const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Subject = sequelize.define('Subject', {
  subject_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  subject_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hours_per_week: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject_type: {
    type: DataTypes.ENUM('Theory', 'Lab', 'Tutorial'),
    allowNull: false
  },
  is_elective: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'subject',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Subject;
