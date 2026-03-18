const Complaint = require('../models/complaint.model');

const complaintController = {

  // POST /api/complaints
  async createComplaint(req, res) {
    try {
      const { orderId, subject, message } = req.body;
      if (!subject || !subject.trim()) {
        return res.status(400).json({ message: 'Subject is required' });
      }
      if (!message || !message.trim()) {
        return res.status(400).json({ message: 'Message is required' });
      }
      const complaintId = await Complaint.create({
        orderId: orderId || null,
        customerId: req.userId,
        subject: subject.trim(),
        message: message.trim(),
      });
      res.status(201).json({ message: 'Complaint submitted successfully', complaintId });
    } catch (error) {
      console.error('Create complaint error:', error);
      res.status(500).json({ message: 'Failed to submit complaint' });
    }
  },

  // GET /api/complaints/my-complaints
  async getMyComplaints(req, res) {
    try {
      const complaints = await Complaint.getByCustomerId(req.userId);
      res.json(complaints);
    } catch (error) {
      console.error('Get my complaints error:', error);
      res.status(500).json({ message: 'Failed to fetch complaints' });
    }
  },

  // GET /api/complaints
  async getAllComplaints(req, res) {
    try {
      const complaints = await Complaint.getAll();
      res.json(complaints);
    } catch (error) {
      console.error('Get all complaints error:', error);
      res.status(500).json({ message: 'Failed to fetch complaints' });
    }
  },

  // GET /api/complaints/:id
  async getComplaintById(req, res) {
    try {
      const complaint = await Complaint.getById(req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      res.json(complaint);
    } catch (error) {
      console.error('Get complaint error:', error);
      res.status(500).json({ message: 'Failed to fetch complaint' });
    }
  },

  // PATCH /api/complaints/:id/status
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!['submitted', 'resolved'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be submitted or resolved' });
      }
      const updated = await Complaint.updateStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      res.json({ message: 'Complaint status updated' });
    } catch (error) {
      console.error('Update complaint status error:', error);
      res.status(500).json({ message: 'Failed to update complaint status' });
    }
  },

};

module.exports = complaintController;
