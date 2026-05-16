const InvoiceService = require('../services/invoiceService');

exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await InvoiceService.createInvoice(req.user.id, req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await InvoiceService.getInvoices(req.user.id);
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

exports.getInvoiceDetail = async (req, res, next) => {
  try {
    const invoice = await InvoiceService.getInvoiceDetail(req.user.id, req.params.id);
    res.json(invoice);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const invoice = await InvoiceService.updateStatus(req.user.id, req.params.id, status);
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    await InvoiceService.deleteInvoice(req.user.id, req.params.id);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
