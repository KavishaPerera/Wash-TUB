const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const serviceRoutes = require('./routes/service.routes');
const publicServiceRoutes = require('./routes/publicService.routes');
const orderRoutes = require('./routes/order.routes');
const db = require('./config/db.config');
const Order = require('./models/order.model');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
db.getConnection()
  .then(async (connection) => {
    console.log('✅ Database connected successfully');
    connection.release();
    // Auto-create order tables
    await Order.createTables();
    await Order.alterTables();
    console.log('✅ Order tables ready');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/services', serviceRoutes);
app.use('/api/services', publicServiceRoutes);
app.use('/api/orders', orderRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
