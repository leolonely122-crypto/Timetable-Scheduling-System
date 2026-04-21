const express = require('express');
const { body } = require('express-validator');
const facultyController = require('../controllers/faculty');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

const router = express.Router();

router.use(authenticateToken);

router.get('/', facultyController.getAllFaculty);
router.get('/:id/timetable', facultyController.getFacultyTimetable);
router.get('/:id/free-slots', facultyController.getFacultyFreeSlots);

// Admin only actions
router.use(authorizeRoles('admin'));

router.post('/', [
  body('faculty_name').notEmpty().withMessage('Name is required'),
  body('employee_code').notEmpty(),
  body('dept_id').isInt(),
  body('email').isEmail()
], validate, facultyController.createFaculty);

router.put('/:id', facultyController.updateFaculty);
router.delete('/:id', facultyController.deleteFaculty);

module.exports = router;
