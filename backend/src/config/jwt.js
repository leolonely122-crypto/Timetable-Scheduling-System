require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'supersecretjwtkey_12345',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
