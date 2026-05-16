const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoiceDetail);
router.patch('/:id/status', invoiceController.updateStatus);
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
