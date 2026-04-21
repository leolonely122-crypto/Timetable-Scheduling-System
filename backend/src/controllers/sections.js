const { Section, Student } = require('../models');
const { sequelize } = require('../config/db');

exports.getAllSections = async (req, res, next) => {
  try {
    const { course_id, year, sem } = req.query;
    const where = {};
    if (course_id) where.course_id = course_id;
    if (year) where.academic_year = year;
    if (sem) where.semester = sem;

    const sections = await Section.findAll({ where });
    res.json({ success: true, data: sections });
  } catch (error) {
    next(error);
  }
};

exports.createSection = async (req, res, next) => {
  try {
    const section = await Section.create(req.body);
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

exports.getSectionTimetable = async (req, res, next) => {
  try {
    const { year, sem } = req.query;
    if (!year || !sem) return res.status(400).json({ success: false, message: 'year and sem required' });

    const [results] = await sequelize.query(
      `SELECT * FROM section_timetable WHERE section_id = ? AND academic_year = ? AND semester = ?`,
      { replacements: [req.params.id, year, sem] }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getSectionStudents = async (req, res, next) => {
  try {
    const students = await Student.findAll({ where: { section_id: req.params.id } });
    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};
