const Promotion = require('../models/promotion.model');
const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const buildPromoEmail = (firstName, code, discountType, discountValue, expiresAt, description) => {
  const discountText =
    discountType === 'percentage'
      ? `${discountValue}% off your order`
      : `LKR ${parseFloat(discountValue).toFixed(2)} off your order`;

  const expiryText = expiresAt
    ? `Valid until: <strong>${new Date(expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>`
    : 'No expiry — use it whenever you like!';

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9fa;padding:20px;border-radius:10px">
      <div style="background:#1a73e8;padding:20px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">Wash Tub</h1>
        <p style="color:#e8f0fe;margin:5px 0 0;font-size:14px">Laundry Made Easy</p>
      </div>
      <div style="background:#fff;padding:30px;border-radius:0 0 8px 8px">
        <h2 style="color:#1a73e8;margin-top:0">Hi ${firstName}, you've got a special offer!</h2>
        ${description ? `<p style="color:#555">${description}</p>` : ''}
        <p style="color:#555">Here is your exclusive promo code:</p>
        <div style="background:#f0f4ff;border:2px dashed #1a73e8;border-radius:8px;padding:20px;text-align:center;margin:20px 0">
          <p style="font-size:28px;font-weight:bold;color:#1a73e8;letter-spacing:4px;margin:0">${code}</p>
          <p style="color:#666;margin:8px 0 0;font-size:16px">${discountText}</p>
        </div>
        <p style="color:#555">${expiryText}</p>
        <p style="color:#555">Apply it at checkout and enjoy the savings!</p>
        <div style="text-align:center;margin:30px 0">
          <a href="http://localhost:5173/services"
             style="background:#1a73e8;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:16px;font-weight:bold">
            Shop Now
          </a>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
        <p style="color:#999;font-size:12px;text-align:center;margin:0">
          © ${new Date().getFullYear()} Wash Tub. All rights reserved.
        </p>
      </div>
    </div>
  `;
};

exports.createPromotion = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrderAmount, maxUses, expiresAt } = req.body;

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ message: 'Code, discount type, and discount value are required' });
    }
    if (!['percentage', 'fixed'].includes(discountType)) {
      return res.status(400).json({ message: 'Discount type must be percentage or fixed' });
    }
    if (parseFloat(discountValue) <= 0) {
      return res.status(400).json({ message: 'Discount value must be greater than 0' });
    }
    if (discountType === 'percentage' && parseFloat(discountValue) > 100) {
      return res.status(400).json({ message: 'Percentage discount cannot exceed 100%' });
    }

    const id = await Promotion.create({ code: code.toUpperCase(), description, discountType, discountValue, minOrderAmount, maxUses, expiresAt });
    const promo = await Promotion.getById(id);
    res.status(201).json({ message: 'Promotion created successfully', promotion: promo });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Promotion code already exists' });
    }
    console.error('createPromotion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.getAll();
    res.json(promotions);
  } catch (err) {
    console.error('getAllPromotions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const affected = await Promotion.delete(req.params.id);
    if (!affected) return res.status(404).json({ message: 'Promotion not found' });
    res.json({ message: 'Promotion deleted' });
  } catch (err) {
    console.error('deletePromotion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.validatePromoCode = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Promo code is required' });

    const promo = await Promotion.getByCode(code.toUpperCase());

    if (!promo || !promo.is_active) {
      return res.status(404).json({ message: 'Invalid promo code' });
    }
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return res.status(400).json({ message: 'This promo code has expired' });
    }
    if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
      return res.status(400).json({ message: 'This promo code has reached its usage limit' });
    }
    const total = parseFloat(orderTotal) || 0;
    if (total < parseFloat(promo.min_order_amount)) {
      return res.status(400).json({
        message: `Minimum order amount of LKR ${parseFloat(promo.min_order_amount).toFixed(2)} required`
      });
    }

    let discountAmount;
    if (promo.discount_type === 'percentage') {
      discountAmount = (total * parseFloat(promo.discount_value)) / 100;
    } else {
      discountAmount = parseFloat(promo.discount_value);
    }
    discountAmount = Math.min(discountAmount, total);

    res.json({
      valid: true,
      promotionId: promo.id,
      code: promo.code,
      discountType: promo.discount_type,
      discountValue: parseFloat(promo.discount_value),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      description: promo.description
    });
  } catch (err) {
    console.error('validatePromoCode error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTopCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const customers = await Promotion.getTopCustomers(limit);
    res.json(customers);
  } catch (err) {
    console.error('getTopCustomers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLowSalesServices = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const services = await Promotion.getLowSalesServices(limit);
    res.json(services);
  } catch (err) {
    console.error('getLowSalesServices error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendPromotionEmails = async (req, res) => {
  try {
    const { promotionId, emails } = req.body;

    if (!promotionId || !emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'promotionId and at least one email are required' });
    }

    const promo = await Promotion.getById(promotionId);
    if (!promo) return res.status(404).json({ message: 'Promotion not found' });

    const transporter = createTransporter();
    let sent = 0;
    let failed = 0;

    for (const recipient of emails) {
      const email = typeof recipient === 'string' ? recipient : recipient.email;
      const firstName = typeof recipient === 'object' ? (recipient.first_name || 'Valued Customer') : 'Valued Customer';
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Your Exclusive Wash Tub Promo Code: ${promo.code}`,
          html: buildPromoEmail(firstName, promo.code, promo.discount_type, promo.discount_value, promo.expires_at, promo.description)
        });
        sent++;
      } catch (emailErr) {
        console.error(`Failed to send promo email to ${email}:`, emailErr.message);
        failed++;
      }
    }

    res.json({ message: `Emails sent: ${sent}, failed: ${failed}`, sent, failed });
  } catch (err) {
    console.error('sendPromotionEmails error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
