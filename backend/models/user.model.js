const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

const User = {

  async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        role ENUM('owner', 'customer', 'delivery', 'staff') DEFAULT 'customer',
        is_active BOOLEAN DEFAULT TRUE,
        reset_password_code VARCHAR(6),
        reset_password_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await db.execute(sql);

    // Attempt to add columns if they don't exist (migrations-ish)
    try {
      await db.execute("ALTER TABLE users ADD COLUMN reset_password_code VARCHAR(6)");
    } catch (e) { /* ignore if exists */ }
    try {
      await db.execute("ALTER TABLE users ADD COLUMN reset_password_expires DATETIME");
    } catch (e) { /* ignore if exists */ }
  },

  // Create a new user
  async create(userData) {
    const { firstName, lastName, email, password, phone, address, role } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (first_name, last_name, email, password, phone, address, role, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
    `;

    const [result] = await db.execute(sql, [
      firstName,
      lastName,
      email,
      hashedPassword,
      phone || null,
      address || null,
      role || 'customer'
    ]);

    return result;
  },

  // Find user by email
  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(sql, [email]);
    return rows[0];
  },

  // Find user by ID
  async findById(id) {
    const sql = 'SELECT id, first_name, last_name, email, phone, address, role, is_active, created_at FROM users WHERE id = ?';
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  },

  // Update user
  async update(id, userData) {
    const { firstName, lastName, phone, address } = userData;
    const sql = `
      UPDATE users 
      SET first_name = ?, last_name = ?, phone = ?, address = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [firstName, lastName, phone, address, id]);
    return result;
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Save reset code
  async saveResetCode(email, code, expires) {
    const sql = 'UPDATE users SET reset_password_code = ?, reset_password_expires = ? WHERE email = ?';
    await db.execute(sql, [code, expires, email]);
  },

  // Verify reset code
  async verifyResetCode(email, code) {
    const sql = 'SELECT * FROM users WHERE email = ? AND reset_password_code = ? AND reset_password_expires > NOW()';
    const [rows] = await db.execute(sql, [email, code]);
    return rows[0];
  },

  // Reset password
  async resetPassword(email, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE users SET password = ?, reset_password_code = NULL, reset_password_expires = NULL WHERE email = ?';
    await db.execute(sql, [hashedPassword, email]);
  },

  // Get all users (admin)
  async getAllUsers() {
    const sql = `
      SELECT id, first_name, last_name, email, phone, address, role, is_active, created_at
      FROM users
      ORDER BY created_at DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  },

  // Set user active/inactive (admin)
  async setActive(id, isActive) {
    const sql = 'UPDATE users SET is_active = ? WHERE id = ?';
    const [result] = await db.execute(sql, [isActive, id]);
    return result;
  },

  // Delete user by ID (admin)
  async deleteById(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.execute(sql, [id]);
    return result;
  },

  // Update user details (admin)
  async adminUpdate(id, userData) {
    const { firstName, lastName, phone, address, role, isActive } = userData;
    const sql = `
      UPDATE users
      SET first_name = ?, last_name = ?, phone = ?, address = ?, role = ?, is_active = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [firstName, lastName, phone || null, address || null, role, isActive, id]);
    return result;
  }
};

module.exports = User;
