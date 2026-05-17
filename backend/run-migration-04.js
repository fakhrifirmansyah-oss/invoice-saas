const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const sql = fs.readFileSync('migrations/04_recurring_tax_fields.sql', 'utf8');
    await pool.query(sql);
    console.log('Migration 04: e-Faktur & Recurring Invoice columns successfully applied!');
  } catch (error) {
    console.error('Migration 04 failed:', error.message);
  } finally {
    await pool.end();
  }
}

run();
