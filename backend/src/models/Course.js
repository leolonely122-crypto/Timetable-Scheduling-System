const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  course_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  course_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  dept_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duration_years: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_semesters: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'course',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Course;
