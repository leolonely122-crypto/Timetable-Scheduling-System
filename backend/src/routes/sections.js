const express = require('express');
const { body } = require('express-validator');
const sectionController = require('../controllers/sections');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

const router = express.Router();

router.use(authenticateToken);

router.get('/', sectionController.getAllSections);
router.get('/:id/timetable', sectionController.getSectionTimetable);
router.get('/:id/students', sectionController.getSectionStudents);

router.use(authorizeRoles('admin'));
router.post('/', [
  body('section_name').notEmpty(),
  body('course_id').isInt(),
  body('academic_year').notEmpty(),
  body('semester').isInt(),
  body('max_students').isInt()
], validate, sectionController.createSection);

module.exports = router;
