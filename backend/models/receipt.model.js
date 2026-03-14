const db = require('../config/db.config');

const Receipt = {

  async createTable() {
    const sql = `
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
    `;
    await db.execute(sql);
  },

};

module.exports = Receipt;
