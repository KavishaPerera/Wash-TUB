const db = require('../config/db.config');

const Order = {
  // ---------------------------------------------------------------
  // Create tables on startup
  // ---------------------------------------------------------------
  async createTables() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(20) UNIQUE NOT NULL,
        customer_id INT NOT NULL,
        status ENUM('pending','confirmed','pickup_scheduled','picked_up','processing','ready','out_for_delivery','delivered','cancelled') DEFAULT 'pending',
        delivery_option ENUM('pickup','delivery') DEFAULT 'delivery',
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT,
        city VARCHAR(100),
        postal_code VARCHAR(20),
        pickup_date DATE,
        pickup_time VARCHAR(50),
        special_instructions TEXT,
        payment_method VARCHAR(30) DEFAULT 'cash',
        subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
        discount DECIMAL(10,2) NOT NULL DEFAULT 0,
        total DECIMAL(10,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        service_id INT,
        item_name VARCHAR(100) NOT NULL,
        method VARCHAR(50),
        unit_type VARCHAR(20) DEFAULT 'ITEM',
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  },

  // ---------------------------------------------------------------
  // Generate a unique order number  WT-20250701-XXXX
  // ---------------------------------------------------------------
  async _generateOrderNumber() {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `WT-${dateStr}`;

    const [rows] = await db.execute(
      `SELECT order_number FROM orders
       WHERE order_number LIKE ?
       ORDER BY id DESC LIMIT 1`,
      [`${prefix}-%`]
    );

    let seq = 1;
    if (rows.length > 0) {
      const last = rows[0].order_number;           // WT-20250701-0003
      const lastSeq = parseInt(last.split('-')[2], 10);
      seq = lastSeq + 1;
    }

    return `${prefix}-${String(seq).padStart(4, '0')}`;
  },

  // ---------------------------------------------------------------
  // Create order + items inside a transaction
  // ---------------------------------------------------------------
  async create(customerId, orderData, items) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const orderNumber = await this._generateOrderNumber();

      const [orderResult] = await conn.execute(
        `INSERT INTO orders
           (order_number, customer_id, delivery_option, full_name, phone,
            address, city, postal_code, pickup_date, pickup_time,
            special_instructions, payment_method, subtotal, delivery_fee, discount, total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderNumber,
          customerId,
          orderData.deliveryOption || 'delivery',
          orderData.fullName,
          orderData.phone,
          orderData.address || null,
          orderData.city || null,
          orderData.postalCode || null,
          orderData.pickupDate || null,
          orderData.pickupTime || null,
          orderData.specialInstructions || null,
          orderData.paymentMethod || 'cash',
          orderData.subtotal,
          orderData.deliveryFee || 0,
          orderData.discount || 0,
          orderData.total,
        ]
      );

      const orderId = orderResult.insertId;

      // Insert each order item
      for (const item of items) {
        await conn.execute(
          `INSERT INTO order_items
             (order_id, service_id, item_name, method, unit_type, price, quantity, subtotal)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.serviceId || null,
            item.name,
            item.method || null,
            item.unitType || 'ITEM',
            item.price,
            item.quantity,
            item.totalPrice || item.price * item.quantity,
          ]
        );
      }

      await conn.commit();
      return { orderId, orderNumber };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // ---------------------------------------------------------------
  // Get a single order by ID (with items)
  // ---------------------------------------------------------------
  async getById(orderId) {
    const [orders] = await db.execute(
      `SELECT o.*, u.first_name, u.last_name, u.email
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       WHERE o.id = ?`,
      [orderId]
    );
    if (orders.length === 0) return null;

    const [items] = await db.execute(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    return { ...orders[0], items };
  },

  // ---------------------------------------------------------------
  // Get a single order by order_number (with items)
  // ---------------------------------------------------------------
  async getByOrderNumber(orderNumber) {
    const [orders] = await db.execute(
      `SELECT o.*, u.first_name, u.last_name, u.email
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       WHERE o.order_number = ?`,
      [orderNumber]
    );
    if (orders.length === 0) return null;

    const [items] = await db.execute(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orders[0].id]
    );

    return { ...orders[0], items };
  },

  // ---------------------------------------------------------------
  // Get all orders for a customer
  // ---------------------------------------------------------------
  async getByCustomerId(customerId) {
    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC`,
      [customerId]
    );

    // Attach items
    for (const order of orders) {
      const [items] = await db.execute(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return orders;
  },

  // ---------------------------------------------------------------
  // Get all orders (admin / staff)
  // ---------------------------------------------------------------
  async getAll(filters = {}) {
    let query = `
      SELECT o.*, u.first_name, u.last_name, u.email
      FROM orders o
      JOIN users u ON o.customer_id = u.id
    `;
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push('o.status = ?');
      params.push(filters.status);
    }
    if (filters.customerId) {
      conditions.push('o.customer_id = ?');
      params.push(filters.customerId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY o.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit, 10));
    }

    const [orders] = await db.execute(query, params);

    // Attach items to each order (so staff/admin dashboards see item details)
    for (const order of orders) {
      const [items] = await db.execute(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return orders;
  },

  // ---------------------------------------------------------------
  // Update order status
  // ---------------------------------------------------------------
  async updateStatus(orderId, status) {
    const [result] = await db.execute(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId]
    );
    return result.affectedRows > 0;
  },

  // ---------------------------------------------------------------
  // Count orders (for dashboard stats)
  // ---------------------------------------------------------------
  async countByStatus(status) {
    const [rows] = await db.execute(
      `SELECT COUNT(*) as count FROM orders WHERE status = ?`,
      [status]
    );
    return rows[0].count;
  },

  async totalRevenue() {
    const [rows] = await db.execute(
      `SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE status NOT IN ('cancelled')`
    );
    return rows[0].revenue;
  },
};

module.exports = Order;
