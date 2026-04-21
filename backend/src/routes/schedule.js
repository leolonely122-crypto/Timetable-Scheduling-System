const express = require('express');
const { body } = require('express-validator');
const scheduleController = require('../controllers/schedule');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

const router = express.Router();

router.use(authenticateToken);

router.get('/', scheduleController.getSchedule);
router.get('/conflicts', authorizeRoles('admin'), scheduleController.getConflicts);
router.get('/export', authorizeRoles('admin'), scheduleController.exportSchedule);

router.use(authorizeRoles('admin'));

router.post('/', [
  body('section_id').isInt(),
  body('subject_id').isInt(),
  body('faculty_id').isInt(),
  body('room_id').isInt(),
  body('slot_id').isInt(),
  body('day_of_week').isIn(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']),
  body('academic_year').notEmpty(),
  body('semester').isInt()
], validate, scheduleController.createSchedule);

router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
