const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function check() {
  try {
    const users = await pool.query('SELECT id, name, email FROM users');
    console.log('--- ALL USERS ---');
    console.table(users.rows);

    const posts = await pool.query('SELECT id, user_id, content, likes_count FROM posts');
    console.log('--- ALL POSTS ---');
    console.table(posts.rows);

    const comments = await pool.query('SELECT id, post_id, user_id, content FROM comments');
    console.log('--- ALL COMMENTS ---');
    console.table(comments.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
check();
