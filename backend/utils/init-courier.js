const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initCourier = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS laundry_prices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_name VARCHAR(150) NOT NULL,
        price_per_unit DECIMAL(12, 2) NOT NULL,
        unit_type VARCHAR(20) DEFAULT 'kg',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS courier_rides (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ride_type VARCHAR(50) NOT NULL,
        pickup_address TEXT NOT NULL,
        dropoff_address TEXT NOT NULL,
        fare DECIMAL(12, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'completed',
        driver_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Courier & Laundry Prices tables created successfully.");

    // Seed default laundry prices for existing users if empty
    const priceCount = await pool.query('SELECT COUNT(*) FROM laundry_prices');
    if (parseInt(priceCount.rows[0].count) === 0) {
      const users = await pool.query('SELECT id FROM users');
      for (const u of users.rows) {
        await pool.query(`
          INSERT INTO laundry_prices (user_id, service_name, price_per_unit, unit_type)
          VALUES 
            (${u.id}, 'Cuci Setrika Kiloan Express', 8000.00, 'kg'),
            (${u.id}, 'Dry Clean Jas Executive', 35000.00, 'pcs'),
            (${u.id}, 'Cuci Bed Cover King Size', 45000.00, 'pcs'),
            (${u.id}, 'Setrika Wangi Kiloan', 5000.00, 'kg')
        `);
      }
      console.log("Default laundry prices seeded for all users.");
    }
  } catch (err) {
    console.error("Error creating courier/laundry tables", err);
  } finally {
    pool.end();
  }
};

initCourier();
