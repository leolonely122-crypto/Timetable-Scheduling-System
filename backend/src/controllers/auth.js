const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { secret, expiresIn } = require('../config/jwt');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = {
      user_id: user.user_id,
      role: user.role,
      reference_id: user.reference_id
    };

    const token = jwt.sign(payload, secret, { expiresIn });

    res.json({
      success: true,
      data: {
        token,
        user: {
          user_id: user.user_id,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  // Since JWT is stateless, logout is typically handled client-side by removing the token.
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
