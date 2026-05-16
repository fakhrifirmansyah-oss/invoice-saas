const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error');
const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoices');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
