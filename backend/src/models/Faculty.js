const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Faculty = sequelize.define('Faculty', {
  faculty_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  faculty_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  employee_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  dept_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  designation: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING
  },
  max_hours_per_week: {
    type: DataTypes.INTEGER,
    defaultValue: 18
  },
  joining_date: {
    type: DataTypes.DATEONLY
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'faculty',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Faculty;
