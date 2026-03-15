const db = require('../config/db.config');

const Promotion = {
  async createTable() {
    await db.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description VARCHAR(255),
        discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2) DEFAULT 0,
        max_uses INT DEFAULT NULL,
        used_count INT DEFAULT 0,
        is_active TINYINT DEFAULT 1,
        expires_at DATETIME DEFAULT NULL,
        applicable_service_ids TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Promotions table ready');
    // Add applicable_service_ids column if it doesn't exist (migration for existing tables)
    try {
      await db.query(`ALTER TABLE promotions ADD COLUMN applicable_service_ids TEXT DEFAULT NULL`);
      console.log('Promotions: added applicable_service_ids column');
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      // Column already exists — safe to ignore
    }
  },

  async create(data) {
    const { code, description, discountType, discountValue, minOrderAmount, maxUses, expiresAt, applicableServiceIds } = data;
    const serviceIdsJson = (Array.isArray(applicableServiceIds) && applicableServiceIds.length > 0)
      ? JSON.stringify(applicableServiceIds)
      : null;
    const [result] = await db.query(
      `INSERT INTO promotions (code, description, discount_type, discount_value, min_order_amount, max_uses, expires_at, applicable_service_ids)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [code, description || null, discountType, discountValue, minOrderAmount || 0, maxUses || null, expiresAt || null, serviceIdsJson]
    );
    return result.insertId;
  },

  async getAll() {
    const [rows] = await db.query(
      `SELECT * FROM promotions ORDER BY created_at DESC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await db.query(`SELECT * FROM promotions WHERE id = ?`, [id]);
    return rows[0];
  },

  async getByCode(code) {
    const [rows] = await db.query(`SELECT * FROM promotions WHERE code = ?`, [code]);
    return rows[0];
  },

  async incrementUsedCount(id) {
    await db.query(`UPDATE promotions SET used_count = used_count + 1 WHERE id = ?`, [id]);
  },

  async delete(id) {
    const [result] = await db.query(`DELETE FROM promotions WHERE id = ?`, [id]);
    return result.affectedRows;
  },

  async getTopCustomers(limit = 10) {
    const [rows] = await db.query(
      `SELECT u.id, u.first_name, u.last_name, u.email,
              COUNT(o.id) as order_count,
              SUM(o.total) as total_spent
       FROM users u
       JOIN orders o ON u.id = o.customer_id
       WHERE u.role = 'customer' AND u.is_active = 1
       GROUP BY u.id
       ORDER BY total_spent DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async getLowSalesServices(limit = 10) {
    const [rows] = await db.query(
      `SELECT s.service_id, s.service_name, s.description, s.unit_type,
              COUNT(oi.id) as order_count,
              COALESCE(SUM(oi.subtotal), 0) as total_revenue
       FROM services s
       LEFT JOIN order_items oi ON s.service_id = oi.service_id
       WHERE s.is_active = 1
       GROUP BY s.service_id
       ORDER BY order_count ASC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async getAllActiveCustomerEmails() {
    const [rows] = await db.query(
      `SELECT email, first_name, last_name FROM users
       WHERE role = 'customer' AND is_active = 1`
    );
    return rows;
  },

  async getAllActiveCustomers() {
    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email FROM users
       WHERE role = 'customer' AND is_active = 1`
    );
    return rows;
  },

  async getServicesByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await db.query(
      `SELECT service_id, service_name, description FROM services WHERE service_id IN (${placeholders})`,
      ids
    );
    return rows;
  }
};

module.exports = Promotion;
