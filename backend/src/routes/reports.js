const express = require('express');
const reportController = require('../controllers/reports');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/faculty-workload', reportController.getFacultyWorkload);
router.get('/room-utilization', reportController.getRoomUtilization);
router.get('/department-summary', reportController.getDepartmentSummary);

module.exports = router;
