const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Schedule = sequelize.define('Schedule', {
  schedule_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  faculty_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  slot_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  day_of_week: {
    type: DataTypes.ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'),
    allowNull: false
  },
  academic_year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'schedule',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['faculty_id', 'slot_id', 'day_of_week', 'academic_year', 'semester']
    },
    {
      unique: true,
      fields: ['room_id', 'slot_id', 'day_of_week', 'academic_year', 'semester']
    },
    {
      unique: true,
      fields: ['section_id', 'slot_id', 'day_of_week', 'academic_year', 'semester']
    }
  ]
});

module.exports = Schedule;
