const { Room } = require('../models');
const { sequelize } = require('../config/db');

exports.getAllRooms = async (req, res, next) => {
  try {
    const { type, min_capacity } = req.query;
    const where = {};
    if (type) where.room_type = type;
    
    // min_capacity would need Op.gte from sequelize if we weren't doing basic where
    // For simplicity, handle it manually or import Op
    const { Op } = require('sequelize');
    if (min_capacity) where.capacity = { [Op.gte]: min_capacity };

    const rooms = await Room.findAll({ where });
    res.json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    await room.update(req.body);
    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

exports.getRoomTimetable = async (req, res, next) => {
  try {
    const { day, year, sem } = req.query;
    let query = `
      SELECT s.schedule_id, s.day_of_week, s.academic_year, s.semester,
             ts.start_time, ts.end_time, ts.slot_name,
             sub.subject_code, sub.subject_name,
             f.faculty_name, sec.section_name
      FROM schedule s
      JOIN time_slot ts ON s.slot_id = ts.slot_id
      JOIN subject sub ON s.subject_id = sub.subject_id
      JOIN faculty f ON s.faculty_id = f.faculty_id
      JOIN section sec ON s.section_id = sec.section_id
      WHERE s.room_id = ? AND s.academic_year = ? AND s.semester = ?
    `;
    const replacements = [req.params.id, year, sem];

    if (day) {
      query += ` AND s.day_of_week = ?`;
      replacements.push(day);
    }

    const [results] = await sequelize.query(query, { replacements });
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getRoomUtilization = async (req, res, next) => {
  try {
    const { year, sem } = req.query;
    if (!year || !sem) return res.status(400).json({ success: false, message: 'year and sem required' });

    const [results] = await sequelize.query(
      `SELECT * FROM room_utilization WHERE academic_year = ? AND semester = ?`,
      { replacements: [year, sem] }
    );
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
