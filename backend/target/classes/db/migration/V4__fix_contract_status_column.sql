-- Fix contract status column length to accommodate all enum values
ALTER TABLE contracts MODIFY COLUMN status VARCHAR(20) DEFAULT 'DRAFT';