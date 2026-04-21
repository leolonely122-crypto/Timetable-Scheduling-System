const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Room = sequelize.define('Room', {
  room_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  room_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  building: {
    type: DataTypes.STRING
  },
  floor: {
    type: DataTypes.INTEGER
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  room_type: {
    type: DataTypes.ENUM('Classroom', 'Lab', 'Seminar_Hall', 'Auditorium'),
    allowNull: false
  },
  has_projector: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  has_AC: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'room',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Room;
