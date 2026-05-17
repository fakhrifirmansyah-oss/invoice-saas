const InvoiceModel = require('../models/invoiceModel');

exports.createInvoice = async (req, res) => {
  try {
    const {
      clientName, clientEmail, clientPhone, items, dueDate, notes,
      invoiceType, recurringInterval, clientNik, taxCode, companyNpwp, clientNpwp, taxRate
    } = req.body;
    const total = items.reduce((sum, i) => sum + (Number(i.quantity) * Number(i.price)), 0);
    const invoice = await InvoiceModel.createInvoice(
      req.user.id, clientName, clientEmail, total, items,
      { dueDate, notes, clientPhone, invoiceType, recurringInterval, clientNik, taxCode, companyNpwp, clientNpwp, taxRate }
    );
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { search, status } = req.query;
    const invoices = await InvoiceModel.getInvoicesByUser(req.user.id, { search, status });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInvoiceDetail = async (req, res) => {
  try {
    const invoice = await InvoiceModel.getInvoiceById(req.user.id, req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await InvoiceModel.updateStatus(req.user.id, req.params.id, status);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const {
      clientName, clientEmail, clientPhone, items, dueDate, notes,
      invoiceType, recurringInterval, clientNik, taxCode, companyNpwp, clientNpwp, taxRate
    } = req.body;
    const total = items.reduce((sum, i) => sum + (Number(i.quantity) * Number(i.price)), 0);
    const invoice = await InvoiceModel.updateInvoice(
      req.user.id, req.params.id,
      { clientName, clientEmail, clientPhone, dueDate, notes, items, total, invoiceType, recurringInterval, clientNik, taxCode, companyNpwp, clientNpwp, taxRate }
    );
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await InvoiceModel.getStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const success = await InvoiceModel.deleteInvoice(req.user.id, req.params.id);
    if (!success) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
