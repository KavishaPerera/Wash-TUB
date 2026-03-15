const db = require('../config/db.config');

const Notification = {

  async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        order_id INT NULL,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'info',
        title VARCHAR(255) NOT NULL DEFAULT '',
        message TEXT NOT NULL,
        is_read TINYINT(1) NOT NULL DEFAULT 0,
        channel ENUM('SMS','EMAIL','PUSH') NOT NULL DEFAULT 'PUSH',
        sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        delivery_status ENUM('QUEUED','SENT','FAILED') NOT NULL DEFAULT 'SENT',
        provider_message_id VARCHAR(120) NULL,
        CONSTRAINT fk_notif_order
          FOREIGN KEY (order_id) REFERENCES orders(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_notif_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE,
        INDEX idx_notif_user_time (user_id, sent_at)
      ) ENGINE=InnoDB
    `;
    await db.execute(sql);
  },

  // Add new columns to existing table if they don't exist yet
  async migrateTable() {
    const migrations = [
      `ALTER TABLE notifications ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'info' AFTER user_id`,
      `ALTER TABLE notifications ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT '' AFTER type`,
      `ALTER TABLE notifications ADD COLUMN is_read TINYINT(1) NOT NULL DEFAULT 0 AFTER message`,
      `ALTER TABLE notifications MODIFY COLUMN order_id INT NULL`,
    ];
    for (const sql of migrations) {
      try {
        await db.execute(sql);
      } catch (err) {
        // ER_DUP_FIELDNAME = column already exists — safe to ignore
        if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      }
    }
  },

  async create({ orderId, userId, type, title, message }) {
    const [result] = await db.execute(
      `INSERT INTO notifications (order_id, user_id, type, title, message, channel, delivery_status)
       VALUES (?, ?, ?, ?, ?, 'PUSH', 'SENT')`,
      [orderId, userId, type, title, message]
    );
    return result.insertId;
  },

  async createBulk(notifications) {
    for (const n of notifications) {
      await this.create(n);
    }
  },

  async getByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT notification_id, order_id, type, title, message, is_read, sent_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY sent_at DESC`,
      [userId]
    );
    return rows;
  },

  async getUnreadCount(userId) {
    const [rows] = await db.execute(
      `SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0`,
      [userId]
    );
    return rows[0].count;
  },

  async markAsRead(notificationId, userId) {
    const [result] = await db.execute(
      `UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?`,
      [notificationId, userId]
    );
    return result.affectedRows > 0;
  },

  async markAllAsRead(userId) {
    await db.execute(
      `UPDATE notifications SET is_read = 1 WHERE user_id = ?`,
      [userId]
    );
  },

  async deleteById(notificationId, userId) {
    const [result] = await db.execute(
      `DELETE FROM notifications WHERE notification_id = ? AND user_id = ?`,
      [notificationId, userId]
    );
    return result.affectedRows > 0;
  },

};

module.exports = Notification;
