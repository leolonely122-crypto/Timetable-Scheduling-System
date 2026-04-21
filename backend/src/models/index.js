const { sequelize } = require('../config/db');

const User = require('./User');
const Department = require('./Department');
const Faculty = require('./Faculty');
const Course = require('./Course');
const Subject = require('./Subject');
const Room = require('./Room');
const TimeSlot = require('./TimeSlot');
const Section = require('./Section');
const Student = require('./Student');
const Schedule = require('./Schedule');

// Define relationships
Department.hasMany(Faculty, { foreignKey: 'dept_id' });
Faculty.belongsTo(Department, { foreignKey: 'dept_id' });

Department.belongsTo(Faculty, { as: 'HOD', foreignKey: 'hod_id' });

Department.hasMany(Course, { foreignKey: 'dept_id' });
Course.belongsTo(Department, { foreignKey: 'dept_id' });

Course.hasMany(Subject, { foreignKey: 'course_id' });
Subject.belongsTo(Course, { foreignKey: 'course_id' });

Course.hasMany(Section, { foreignKey: 'course_id' });
Section.belongsTo(Course, { foreignKey: 'course_id' });

Section.belongsTo(Faculty, { as: 'ClassTeacher', foreignKey: 'class_teacher_id' });

Section.hasMany(Student, { foreignKey: 'section_id' });
Student.belongsTo(Section, { foreignKey: 'section_id' });

Schedule.belongsTo(Section, { foreignKey: 'section_id' });
Schedule.belongsTo(Subject, { foreignKey: 'subject_id' });
Schedule.belongsTo(Faculty, { foreignKey: 'faculty_id' });
Schedule.belongsTo(Room, { foreignKey: 'room_id' });
Schedule.belongsTo(TimeSlot, { foreignKey: 'slot_id' });

module.exports = {
  sequelize,
  User,
  Department,
  Faculty,
  Course,
  Subject,
  Room,
  TimeSlot,
  Section,
  Student,
  Schedule
};
