const express = require('express');
const { body } = require('express-validator');
const timeslotController = require('../controllers/timeslots');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

const router = express.Router();

router.use(authenticateToken);

router.get('/', timeslotController.getAllTimeSlots);

router.use(authorizeRoles('admin'));
router.post('/', [
  body('slot_name').notEmpty(),
  body('start_time').notEmpty(),
  body('end_time').notEmpty(),
  body('duration_minutes').isInt()
], validate, timeslotController.createTimeSlot);

module.exports = router;
