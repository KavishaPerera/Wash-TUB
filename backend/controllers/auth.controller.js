const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

// Initialize users table
User.createTable().catch(console.error);

// Helper function to get dashboard path based on role
const getDashboardPath = (role) => {
  const dashboards = {
    owner: '/admin-dashboard',
    customer: '/customer-dashboard',
    staff: '/staff-dashboard',
    delivery: '/delivery-dashboard'
  };
  return dashboards[role] || '/customer-dashboard';
};

const authController = {
  // Register new user
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, phone, address, role } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          message: 'First name, last name, email, and password are required'
        });
      }

      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      // Create user
      const result = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        role
      });

      // Get created user
      const user = await User.findById(result.insertId);

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      // Get dashboard redirect path based on role
      const redirectPath = getDashboardPath(user.role);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role
        },
        token,
        redirectPath
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Error registering user' });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      // Get dashboard redirect path based on role
      const redirectPath = getDashboardPath(user.role);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role
        },
        token,
        redirectPath
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error fetching profile' });
    }
  },

  // Forgot Password - Send OTP
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User with this email does not exist' });
      }

      // Generate 6 digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      // Expires in 1 hour
      const expires = new Date(Date.now() + 3600000);

      await User.saveResetCode(email, code, expires);

      // Send email
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Code - WashTub',
        text: `Your password reset code is: ${code}\n\nThis code will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`
      };

      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: 'Verification code sent to your email' });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Error sending verification code' });
    }
  },

  // Verify Reset Code
  async verifyCode(req, res) {
    try {
      const { email, code } = req.body;

      const user = await User.verifyResetCode(email, code);
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification code' });
      }

      res.json({ success: true, message: 'Code verified successfully' });
    } catch (error) {
      console.error('Verify code error:', error);
      res.status(500).json({ message: 'Error verifying code' });
    }
  },

  // Reset Password
  async resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;

      // Basic validation
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      await User.resetPassword(email, newPassword);

      res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Error resetting password' });
    }
  }
};

module.exports = authController;
