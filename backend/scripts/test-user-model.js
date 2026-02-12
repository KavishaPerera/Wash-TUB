require('dotenv').config();
const User = require('../models/user.model');
const db = require('../config/db.config');

async function testUserFlow() {
    console.log('Testing User Model connection...');

    try {
        // 1. Create a test user
        const testUser = {
            firstName: 'Test',
            lastName: 'User',
            email: `test_user_${Date.now()}@example.com`,
            password: 'password123',
            role: 'customer'
        };

        console.log('Creating user:', testUser.email);
        const createResult = await User.create(testUser);
        const userId = createResult.insertId;
        console.log('✅ User created with ID:', userId);

        // 2. Find user by ID
        const foundById = await User.findById(userId);
        if (foundById && foundById.email === testUser.email) {
            console.log('✅ Found user by ID:', foundById.email);
        } else {
            console.error('❌ Failed to find user by ID');
        }

        // 3. Find user by Email
        const foundByEmail = await User.findByEmail(testUser.email);
        if (foundByEmail && foundByEmail.id === userId) {
            console.log('✅ Found user by Email:', foundByEmail.first_name);
        } else {
            console.error('❌ Failed to find user by Email');
        }

        // 4. Verify password
        const isPasswordValid = await User.verifyPassword('password123', foundByEmail.password);
        if (isPasswordValid) {
            console.log('✅ Password verification successful');
        } else {
            console.error('❌ Password verification failed');
        }

        // Cleanup (optional, but good for testing)
        const [delResult] = await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        console.log('✅ Cleanup: Deleted test user');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        process.exit();
    }
}

testUserFlow();
