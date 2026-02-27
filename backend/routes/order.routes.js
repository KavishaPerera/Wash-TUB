const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, isOwner, isStaff, isDelivery } = require('../middleware/auth.middleware');

// Customer routes
router.post('/', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getMyOrders);

// Stats (owner only) — must be before /:id to avoid "stats" being parsed as an id
router.get('/stats/summary', verifyToken, isOwner, orderController.getStats);

// Delivery personnel — must be before /:id
router.get('/delivery-orders', verifyToken, isDelivery, orderController.getDeliveryOrders);

// Single order (customer sees own, staff/owner see any)
router.get('/:id', verifyToken, orderController.getOrderById);

// Admin / Staff routes
router.get('/', verifyToken, isStaff, orderController.getAllOrders);
// Delivery personnel and staff can both update order status
router.patch('/:id/status', verifyToken, (req, res, next) => {
  if (req.userRole === 'staff' || req.userRole === 'owner' || req.userRole === 'delivery') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied.' });
}, orderController.updateOrderStatus);

module.exports = router;
