// View all registered users
// Run with: node scripts/view-users.js

require('dotenv').config();
const mysql = require('mysql2/promise');

async function viewUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'laundry_management_system',
    port: process.env.DB_PORT || 3307
  });

  console.log('\n========== REGISTERED USERS ==========\n');

  const [rows] = await connection.execute(
    'SELECT id, first_name, last_name, email, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
  );

  console.table(rows);

  console.log(`\nTotal Users: ${rows.length}`);
  console.log('\n=======================================\n');

  await connection.end();
}

viewUsers().catch(console.error);
