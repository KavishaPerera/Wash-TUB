const db = require('./config/db.config');

async function updateDatabase() {
  try {
    console.log('Attempting to update status ENUM...');
    await db.execute(`
      ALTER TABLE orders
      MODIFY COLUMN status
      ENUM('pending','confirmed','pickup_scheduled','picked_up','out_for_processing',
           'processing','ready','completed','finished','out_for_delivery','delivery_scheduled','delivered','cancelled')
      DEFAULT 'pending'
    `);
    console.log('✅ Order status ENUM successfully updated in database!');
  } catch (err) {
    console.error('❌ Failed to update database:', err.message);
  } finally {
    process.exit(0);
  }
}

updateDatabase();
