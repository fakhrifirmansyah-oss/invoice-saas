const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixIndex() {
  try {
    console.log('Connecting to database to fix index constraint...');
    
    // 1. Drop the old unique index that was globally unique on invoice_number
    await pool.query('DROP INDEX IF EXISTS idx_invoices_number;');
    console.log('Dropped idx_invoices_number.');

    // 2. Drop any constraint if it was created as a constraint
    try {
      await pool.query('ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_invoice_number_key;');
      console.log('Dropped constraint if existed.');
    } catch (e) {
      console.log('Constraint drop skipped or not found.');
    }

    // 3. Create the new tenant-isolated unique index on (user_id, invoice_number)
    await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_user_number ON invoices(user_id, invoice_number);');
    console.log('Created tenant-isolated unique index idx_invoices_user_number on invoices(user_id, invoice_number).');

    console.log('Index migration fixed successfully!');
  } catch (err) {
    console.error('Error during index fix migration:', err);
  } finally {
    await pool.end();
  }
}

fixIndex();
