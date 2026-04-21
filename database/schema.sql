-- Timetable Scheduling System - Full DDL Schema
-- Compatible with MySQL 8.0

SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================
-- 1. TABLES
-- ==========================================

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS section;
DROP TABLE IF EXISTS time_slot;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS subject;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    dept_code VARCHAR(20) NOT NULL UNIQUE,
    hod_id INT NULL,
    established_year INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_name VARCHAR(100) NOT NULL,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    dept_id INT NOT NULL,
    designation VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    max_hours_per_week INT DEFAULT 18,
    joining_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES department(dept_id) ON DELETE RESTRICT
);

-- Circular foreign key for department's HOD
ALTER TABLE department ADD CONSTRAINT fk_dept_hod FOREIGN KEY (hod_id) REFERENCES faculty(faculty_id) ON DELETE SET NULL;

CREATE TABLE course (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    dept_id INT NOT NULL,
    duration_years INT NOT NULL,
    total_semesters INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES department(dept_id) ON DELETE RESTRICT
);

CREATE TABLE subject (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    course_id INT NOT NULL,
    semester INT NOT NULL,
    credits INT NOT NULL,
    hours_per_week INT NOT NULL,
    subject_type ENUM('Theory', 'Lab', 'Tutorial') NOT NULL,
    is_elective BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE RESTRICT
);

CREATE TABLE room (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    building VARCHAR(50),
    floor INT,
    capacity INT NOT NULL,
    room_type ENUM('Classroom', 'Lab', 'Seminar_Hall', 'Auditorium') NOT NULL,
    has_projector BOOLEAN DEFAULT FALSE,
    has_AC BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE time_slot (
    slot_id INT AUTO_INCREMENT PRIMARY KEY,
    slot_name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    is_break BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE section (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    section_name VARCHAR(20) NOT NULL,
    course_id INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    max_students INT NOT NULL,
    class_teacher_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE RESTRICT,
    FOREIGN KEY (class_teacher_id) REFERENCES faculty(faculty_id) ON DELETE SET NULL,
    UNIQUE(course_id, section_name, academic_year, semester)
);

CREATE TABLE student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    student_name VARCHAR(100) NOT NULL,
    section_id INT NOT NULL,
    date_of_birth DATE,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES section(section_id) ON DELETE RESTRICT
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'faculty', 'student') NOT NULL,
    reference_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    subject_id INT NOT NULL,
    faculty_id INT NOT NULL,
    room_id INT NOT NULL,
    slot_id INT NOT NULL,
    day_of_week ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT') NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES section(section_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE RESTRICT,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE RESTRICT,
    FOREIGN KEY (slot_id) REFERENCES time_slot(slot_id) ON DELETE RESTRICT,
    
    -- CRITICAL UNIQUE CONSTRAINTS (Conflict Prevention)
    CONSTRAINT uq_faculty_slot UNIQUE (faculty_id, slot_id, day_of_week, academic_year, semester),
    CONSTRAINT uq_room_slot UNIQUE (room_id, slot_id, day_of_week, academic_year, semester),
    CONSTRAINT uq_section_slot UNIQUE (section_id, slot_id, day_of_week, academic_year, semester)
);

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 2. TRIGGERS
-- ==========================================

DELIMITER //

-- Check faculty weekly hours do not exceed max_hours_per_week
DROP TRIGGER IF EXISTS trg_check_faculty_hours //
CREATE TRIGGER trg_check_faculty_hours
BEFORE INSERT ON schedule
FOR EACH ROW
BEGIN
    DECLARE current_hours INT;
    DECLARE max_allowed_hours INT;
    DECLARE slot_duration INT;

    -- Get max allowed hours
    SELECT max_hours_per_week INTO max_allowed_hours FROM faculty WHERE faculty_id = NEW.faculty_id;
    
    -- Get duration of the new slot in hours
    SELECT (duration_minutes / 60) INTO slot_duration FROM time_slot WHERE slot_id = NEW.slot_id;

    -- Calculate currently scheduled hours for this faculty in this academic year and semester
    SELECT COALESCE(SUM(t.duration_minutes / 60), 0) INTO current_hours
    FROM schedule s
    JOIN time_slot t ON s.slot_id = t.slot_id
    WHERE s.faculty_id = NEW.faculty_id 
      AND s.academic_year = NEW.academic_year 
      AND s.semester = NEW.semester;

    IF (current_hours + slot_duration) > max_allowed_hours THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Faculty weekly hours will exceed the maximum allowed limit.';
    END IF;
END //

-- Check room capacity >= section max_students
DROP TRIGGER IF EXISTS trg_check_room_capacity //
CREATE TRIGGER trg_check_room_capacity
BEFORE INSERT ON schedule
FOR EACH ROW
BEGIN
    DECLARE room_cap INT;
    DECLARE sec_max_students INT;

    SELECT capacity INTO room_cap FROM room WHERE room_id = NEW.room_id;
    SELECT max_students INTO sec_max_students FROM section WHERE section_id = NEW.section_id;

    IF room_cap < sec_max_students THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Room capacity is less than the section maximum students.';
    END IF;
END //

-- Validate subject belongs to the section's course and semester
DROP TRIGGER IF EXISTS trg_validate_subject_course //
CREATE TRIGGER trg_validate_subject_course
BEFORE INSERT ON schedule
FOR EACH ROW
BEGIN
    DECLARE sub_course_id INT;
    DECLARE sub_semester INT;
    DECLARE sec_course_id INT;
    DECLARE sec_semester INT;

    SELECT course_id, semester INTO sub_course_id, sub_semester FROM subject WHERE subject_id = NEW.subject_id;
    SELECT course_id, semester INTO sec_course_id, sec_semester FROM section WHERE section_id = NEW.section_id;

    IF sub_course_id != sec_course_id OR sub_semester != sec_semester THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Subject does not match the section course or semester.';
    END IF;
END //

DELIMITER ;


-- ==========================================
-- 3. VIEWS
-- ==========================================

-- Faculty Timetable View
CREATE OR REPLACE VIEW faculty_timetable AS
SELECT 
    s.schedule_id, s.faculty_id, f.faculty_name, f.employee_code,
    s.day_of_week, s.academic_year, s.semester,
    ts.start_time, ts.end_time, ts.slot_name,
    sub.subject_code, sub.subject_name,
    r.room_number, r.room_type,
    sec.section_name, c.course_code
FROM schedule s
JOIN faculty f ON s.faculty_id = f.faculty_id
JOIN time_slot ts ON s.slot_id = ts.slot_id
JOIN subject sub ON s.subject_id = sub.subject_id
JOIN room r ON s.room_id = r.room_id
JOIN section sec ON s.section_id = sec.section_id
JOIN course c ON sec.course_id = c.course_id;

-- Section Timetable View
CREATE OR REPLACE VIEW section_timetable AS
SELECT 
    s.schedule_id, s.section_id, sec.section_name, c.course_code,
    s.day_of_week, s.academic_year, s.semester,
    ts.start_time, ts.end_time, ts.slot_name,
    sub.subject_code, sub.subject_name, sub.subject_type,
    r.room_number,
    f.faculty_name
FROM schedule s
JOIN section sec ON s.section_id = sec.section_id
JOIN course c ON sec.course_id = c.course_id
JOIN time_slot ts ON s.slot_id = ts.slot_id
JOIN subject sub ON s.subject_id = sub.subject_id
JOIN room r ON s.room_id = r.room_id
JOIN faculty f ON s.faculty_id = f.faculty_id;

-- Room Utilization View
CREATE OR REPLACE VIEW room_utilization AS
SELECT 
    r.room_id, r.room_number, r.capacity, r.room_type,
    s.academic_year, s.semester,
    COUNT(s.schedule_id) AS booked_slots,
    (SELECT COUNT(*) FROM time_slot WHERE is_break = FALSE) * 6 AS total_slots_per_week, -- Assuming 6 days week
    (COUNT(s.schedule_id) / ((SELECT COUNT(*) FROM time_slot WHERE is_break = FALSE) * 6)) * 100 AS utilization_percentage
FROM room r
LEFT JOIN schedule s ON r.room_id = s.room_id
GROUP BY r.room_id, s.academic_year, s.semester;

-- Faculty Workload View
CREATE OR REPLACE VIEW faculty_workload AS
SELECT 
    f.faculty_id, f.faculty_name, f.max_hours_per_week,
    s.academic_year, s.semester,
    COALESCE(SUM(ts.duration_minutes / 60), 0) AS scheduled_hours,
    f.max_hours_per_week - COALESCE(SUM(ts.duration_minutes / 60), 0) AS remaining_hours
FROM faculty f
LEFT JOIN schedule s ON f.faculty_id = s.faculty_id
LEFT JOIN time_slot ts ON s.slot_id = ts.slot_id
GROUP BY f.faculty_id, s.academic_year, s.semester;

-- Department Schedule View
CREATE OR REPLACE VIEW department_schedule AS
SELECT 
    d.dept_id, d.dept_name,
    c.course_id, c.course_name,
    sec.section_id, sec.section_name,
    s.schedule_id, s.day_of_week,
    ts.slot_name, ts.start_time, ts.end_time,
    sub.subject_name,
    f.faculty_name,
    r.room_number
FROM schedule s
JOIN section sec ON s.section_id = sec.section_id
JOIN course c ON sec.course_id = c.course_id
JOIN department d ON c.dept_id = d.dept_id
JOIN time_slot ts ON s.slot_id = ts.slot_id
JOIN subject sub ON s.subject_id = sub.subject_id
JOIN faculty f ON s.faculty_id = f.faculty_id
JOIN room r ON s.room_id = r.room_id;

-- ==========================================
-- 4. STORED PROCEDURES
-- ==========================================

DELIMITER //

-- Procedure to Insert Schedule safely
DROP PROCEDURE IF EXISTS insert_schedule //
CREATE PROCEDURE insert_schedule(
    IN p_section_id INT,
    IN p_subject_id INT,
    IN p_faculty_id INT,
    IN p_room_id INT,
    IN p_slot_id INT,
    IN p_day_of_week ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'),
    IN p_academic_year VARCHAR(20),
    IN p_semester INT,
    IN p_created_by INT
)
BEGIN
    INSERT INTO schedule (
        section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, academic_year, semester, created_by
    ) VALUES (
        p_section_id, p_subject_id, p_faculty_id, p_room_id, p_slot_id, p_day_of_week, p_academic_year, p_semester, p_created_by
    );
END //

-- Procedure to get free slots for a faculty on a given day
DROP PROCEDURE IF EXISTS get_faculty_free_slots //
CREATE PROCEDURE get_faculty_free_slots(
    IN p_faculty_id INT,
    IN p_day_of_week VARCHAR(3),
    IN p_academic_year VARCHAR(20),
    IN p_semester INT
)
BEGIN
    SELECT ts.slot_id, ts.slot_name, ts.start_time, ts.end_time
    FROM time_slot ts
    WHERE ts.is_break = FALSE
      AND ts.slot_id NOT IN (
          SELECT slot_id 
          FROM schedule 
          WHERE faculty_id = p_faculty_id 
            AND day_of_week = p_day_of_week 
            AND academic_year = p_academic_year 
            AND semester = p_semester
      );
END //

-- Procedure to get free slots for a room on a given day
DROP PROCEDURE IF EXISTS get_room_free_slots //
CREATE PROCEDURE get_room_free_slots(
    IN p_room_id INT,
    IN p_day_of_week VARCHAR(3),
    IN p_academic_year VARCHAR(20),
    IN p_semester INT
)
BEGIN
    SELECT ts.slot_id, ts.slot_name, ts.start_time, ts.end_time
    FROM time_slot ts
    WHERE ts.is_break = FALSE
      AND ts.slot_id NOT IN (
          SELECT slot_id 
          FROM schedule 
          WHERE room_id = p_room_id 
            AND day_of_week = p_day_of_week 
            AND academic_year = p_academic_year 
            AND semester = p_semester
      );
END //

-- Procedure to copy timetable from one semester to another
DROP PROCEDURE IF EXISTS copy_timetable //
CREATE PROCEDURE copy_timetable(
    IN p_source_year VARCHAR(20),
    IN p_source_sem INT,
    IN p_target_year VARCHAR(20),
    IN p_target_sem INT
)
BEGIN
    INSERT INTO schedule (
        section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, academic_year, semester, created_by
    )
    SELECT 
        section_id, subject_id, faculty_id, room_id, slot_id, day_of_week, p_target_year, p_target_sem, created_by
    FROM schedule
    WHERE academic_year = p_source_year AND semester = p_source_sem;
END //

-- Procedure to generate conflict report (though constraints prevent them, this checks for potential issues if constraints were disabled)
DROP PROCEDURE IF EXISTS generate_conflict_report //
CREATE PROCEDURE generate_conflict_report(
    IN p_academic_year VARCHAR(20),
    IN p_semester INT
)
BEGIN
    SELECT 'Faculty Conflict' AS conflict_type, faculty_id AS id, slot_id, day_of_week, COUNT(*) AS occurrences
    FROM schedule
    WHERE academic_year = p_academic_year AND semester = p_semester
    GROUP BY faculty_id, slot_id, day_of_week
    HAVING COUNT(*) > 1
    
    UNION ALL
    
    SELECT 'Room Conflict', room_id, slot_id, day_of_week, COUNT(*)
    FROM schedule
    WHERE academic_year = p_academic_year AND semester = p_semester
    GROUP BY room_id, slot_id, day_of_week
    HAVING COUNT(*) > 1
    
    UNION ALL
    
    SELECT 'Section Conflict', section_id, slot_id, day_of_week, COUNT(*)
    FROM schedule
    WHERE academic_year = p_academic_year AND semester = p_semester
    GROUP BY section_id, slot_id, day_of_week
    HAVING COUNT(*) > 1;
END //

DELIMITER ;
