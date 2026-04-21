const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, authController.login);

router.post('/logout', authController.logout);

router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
