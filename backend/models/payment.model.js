const db = require('../config/db.config');

const Payment = {

  async createTable() {
    const sql = `
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
    `;
    await db.execute(sql);
  },

};

module.exports = Payment;
