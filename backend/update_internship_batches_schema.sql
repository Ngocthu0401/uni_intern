-- Script để cập nhật schema của bảng internship_batches
-- Thêm trường company_id và foreign key constraint

-- 1. Thêm cột company_id vào bảng internship_batches
ALTER TABLE internship_batches 
ADD COLUMN company_id BIGINT;

-- 2. Thêm foreign key constraint
ALTER TABLE internship_batches 
ADD CONSTRAINT FK_internship_batches_company 
FOREIGN KEY (company_id) REFERENCES companies(id);

-- 3. Cập nhật dữ liệu hiện tại (gán company cho các batch hiện có)
-- Batch 1: FPT Software
UPDATE internship_batches 
SET company_id = 1 
WHERE id = 1;

-- Batch 2: VNG Corp  
UPDATE internship_batches 
SET company_id = 2 
WHERE id = 2;

-- Batch 3: TMA Solutions
UPDATE internship_batches 
SET company_id = 3 
WHERE id = 3;

-- 4. Đặt company_id là NOT NULL sau khi đã cập nhật dữ liệu
ALTER TABLE internship_batches 
MODIFY COLUMN company_id BIGINT NOT NULL;

-- 5. Thêm index cho company_id để tối ưu performance
CREATE INDEX idx_internship_batches_company_id ON internship_batches(company_id);

-- 6. Kiểm tra kết quả
SELECT 
    ib.id,
    ib.batch_name,
    ib.batch_code,
    ib.company_id,
    c.company_name
FROM internship_batches ib
LEFT JOIN companies c ON ib.company_id = c.id
ORDER BY ib.id;

