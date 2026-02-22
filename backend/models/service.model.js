const db = require('../config/db.config');

const Service = {

  // ---------------------------------------------------------------
  // Create both tables on startup
  // ---------------------------------------------------------------
  async createTables() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS services (
        service_id   BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        service_name VARCHAR(120) NOT NULL,
        description  TEXT NULL,
        unit_type    ENUM('KG','PIECE','ITEM') NOT NULL DEFAULT 'ITEM',
        is_active    TINYINT(1) NOT NULL DEFAULT 1
      ) ENGINE=InnoDB
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS service_price_history (
        service_price_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        service_id       BIGINT UNSIGNED NOT NULL,
        price_per_unit   DECIMAL(10,2) NOT NULL,
        effective_from   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        effective_to     DATETIME NULL,
        CONSTRAINT fk_price_service
          FOREIGN KEY (service_id) REFERENCES services(service_id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  },

  // ---------------------------------------------------------------
  // Create a service + initial price row
  // ---------------------------------------------------------------
  async create({ serviceName, description, unitType, pricePerUnit }) {
    const [svcResult] = await db.execute(
      `INSERT INTO services (service_name, description, unit_type, is_active)
       VALUES (?, ?, ?, 1)`,
      [serviceName, description || null, unitType || 'ITEM']
    );

    const serviceId = svcResult.insertId;

    await db.execute(
      `INSERT INTO service_price_history (service_id, price_per_unit, effective_from, effective_to)
       VALUES (?, ?, NOW(), NULL)`,
      [serviceId, pricePerUnit]
    );

    return serviceId;
  },

  // ---------------------------------------------------------------
  // Get all services with their current (effective_to IS NULL) price
  // ---------------------------------------------------------------
  async getAll() {
    const [rows] = await db.execute(`
      SELECT
        s.service_id,
        s.service_name,
        s.description,
        s.unit_type,
        s.is_active,
        sph.service_price_id,
        sph.price_per_unit,
        sph.effective_from
      FROM services s
      LEFT JOIN service_price_history sph
        ON s.service_id = sph.service_id AND sph.effective_to IS NULL
      ORDER BY s.service_id ASC
    `);
    return rows;
  },

  // ---------------------------------------------------------------
  // Get active services with their current price (public pricing)
  // ---------------------------------------------------------------
  async getActive() {
    const [rows] = await db.execute(`
      SELECT
        s.service_id,
        s.service_name,
        s.description,
        s.unit_type,
        s.is_active,
        sph.service_price_id,
        sph.price_per_unit,
        sph.effective_from
      FROM services s
      LEFT JOIN service_price_history sph
        ON s.service_id = sph.service_id AND sph.effective_to IS NULL
      WHERE s.is_active = 1
      ORDER BY s.service_id ASC
    `);
    return rows;
  },

  // ---------------------------------------------------------------
  // Get one service by ID
  // ---------------------------------------------------------------
  async getById(serviceId) {
    const [rows] = await db.execute(`
      SELECT
        s.service_id,
        s.service_name,
        s.description,
        s.unit_type,
        s.is_active,
        sph.service_price_id,
        sph.price_per_unit,
        sph.effective_from
      FROM services s
      LEFT JOIN service_price_history sph
        ON s.service_id = sph.service_id AND sph.effective_to IS NULL
      WHERE s.service_id = ?
    `, [serviceId]);
    return rows[0];
  },

  // ---------------------------------------------------------------
  // Update service details; if price changed → close old row + insert new
  // ---------------------------------------------------------------
  async update(serviceId, { serviceName, description, unitType, pricePerUnit }) {
    await db.execute(
      `UPDATE services SET service_name = ?, description = ?, unit_type = ? WHERE service_id = ?`,
      [serviceName, description || null, unitType, serviceId]
    );

    if (pricePerUnit !== undefined && pricePerUnit !== null) {
      // Close the current price row
      await db.execute(
        `UPDATE service_price_history
         SET effective_to = NOW()
         WHERE service_id = ? AND effective_to IS NULL`,
        [serviceId]
      );
      // Open a new price row
      await db.execute(
        `INSERT INTO service_price_history (service_id, price_per_unit, effective_from, effective_to)
         VALUES (?, ?, NOW(), NULL)`,
        [serviceId, pricePerUnit]
      );
    }
  },

  // ---------------------------------------------------------------
  // Toggle active / inactive
  // ---------------------------------------------------------------
  async setActive(serviceId, isActive) {
    const [result] = await db.execute(
      `UPDATE services SET is_active = ? WHERE service_id = ?`,
      [isActive ? 1 : 0, serviceId]
    );
    return result;
  },

  // ---------------------------------------------------------------
  // Delete service (CASCADE removes all price_history rows)
  // ---------------------------------------------------------------
  async deleteById(serviceId) {
    const [result] = await db.execute(
      `DELETE FROM services WHERE service_id = ?`,
      [serviceId]
    );
    return result;
  },

  // ---------------------------------------------------------------
  // Full price history for one service (newest first)
  // ---------------------------------------------------------------
  async getPriceHistory(serviceId) {
    const [rows] = await db.execute(`
      SELECT service_price_id, price_per_unit, effective_from, effective_to
      FROM service_price_history
      WHERE service_id = ?
      ORDER BY effective_from DESC
    `, [serviceId]);
    return rows;
  },
};

module.exports = Service;
