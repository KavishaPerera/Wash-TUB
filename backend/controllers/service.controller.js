const Service = require('../models/service.model');

// Ensure tables exist on first load
Service.createTables().catch(console.error);

const serviceController = {

  // ----------------------------------------------------------------
  // POST /api/admin/services
  // ----------------------------------------------------------------
  async createService(req, res) {
    try {
      const { serviceName, description, unitType, pricePerUnit } = req.body;

      if (!serviceName || pricePerUnit === undefined || pricePerUnit === '') {
        return res.status(400).json({ success: false, message: 'Service name and price are required' });
      }

      const price = parseFloat(pricePerUnit);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({ success: false, message: 'Price must be a valid non-negative number' });
      }

      const validUnits = ['KG', 'PIECE', 'ITEM'];
      const unit = (unitType || 'ITEM').toUpperCase();
      if (!validUnits.includes(unit)) {
        return res.status(400).json({ success: false, message: 'Invalid unit type. Use KG, PIECE, or ITEM' });
      }

      const serviceId = await Service.create({ serviceName, description, unitType: unit, pricePerUnit: price });
      const service = await Service.getById(serviceId);

      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        service: formatService(service),
      });
    } catch (error) {
      console.error('createService error:', error);
      res.status(500).json({ success: false, message: 'Error creating service' });
    }
  },

  // ----------------------------------------------------------------
  // GET /api/admin/services  (also accessible publicly via /api/services)
  // ----------------------------------------------------------------
  async getAllServices(req, res) {
    try {
      const services = await Service.getAll();
      res.json({ success: true, services: services.map(formatService) });
    } catch (error) {
      console.error('getAllServices error:', error);
      res.status(500).json({ success: false, message: 'Error fetching services' });
    }
  },

  // ----------------------------------------------------------------
  // GET /api/services  (public: active services only)
  // ----------------------------------------------------------------
  async getPublicServices(req, res) {
    try {
      const services = await Service.getActive();
      res.json({ success: true, services: services.map(formatService) });
    } catch (error) {
      console.error('getPublicServices error:', error);
      res.status(500).json({ success: false, message: 'Error fetching services' });
    }
  },

  // ----------------------------------------------------------------
  // PUT /api/admin/services/:id
  // ----------------------------------------------------------------
  async updateService(req, res) {
    try {
      const { id } = req.params;
      const { serviceName, description, unitType, pricePerUnit } = req.body;

      if (!serviceName) {
        return res.status(400).json({ success: false, message: 'Service name is required' });
      }

      const existing = await Service.getById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      const validUnits = ['KG', 'PIECE', 'ITEM'];
      const unit = (unitType || 'ITEM').toUpperCase();
      if (!validUnits.includes(unit)) {
        return res.status(400).json({ success: false, message: 'Invalid unit type' });
      }

      let price = undefined;
      if (pricePerUnit !== undefined && pricePerUnit !== '') {
        price = parseFloat(pricePerUnit);
        if (isNaN(price) || price < 0) {
          return res.status(400).json({ success: false, message: 'Price must be a valid non-negative number' });
        }
      }

      await Service.update(id, { serviceName, description, unitType: unit, pricePerUnit: price });
      const updated = await Service.getById(id);

      res.json({
        success: true,
        message: 'Service updated successfully',
        service: formatService(updated),
      });
    } catch (error) {
      console.error('updateService error:', error);
      res.status(500).json({ success: false, message: 'Error updating service' });
    }
  },

  // ----------------------------------------------------------------
  // PATCH /api/admin/services/:id/toggle-status
  // ----------------------------------------------------------------
  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const existing = await Service.getById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      const newStatus = !existing.is_active;
      await Service.setActive(id, newStatus);

      res.json({
        success: true,
        message: `Service ${newStatus ? 'activated' : 'deactivated'} successfully`,
        isActive: newStatus,
      });
    } catch (error) {
      console.error('toggleStatus error:', error);
      res.status(500).json({ success: false, message: 'Error updating service status' });
    }
  },

  // ----------------------------------------------------------------
  // DELETE /api/admin/services/:id
  // ----------------------------------------------------------------
  async deleteService(req, res) {
    try {
      const { id } = req.params;
      const existing = await Service.getById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      await Service.deleteById(id);
      res.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
      console.error('deleteService error:', error);
      res.status(500).json({ success: false, message: 'Error deleting service' });
    }
  },

  // ----------------------------------------------------------------
  // GET /api/admin/services/:id/price-history
  // ----------------------------------------------------------------
  async getPriceHistory(req, res) {
    try {
      const { id } = req.params;
      const existing = await Service.getById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      const history = await Service.getPriceHistory(id);
      res.json({ success: true, serviceName: existing.service_name, history });
    } catch (error) {
      console.error('getPriceHistory error:', error);
      res.status(500).json({ success: false, message: 'Error fetching price history' });
    }
  },
};

// ----------------------------------------------------------------
// Helper: shape a DB row into a clean API response object
// ----------------------------------------------------------------
function formatService(s) {
  return {
    id: s.service_id,
    name: s.service_name,
    description: s.description || '',
    unitType: s.unit_type,
    isActive: Boolean(s.is_active),
    price: s.price_per_unit !== null ? parseFloat(s.price_per_unit) : null,
    priceEffectiveFrom: s.effective_from || null,
  };
}

module.exports = serviceController;
