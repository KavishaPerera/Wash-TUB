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

        // List tables
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('Tables:', tables.map(t => Object.values(t)[0]));

        if (tables.length > 0) {
            // Describe users table if it exists
            const [columns] = await connection.execute('DESCRIBE users');
            console.table(columns);
        } else {
            console.log('No tables found.');
        }

        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkSchema();
