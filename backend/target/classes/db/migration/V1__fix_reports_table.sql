-- Fix reports table by removing student_id column since we access student through internship relationship
-- This migration handles the case where student_id column exists but is not needed

-- First, update any existing records to remove NOT NULL constraint issues
ALTER TABLE reports MODIFY COLUMN student_id BIGINT NULL;

-- Drop the student_id column since we access student through internship.student relationship
ALTER TABLE reports DROP COLUMN student_id;