const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Department = sequelize.define('Department', {
  dept_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  dept_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dept_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  hod_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  established_year: {
    type: DataTypes.INTEGER
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'department',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Department;
