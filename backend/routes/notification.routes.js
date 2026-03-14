const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All notification routes require authentication
// Unread count — must be before /:id to avoid being parsed as an id
router.get('/unread-count', verifyToken, notificationController.getUnreadCount);

// Mark all as read — must be before /:id
router.patch('/read-all', verifyToken, notificationController.markAllAsRead);

// List all notifications for the logged-in user
router.get('/', verifyToken, notificationController.getNotifications);

// Mark single notification as read
router.patch('/:id/read', verifyToken, notificationController.markAsRead);

// Delete a notification
router.delete('/:id', verifyToken, notificationController.deleteNotification);

module.exports = router;
