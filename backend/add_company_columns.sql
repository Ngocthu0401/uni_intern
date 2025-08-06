-- Add missing columns to companies table
ALTER TABLE companies 
ADD COLUMN abbreviated_name VARCHAR(20),
ADD COLUMN company_type VARCHAR(50);

-- Update existing companies with default values if needed
UPDATE companies 
SET abbreviated_name = LEFT(company_name, 3),
    company_type = 'PRIVATE_LIMITED' 
WHERE abbreviated_name IS NULL OR company_type IS NULL;

-- Show updated structure
DESCRIBE companies;