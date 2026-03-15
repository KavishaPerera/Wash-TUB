const express = require('express');
const router = express.Router();
const { verifyToken, isOwner } = require('../middleware/auth.middleware');
const promotionController = require('../controllers/promotion.controller');

// Admin-only routes
router.post('/admin/promotions', verifyToken, isOwner, promotionController.createPromotion);
router.get('/admin/promotions', verifyToken, isOwner, promotionController.getAllPromotions);
router.delete('/admin/promotions/:id', verifyToken, isOwner, promotionController.deletePromotion);
router.get('/admin/promotions/top-customers', verifyToken, isOwner, promotionController.getTopCustomers);
router.get('/admin/promotions/active-customers', verifyToken, isOwner, promotionController.getAllActiveCustomers);
router.get('/admin/promotions/low-sales-services', verifyToken, isOwner, promotionController.getLowSalesServices);
router.post('/admin/promotions/send-emails', verifyToken, isOwner, promotionController.sendPromotionEmails);
router.post('/admin/promotions/send-notifications', verifyToken, isOwner, promotionController.sendPromotionNotifications);

// Customer route — validate a promo code
router.post('/promotions/validate', verifyToken, promotionController.validatePromoCode);

module.exports = router;
