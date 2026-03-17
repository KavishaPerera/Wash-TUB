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
    // Check each column via information_schema before attempting ALTER — avoids MDL deadlock on restart
    const columnMigrations = [
      { column: 'type',    sql: `ALTER TABLE notifications ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'info' AFTER user_id` },
      { column: 'title',   sql: `ALTER TABLE notifications ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT '' AFTER type` },
      { column: 'is_read', sql: `ALTER TABLE notifications ADD COLUMN is_read TINYINT(1) NOT NULL DEFAULT 0 AFTER message` },
    ];
    for (const { column, sql } of columnMigrations) {
      const [[{ cnt }]] = await db.query(
        `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notifications' AND COLUMN_NAME = ?`,
        [column]
      );
      if (cnt === 0) await db.execute(sql);
    }
    // MODIFY COLUMN is safe to run every time (it's idempotent — no lock if schema already matches)
    try {
      await db.execute(`ALTER TABLE notifications MODIFY COLUMN order_id INT NULL`);
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
    }
  },

  async create({ orderId, userId, type, title, message, channel = 'PUSH', deliveryStatus = 'SENT', providerMessageId = null }) {
    const [result] = await db.execute(
      `INSERT INTO notifications (order_id, user_id, type, title, message, channel, delivery_status, provider_message_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderId, userId, type, title, message, channel, deliveryStatus, providerMessageId]
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
