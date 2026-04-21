const { TimeSlot } = require('../models');

exports.getAllTimeSlots = async (req, res, next) => {
  try {
    const slots = await TimeSlot.findAll({ order: [['start_time', 'ASC']] });
    res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
};

exports.createTimeSlot = async (req, res, next) => {
  try {
    const slot = await TimeSlot.create(req.body);
    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};
