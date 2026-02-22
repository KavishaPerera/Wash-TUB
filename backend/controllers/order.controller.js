const Order = require('../models/order.model');

const orderController = {
  // ---------------------------------------------------------------
  // POST /api/orders  –  Place a new order (customer)
  // ---------------------------------------------------------------
  async createOrder(req, res) {
    try {
      const customerId = req.userId;
      const { deliveryDetails, items } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain at least one item.' });
      }

      if (!deliveryDetails || !deliveryDetails.fullName || !deliveryDetails.phone) {
        return res.status(400).json({ message: 'Full name and phone are required.' });
      }

      // Calculate totals on server side for security
      const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const deliveryFee = deliveryDetails.deliveryOption === 'delivery' ? 200 : 0;
      const discount = 0; // future: coupon system
      const total = subtotal + deliveryFee - discount;

      const orderData = {
        deliveryOption: deliveryDetails.deliveryOption,
        fullName: deliveryDetails.fullName,
        phone: deliveryDetails.phone,
        address: deliveryDetails.address,
        city: deliveryDetails.city,
        postalCode: deliveryDetails.postalCode,
        pickupDate: deliveryDetails.pickupDate,
        pickupTime: deliveryDetails.pickupTime,
        specialInstructions: deliveryDetails.specialInstructions,
        paymentMethod: deliveryDetails.paymentMethod || 'cash',
        subtotal,
        deliveryFee,
        discount,
        total,
      };

      const { orderId, orderNumber } = await Order.create(customerId, orderData, items);

      res.status(201).json({
        message: 'Order placed successfully!',
        orderId,
        orderNumber,
        total,
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ message: 'Failed to place order.' });
    }
  },

  // ---------------------------------------------------------------
  // GET /api/orders/my-orders  –  Customer's own orders
  // ---------------------------------------------------------------
  async getMyOrders(req, res) {
    try {
      const orders = await Order.getByCustomerId(req.userId);
      res.json(orders);
    } catch (error) {
      console.error('Get my orders error:', error);
      res.status(500).json({ message: 'Failed to fetch orders.' });
    }
  },

  // ---------------------------------------------------------------
  // GET /api/orders/:id  –  Single order detail
  // ---------------------------------------------------------------
  async getOrderById(req, res) {
    try {
      const order = await Order.getById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      // Customers can only view their own orders
      if (req.userRole === 'customer' && order.customer_id !== req.userId) {
        return res.status(403).json({ message: 'Access denied.' });
      }

      res.json(order);
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ message: 'Failed to fetch order.' });
    }
  },

  // ---------------------------------------------------------------
  // GET /api/orders  –  All orders (owner / staff)
  // ---------------------------------------------------------------
  async getAllOrders(req, res) {
    try {
      const filters = {
        status: req.query.status,
        limit: req.query.limit,
      };
      const orders = await Order.getAll(filters);
      res.json(orders);
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({ message: 'Failed to fetch orders.' });
    }
  },

  // ---------------------------------------------------------------
  // PATCH /api/orders/:id/status  –  Update order status
  // ---------------------------------------------------------------
  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const validStatuses = [
        'pending', 'confirmed', 'pickup_scheduled', 'picked_up',
        'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled',
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status.' });
      }

      const updated = await Order.updateStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      res.json({ message: `Order status updated to "${status}".` });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ message: 'Failed to update order status.' });
    }
  },

  // ---------------------------------------------------------------
  // GET /api/orders/stats/summary  –  Dashboard stats (owner)
  // ---------------------------------------------------------------
  async getStats(req, res) {
    try {
      const [pending, processing, delivered, revenue] = await Promise.all([
        Order.countByStatus('pending'),
        Order.countByStatus('processing'),
        Order.countByStatus('delivered'),
        Order.totalRevenue(),
      ]);

      res.json({ pending, processing, delivered, revenue });
    } catch (error) {
      console.error('Get order stats error:', error);
      res.status(500).json({ message: 'Failed to fetch stats.' });
    }
  },
};

module.exports = orderController;
