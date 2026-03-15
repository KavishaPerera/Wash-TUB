const Order = require('../models/order.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const Promotion = require('../models/promotion.model');

// Notification messages for each order status
const STATUS_NOTIFICATIONS = {
  pending: {
    type: 'order_received',
    title: 'Order Received',
    message: (num) => `Your order ${num} has been received and is awaiting confirmation.`,
  },
  confirmed: {
    type: 'order_confirmed',
    title: 'Order Confirmed',
    message: (num) => `Your order ${num} has been confirmed by our team.`,
  },
  pickup_scheduled: {
    type: 'pickup_scheduled',
    title: 'Pickup Scheduled',
    message: (num) => `A pickup has been scheduled for your order ${num}.`,
  },
  picked_up: {
    type: 'picked_up',
    title: 'Laundry Picked Up',
    message: (num) => `Your laundry for order ${num} has been picked up and is on its way to our facility.`,
  },
  processing: {
    type: 'processing',
    title: 'Order Processing',
    message: (num) => `Your laundry for order ${num} is now being processed. Estimated completion: 24 hours.`,
  },
  ready: {
    type: 'order_ready',
    title: 'Order Ready',
    message: (num) => `Your laundry for order ${num} has been cleaned and is ready.`,
  },
  finished: {
    type: 'order_finished',
    title: 'Order Finished',
    message: (num) => `Your laundry for order ${num} has been completed and is ready for delivery.`,
  },
  out_for_delivery: {
    type: 'out_for_delivery',
    title: 'Out for Delivery',
    message: (num) => `Great news! Your order ${num} is on its way to you.`,
  },
  delivery_scheduled: {
    type: 'delivery_scheduled',
    title: 'Delivery Scheduled',
    message: (num) => `Your delivery for order ${num} has been scheduled. Please be available to receive it.`,
  },
  delivered: {
    type: 'order_delivered',
    title: 'Order Delivered',
    message: (num) => `Your order ${num} has been successfully delivered. Thank you for choosing WashTub!`,
  },
  cancelled: {
    type: 'order_cancelled',
    title: 'Order Cancelled',
    message: (num) => `Your order ${num} has been cancelled.`,
  },
};

// Helper — silently create a notification (never throws, so order ops aren't blocked)
async function notifyCustomer(orderId, customerId, status, orderNumber) {
  const tpl = STATUS_NOTIFICATIONS[status];
  if (!tpl) return;
  try {
    await Notification.create({
      orderId,
      userId: customerId,
      type: tpl.type,
      title: tpl.title,
      message: tpl.message(orderNumber),
    });
  } catch (err) {
    console.error(`Failed to create notification for order ${orderNumber}:`, err.message);
  }
}

const orderController = {
  // ---------------------------------------------------------------
  // POST /api/orders  –  Place a new order (customer)
  // ---------------------------------------------------------------
  async createOrder(req, res) {
    try {
      const customerId = req.userId;
      const { deliveryDetails, items, promoCode } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain at least one item.' });
      }

      if (!deliveryDetails || !deliveryDetails.fullName || !deliveryDetails.phone) {
        return res.status(400).json({ message: 'Full name and phone are required.' });
      }

      // Calculate totals on server side for security
      const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const deliveryFee = deliveryDetails.deliveryOption === 'delivery' ? 200 : 0;

      // Validate and apply promo code if provided
      let discount = 0;
      let appliedPromoId = null;
      if (promoCode) {
        const promo = await Promotion.getByCode(promoCode.toUpperCase());
        if (promo && promo.is_active) {
          const notExpired = !promo.expires_at || new Date(promo.expires_at) >= new Date();
          const usageOk = promo.max_uses === null || promo.used_count < promo.max_uses;
          const meetsMin = subtotal >= parseFloat(promo.min_order_amount);
          if (notExpired && usageOk && meetsMin) {
            // Check service restriction (for low-sales promotions)
            if (promo.applicable_service_ids) {
              const allowedIds = JSON.parse(promo.applicable_service_ids);
              const hasMatch = items.some(item => allowedIds.includes(Number(item.serviceId)));
              if (!hasMatch) {
                // Promo not valid for these items — skip discount silently
              } else {
                if (promo.discount_type === 'percentage') {
                  discount = (subtotal * parseFloat(promo.discount_value)) / 100;
                } else {
                  discount = parseFloat(promo.discount_value);
                }
                discount = Math.min(discount, subtotal);
                appliedPromoId = promo.id;
              }
            } else {
              if (promo.discount_type === 'percentage') {
                discount = (subtotal * parseFloat(promo.discount_value)) / 100;
              } else {
                discount = parseFloat(promo.discount_value);
              }
              discount = Math.min(discount, subtotal);
              appliedPromoId = promo.id;
            }
          }
        }
      }

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

      // Increment promo usage after successful order creation
      if (appliedPromoId) {
        await Promotion.incrementUsedCount(appliedPromoId);
      }

      // Notify customer that their order was received
      await notifyCustomer(orderId, customerId, 'pending', orderNumber);

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
  //
  // Role-based transition rules:
  //   Delivery person:
  //     Pickup phase  → pickup_scheduled, picked_up, out_for_processing
  //     Delivery phase (only for delivery_option='delivery' orders after
  //     staff marks 'finished') → delivery_scheduled, delivered
  //   Staff / Owner:
  //     Processing phase → processing, ready, finished
  //     Can also cancel orders
  // ---------------------------------------------------------------
  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const validStatuses = [
        'pending', 'confirmed', 'pickup_scheduled', 'picked_up',
        'out_for_processing', 'processing', 'ready', 'finished',
        'out_for_delivery', 'delivery_scheduled', 'delivered', 'cancelled',
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status.' });
      }

      // Fetch the order to check current status & delivery option
      const order = await Order.getById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      const role = req.userRole; // 'delivery', 'staff', 'owner'
      const currentStatus = order.status;
      const deliveryOption = order.delivery_option; // 'pickup' or 'delivery'

      // ── Delivery person transition rules ─────────────────────────
      if (role === 'delivery') {
        // Allowed pickup-phase transitions
        const deliveryPickupTransitions = {
          'pending':            ['pickup_scheduled'],
          'confirmed':          ['pickup_scheduled'],
          'pickup_scheduled':   ['picked_up'],
          'picked_up':          ['out_for_processing'],
        };

        // Allowed delivery-phase transitions (only for delivery orders after completed)
        const deliveryDeliveryTransitions = {
          'finished':           ['delivery_scheduled'],
          'delivery_scheduled': ['delivered'],
        };

        const allowedFromPickup = deliveryPickupTransitions[currentStatus] || [];
        const allowedFromDelivery = deliveryDeliveryTransitions[currentStatus] || [];

        if (allowedFromPickup.includes(status)) {
          // Valid pickup-phase transition — allowed for both pickup & delivery orders
        } else if (allowedFromDelivery.includes(status)) {
          // Delivery phase — only allowed for 'delivery' orders
          if (deliveryOption !== 'delivery') {
            return res.status(403).json({
              message: 'Delivery-phase updates are only allowed for Pickup & Delivery orders.',
            });
          }
        } else {
          return res.status(403).json({
            message: `Delivery personnel cannot change status from "${currentStatus}" to "${status}".`,
          });
        }
      }

      // ── Staff / Owner transition rules ───────────────────────────
      if (role === 'staff' || role === 'owner') {
        const staffTransitions = {
          'out_for_processing': ['processing'],
          'processing':         ['ready'],
          'ready':              ['finished'],
        };

        const allowedStaff = staffTransitions[currentStatus] || [];

        // Staff can also cancel orders from any status
        if (status !== 'cancelled' && !allowedStaff.includes(status)) {
          return res.status(403).json({
            message: `Staff cannot change status from "${currentStatus}" to "${status}".`,
          });
        }
      }

      const updated = await Order.updateStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      // Notify the customer about the status change
      await notifyCustomer(order.id, order.customer_id, status, order.order_number);

      res.json({ message: `Order status updated to "${status}".` });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ message: 'Failed to update order status.' });
    }
  },

  // ---------------------------------------------------------------
  // PATCH /api/orders/:id/payment-status  –  Update payment status (owner/staff)
  // ---------------------------------------------------------------
  async updatePaymentStatus(req, res) {
    try {
      const { paymentStatus } = req.body;
      const validStatuses = ['paid', 'pending', 'failed', 'refunded'];

      if (!validStatuses.includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status.' });
      }

      const updated = await Order.updatePaymentStatus(req.params.id, paymentStatus);
      if (!updated) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      res.json({ message: `Payment status updated to "${paymentStatus}".` });
    } catch (error) {
      console.error('Update payment status error:', error);
      res.status(500).json({ message: 'Failed to update payment status.' });
    }
  },

  // ---------------------------------------------------------------
  // GET /api/orders/delivery-history  –  Completed history for delivery personnel
  // ---------------------------------------------------------------
  async getDeliveryHistory(req, res) {
    try {
      const orders = await Order.getDeliveryHistory();
      res.json(orders);
    } catch (error) {
      console.error('Get delivery history error:', error);
      res.status(500).json({ message: 'Failed to fetch delivery history.' });
    }
  },

  // ---------------------------------------------------------------
  // GET /api/orders/delivery-orders  –  Orders for delivery personnel
  // ---------------------------------------------------------------
  async getDeliveryOrders(req, res) {
    try {
      const orders = await Order.getDeliveryOrders();
      res.json(orders);
    } catch (error) {
      console.error('Get delivery orders error:', error);
      res.status(500).json({ message: 'Failed to fetch delivery orders.' });
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

  // ---------------------------------------------------------------
  // POST /api/orders/pos  –  Staff creates walk-in POS order
  // ---------------------------------------------------------------
  async createPosOrder(req, res) {
    try {
      const { customer, items, paymentMethod, amountGiven, discount, discountReason } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain at least one item.' });
      }

      if (!customer || !customer.firstName || !customer.lastName || !customer.phone) {
        return res.status(400).json({ message: 'Customer first name, last name, and phone are required.' });
      }

      // Find or create walk-in customer
      const customerId = await User.findOrCreateWalkIn({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      });

      // Calculate totals on server side
      const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const appliedDiscount = Math.min(Math.max(parseFloat(discount) || 0, 0), subtotal);
      const total = subtotal - appliedDiscount;

      const orderData = {
        deliveryOption: 'pickup',
        fullName: `${customer.firstName} ${customer.lastName}`,
        phone: customer.phone,
        address: null,
        city: null,
        postalCode: null,
        pickupDate: null,
        pickupTime: null,
        specialInstructions: 'POS Walk-in Order',
        paymentMethod: paymentMethod || 'cash',
        subtotal,
        deliveryFee: 0,
        discount: appliedDiscount,
        discountReason: appliedDiscount > 0 ? (discountReason || null) : null,
        total,
      };

      const { orderId, orderNumber } = await Order.create(customerId, orderData, items);

      // POS cash payments are paid immediately
      await Order.updatePaymentStatus(orderId, 'paid');
      await Order.updateStatus(orderId, 'processing');

      res.status(201).json({
        message: 'POS order created successfully!',
        orderId,
        orderNumber,
        subtotal,
        discount: appliedDiscount,
        discountReason: appliedDiscount > 0 ? (discountReason || null) : null,
        total,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
        },
      });
    } catch (error) {
      console.error('Create POS order error:', error);
      res.status(500).json({ message: 'Failed to create POS order.' });
    }
  },
};

module.exports = orderController;
