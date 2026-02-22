const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes below require a valid JWT for an 'owner' role user
router.use(authMiddleware.verifyToken, authMiddleware.isOwner);

router.get('/',                              serviceController.getAllServices);    // GET    /api/admin/services
router.post('/',                             serviceController.createService);     // POST   /api/admin/services
router.put('/:id',                           serviceController.updateService);     // PUT    /api/admin/services/:id
router.patch('/:id/toggle-status',           serviceController.toggleStatus);      // PATCH  /api/admin/services/:id/toggle-status
router.delete('/:id',                        serviceController.deleteService);     // DELETE /api/admin/services/:id
router.get('/:id/price-history',             serviceController.getPriceHistory);   // GET    /api/admin/services/:id/price-history

module.exports = router;
