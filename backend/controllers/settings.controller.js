const Settings = require('../models/settings.model');

const settingsController = {
    async getSettings(req, res) {
        try {
            const settings = await Settings.getAll();
            res.json(settings);
        } catch (err) {
            console.error('Get settings error:', err);
            res.status(500).json({ message: 'Failed to fetch settings.' });
        }
    },

    async updateSettings(req, res) {
        try {
            const updates = req.body;
            if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
                return res.status(400).json({ message: 'Invalid settings payload.' });
            }
            await Settings.setBulk(updates);
            res.json({ message: 'Settings updated successfully.' });
        } catch (err) {
            console.error('Update settings error:', err);
            res.status(500).json({ message: 'Failed to update settings.' });
        }
    },
};

module.exports = settingsController;
