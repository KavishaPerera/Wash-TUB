const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All admin routes require a valid JWT issued to an 'owner' role user
router.use(authMiddleware.verifyToken, authMiddleware.isOwner);

// User management
router.get('/users', adminController.getAllUsers);                        // GET  /api/admin/users
router.post('/users', adminController.createUser);                       // POST /api/admin/users
router.put('/users/:id', adminController.updateUser);                    // PUT  /api/admin/users/:id
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus); // PATCH /api/admin/users/:id/toggle-status
router.delete('/users/:id', adminController.deleteUser);                 // DELETE /api/admin/users/:id

module.exports = router;
