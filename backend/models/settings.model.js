const db = require('../config/db.config');

const Settings = {
    async createTable() {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS system_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) NOT NULL UNIQUE,
                setting_value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);
        // Seed default delivery fees — INSERT IGNORE won't overwrite existing values
        await db.execute(`
            INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES
                ('delivery_fee', '350'),
                ('pickup_fee', '200')
        `);
    },

    async getAll() {
        const [rows] = await db.execute('SELECT setting_key, setting_value FROM system_settings');
        return rows.reduce((map, row) => {
            map[row.setting_key] = row.setting_value;
            return map;
        }, {});
    },

    async get(key) {
        const [rows] = await db.execute(
            'SELECT setting_value FROM system_settings WHERE setting_key = ?',
            [key]
        );
        return rows.length ? rows[0].setting_value : null;
    },

    async setBulk(settingsMap) {
        const entries = Object.entries(settingsMap);
        if (entries.length === 0) return;
        for (const [key, value] of entries) {
            await db.execute(
                `INSERT INTO system_settings (setting_key, setting_value)
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
                [key, String(value)]
            );
        }
    },
};

module.exports = Settings;
