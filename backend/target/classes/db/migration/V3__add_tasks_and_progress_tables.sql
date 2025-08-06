-- Create Tasks table
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    internship_id BIGINT NOT NULL,
    mentor_id BIGINT,
    student_id BIGINT,
    status VARCHAR(20) DEFAULT 'PENDING',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    due_date DATE,
    estimated_hours INT,
    actual_hours INT,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- Create Internship Progress table
CREATE TABLE internship_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    internship_id BIGINT NOT NULL,
    current_week INT NOT NULL DEFAULT 1,
    total_weeks INT NOT NULL DEFAULT 12,
    completed_tasks INT DEFAULT 0,
    total_tasks INT DEFAULT 0,
    overall_progress DOUBLE DEFAULT 0.0,
    weekly_goals TEXT,
    achievements TEXT,
    challenges TEXT,
    mentor_feedback TEXT,
    student_reflection TEXT,
    week_start_date DATE,
    week_end_date DATE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    UNIQUE KEY unique_internship_week (internship_id, current_week)
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_internship_id ON tasks(internship_id);
CREATE INDEX idx_tasks_mentor_id ON tasks(mentor_id);
CREATE INDEX idx_tasks_student_id ON tasks(student_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

CREATE INDEX idx_progress_internship_id ON internship_progress(internship_id);
CREATE INDEX idx_progress_current_week ON internship_progress(current_week);
CREATE INDEX idx_progress_week_dates ON internship_progress(week_start_date, week_end_date);