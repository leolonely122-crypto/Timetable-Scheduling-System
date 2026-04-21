const { Course, Subject } = require('../models');

exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.findAll({ where: { is_active: true } });
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

exports.getCourseSubjects = async (req, res, next) => {
  try {
    const { semester } = req.query;
    const where = { course_id: req.params.id };
    if (semester) where.semester = semester;

    const subjects = await Subject.findAll({ where });
    res.json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
};

exports.createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });

    await subject.update(req.body);
    res.json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};
