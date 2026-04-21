const { sequelize } = require('../config/db');

exports.getFacultyWorkload = async (req, res, next) => {
  try {
    const { year, sem } = req.query;
    if (!year || !sem) return res.status(400).json({ success: false, message: 'year and sem required' });

    const [results] = await sequelize.query(
      `SELECT * FROM faculty_workload WHERE academic_year = ? AND semester = ?`,
      { replacements: [year, sem] }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getRoomUtilization = async (req, res, next) => {
  try {
    const { year, sem } = req.query;
    if (!year || !sem) return res.status(400).json({ success: false, message: 'year and sem required' });

    const [results] = await sequelize.query(
      `SELECT * FROM room_utilization WHERE academic_year = ? AND semester = ? ORDER BY utilization_percentage DESC`,
      { replacements: [year, sem] }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getDepartmentSummary = async (req, res, next) => {
  try {
    // Basic implementation since specific logic for department summary view isn't fully detailed in the prompt,
    // Using the department_schedule view to aggregate some stats
    const { year, sem } = req.query;
    if (!year || !sem) return res.status(400).json({ success: false, message: 'year and sem required' });

    // The department_schedule view joins many things. We can group by dept_name in raw SQL:
    const [results] = await sequelize.query(`
      SELECT 
        d.dept_name,
        COUNT(DISTINCT s.subject_id) AS total_subjects,
        COUNT(DISTINCT s.faculty_id) AS total_faculty_assigned,
        COUNT(DISTINCT s.section_id) AS total_sections
      FROM schedule s
      JOIN section sec ON s.section_id = sec.section_id
      JOIN course c ON sec.course_id = c.course_id
      JOIN department d ON c.dept_id = d.dept_id
      WHERE s.academic_year = ? AND s.semester = ?
      GROUP BY d.dept_name
    `, { replacements: [year, sem] });

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
