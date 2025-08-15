-- Xóa cột cũ
ALTER TABLE evaluations
  DROP COLUMN technical_score,
  DROP COLUMN soft_skill_score,
  DROP COLUMN attitude_score,
  DROP COLUMN communication_score;

-- Thêm các cột mới - Phần I
ALTER TABLE evaluations
  ADD COLUMN understanding_organization DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN following_rules DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN work_schedule_compliance DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN communication_attitude DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN property_protection DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN work_enthusiasm DOUBLE PRECISION DEFAULT 0.0;

-- Thêm các cột mới - Phần II
ALTER TABLE evaluations
  ADD COLUMN job_requirements_fulfillment DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN learning_spirit DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN initiative_creativity DOUBLE PRECISION DEFAULT 0.0;

-- Thêm cột tổng kết
ALTER TABLE evaluations
  ADD COLUMN discipline_score DOUBLE PRECISION DEFAULT 0.0,
  ADD COLUMN professional_score DOUBLE PRECISION DEFAULT 0.0;
