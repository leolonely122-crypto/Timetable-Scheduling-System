-- Timetable Scheduling System - Seed Data
-- Compatible with MySQL 8.0

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE schedule;
TRUNCATE TABLE student;
TRUNCATE TABLE section;
TRUNCATE TABLE time_slot;
TRUNCATE TABLE room;
TRUNCATE TABLE subject;
TRUNCATE TABLE course;
TRUNCATE TABLE faculty;
TRUNCATE TABLE department;

-- ==========================================
-- 1. DEPARTMENTS
-- ==========================================
INSERT INTO department (dept_name, dept_code, established_year) VALUES
('Computer Science and Engineering', 'CSE', 2000),
('Electronics and Communication Engineering', 'ECE', 2002),
('Mechanical Engineering', 'MECH', 2005),
('Information Technology', 'IT', 2001);

-- ==========================================
-- 2. FACULTY (15 Faculty members)
-- ==========================================
INSERT INTO faculty (faculty_name, employee_code, dept_id, designation, email, phone, max_hours_per_week) VALUES
('Dr. Alan Turing', 'F001', 1, 'Professor', 'alan@example.com', '1234567890', 18),
('Dr. Grace Hopper', 'F002', 1, 'Associate Professor', 'grace@example.com', '1234567891', 18),
('Prof. Linus Torvalds', 'F003', 1, 'Assistant Professor', 'linus@example.com', '1234567892', 20),
('Dr. Ada Lovelace', 'F004', 1, 'Assistant Professor', 'ada@example.com', '1234567893', 20),
('Dr. Claude Shannon', 'F005', 2, 'Professor', 'claude@example.com', '1234567894', 16),
('Prof. Hedy Lamarr', 'F006', 2, 'Associate Professor', 'hedy@example.com', '1234567895', 18),
('Dr. Nikola Tesla', 'F007', 2, 'Assistant Professor', 'nikola@example.com', '1234567896', 20),
('Prof. James Watt', 'F008', 3, 'Professor', 'james@example.com', '1234567897', 16),
('Dr. Rudolf Diesel', 'F009', 3, 'Associate Professor', 'rudolf@example.com', '1234567898', 18),
('Prof. Henry Ford', 'F010', 3, 'Assistant Professor', 'henry@example.com', '1234567899', 20),
('Dr. Tim Berners-Lee', 'F011', 4, 'Professor', 'tim@example.com', '1234567800', 16),
('Prof. Vint Cerf', 'F012', 4, 'Associate Professor', 'vint@example.com', '1234567801', 18),
('Dr. Radia Perlman', 'F013', 4, 'Assistant Professor', 'radia@example.com', '1234567802', 20),
('Prof. Margaret Hamilton', 'F014', 1, 'Lecturer', 'margaret@example.com', '1234567803', 22),
('Dr. Richard Feynman', 'F015', 2, 'Lecturer', 'richard@example.com', '1234567804', 22);

-- Update HODs
UPDATE department SET hod_id = 1 WHERE dept_id = 1;
UPDATE department SET hod_id = 5 WHERE dept_id = 2;
UPDATE department SET hod_id = 8 WHERE dept_id = 3;
UPDATE department SET hod_id = 11 WHERE dept_id = 4;

-- ==========================================
-- 3. COURSES (3 Courses)
-- ==========================================
INSERT INTO course (course_name, course_code, dept_id, duration_years, total_semesters) VALUES
('B.Tech Computer Science', 'BTECH-CSE', 1, 4, 8),
('B.Tech Electronics', 'BTECH-ECE', 2, 4, 8),
('B.Tech Information Tech', 'BTECH-IT', 4, 4, 8);

-- ==========================================
-- 4. SUBJECTS (Semester 4 subjects)
-- ==========================================
INSERT INTO subject (subject_name, subject_code, course_id, semester, credits, hours_per_week, subject_type) VALUES
('Database Management Systems', 'CS401', 1, 4, 4, 4, 'Theory'),
('Operating Systems', 'CS402', 1, 4, 4, 4, 'Theory'),
('Design and Analysis of Algorithms', 'CS403', 1, 4, 4, 4, 'Theory'),
('DBMS Lab', 'CS404', 1, 4, 2, 3, 'Lab'),
('Microprocessors', 'EC401', 2, 4, 4, 4, 'Theory'),
('Analog Circuits', 'EC402', 2, 4, 4, 4, 'Theory'),
('Web Technologies', 'IT401', 3, 4, 4, 4, 'Theory'),
('Software Engineering', 'IT402', 3, 4, 4, 4, 'Theory');

-- ==========================================
-- 5. ROOMS (8 Rooms)
-- ==========================================
INSERT INTO room (room_number, building, floor, capacity, room_type, has_projector, has_AC) VALUES
('C-101', 'Main Block', 1, 60, 'Classroom', TRUE, FALSE),
('C-102', 'Main Block', 1, 60, 'Classroom', TRUE, FALSE),
('C-103', 'Main Block', 1, 60, 'Classroom', TRUE, FALSE),
('C-201', 'Main Block', 2, 60, 'Classroom', TRUE, FALSE),
('C-202', 'Main Block', 2, 60, 'Classroom', TRUE, FALSE),
('L-101', 'Lab Block', 1, 30, 'Lab', TRUE, TRUE),
('L-102', 'Lab Block', 1, 30, 'Lab', TRUE, TRUE),
('S-301', 'Admin Block', 3, 120, 'Seminar_Hall', TRUE, TRUE);

-- ==========================================
-- 6. TIME SLOTS (9 Slots: 7 periods + 2 breaks)
-- ==========================================
INSERT INTO time_slot (slot_name, start_time, end_time, duration_minutes, is_break) VALUES
('Period 1', '09:00:00', '09:50:00', 50, FALSE),
('Period 2', '09:50:00', '10:40:00', 50, FALSE),
('Short Break', '10:40:00', '11:00:00', 20, TRUE),
('Period 3', '11:00:00', '11:50:00', 50, FALSE),
('Period 4', '11:50:00', '12:40:00', 50, FALSE),
('Lunch Break', '12:40:00', '13:30:00', 50, TRUE),
('Period 5', '13:30:00', '14:20:00', 50, FALSE),
('Period 6', '14:20:00', '15:10:00', 50, FALSE),
('Period 7', '15:10:00', '16:00:00', 50, FALSE);

-- ==========================================
-- 7. SECTIONS (4 Sections)
-- ==========================================
INSERT INTO section (section_name, course_id, academic_year, semester, max_students, class_teacher_id) VALUES
('CSE-A', 1, '2025-26', 4, 50, 1),
('CSE-B', 1, '2025-26', 4, 50, 2),
('ECE-A', 2, '2025-26', 4, 50, 5),
('IT-A', 3, '2025-26', 4, 50, 11);

-- ==========================================
-- 8. STUDENTS (10 Sample Students)
-- ==========================================
INSERT INTO student (roll_number, student_name, section_id, date_of_birth, email, phone) VALUES
('24CS001', 'Alice Johnson', 1, '2004-05-15', 'alice@student.edu', '9876543210'),
('24CS002', 'Bob Smith', 1, '2004-06-20', 'bob@student.edu', '9876543211'),
('24CS051', 'Charlie Brown', 2, '2004-02-10', 'charlie@student.edu', '9876543212'),
('24CS052', 'Diana Prince', 2, '2004-08-30', 'diana@student.edu', '9876543213'),
('24EC001', 'Evan Wright', 3, '2004-11-22', 'evan@student.edu', '9876543214'),
('24EC002', 'Fiona Gallagher', 3, '2003-12-05', 'fiona@student.edu', '9876543215'),
('24IT001', 'George Martin', 4, '2004-03-17', 'george@student.edu', '9876543216'),
('24IT002', 'Hannah Abbott', 4, '2004-07-07', 'hannah@student.edu', '9876543217'),
('24CS003', 'Ian Malcolm', 1, '2004-01-25', 'ian@student.edu', '9876543218'),
('24CS053', 'Julia Roberts', 2, '2004-09-12', 'julia@student.edu', '9876543219');

-- ==========================================
-- 9. SCHEDULE (Partial 5-Day Schedule)
-- ==========================================
-- Note: slot_ids: 1(P1), 2(P2), 4(P3), 5(P4), 7(P5), 8(P6), 9(P7)
-- Subjects: 1(CS401), 2(CS402), 3(CS403), 4(CS404), 5(EC401), 6(EC402), 7(IT401), 8(IT402)
-- Rooms: 1-5 (Class), 6-7 (Lab)
-- Sections: 1(CSE-A), 2(CSE-B), 3(ECE-A), 4(IT-A)

-- MONDAY
INSERT INTO schedule (section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, academic_year, semester, created_by) VALUES
-- CSE-A (Sec 1)
(1, 1, 1, 1, 1, 'MON', '2025-26', 4, 1), -- P1, CS401, Alan, C-101
(1, 2, 2, 1, 2, 'MON', '2025-26', 4, 1), -- P2, CS402, Grace, C-101
(1, 3, 3, 1, 4, 'MON', '2025-26', 4, 1), -- P3, CS403, Linus, C-101
-- CSE-B (Sec 2)
(2, 2, 2, 2, 1, 'MON', '2025-26', 4, 1), -- P1, CS402, Grace, C-102
(2, 3, 3, 2, 2, 'MON', '2025-26', 4, 1), -- P2, CS403, Linus, C-102
(2, 1, 1, 2, 4, 'MON', '2025-26', 4, 1), -- P3, CS401, Alan, C-102
-- ECE-A (Sec 3)
(3, 5, 5, 3, 1, 'MON', '2025-26', 4, 1), -- P1, EC401, Claude, C-103
(3, 6, 6, 3, 2, 'MON', '2025-26', 4, 1), -- P2, EC402, Hedy, C-103
-- IT-A (Sec 4)
(4, 7, 11, 4, 4, 'MON', '2025-26', 4, 1), -- P3, IT401, Tim, C-201
(4, 8, 12, 4, 5, 'MON', '2025-26', 4, 1); -- P4, IT402, Vint, C-201

-- TUESDAY
INSERT INTO schedule (section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, academic_year, semester, created_by) VALUES
-- CSE-A (Sec 1) - LAB SESSION (Continuous slots P5, P6, P7)
(1, 4, 4, 6, 7, 'TUE', '2025-26', 4, 1), -- P5, CS404, Ada, L-101
(1, 4, 4, 6, 8, 'TUE', '2025-26', 4, 1), -- P6, CS404, Ada, L-101
(1, 4, 4, 6, 9, 'TUE', '2025-26', 4, 1), -- P7, CS404, Ada, L-101
-- CSE-B (Sec 2)
(2, 1, 1, 2, 1, 'TUE', '2025-26', 4, 1),
(2, 2, 2, 2, 2, 'TUE', '2025-26', 4, 1);

-- WEDNESDAY
INSERT INTO schedule (section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, academic_year, semester, created_by) VALUES
-- CSE-A (Sec 1)
(1, 3, 3, 1, 1, 'WED', '2025-26', 4, 1),
(1, 1, 1, 1, 2, 'WED', '2025-26', 4, 1),
-- CSE-B (Sec 2) - LAB SESSION (Continuous slots P5, P6, P7)
(2, 4, 4, 6, 7, 'WED', '2025-26', 4, 1),
(2, 4, 4, 6, 8, 'WED', '2025-26', 4, 1),
(2, 4, 4, 6, 9, 'WED', '2025-26', 4, 1);

-- THURSDAY
INSERT INTO schedule (section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, academic_year, semester, created_by) VALUES
(1, 2, 2, 1, 1, 'THU', '2025-26', 4, 1),
(3, 5, 5, 3, 1, 'THU', '2025-26', 4, 1),
(4, 7, 11, 4, 2, 'THU', '2025-26', 4, 1);

-- FRIDAY
INSERT INTO schedule (section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, academic_year, semester, created_by) VALUES
(1, 1, 1, 1, 4, 'FRI', '2025-26', 4, 1),
(2, 3, 3, 2, 4, 'FRI', '2025-26', 4, 1),
(3, 6, 6, 3, 5, 'FRI', '2025-26', 4, 1),
(4, 8, 12, 4, 5, 'FRI', '2025-26', 4, 1);

SET FOREIGN_KEY_CHECKS = 1;
