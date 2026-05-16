const db = require('../config/db');

class InvoiceModel {
  static async createInvoice(userId, clientName, clientEmail, total, items) {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const dbClient = await pool.connect();

    try {
      await dbClient.query('BEGIN');
      
      const invoiceRes = await dbClient.query(
        'INSERT INTO invoices (user_id, client_name, client_email, total) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, clientName, clientEmail, total]
      );
      const invoice = invoiceRes.rows[0];

      for (let item of items) {
        await dbClient.query(
          'INSERT INTO invoice_items (invoice_id, description, quantity, price) VALUES ($1, $2, $3, $4)',
          [invoice.id, item.description, item.quantity, item.price]
        );
      }

      await dbClient.query('COMMIT');
      return invoice;
    } catch (e) {
      await dbClient.query('ROLLBACK');
      throw e;
    } finally {
      dbClient.release();
    }
  }

  static async getInvoicesByUser(userId) {
    const { rows } = await db.query('SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return rows;
  }

  static async getInvoiceById(userId, invoiceId) {
    const invoiceRes = await db.query('SELECT * FROM invoices WHERE id = $1 AND user_id = $2', [invoiceId, userId]);
    if (invoiceRes.rows.length === 0) return null;
    
    const invoice = invoiceRes.rows[0];
    const itemsRes = await db.query('SELECT * FROM invoice_items WHERE invoice_id = $1', [invoiceId]);
    
    return { ...invoice, items: itemsRes.rows };
  }

  static async updateStatus(userId, invoiceId, status) {
    const { rows } = await db.query(
      'UPDATE invoices SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [status, invoiceId, userId]
    );
    return rows[0];
  }

  static async deleteInvoice(userId, invoiceId) {
    const { rowCount } = await db.query('DELETE FROM invoices WHERE id = $1 AND user_id = $2', [invoiceId, userId]);
    return rowCount > 0;
  }
}

module.exports = InvoiceModel;
