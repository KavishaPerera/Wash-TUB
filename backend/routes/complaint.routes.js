const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');
const { verifyToken, isOwner, isCustomer } = require('../middleware/auth.middleware');

// Customer submits a complaint
router.post('/', verifyToken, isCustomer, complaintController.createComplaint);

// Customer views own complaints — must be before /:id
router.get('/my-complaints', verifyToken, isCustomer, complaintController.getMyComplaints);

// Owner views all complaints
router.get('/', verifyToken, isOwner, complaintController.getAllComplaints);

// Single complaint detail
router.get('/:id', verifyToken, complaintController.getComplaintById);

// Owner updates complaint status
router.patch('/:id/status', verifyToken, isOwner, complaintController.updateStatus);

module.exports = router;
