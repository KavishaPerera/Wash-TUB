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
