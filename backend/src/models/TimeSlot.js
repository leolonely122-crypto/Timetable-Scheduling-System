const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TimeSlot = sequelize.define('TimeSlot', {
  slot_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  slot_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_break: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'time_slot',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = TimeSlot;
