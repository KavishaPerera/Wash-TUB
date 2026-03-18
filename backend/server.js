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
const reportRoutes = require('./routes/report.routes');
const notificationRoutes = require('./routes/notification.routes');
const promotionRoutes = require('./routes/promotion.routes');
const complaintRoutes = require('./routes/complaint.routes');
const db = require('./config/db.config');
const Order = require('./models/order.model');
const Report = require('./models/report.model');
const Payment = require('./models/payment.model');
const Receipt = require('./models/receipt.model');
const Notification = require('./models/notification.model');
const Promotion = require('./models/promotion.model');
const Complaint = require('./models/complaint.model');

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
    // await Order.alterTables();
    console.log('✅ Order tables ready');
    await Report.createTable();
    console.log('✅ Reports table ready');
    await Payment.createTable();
    console.log('✅ Payments table ready');
    await Receipt.createTable();
    console.log('✅ Receipts table ready');
    await Notification.createTable();
    await Notification.migrateTable();
    console.log('✅ Notifications table ready');
    await Promotion.createTable();
    await Complaint.createTable();
    await Complaint.migrateTable();
    console.log('✅ Complaints table ready');
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
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', promotionRoutes);
app.use('/api/complaints', complaintRoutes);

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
