const { Schedule } = require('../models');
const { sequelize } = require('../config/db');

exports.getSchedule = async (req, res, next) => {
  try {
    const { section_id, year, sem } = req.query;
    const where = {};
    if (section_id) where.section_id = section_id;
    if (year) where.academic_year = year;
    if (sem) where.semester = sem;

    const schedules = await Schedule.findAll({ where });
    res.json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
};

exports.createSchedule = async (req, res, next) => {
  try {
    const { section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, academic_year, semester } = req.body;
    const created_by = req.user.user_id;

    // Using stored procedure
    await sequelize.query(
      `CALL insert_schedule(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      { replacements: [section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, academic_year, semester, created_by] }
    );

    res.status(201).json({ success: true, message: 'Schedule created successfully' });
  } catch (error) {
    // Handling specific SQL signal states (45000) for our triggers
    if (error.original && error.original.sqlState === '45000') {
      return res.status(409).json({ success: false, message: error.original.sqlMessage });
    }
    // Handle unique constraint conflicts mapping to 409
    if (error.name === 'SequelizeUniqueConstraintError' || (error.original && error.original.code === 'ER_DUP_ENTRY')) {
      return res.status(409).json({ success: false, message: 'Scheduling conflict detected for faculty, room, or section.' });
    }
    next(error);
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });

    await schedule.update(req.body);
    res.json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};

exports.deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });

    await schedule.destroy();
    res.json({ success: true, message: 'Schedule deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getConflicts = async (req, res, next) => {
  try {
    const { year, sem } = req.query;
    if (!year || !sem) return res.status(400).json({ success: false, message: 'year and sem required' });

    const [results] = await sequelize.query(
      `CALL generate_conflict_report(?, ?)`,
      { replacements: [year, sem] }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.exportSchedule = async (req, res, next) => {
  try {
    const { year, sem, type } = req.query;
    // Exporting JSON format directly for simplicity
    const schedules = await Schedule.findAll({ where: { academic_year: year, semester: sem } });
    
    if (type === 'csv') {
      // Very basic CSV generation
      let csv = 'schedule_id,section_id,subject_id,faculty_id,room_id,slot_id,day_of_week\n';
      schedules.forEach(s => {
        csv += `${s.schedule_id},${s.section_id},${s.subject_id},${s.faculty_id},${s.room_id},${s.slot_id},${s.day_of_week}\n`;
      });
      res.header('Content-Type', 'text/csv');
      res.attachment('schedule.csv');
      return res.send(csv);
    }

    res.json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
};
