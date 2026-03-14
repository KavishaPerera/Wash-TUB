const db = require('../config/db.config');

const Report = {

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
