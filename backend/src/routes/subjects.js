const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controllers/courses');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.post('/', [
  body('subject_name').notEmpty(),
  body('subject_code').notEmpty(),
  body('course_id').isInt(),
  body('semester').isInt(),
  body('credits').isInt(),
  body('hours_per_week').isInt(),
  body('subject_type').isIn(['Theory', 'Lab', 'Tutorial'])
], validate, courseController.createSubject);

router.put('/:id', courseController.updateSubject);

module.exports = router;
