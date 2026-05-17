const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixDecimalOverflow() {
  try {
    console.log('Connecting to database to scale money columns...');
    
    // Alter column types to DECIMAL(20, 2) which supports up to 100 quadrillion Rupiah!
    await pool.query(`
      ALTER TABLE invoices ALTER COLUMN total TYPE DECIMAL(20, 2);
      ALTER TABLE invoice_items ALTER COLUMN price TYPE DECIMAL(20, 2);
    `);
    
    console.log('------------------------------------------------------------');
    console.log('✅ COLUMNS SCALED SUCCESSFULLY!');
    console.log('👉 invoices.total diubah menjadi DECIMAL(20, 2).');
    console.log('👉 invoice_items.price diubah menjadi DECIMAL(20, 2).');
    console.log('👉 Batas nominal transaksi kini ditingkatkan hingga Rp 999 Triliun! (Bebas Overflow)');
    console.log('------------------------------------------------------------');
  } catch (err) {
    console.error('❌ Gagal mengubah tipe data kolom:', err);
  } finally {
    await pool.end();
  }
}

fixDecimalOverflow();
