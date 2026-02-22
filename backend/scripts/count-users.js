// Count rows in the users table (no PII output)
// Run with: node scripts/count-users.js

require('dotenv').config();
const mysql = require('mysql2/promise');

async function countUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'laundry_management_system',
    port: Number(process.env.DB_PORT) || 3307
  });

  const [has] = await connection.execute("SHOW TABLES LIKE 'users'");
  if (!has.length) {
    console.log(`users table not found in database: ${process.env.DB_NAME}`);
    await connection.end();
    return;
  }

  const [rows] = await connection.execute('SELECT COUNT(*) AS user_count FROM users');
  console.log('users row count:', rows[0].user_count);

  await connection.end();
}

countUsers().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
