const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

const User = {
  // Create users table if not exists
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await db.execute(sql);
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
    const sql = 'SELECT id, first_name, last_name, email, phone, address, role, created_at FROM users WHERE id = ?';
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
  }
};

module.exports = User;
