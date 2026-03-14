const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const db = require('../config/db.config');

async function migrate() {
  try {
    // 1. payments — must exist before receipts (FK dependency)
    console.log('Creating payments table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL UNIQUE,
        method ENUM('CASH','CARD','ONLINE') NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
        paid_at DATETIME NULL,
        provider_txn_id VARCHAR(120) NULL,
        CONSTRAINT fk_payments_order
          FOREIGN KEY (order_id) REFERENCES orders(id)
          ON DELETE CASCADE,
        INDEX idx_payments_status (status, paid_at)
      ) ENGINE=InnoDB
    `);
    console.log('✅ payments table ready');

    // 2. receipts — depends on payments
    console.log('Creating receipts table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS receipts (
        receipt_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        payment_id BIGINT UNSIGNED NOT NULL UNIQUE,
        receipt_number VARCHAR(60) NOT NULL UNIQUE,
        issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        file_path VARCHAR(255) NOT NULL,
        CONSTRAINT fk_receipts_payment
          FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
    console.log('✅ receipts table ready');

    // 3. notifications — depends on orders and users (both already exist)
    console.log('Creating notifications table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        user_id INT NOT NULL,
        channel ENUM('SMS','EMAIL','PUSH') NOT NULL,
        message TEXT NOT NULL,
        sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        delivery_status ENUM('QUEUED','SENT','FAILED') NOT NULL DEFAULT 'QUEUED',
        provider_message_id VARCHAR(120) NULL,
        CONSTRAINT fk_notif_order
          FOREIGN KEY (order_id) REFERENCES orders(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_notif_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE,
        INDEX idx_notif_order_time (order_id, sent_at),
        INDEX idx_notif_user_time (user_id, sent_at)
      ) ENGINE=InnoDB
    `);
    console.log('✅ notifications table ready');

    console.log('\n✅ All migrations completed successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
