const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Section = sequelize.define('Section', {
  section_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  section_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  course_id: {
    type: DataTypes.INTEGER,
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
  max_students: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  class_teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'section',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['course_id', 'section_name', 'academic_year', 'semester']
    }
  ]
});

module.exports = Section;
