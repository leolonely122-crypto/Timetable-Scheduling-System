const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  roll_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  student_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_of_birth: {
    type: DataTypes.DATEONLY
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'student',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Student;
