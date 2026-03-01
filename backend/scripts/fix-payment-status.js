const db = require('../config/db.config');

async function run() {
  // Step 1: Add payment_status column if it doesn't exist
  try {
    await db.execute(`ALTER TABLE orders ADD COLUMN payment_status ENUM('paid','pending','failed','refunded') DEFAULT 'pending'`);
    console.log('Column payment_status added.');
  } catch (e) {
    console.log('Column may already exist:', e.message);
  }

  // Step 2: Backfill — card orders should be 'paid'
  const [result] = await db.execute(`
    UPDATE orders
    SET payment_status = 'paid'
    WHERE payment_method IN ('visa', 'mastercard', 'amex')
  `);
  console.log(`Backfilled ${result.affectedRows} card orders to paid.`);

  // Step 3: Check result
  const [rows] = await db.execute(`SELECT id, payment_method, payment_status, total FROM orders LIMIT 10`);
  console.log('Sample rows:', JSON.stringify(rows, null, 2));

  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
