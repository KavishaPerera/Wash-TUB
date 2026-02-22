const User = require('../models/user.model');
const nodemailer = require('nodemailer');

// Shared transporter factory
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Map internal role name to user-friendly label
const roleLabel = (role) => {
  const labels = {
    owner: 'Admin',
    staff: 'Staff',
    delivery: 'Delivery Personnel',
    customer: 'Customer',
  };
  return labels[role] || role;
};

// Dashboard URL per role
const dashboardUrl = (role) => {
  const paths = {
    owner: '/admin-dashboard',
    staff: '/staff-dashboard',
    delivery: '/delivery-dashboard',
    customer: '/customer-dashboard',
  };
  return `http://localhost:5173${paths[role] || '/signin'}`;
};

const adminController = {
  // ----------------------------------------------------------------
  // POST /api/admin/users
  // Admin creates a new user account and emails them their credentials
  // ----------------------------------------------------------------
  async createUser(req, res) {
    try {
      const { firstName, lastName, email, password, phone, address, role } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'First name, last name, email, password, and role are required',
        });
      }

      // Validate role is an accepted value
      const validRoles = ['owner', 'customer', 'delivery', 'staff'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role specified' });
      }

      // Check for duplicate email
      const existing = await User.findByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email is already registered' });
      }

      // Create the user
      const result = await User.create({ firstName, lastName, email, password, phone, address, role });
      const newUser = await User.findById(result.insertId);

      // Send welcome email with credentials
      try {
        const transporter = createTransporter();

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f1f5f9; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0ea5e9, #2563eb); padding: 32px 40px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 26px; letter-spacing: 1px; }
    .header p  { color: #bae6fd; margin: 6px 0 0; font-size: 14px; }
    .body { padding: 32px 40px; }
    .body h2 { color: #1e293b; margin-top: 0; }
    .body p  { color: #475569; line-height: 1.6; }
    .credentials { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
    .credentials table { width: 100%; border-collapse: collapse; }
    .credentials td { padding: 8px 0; color: #334155; font-size: 15px; }
    .credentials td:first-child { font-weight: 600; width: 120px; color: #64748b; }
    .credentials td span { background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 4px; font-family: monospace; font-size: 14px; letter-spacing: 0.5px; }
    .btn { display: inline-block; margin-top: 8px; padding: 12px 28px; background: #0ea5e9; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; }
    .footer { background: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    .note { background: #fef9c3; border-left: 4px solid #eab308; padding: 12px 16px; border-radius: 4px; margin-top: 20px; font-size: 13px; color: #713f12; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>WashTub</h1>
      <p>Laundry Management System</p>
    </div>
    <div class="body">
      <h2>Welcome, ${firstName}!</h2>
      <p>An account has been created for you on the <strong>WashTub</strong> platform. Your role is <strong>${roleLabel(role)}</strong>.</p>
      <p>Use the credentials below to sign in:</p>

      <div class="credentials">
        <table>
          <tr>
            <td>Email:</td>
            <td><span>${email}</span></td>
          </tr>
          <tr>
            <td>Password:</td>
            <td><span>${password}</span></td>
          </tr>
          <tr>
            <td>Role:</td>
            <td><span>${roleLabel(role)}</span></td>
          </tr>
        </table>
      </div>

      <a class="btn" href="http://localhost:5173/signin">Sign In Now</a>

      <div class="note">
        <strong>Security tip:</strong> Please change your password after your first login.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} WashTub &mdash; This email was sent by an admin. If you did not expect this, please contact support.
    </div>
  </div>
</body>
</html>`;

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: email,
          subject: `WashTub – Your ${roleLabel(role)} Account Is Ready`,
          html,
        });
      } catch (emailErr) {
        // Don't fail the whole request if email sending fails; just log it
        console.error('Failed to send welcome email:', emailErr.message);
      }

      return res.status(201).json({
        success: true,
        message: `${roleLabel(role)} account created successfully. Login credentials emailed to ${email}.`,
        user: {
          id: newUser.id,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          email: newUser.email,
          role: newUser.role,
          isActive: newUser.is_active,
          createdAt: newUser.created_at,
        },
      });
    } catch (error) {
      console.error('Admin createUser error:', error);
      res.status(500).json({ success: false, message: 'Error creating user account' });
    }
  },

  // ----------------------------------------------------------------
  // GET /api/admin/users
  // Returns all users for the User Management table
  // ----------------------------------------------------------------
  async getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();

      const formatted = users.map((u) => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        name: `${u.first_name} ${u.last_name}`,
        email: u.email,
        phone: u.phone,
        address: u.address,
        role: u.role,
        isActive: Boolean(u.is_active),
        createdAt: u.created_at,
      }));

      res.json({ success: true, users: formatted });
    } catch (error) {
      console.error('Admin getAllUsers error:', error);
      res.status(500).json({ success: false, message: 'Error fetching users' });
    }
  },

  // ----------------------------------------------------------------
  // PATCH /api/admin/users/:id/toggle-status
  // Activate or deactivate a user account
  // ----------------------------------------------------------------
  async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;

      // Prevent admin from deactivating their own account
      if (Number(id) === req.userId) {
        return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const newStatus = !user.is_active;
      await User.setActive(id, newStatus);

      res.json({
        success: true,
        message: `User account ${newStatus ? 'activated' : 'deactivated'} successfully`,
        isActive: newStatus,
      });
    } catch (error) {
      console.error('Admin toggleUserStatus error:', error);
      res.status(500).json({ success: false, message: 'Error updating user status' });
    }
  },

  // ----------------------------------------------------------------
  // DELETE /api/admin/users/:id
  // Permanently removes a user account
  // ----------------------------------------------------------------
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Prevent admin from deleting their own account
      if (Number(id) === req.userId) {
        return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      await User.deleteById(id);

      res.json({ success: true, message: 'User account deleted successfully' });
    } catch (error) {
      console.error('Admin deleteUser error:', error);
      res.status(500).json({ success: false, message: 'Error deleting user' });
    }
  },

  // ----------------------------------------------------------------
  // PUT /api/admin/users/:id
  // Update user details
  // ----------------------------------------------------------------
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { firstName, lastName, phone, address, role, isActive } = req.body;

      if (!firstName || !lastName || !role) {
        return res.status(400).json({ success: false, message: 'First name, last name, and role are required' });
      }

      const validRoles = ['owner', 'customer', 'delivery', 'staff'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role specified' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      await User.adminUpdate(id, { firstName, lastName, phone, address, role, isActive: isActive !== undefined ? isActive : user.is_active });

      res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
      console.error('Admin updateUser error:', error);
      res.status(500).json({ success: false, message: 'Error updating user' });
    }
  },
};

module.exports = adminController;
