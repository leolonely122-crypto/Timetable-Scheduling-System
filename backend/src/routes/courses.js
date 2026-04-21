const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controllers/courses');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

const router = express.Router();

router.use(authenticateToken);

router.get('/', courseController.getAllCourses);
router.get('/:id/subjects', courseController.getCourseSubjects);

router.use(authorizeRoles('admin'));

router.post('/', [
  body('course_name').notEmpty(),
  body('course_code').notEmpty(),
  body('dept_id').isInt(),
  body('duration_years').isInt(),
  body('total_semesters').isInt()
], validate, courseController.createCourse);

// Note: Using course router for subjects as they are tightly coupled,
// or we could mount a subjects router in app.js. Following requirements:
// POST /api/subjects -> we will mount this route in app.js as well,
// but for simplicity we can just export a separate subjects router or include here.
// Actually, the requirement said:
// POST /api/subjects
// PUT /api/subjects/:id
// Let's create a subjects router and export it.

module.exports = router;
