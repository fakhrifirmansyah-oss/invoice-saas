const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Require auth for all social routes
router.use(auth);

// 1. GET ALL POSTS with author names, likes, and comments (using nested JSON aggregation)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.id,
        p.content,
        p.image_url,
        p.likes_count,
        p.created_at,
        p.user_id,
        u.name as author_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'content', c.content,
              'author_name', cu.name,
              'created_at', c.created_at
            ) ORDER BY c.created_at ASC
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as comments
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN users cu ON c.user_id = cu.id
      GROUP BY p.id, u.name
      ORDER BY p.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// 2. CREATE A NEW POST
router.post('/', async (req, res) => {
  try {
    const { content, image_url } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const result = await db.query(
      `INSERT INTO posts (user_id, content, image_url) 
       VALUES ($1, $2, $3) 
       RETURNING id, content, image_url, likes_count, created_at`,
      [req.user.id, content, image_url]
    );

    const newPost = result.rows[0];
    
    // Fetch author name to append
    const userResult = await db.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    newPost.author_name = userResult.rows[0].name;
    newPost.comments = [];

    // --- AUTO INTERACT FROM OTHER SEEDED USERS ---
    try {
      const seedUsers = await db.query("SELECT id, name FROM users WHERE email IN ('budi.laundry@yopmail.com', 'siti.boutique@yopmail.com', 'rian.print@yopmail.com')");
      
      if (seedUsers.rows.length > 0) {
        const userMap = {};
        seedUsers.rows.forEach(u => {
          const lowerName = u.name.toLowerCase();
          if (lowerName.includes('budi')) userMap['budi'] = u.id;
          else if (lowerName.includes('siti')) userMap['siti'] = u.id;
          else if (lowerName.includes('rian')) userMap['rian'] = u.id;
        });

        const budiId = userMap['budi'];
        const sitiId = userMap['siti'];
        const rianId = userMap['rian'];

        const lowerContent = content.toLowerCase();

        // 1. Trigger automatic Likes from community other owners!
        const mockLikes = Math.floor(Math.random() * 3) + 1; // 1 to 3 likes
        await db.query("UPDATE posts SET likes_count = likes_count + $1 WHERE id = $2", [mockLikes, newPost.id]);
        newPost.likes_count = (newPost.likes_count || 0) + mockLikes;

        // 2. Trigger automatic Comments from other owners based on keywords!
        // Budi Santoso (Laundry Express) comments:
        if (budiId) {
          let budiComment = 'Luar biasa Bos! Terus berkarya dan mengorbit bersama FDBA Invoice Digital! Maju terus wirausaha Indonesia! 🚀';
          if (lowerContent.match(/(laundry|cuci|londri|setrika|gosok|baju|pakaian)/)) {
            budiComment = 'Waduh mantap rapi bener Bos usahanya! Kapan-kapan kita kolaborasi yuk antar sesama laundry. Sukses terus! LG Giant Max siap menanti 🧼👕';
          } else if (lowerContent.match(/(cuan|invoice|uang|pendapatan|omset|kaya)/)) {
            budiComment = 'Gila keren abis cuannya Bosku! Bikin tambah semangat wirausaha nih! Moga rezeki melimpah terus 💰💸';
          }
          await db.query("INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)", [newPost.id, budiId, budiComment]);
        }

        // Siti Aminah (Amanah DryClean) comments:
        if (sitiId) {
          let sitiComment = 'Suka sekali melihat perkembangan bisnis Bos yang sangat inspiratif ini! Sukses selalu! 🌟';
          if (lowerContent.match(/(laundry|cuci|londri|dryclean|premium)/)) {
            sitiComment = 'Rapih dan wangi banget pasti hasilnya Bos. Sukses selalu buat outlet barunya! 👔✨';
          } else if (lowerContent.match(/(kwitansi|cetak|kertas|invoice)/)) {
            sitiComment = 'Betul Bos! Pakai FDBA Invoice Digital cetak kwitansi jadi keliatan premium banget, pelanggan butik saya langsung percaya 👍';
          }
          await db.query("INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)", [newPost.id, sitiId, sitiComment]);
        }

        // Rian Hidayat (Rian Print) comments:
        if (rianId) {
          let rianComment = 'Sangat mantap Bosku! Terus berkarya dan mengorbit bersama FDBA Invoice Digital! 👍';
          if (lowerContent.match(/(kwitansi|cetak|kertas|concorde)/)) {
            rianComment = 'Wah mantap! Kertas Concorde emang tiada duanya Bos. Keliatan elite banget kwitansinya! 📄🔥';
          } else if (lowerContent.match(/(cuan|invoice|uang|tagih)/)) {
            rianComment = 'Mantap Bos! Sistem audit tagihan FDBA Invoice Digital bikin klien nunggak langsung insyaf bayar lunas hahaha! 😂👍';
          }
          await db.query("INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)", [newPost.id, rianId, rianComment]);
        }
      }
    } catch (err) {
      console.error('Error in community auto-interaction:', err);
      // Fallback gracefully so main post creation doesn't fail
    }

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

// 3. LIKE A POST
router.post('/:id/like', async (req, res) => {
  try {
    const postId = req.params.id;
    
    const result = await db.query(
      `UPDATE posts 
       SET likes_count = likes_count + 1 
       WHERE id = $1 
       RETURNING id, likes_count`,
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Error liking post' });
  }
});

// 4. ADD A COMMENT TO A POST
router.post('/:id/comment', async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment content is required' });

    const result = await db.query(
      `INSERT INTO comments (post_id, user_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING id, content, created_at`,
      [postId, req.user.id, content]
    );

    const newComment = result.rows[0];

    // Fetch author name to append
    const userResult = await db.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    newComment.author_name = userResult.rows[0].name;

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

module.exports = router;
