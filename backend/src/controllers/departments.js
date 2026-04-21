const { Department } = require('../models');

exports.getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll({ where: { is_active: true } });
    res.json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
};

exports.createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });

    await department.update(req.body);
    res.json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });

    await department.update({ is_active: false });
    res.json({ success: true, message: 'Department soft deleted' });
  } catch (error) {
    next(error);
  }
};
