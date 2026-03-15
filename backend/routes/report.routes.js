const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isOwner } = require('../middleware/auth.middleware');

router.get('/daily-sales',        verifyToken, isOwner, reportController.getDailySales);
router.get('/service-popularity', verifyToken, isOwner, reportController.getServicePopularity);
router.get('/monthly-sales',      verifyToken, isOwner, reportController.getMonthlySales);
router.get('/payment-method',     verifyToken, isOwner, reportController.getPaymentMethod);
router.get('/top-customers',      verifyToken, isOwner, reportController.getTopCustomers);
router.get('/pickup-delivery',    verifyToken, isOwner, reportController.getPickupDelivery);
router.get('/weekly-performance', verifyToken, isOwner, reportController.getWeeklyPerformance);

module.exports = router;
