const db = require('../config/db');

// Helper to calculate the next recurring date
function getNextRecurringDate(interval, currentDate = new Date()) {
  const date = new Date(currentDate);
  if (interval === 'weekly') {
    date.setDate(date.getDate() + 7);
  } else if (interval === 'monthly') {
    date.setMonth(date.getMonth() + 1);
  } else if (interval === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    return null;
  }
  return date;
}

async function processRecurringInvoices() {
  console.log('[RECURRING JOB] Starting cron-like check for due recurring profiles...');

  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  let dbClient = null;

  try {
    dbClient = await pool.connect();
    
    // 1. Find all active recurring invoices whose next_recurring_date has passed
    const { rows: dueInvoices } = await dbClient.query(`
      SELECT * FROM invoices 
      WHERE invoice_type = 'recurring' 
        AND recurring_interval != 'none' 
        AND next_recurring_date <= NOW()
    `);

    if (dueInvoices.length === 0) {
      console.log('[RECURRING JOB] No recurring invoices are due for processing today.');
      return;
    }

    console.log(`[RECURRING JOB] Found ${dueInvoices.length} recurring invoices to process.`);

    for (let parent of dueInvoices) {
      await dbClient.query('BEGIN');

      // Calculate new due date if original had one
      let newDueDate = null;
      if (parent.due_date) {
        const offset = new Date(parent.due_date) - new Date(parent.created_at);
        newDueDate = new Date(Date.now() + offset);
      }

      // Generate a new unique invoice number
      const { rows: countRes } = await dbClient.query(
        `SELECT COUNT(*) as count FROM invoices WHERE user_id = $1`, [parent.user_id]
      );
      const nextNum = parseInt(countRes[0].count) + 1;
      const newInvoiceNumber = `INV-${String(nextNum).padStart(4, '0')}`;

      // Insert new child invoice
      const newInvoiceRes = await dbClient.query(`
        INSERT INTO invoices 
          (user_id, client_name, client_email, client_phone, total, invoice_number, 
           due_date, notes, status, invoice_type, recurring_interval, next_recurring_date,
           client_nik, tax_code, company_npwp, client_npwp, tax_rate, tax_amount, 
           requires_materai, total_in_words)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, 'unpaid', 'standard', 'none', null,
           $9, $10, $11, $12, $13, $14, $15, $16) 
        RETURNING *
      `, [
        parent.user_id, parent.client_name, parent.client_email, parent.client_phone, parent.total,
        newInvoiceNumber, newDueDate, parent.notes, parent.client_nik, parent.tax_code,
        parent.company_npwp, parent.client_npwp, parent.tax_rate, parent.tax_amount,
        parent.requires_materai, parent.total_in_words
      ]);

      const child = newInvoiceRes.rows[0];

      // Copy all invoice items
      const { rows: items } = await dbClient.query(
        'SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id ASC',
        [parent.id]
      );

      for (let item of items) {
        await dbClient.query(`
          INSERT INTO invoice_items (invoice_id, description, quantity, price)
          VALUES ($1, $2, $3, $4)
        `, [child.id, item.description, item.quantity, item.price]);
      }

      // Update parent's next_recurring_date to the next cycle
      const nextCycleDate = getNextRecurringDate(parent.recurring_interval, parent.next_recurring_date);
      await dbClient.query(`
        UPDATE invoices 
        SET next_recurring_date = $1 
        WHERE id = $2
      `, [nextCycleDate, parent.id]);

      await dbClient.query('COMMIT');
      console.log(`[RECURRING JOB] Successfully auto-generated ${newInvoiceNumber} for ${parent.client_name}. Next cycle: ${nextCycleDate.toISOString().split('T')[0]}`);
    }
  } catch (error) {
    if (dbClient) {
      try {
        await dbClient.query('ROLLBACK');
      } catch (rollbackErr) {
        console.error('[RECURRING JOB] Rollback error:', rollbackErr);
      }
    }
    console.error('[RECURRING JOB] Error processing recurring invoices:', error);
  } finally {
    if (dbClient) {
      dbClient.release();
    }
    await pool.end();
  }
}

module.exports = { processRecurringInvoices };
