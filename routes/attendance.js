const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Get attendance records with optional employee filter
router.get('/', async (req, res) => {
  try {
    const { employeeId } = req.query;
    let query = {};
    
    if (employeeId) {
      query.employeeId = employeeId;
    }

    const attendance = await Attendance.find(query)
      .populate('employeeId', 'fullName employeeId')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records', error: error.message });
  }
});

// Mark attendance
router.post('/', [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['Present', 'Absent']).withMessage('Status must be Present or Absent')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { employeeId, date, status } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Normalize date to start of day for consistent comparison
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this employee on this date
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this employee on this date' });
    }

    const attendance = new Attendance({
      employeeId,
      date: attendanceDate,
      status
    });

    await attendance.save();
    await attendance.populate('employeeId', 'fullName employeeId');
    
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
});

module.exports = router;