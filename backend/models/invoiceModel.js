const db = require('../config/db');

// Helper to convert number to Indonesian words (Terbilang)
function terbilang(nilai) {
  const bilangan = [
    '', 'satu', 'dua', 'tiga', 'empat', 'lima',
    'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'
  ];
  nilai = Math.floor(nilai);
  if (nilai < 12) {
    return ' ' + bilangan[nilai];
  } else if (nilai < 20) {
    return terbilang(nilai - 10) + ' belas';
  } else if (nilai < 100) {
    return terbilang(nilai / 10) + ' puluh' + terbilang(nilai % 10);
  } else if (nilai < 200) {
    return ' seratus' + terbilang(nilai - 100);
  } else if (nilai < 1000) {
    return terbilang(nilai / 100) + ' ratus' + terbilang(nilai % 100);
  } else if (nilai < 2000) {
    return ' seribu' + terbilang(nilai - 1000);
  } else if (nilai < 1000000) {
    return terbilang(nilai / 1000) + ' ribu' + terbilang(nilai % 1000);
  } else if (nilai < 1000000000) {
    return terbilang(nilai / 1000000) + ' juta' + terbilang(nilai % 1000000);
  } else if (nilai < 1000000000000) {
    return terbilang(nilai / 1000000000) + ' milyar' + terbilang(nilai % 1000000000);
  } else if (nilai < 1000000000000000) {
    return terbilang(nilai / 1000000000000) + ' trilyun' + terbilang(nilai % 1000000000000);
  }
  return '';
}

function getTerbilangRupiah(amount) {
  const hasil = terbilang(amount).trim();
  return hasil ? (hasil.charAt(0).toUpperCase() + hasil.slice(1) + ' rupiah') : 'Nol rupiah';
}

// Calculate next recurring date based on interval
function calculateNextRecurringDate(interval, fromDate = new Date()) {
  const date = new Date(fromDate);
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

class InvoiceModel {
  // ── Generate invoice number ──────────────────────────────────────
  static async generateInvoiceNumber(userId) {
    const { rows } = await db.query(
      `SELECT COUNT(*) as count FROM invoices WHERE user_id = $1`, [userId]
    );
    const count = parseInt(rows[0].count) + 1;
    return `INV-${String(count).padStart(4, '0')}`;
  }

  // ── Create Invoice ───────────────────────────────────────────────
  static async createInvoice(userId, clientName, clientEmail, total, items, extra = {}) {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const dbClient = await pool.connect();

    try {
      await dbClient.query('BEGIN');

      const invoiceNumber = await this.generateInvoiceNumber(userId);
      const taxRate = parseFloat(extra.taxRate || 0);
      const taxAmount = total * (taxRate / 100);
      const finalTotal = total + taxAmount;
      const requiresMaterai = finalTotal > 5000000;
      const totalInWords = getTerbilangRupiah(finalTotal);

      let nextRecurringDate = null;
      if (extra.invoiceType === 'recurring' && extra.recurringInterval && extra.recurringInterval !== 'none') {
        nextRecurringDate = calculateNextRecurringDate(extra.recurringInterval);
      }

      const invoiceRes = await dbClient.query(
        `INSERT INTO invoices 
          (user_id, client_name, client_email, total, invoice_number, due_date, notes, client_phone, 
           invoice_type, recurring_interval, next_recurring_date, client_nik, tax_code, 
           company_npwp, client_npwp, tax_rate, tax_amount, requires_materai, total_in_words)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
        [
          userId, clientName, clientEmail, finalTotal,
          invoiceNumber,
          extra.dueDate || null,
          extra.notes || null,
          extra.clientPhone || null,
          extra.invoiceType || 'standard',
          extra.recurringInterval || 'none',
          nextRecurringDate,
          extra.clientNik || null,
          extra.taxCode || '01',
          extra.companyNpwp || null,
          extra.clientNpwp || null,
          taxRate,
          taxAmount,
          requiresMaterai,
          totalInWords
        ]
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
      await pool.end();
    }
  }

  // ── Get All Invoices (with search + filter) ───────────────────────
  static async getInvoicesByUser(userId, { search, status } = {}) {
    let query = `
      SELECT * FROM invoices 
      WHERE user_id = $1
    `;
    const params = [userId];

    if (status && status !== 'all') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (client_name ILIKE $${params.length} OR invoice_number ILIKE $${params.length} OR client_email ILIKE $${params.length})`;
    }

    // Auto-mark overdue
    await db.query(`
      UPDATE invoices 
      SET status = 'overdue' 
      WHERE user_id = $1 AND status = 'unpaid' AND due_date IS NOT NULL AND due_date < NOW()
    `, [userId]);

    query += ' ORDER BY created_at DESC';
    const { rows } = await db.query(query, params);
    return rows;
  }

  // ── Get Invoice By ID ─────────────────────────────────────────────
  static async getInvoiceById(userId, invoiceId) {
    const invoiceRes = await db.query(
      'SELECT * FROM invoices WHERE id = $1 AND user_id = $2',
      [invoiceId, userId]
    );
    if (invoiceRes.rows.length === 0) return null;

    const invoice = invoiceRes.rows[0];
    const itemsRes = await db.query(
      'SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id ASC',
      [invoiceId]
    );

    return { ...invoice, items: itemsRes.rows };
  }

  // ── Update Status ─────────────────────────────────────────────────
  static async updateStatus(userId, invoiceId, status) {
    const { rows } = await db.query(
      'UPDATE invoices SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [status, invoiceId, userId]
    );
    return rows[0];
  }

  // ── Edit Invoice ──────────────────────────────────────────────────
  static async updateInvoice(userId, invoiceId, data) {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const dbClient = await pool.connect();

    try {
      await dbClient.query('BEGIN');

      const {
        clientName, clientEmail, clientPhone, dueDate, notes, items, total,
        invoiceType, recurringInterval, clientNik, taxCode, companyNpwp, clientNpwp, taxRate
      } = data;

      const rate = parseFloat(taxRate || 0);
      const taxAmount = total * (rate / 100);
      const finalTotal = total + taxAmount;
      const requiresMaterai = finalTotal > 5000000;
      const totalInWords = getTerbilangRupiah(finalTotal);

      let nextRecurringDate = null;
      if (invoiceType === 'recurring' && recurringInterval && recurringInterval !== 'none') {
        nextRecurringDate = calculateNextRecurringDate(recurringInterval);
      }

      const invoiceRes = await dbClient.query(
        `UPDATE invoices SET
          client_name = $1, client_email = $2, client_phone = $3,
          due_date = $4, notes = $5, total = $6,
          invoice_type = $7, recurring_interval = $8, next_recurring_date = $9,
          client_nik = $10, tax_code = $11, company_npwp = $12, client_npwp = $13,
          tax_rate = $14, tax_amount = $15, requires_materai = $16, total_in_words = $17
         WHERE id = $18 AND user_id = $19 RETURNING *`,
        [
          clientName, clientEmail, clientPhone, dueDate || null, notes || null, finalTotal,
          invoiceType || 'standard',
          recurringInterval || 'none',
          nextRecurringDate,
          clientNik || null,
          taxCode || '01',
          companyNpwp || null,
          clientNpwp || null,
          rate,
          taxAmount,
          requiresMaterai,
          totalInWords,
          invoiceId,
          userId
        ]
      );

      if (invoiceRes.rows.length === 0) throw new Error('Invoice not found');

      // Replace all items
      await dbClient.query('DELETE FROM invoice_items WHERE invoice_id = $1', [invoiceId]);
      for (let item of items) {
        await dbClient.query(
          'INSERT INTO invoice_items (invoice_id, description, quantity, price) VALUES ($1, $2, $3, $4)',
          [invoiceId, item.description, item.quantity, item.price]
        );
      }

      await dbClient.query('COMMIT');
      return invoiceRes.rows[0];
    } catch (e) {
      await dbClient.query('ROLLBACK');
      throw e;
    } finally {
      dbClient.release();
      await pool.end();
    }
  }

  // ── Delete Invoice ────────────────────────────────────────────────
  static async deleteInvoice(userId, invoiceId) {
    const { rowCount } = await db.query(
      'DELETE FROM invoices WHERE id = $1 AND user_id = $2',
      [invoiceId, userId]
    );
    return rowCount > 0;
  }

  // ── Dashboard Stats ───────────────────────────────────────────────
  static async getStats(userId) {
    const { rows } = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'unpaid') AS unpaid_count,
        COUNT(*) FILTER (WHERE status = 'paid') AS paid_count,
        COUNT(*) FILTER (WHERE status = 'overdue') AS overdue_count,
        COUNT(*) FILTER (WHERE invoice_type = 'recurring') AS recurring_count,
        COALESCE(SUM(total) FILTER (WHERE status = 'paid'), 0) AS total_revenue,
        COALESCE(SUM(total) FILTER (WHERE status IN ('unpaid','overdue')), 0) AS outstanding
      FROM invoices WHERE user_id = $1
    `, [userId]);
    return rows[0];
  }
}

module.exports = InvoiceModel;
