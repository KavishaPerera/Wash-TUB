const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware.verifyToken, authController.getProfile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-code', authController.verifyCode);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authMiddleware.verifyToken, authController.changePassword);

module.exports = router;
