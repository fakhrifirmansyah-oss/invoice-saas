const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function clearDatabase() {
  try {
    console.log('Connecting to database to clear all testing data...');
    
    // Truncate tables, restarting all primary key sequences to 1, cascading deletes cleanly
    await pool.query('TRUNCATE TABLE users, invoices, invoice_items RESTART IDENTITY CASCADE;');
    
    console.log('------------------------------------------------------------');
    console.log('✅ DATABASE SUCCESSFUL RESETS!');
    console.log('👉 Semua tabel (users, invoices, invoice_items) telah dikosongkan.');
    console.log('👉 Semua Counter ID auto-increment telah di-reset ke 1.');
    console.log('👉 Aplikasi FDBAtech kini dalam kondisi bersih sempurna (Fresh State)!');
    console.log('------------------------------------------------------------');
  } catch (err) {
    console.error('❌ Gagal melakukan pembersihan database:', err);
  } finally {
    await pool.end();
  }
}

clearDatabase();
