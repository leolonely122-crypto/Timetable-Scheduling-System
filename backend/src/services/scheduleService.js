// A utility service for additional conflict logic if needed beyond database constraints
// The prompt specifies: "services/scheduleService.js (conflict logic)"

const { Schedule, Faculty, TimeSlot, Room, Section, Subject } = require('../models');

class ScheduleService {
  /**
   * Helper to validate a schedule entry before insertion.
   * This logic mimics the triggers but can be used for UI pre-validation.
   */
  static async validateSchedule(entry) {
    const { section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, academic_year, semester } = entry;
    
    // 1. Check Faculty Conflict
    const facConflict = await Schedule.findOne({
      where: { faculty_id, slot_id, day_of_week, academic_year, semester }
    });
    if (facConflict) return { valid: false, message: 'Faculty is already booked for this slot.' };

    // 2. Check Room Conflict
    const roomConflict = await Schedule.findOne({
      where: { room_id, slot_id, day_of_week, academic_year, semester }
    });
    if (roomConflict) return { valid: false, message: 'Room is already booked for this slot.' };

    // 3. Check Section Conflict
    const secConflict = await Schedule.findOne({
      where: { section_id, slot_id, day_of_week, academic_year, semester }
    });
    if (secConflict) return { valid: false, message: 'Section is already booked for this slot.' };

    return { valid: true };
  }
}

module.exports = ScheduleService;
