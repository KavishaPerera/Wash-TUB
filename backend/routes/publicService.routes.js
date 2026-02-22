const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

// Public pricing data (active services only)
router.get('/', serviceController.getPublicServices); // GET /api/services

module.exports = router;
