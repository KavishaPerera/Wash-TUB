require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function fixSchema() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '1234',
            database: process.env.DB_NAME || 'laundry_management_system',
            port: process.env.DB_PORT || 3307
        });

        console.log(`Connected to database: ${process.env.DB_NAME}`);

        // Check if users table needs migration
        const [columns] = await connection.execute("SHOW COLUMNS FROM users LIKE 'user_id'");

        if (columns.length > 0) {
            console.log('Detected incompatible schema (found user_id column).');

            const backupName = `users_backup_${Date.now()}`;
            console.log(`Renaming existing 'users' table to '${backupName}'...`);
            await connection.execute(`RENAME TABLE users TO ${backupName}`);

            console.log('Creating correct schema...');
            // Read init.sql
            const initSqlPath = path.join(__dirname, '../database/init.sql');
            const initSql = fs.readFileSync(initSqlPath, 'utf8');

            // Extract CREATE TABLE statement for users
            // This is a simple parser, might need adjustment if init.sql is complex
            // For now, let's just manually define the correct schema as per the User model to ensure consistency

            const createTableSql = `
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
        );
      `;

            await connection.execute(createTableSql);
            console.log('Users table created with correct schema.');

            // Add indexes
            try { await connection.execute("CREATE INDEX idx_users_email ON users(email)"); } catch (e) { }
            try { await connection.execute("CREATE INDEX idx_users_role ON users(role)"); } catch (e) { }

            console.log('Database fixed successfully.');
        } else {
            const [idCol] = await connection.execute("SHOW COLUMNS FROM users LIKE 'id'");
            if (idCol.length > 0) {
                console.log('Schema appears correct (found id column). No changes needed.');
            } else {
                console.log('Unknown schema state. Please inspect manually.');
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

fixSchema();
