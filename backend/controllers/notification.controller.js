const Notification = require('../models/notification.model');

const notificationController = {

  // GET /api/notifications
  async getNotifications(req, res) {
    try {
      const notifications = await Notification.getByUserId(req.userId);
      res.json(notifications);
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ message: 'Failed to fetch notifications.' });
    }
  },

  // GET /api/notifications/unread-count
  async getUnreadCount(req, res) {
    try {
      const count = await Notification.getUnreadCount(req.userId);
      res.json({ count });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ message: 'Failed to fetch unread count.' });
    }
  },

  // PATCH /api/notifications/read-all
  async markAllAsRead(req, res) {
    try {
      await Notification.markAllAsRead(req.userId);
      res.json({ message: 'All notifications marked as read.' });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({ message: 'Failed to update notifications.' });
    }
  },

  // PATCH /api/notifications/:id/read
  async markAsRead(req, res) {
    try {
      const updated = await Notification.markAsRead(req.params.id, req.userId);
      if (!updated) {
        return res.status(404).json({ message: 'Notification not found.' });
      }
      res.json({ message: 'Notification marked as read.' });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ message: 'Failed to update notification.' });
    }
  },

  // DELETE /api/notifications/:id
  async deleteNotification(req, res) {
    try {
      const deleted = await Notification.deleteById(req.params.id, req.userId);
      if (!deleted) {
        return res.status(404).json({ message: 'Notification not found.' });
      }
      res.json({ message: 'Notification deleted.' });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({ message: 'Failed to delete notification.' });
    }
  },

};

module.exports = notificationController;
