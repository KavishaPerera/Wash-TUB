module.exports = {
  secret: process.env.JWT_SECRET || 'laundry-management-secret-key-2026',
  expiresIn: '24h'
};
