-- Migration to create contracts table and support contract management features

CREATE TABLE IF NOT EXISTS contracts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Core contract fields
    contract_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    terms_and_conditions TEXT,
    
    -- Relationships
    internship_id BIGINT,
    created_by_teacher_id BIGINT,
    
    -- Dates
    start_date DATE,
    end_date DATE,
    signed_date DATE,
    
    -- Status and workflow
    status ENUM('DRAFT', 'PENDING', 'SENT', 'SIGNED', 'ACTIVE', 'PAID', 'REJECTED', 'EXPIRED', 'TERMINATED') DEFAULT 'DRAFT',
    
    -- File and signatures
    contract_file_url VARCHAR(500),
    student_signature TEXT,
    company_signature TEXT,
    department_signature TEXT,
    
    -- Notes
    notes TEXT,
    
    -- Support contract specific fields
    contract_type VARCHAR(50) DEFAULT 'SUPPORT',
    support_amount DECIMAL(15,2),
    payment_terms TEXT,
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_date DATE,
    
    -- Approval workflow
    approval_status VARCHAR(50) DEFAULT 'PENDING',
    approved_by VARCHAR(255),
    approval_date DATE,
    template_id VARCHAR(50),
    
    -- Foreign key constraints
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    
    -- Indexes for performance
    INDEX idx_contract_code (contract_code),
    INDEX idx_contract_status (status),
    INDEX idx_contract_internship (internship_id),
    INDEX idx_contract_teacher (created_by_teacher_id),
    INDEX idx_contract_type (contract_type),
    INDEX idx_contract_payment_status (payment_status),
    INDEX idx_contract_approval_status (approval_status)
);

-- Insert some sample contract templates for testing
INSERT INTO contracts (contract_code, title, content, contract_type, status, approval_status, support_amount, payment_terms) VALUES 
('TEMPLATE_SUPPORT_001', 'Mẫu hợp đồng hỗ trợ thực tập sinh', 
'Hợp đồng hỗ trợ tài chính cho sinh viên thực tập tại doanh nghiệp.

ĐIỀU 1: ĐỐI TƯỢNG HỖ TRỢ
- Sinh viên đang thực tập tại doanh nghiệp theo chương trình của trường
- Có thái độ học tập tích cực và kết quả tốt

ĐIỀU 2: MỨC HỖ TRỢ
- Mức hỗ trợ: [SUPPORT_AMOUNT] VNĐ/tháng
- Thời gian hỗ trợ: từ [START_DATE] đến [END_DATE]

ĐIỀU 3: ĐIỀU KIỆN HỖ TRỢ
- Tham gia đầy đủ các hoạt động thực tập
- Nộp báo cáo định kỳ theo quy định
- Có đánh giá tích cực từ doanh nghiệp

ĐIỀU 4: THANH TOÁN
- Thanh toán theo tháng vào ngày 15 hàng tháng
- Chuyển khoản vào tài khoản sinh viên đăng ký', 
'SUPPORT', 'DRAFT', 'APPROVED', 2000000.00, 
'Thanh toán hàng tháng vào ngày 15. Chuyển khoản qua tài khoản ngân hàng của sinh viên.'),

('TEMPLATE_INTERNSHIP_001', 'Mẫu hợp đồng thực tập doanh nghiệp', 
'Hợp đồng thực tập giữa trường, doanh nghiệp và sinh viên.

ĐIỀU 1: CÁC BÊN THAM GIA
- Bên A: Trường Đại học
- Bên B: Doanh nghiệp
- Bên C: Sinh viên

ĐIỀU 2: NỘI DUNG THỰC TẬP
- Thời gian thực tập: [START_DATE] đến [END_DATE]
- Địa điểm: Trường/Doanh nghiệp
- Nội dung: Theo chương trình đào tạo

ĐIỀU 3: QUYỀN VÀ NGHĨA VỤ
- Sinh viên: Chấp hành nội quy, hoàn thành nhiệm vụ
- Doanh nghiệp: Hướng dẫn, đánh giá sinh viên
- Trường: Giám sát, hỗ trợ sinh viên', 
'INTERNSHIP', 'DRAFT', 'APPROVED', 0.00, 
'Không có hỗ trợ tài chính.');