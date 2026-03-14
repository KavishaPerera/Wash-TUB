const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isOwner } = require('../middleware/auth.middleware');

router.get('/daily-sales', verifyToken, isOwner, reportController.getDailySales);

module.exports = router;
