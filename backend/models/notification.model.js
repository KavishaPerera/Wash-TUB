const db = require('../config/db.config');

const Notification = {

  async createTable() {
    const sql = `
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
    `;
    await db.execute(sql);
  },

};

module.exports = Notification;
