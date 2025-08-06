-- Add status column to students table
ALTER TABLE students 
ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL;

-- Update existing records to have ACTIVE status
UPDATE students SET status = 'ACTIVE' WHERE status IS NULL;

-- Add index for better query performance
CREATE INDEX idx_students_status ON students(status);