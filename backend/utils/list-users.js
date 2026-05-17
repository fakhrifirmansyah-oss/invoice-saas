const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function listUsers() {
  try {
    console.log('Fetching all registered users...');
    const { rows } = await pool.query('SELECT id, name, email, auth_provider, is_verified, created_at FROM users;');
    console.log('------------------------------------------------------------');
    if (rows.length === 0) {
      console.log('📭 TIDAK ADA USER YANG TERDAFTAR (Kosong!).');
    } else {
      console.table(rows);
    }
    console.log('------------------------------------------------------------');
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    await pool.end();
  }
}

listUsers();
