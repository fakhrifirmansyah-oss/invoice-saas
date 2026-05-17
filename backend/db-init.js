const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, './.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255),
        auth_provider VARCHAR(50) DEFAULT 'email',
        is_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        client_name VARCHAR(100) NOT NULL,
        client_email VARCHAR(100),
        status VARCHAR(20) DEFAULT 'unpaid',
        total DECIMAL(20, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
        description VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(20, 2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        image_url TEXT,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS laundry_prices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_name VARCHAR(150) NOT NULL,
        price_per_unit DECIMAL(12, 2) NOT NULL,
        unit_type VARCHAR(20) DEFAULT 'kg',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS courier_rides (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ride_type VARCHAR(50) NOT NULL,
        pickup_address TEXT NOT NULL,
        dropoff_address TEXT NOT NULL,
        fare DECIMAL(12, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'completed',
        driver_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database tables created successfully.");

    // --- SEED MOCK COMMUNITY DATA ---
    console.log("Seeding mock community users, posts, and comments...");
    const bcrypt = require('bcrypt');
    const mockPass = await bcrypt.hash('secret123', 10);
    
    // Seed users
    await pool.query(`
      INSERT INTO users (name, email, password, is_verified) 
      VALUES 
        ('Budi Santoso (Budi Laundry Express)', 'budi.laundry@yopmail.com', '${mockPass}', true),
        ('Siti Aminah (Amanah DryClean)', 'siti.boutique@yopmail.com', '${mockPass}', true),
        ('Rian Hidayat (Rian Print & Press)', 'rian.print@yopmail.com', '${mockPass}', true)
      ON CONFLICT (email) DO NOTHING;
    `);

    // Check if seeded posts exist (using Budi's ID), then seed them if not present
    const usersRes = await pool.query("SELECT id, email FROM users WHERE email IN ('budi.laundry@yopmail.com', 'siti.boutique@yopmail.com', 'rian.print@yopmail.com')");
    const userMap = {};
    usersRes.rows.forEach(u => {
      userMap[u.email] = u.id;
    });

    const budiId = userMap['budi.laundry@yopmail.com'];
    const sitiId = userMap['siti.boutique@yopmail.com'];
    const rianId = userMap['rian.print@yopmail.com'];

    if (budiId && sitiId && rianId) {
      const budiPostExists = await pool.query('SELECT COUNT(*) FROM posts WHERE user_id = $1', [budiId]);
      if (parseInt(budiPostExists.rows[0].count) === 0) {
        // Budi post
        const budiPost = await pool.query(`
          INSERT INTO posts (user_id, content, image_url, likes_count)
          VALUES (${budiId}, 'Hari ini armada cuci bertambah lagi! 5 mesin cuci premium LG Giant Max resmi mendarat di outlet cabang Sudirman. Siap melayani ribuan kilogram pakaian pelanggan! 🧼👕', 'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=600&q=80', 12)
          RETURNING id;
        `);
        const budiPostId = budiPost.rows[0].id;

        // Siti post
        const sitiPost = await pool.query(`
          INSERT INTO posts (user_id, content, image_url, likes_count)
          VALUES (${sitiId}, 'Alhamdulillah, testimoni bintang 5 dari pelanggan VIP hari ini! Senang sekali bisa membantu merapikan jas mewah klien dengan cepat dan aman. Pencatatan transaksi di FDBAtech benar-benar mempermudah segalanya! 📈💼', 'https://images.unsplash.com/photo-1521791136364-72864753023b?auto=format&fit=crop&w=600&q=80', 9)
          RETURNING id;
        `);
        const sitiPostId = sitiPost.rows[0].id;

        // Rian post
        const rianPost = await pool.query(`
          INSERT INTO posts (user_id, content, image_url, likes_count)
          VALUES (${rianId}, 'Kwitansi Concorde Premium FDBAtech yang saya cetak kemarin langsung diserahkan ke klien besar. Begitu lihat stempel basah digital Lunas, pembayaran langsung disetujui! Rekomendasi banget buat pengusaha! 📄🚀', 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80', 15)
          RETURNING id;
        `);
        const rianPostId = rianPost.rows[0].id;

        // Seed comments on Budi's post
        await pool.query(`
          INSERT INTO comments (post_id, user_id, content)
          VALUES 
            (${budiPostId}, ${sitiId}, 'Luar biasa kencang ekspansinya Bos Budi! Kapan-kapan mau mampir ke Sudirman ah 🧼'),
            (${budiPostId}, ${rianId}, 'Mantap pak! LG Giant Max emang legendaris kuatnya. Semoga usahanya makin jaya!');
        `);

        // Seed comments on Siti's post
        await pool.query(`
          INSERT INTO comments (post_id, user_id, content)
          VALUES 
            (${sitiPostId}, ${budiId}, 'Hebat bu Siti! Layanan VIP emang margin paling mantap. Sukses terus ya!'),
            (${sitiPostId}, ${rianId}, 'Betul bu, catatan keuangan jadi rapi banget sejak pakai FDBAtech.');
        `);

        // Seed comments on Rian's post
        await pool.query(`
          INSERT INTO comments (post_id, user_id, content)
          VALUES 
            (${rianPostId}, ${budiId}, 'Gila keren banget! Desain kwitansinya emang terlihat sangat tepercaya.'),
            (${rianPostId}, ${sitiId}, 'Boleh ditiru nih trik stempel basahnya pak Rian. Hebat!');
        `);
        console.log("Mock community data seeded successfully.");
      }
    }
  } catch (err) {
    console.error("Error creating or seeding tables", err);
  } finally {
    pool.end();
  }
};

createTables();
