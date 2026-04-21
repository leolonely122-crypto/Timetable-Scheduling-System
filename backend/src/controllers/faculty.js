const { Faculty, Schedule, TimeSlot } = require('../models');
const { sequelize } = require('../config/db');

exports.getAllFaculty = async (req, res, next) => {
  try {
    const { dept_id, is_active } = req.query;
    const where = {};
    if (dept_id) where.dept_id = dept_id;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const facultyList = await Faculty.findAll({ where });
    res.json({ success: true, data: facultyList });
  } catch (error) {
    next(error);
  }
};

exports.createFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
};

exports.updateFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });

    await faculty.update(req.body);
    res.json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
};

exports.deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });

    await faculty.update({ is_active: false });
    res.json({ success: true, message: 'Faculty soft deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getFacultyTimetable = async (req, res, next) => {
  try {
    const { year, sem } = req.query;
    if (!year || !sem) return res.status(400).json({ success: false, message: 'year and sem are required' });

    // Assuming we created the view faculty_timetable in the DB
    const [results] = await sequelize.query(
      `SELECT * FROM faculty_timetable WHERE faculty_id = ? AND academic_year = ? AND semester = ?`,
      { replacements: [req.params.id, year, sem] }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getFacultyFreeSlots = async (req, res, next) => {
  try {
    const { day, year, sem } = req.query;
    if (!day || !year || !sem) return res.status(400).json({ success: false, message: 'day, year, and sem are required' });

    const [results] = await sequelize.query(
      `CALL get_faculty_free_slots(?, ?, ?, ?)`,
      { replacements: [req.params.id, day, year, sem] }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
