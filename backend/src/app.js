const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes (To be created)
const authRoutes = require('./routes/auth');
const departmentRoutes = require('./routes/departments');
const facultyRoutes = require('./routes/faculty');
const roomRoutes = require('./routes/rooms');
const courseRoutes = require('./routes/courses');
const sectionRoutes = require('./routes/sections');
const scheduleRoutes = require('./routes/schedule');
const timeslotRoutes = require('./routes/timeslots');
const reportRoutes = require('./routes/reports');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/timeslots', timeslotRoutes);
app.use('/api/reports', reportRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
