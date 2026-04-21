const express = require('express');
const { body } = require('express-validator');
const departmentController = require('../controllers/departments');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

const router = express.Router();

router.use(authenticateToken);

router.get('/', departmentController.getAllDepartments);

// Only admin can manage departments
router.use(authorizeRoles('admin'));

router.post('/', [
  body('dept_name').notEmpty().withMessage('Department name is required'),
  body('dept_code').notEmpty().withMessage('Department code is required')
], validate, departmentController.createDepartment);

router.put('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;
