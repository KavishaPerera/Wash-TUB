require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '1234',
            database: process.env.DB_NAME || 'laundry_management_system',
            port: process.env.DB_PORT || 3307
        });

        console.log(`Connected to database: ${process.env.DB_NAME}`);

        const [tables] = await connection.execute('SHOW TABLES');
        if (tables.length === 0) {
            console.log('No tables found.');
            process.exit(0);
        }

        // Check users table specifically
        const [columns] = await connection.execute('DESCRIBE users');
        columns.forEach(col => {
            console.log(`Column: ${col.Field}, Type: ${col.Type}, Key: ${col.Key}`);
        });

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkSchema();
