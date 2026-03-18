const db = require('../config/db.config');

const Complaint = {

  async createTable() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS complaints (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        order_id    INT NULL,
        customer_id INT NOT NULL,
        subject     VARCHAR(255) NOT NULL,
        message     TEXT NOT NULL,
        status      ENUM('submitted','resolved') NOT NULL DEFAULT 'submitted',
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id)    REFERENCES orders(id) ON DELETE SET NULL,
        FOREIGN KEY (customer_id) REFERENCES users(id)  ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  },

  async create({ orderId, customerId, subject, message }) {
    const [result] = await db.execute(
      `INSERT INTO complaints (order_id, customer_id, subject, message)
       VALUES (?, ?, ?, ?)`,
      [orderId || null, customerId, subject, message]
    );
    return result.insertId;
  },

  async getByCustomerId(customerId) {
    const [rows] = await db.execute(
      `SELECT c.id, c.subject, c.message, c.status, c.created_at, c.updated_at,
              o.order_number
       FROM complaints c
       LEFT JOIN orders o ON c.order_id = o.id
       WHERE c.customer_id = ?
       ORDER BY c.created_at DESC`,
      [customerId]
    );
    return rows;
  },

  async getAll() {
    const [rows] = await db.execute(
      `SELECT c.id, c.subject, c.message, c.status, c.created_at, c.updated_at,
              o.order_number,
              u.first_name, u.last_name, u.email
       FROM complaints c
       LEFT JOIN orders o ON c.order_id = o.id
       JOIN users u ON c.customer_id = u.id
       ORDER BY c.created_at DESC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute(
      `SELECT c.id, c.subject, c.message, c.status, c.created_at, c.updated_at,
              o.order_number,
              u.first_name, u.last_name, u.email
       FROM complaints c
       LEFT JOIN orders o ON c.order_id = o.id
       JOIN users u ON c.customer_id = u.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  },

  async migrateTable() {
    // Migrate any existing 'open' rows to 'submitted'
    await db.execute(`UPDATE complaints SET status = 'submitted' WHERE status = 'open'`);
    // Alter the ENUM column to replace 'open' with 'submitted'
    await db.execute(
      `ALTER TABLE complaints MODIFY COLUMN status ENUM('submitted','resolved') NOT NULL DEFAULT 'submitted'`
    );
  },

  async updateStatus(id, status) {
    const [result] = await db.execute(
      `UPDATE complaints SET status = ? WHERE id = ?`,
      [status, id]
    );
    return result.affectedRows > 0;
  },

};

module.exports = Complaint;
