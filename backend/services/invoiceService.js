const InvoiceModel = require('../models/invoiceModel');

class InvoiceService {
  static async createInvoice(userId, invoiceData) {
    const { clientName, clientEmail, items } = invoiceData;
    
    if (!clientName || !items || items.length === 0) {
      throw new Error('Client name and at least one item are required');
    }

    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    return await InvoiceModel.createInvoice(userId, clientName, clientEmail, total, items);
  }

  static async getInvoices(userId) {
    return await InvoiceModel.getInvoicesByUser(userId);
  }

  static async getInvoiceDetail(userId, invoiceId) {
    const invoice = await InvoiceModel.getInvoiceById(userId, invoiceId);
    if (!invoice) throw new Error('Invoice not found');
    return invoice;
  }

  static async updateStatus(userId, invoiceId, status) {
    const invoice = await InvoiceModel.updateStatus(userId, invoiceId, status);
    if (!invoice) throw new Error('Invoice not found or unauthorized');
    return invoice;
  }

  static async deleteInvoice(userId, invoiceId) {
    const success = await InvoiceModel.deleteInvoice(userId, invoiceId);
    if (!success) throw new Error('Invoice not found or unauthorized');
    return success;
  }
}

module.exports = InvoiceService;
