const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, isOwner, isStaff } = require('../middleware/auth.middleware');

// Customer routes
router.post('/', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getMyOrders);

// Stats (owner only) — must be before /:id to avoid "stats" being parsed as an id
router.get('/stats/summary', verifyToken, isOwner, orderController.getStats);

// Single order (customer sees own, staff/owner see any)
router.get('/:id', verifyToken, orderController.getOrderById);

// Admin / Staff routes
router.get('/', verifyToken, isStaff, orderController.getAllOrders);
router.patch('/:id/status', verifyToken, isStaff, orderController.updateOrderStatus);

module.exports = router;
