# Timetable Scheduling System

A production-ready, full-stack web application designed for educational institutions to efficiently create, manage, and view academic timetables. Built with robust database-level conflict prevention.

## Features

- **Automated Conflict Prevention:** Database-level triggers and constraints ensure no scheduling overlaps for faculty, rooms, or sections.
- **Role-based Access Control:** Distinct portals for Administrators, Faculty, and Students.
- **Interactive Timetable Viewer:** View schedules dynamically by Section, Faculty, or Room.
- **Schedule Builder:** Intuitive interface with real-time conflict detection.
- **Reports & Analytics:** Visual insights into Faculty Workload and Room Utilization.
- **Premium UI:** Designed with modern aesthetics, glassmorphism elements, and responsive layouts.

## Tech Stack

- **Database:** MySQL 8.0 (Full relational schema with Triggers & Stored Procedures)
- **Backend:** Node.js, Express.js, Sequelize ORM
- **Frontend:** React 18, Vite, Tailwind CSS, TanStack Query, React Router v6

## Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL 8.0+

### Database Setup

1. Create a MySQL database (e.g., `timetable_db`).
2. Run the `database/schema.sql` script to create all tables, views, triggers, and stored procedures.
3. Run the `database/seed.sql` script to populate the database with realistic sample data (departments, faculty, courses, rooms, sections, and schedule).

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=timetable_db
   JWT_SECRET=supersecretjwtkey_12345
   JWT_EXPIRES_IN=24h
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Default Login Credentials (from seed data)
- **Admin**: `admin@example.com` / `password123` (Note: Ensure an admin user is inserted if modifying auth flow, or just use the UI defaults to bypass for demo purposes)
- **Faculty/Student**: Any email from the seed data can be linked to a user account.

## API Documentation Structure
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/schedule` - Fetch schedules with filters
- `POST /api/schedule` - Create a schedule slot (Triggers `insert_schedule` procedure and conflict checks)
- `GET /api/reports/*` - Fetch statistical data for dashboards

---
*Built with React, Express, and MySQL.*
