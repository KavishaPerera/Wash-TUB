const db = require('../config/db.config');

const Report = {

  async getDailySalesData(startDate, endDate) {
    const [dailyRows] = await db.execute(`
      SELECT
        DATE(created_at) AS date,
        COUNT(*) AS orders,
        SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END) AS revenue,
        COALESCE(AVG(CASE WHEN status != 'cancelled' THEN total ELSE NULL END), 0) AS avg_value,
        SUM(CASE WHEN status IN ('delivered','finished') THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
      FROM orders
      WHERE DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [startDate, endDate]);

    const [paymentRows] = await db.execute(`
      SELECT
        COALESCE(payment_method, 'unknown') AS payment_method,
        COUNT(*) AS count,
        SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END) AS amount
      FROM orders
      WHERE DATE(created_at) BETWEEN ? AND ?
      GROUP BY payment_method
    `, [startDate, endDate]);

    return { dailyRows, paymentRows };
  },

  async getServicePopularityData(startDate, endDate) {
    const [serviceRows] = await db.execute(`
      SELECT
        oi.item_name,
        COALESCE(oi.method, 'N/A') AS method,
        SUM(oi.quantity) AS total_quantity,
        COUNT(oi.id)     AS order_count,
        SUM(oi.subtotal) AS total_revenue
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE DATE(o.created_at) BETWEEN ? AND ?
        AND o.status != 'cancelled'
      GROUP BY oi.item_name, oi.method
      ORDER BY total_quantity DESC
    `, [startDate, endDate]);

    return { serviceRows };
  },

  async getMonthlySalesData(year, month = null) {
    let sql = `
      SELECT
        MONTH(created_at)     AS month_num,
        MONTHNAME(created_at) AS month_name,
        COUNT(*)              AS orders,
        SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END)                       AS revenue,
        COALESCE(AVG(CASE WHEN status != 'cancelled' THEN total ELSE NULL END), 0)        AS avg_value,
        SUM(CASE WHEN status IN ('delivered','finished') THEN 1 ELSE 0 END)               AS completed,
        SUM(CASE WHEN status = 'cancelled'              THEN 1 ELSE 0 END)                AS cancelled
      FROM orders
      WHERE YEAR(created_at) = ?
    `;
    const params = [year];
    if (month) {
      sql += ' AND MONTH(created_at) = ?';
      params.push(month);
    }
    sql += ' GROUP BY MONTH(created_at), MONTHNAME(created_at) ORDER BY month_num ASC';

    const [monthlyRows] = await db.execute(sql, params);
    return { monthlyRows };
  },

  async getPaymentMethodData(startDate, endDate) {
    const [paymentRows] = await db.execute(`
      SELECT
        COALESCE(payment_method, 'unknown')                                     AS payment_method,
        COUNT(*)                                                                 AS transactions,
        SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END)              AS revenue,
        SUM(CASE WHEN payment_status = 'paid'    THEN total ELSE 0 END)         AS collected,
        SUM(CASE WHEN payment_status = 'pending' THEN total ELSE 0 END)         AS pending_amount,
        SUM(CASE WHEN status = 'cancelled'       THEN 1    ELSE 0 END)          AS cancelled
      FROM orders
      WHERE DATE(created_at) BETWEEN ? AND ?
      GROUP BY payment_method
      ORDER BY revenue DESC
    `, [startDate, endDate]);

    return { paymentRows };
  },

  async getTopCustomersData(startDate, endDate, limit = 10) {
    const [customerRows] = await db.execute(`
      SELECT
        u.id                                                                           AS customer_id,
        CONCAT(u.first_name, ' ', u.last_name)                                         AS customer_name,
        u.email,
        u.phone,
        COUNT(o.id)                                                                    AS total_orders,
        SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END)                AS total_spent,
        COALESCE(AVG(CASE WHEN o.status != 'cancelled' THEN o.total ELSE NULL END), 0) AS avg_order_value,
        MAX(o.created_at)                                                              AS last_order_date,
        SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END)                       AS cancelled_orders
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      WHERE DATE(o.created_at) BETWEEN ? AND ?
        AND u.role = 'customer'
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone
      ORDER BY total_spent DESC
      LIMIT ${limit}
    `, [startDate, endDate]);

    return { customerRows };
  },

  async getPickupDeliveryData(startDate, endDate) {
    const [typeRows] = await db.execute(`
      SELECT
        delivery_option,
        COUNT(*) AS order_count,
        SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END) AS total_revenue
      FROM orders
      WHERE DATE(created_at) BETWEEN ? AND ?
        AND status != 'cancelled'
      GROUP BY delivery_option
    `, [startDate, endDate]);

    const [slotRows] = await db.execute(`
      SELECT
        COALESCE(NULLIF(TRIM(pickup_time), ''), 'Not Set') AS time_slot,
        COUNT(*) AS request_count
      FROM orders
      WHERE DATE(created_at) BETWEEN ? AND ?
        AND status != 'cancelled'
      GROUP BY time_slot
      ORDER BY
        CASE time_slot
          WHEN '06:00 AM - 09:00 AM' THEN 1
          WHEN '09:00 AM - 12:00 PM' THEN 2
          WHEN '12:00 PM - 03:00 PM' THEN 3
          WHEN '03:00 PM - 06:00 PM' THEN 4
          WHEN '06:00 PM - 09:00 PM' THEN 5
          ELSE 6
        END ASC
    `, [startDate, endDate]);

    const [areaRows] = await db.execute(`
      SELECT
        city,
        COUNT(*) AS order_count,
        SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END) AS total_revenue
      FROM orders
      WHERE DATE(created_at) BETWEEN ? AND ?
        AND delivery_option = 'delivery'
        AND status != 'cancelled'
        AND city IN (
          'Battaramulla', 'Hokandara', 'Koswatta', 'Malabe',
          'Pelawatta', 'Sri Jayawardenapura', 'Thalawathugoda'
        )
      GROUP BY city
      ORDER BY order_count DESC
    `, [startDate, endDate]);

    const [trendRows] = await db.execute(`
      SELECT
        DATE(created_at) AS order_date,
        delivery_option,
        COUNT(*) AS order_count
      FROM orders
      WHERE DATE(created_at) BETWEEN ? AND ?
        AND status != 'cancelled'
      GROUP BY DATE(created_at), delivery_option
      ORDER BY order_date ASC
    `, [startDate, endDate]);

    return { typeRows, slotRows, areaRows, trendRows };
  },

  async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS reports (
        report_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        owner_id INT NOT NULL,
        report_type ENUM('DAILY','WEEKLY','MONTHLY') NOT NULL,
        generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        file_path VARCHAR(255) NOT NULL,

        CONSTRAINT fk_reports_owner
          FOREIGN KEY (owner_id) REFERENCES users(id),
        INDEX idx_reports_owner_time (owner_id, generated_at)
      ) ENGINE=InnoDB
    `;
    await db.execute(sql);
  },

};

module.exports = Report;
