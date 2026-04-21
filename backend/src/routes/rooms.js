const express = require('express');
const { body } = require('express-validator');
const roomController = require('../controllers/rooms');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

const router = express.Router();

router.use(authenticateToken);

router.get('/', roomController.getAllRooms);
router.get('/utilization', authorizeRoles('admin'), roomController.getRoomUtilization);
router.get('/:id/timetable', roomController.getRoomTimetable);

router.use(authorizeRoles('admin'));
router.post('/', [
  body('room_number').notEmpty(),
  body('capacity').isInt(),
  body('room_type').notEmpty()
], validate, roomController.createRoom);
router.put('/:id', roomController.updateRoom);

module.exports = router;
