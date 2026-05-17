const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Require authentication for all logistics endpoints
router.use(auth);

// ==========================================
// 1. LAUNDRY PRICING SYSTEMS
// ==========================================

// GET ALL LAUNDRY PRICES FOR CURRENT USER
router.get('/prices', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, service_name, price_per_unit, unit_type FROM laundry_prices WHERE user_id = $1 ORDER BY created_at ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching laundry prices:', error);
    res.status(500).json({ message: 'Error fetching laundry prices' });
  }
});

// ADD OR UPDATE A LAUNDRY PRICE
router.post('/prices', async (req, res) => {
  try {
    const { service_name, price_per_unit, unit_type } = req.body;
    if (!service_name || !price_per_unit) {
      return res.status(400).json({ message: 'Service name and price are required' });
    }

    const result = await db.query(
      `INSERT INTO laundry_prices (user_id, service_name, price_per_unit, unit_type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, service_name, price_per_unit, unit_type`,
      [req.user.id, service_name, price_per_unit, unit_type || 'kg']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving laundry price:', error);
    res.status(500).json({ message: 'Error saving laundry price' });
  }
});

// DELETE A LAUNDRY PRICE
router.delete('/prices/:id', async (req, res) => {
  try {
    const priceId = req.params.id;
    await db.query('DELETE FROM laundry_prices WHERE id = $1 AND user_id = $2', [priceId, req.user.id]);
    res.json({ message: 'Laundry price deleted successfully' });
  } catch (error) {
    console.error('Error deleting laundry price:', error);
    res.status(500).json({ message: 'Error deleting laundry price' });
  }
});


// ==========================================
// 2. COURIER & RIDE-HAILING SYSTEMS (GOJEK SAAS)
// ==========================================

// GET ALL COURIER RIDES FOR CURRENT USER
router.get('/rides', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, ride_type, pickup_address, dropoff_address, fare, status, driver_name, created_at FROM courier_rides WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courier rides:', error);
    res.status(500).json({ message: 'Error fetching courier rides' });
  }
});

// PLACE A RIDE / DELIVERY ORDER
router.post('/rides', async (req, res) => {
  try {
    const { ride_type, pickup_address, dropoff_address, fare } = req.body;
    if (!ride_type || !pickup_address || !dropoff_address || !fare) {
      return res.status(400).json({ message: 'All ride details (type, pickup, dropoff, fare) are required' });
    }

    // List of cool, futuristic driver names!
    const drivers = [
      'Roni Ojek Orbit',
      'Aris Bintang Kilat',
      'Bimo Kurir Concorde',
      'Seno Go-FDBA',
      'Dika Driver Kortex',
      'Ahmad Express Super'
    ];
    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];

    // 1. Insert ride order into logistics DB
    const rideResult = await db.query(
      `INSERT INTO courier_rides (user_id, ride_type, pickup_address, dropoff_address, fare, status, driver_name)
       VALUES ($1, $2, $3, $4, $5, 'completed', $6)
       RETURNING id, ride_type, pickup_address, dropoff_address, fare, status, driver_name, created_at`,
      [req.user.id, ride_type, pickup_address, dropoff_address, fare, randomDriver]
    );

    const newRide = rideResult.rows[0];

    // 2. AUTO GENERATE A PREMIUM SAAS INVOICE for this ride!
    // This connects logistics revenue directly back into FDBAtech's accounting flow!
    const invoiceResult = await db.query(
      `INSERT INTO invoices (user_id, client_name, client_email, status, total)
       VALUES ($1, $2, $3, 'paid', $4)
       RETURNING id`,
      [
        req.user.id,
        `${ride_type} - ${randomDriver}`,
        'logistics@yopmail.com',
        fare
      ]
    );
    const invoiceId = invoiceResult.rows[0].id;

    // Add detail items for the ride receipt invoice
    await db.query(
      `INSERT INTO invoice_items (invoice_id, description, quantity, price)
       VALUES ($1, $2, 1, $3)`,
      [
        invoiceId,
        `Jasa Layanan ${ride_type} (${pickup_address} -> ${dropoff_address})`,
        fare
      ]
    );

    res.status(201).json({
      ride: newRide,
      invoice_id: invoiceId,
      message: `Sukses memesan ${ride_type}! Driver ${randomDriver} siap menjemput.`
    });
  } catch (error) {
    console.error('Error placing courier ride:', error);
    res.status(500).json({ message: 'Error placing courier ride' });
  }
});

module.exports = router;
