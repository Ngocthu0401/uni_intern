// Batch Models

export const BatchStatus = {
  ACTIVE: 'ACTIVE',
  REGISTRATION_ACTIVE: 'REGISTRATION_ACTIVE',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DRAFT: 'DRAFT'
};

export const Semester = {
  SPRING: 'SPRING',
  SUMMER: 'SUMMER',
  FALL: 'FALL',
  WINTER: 'WINTER'
};

export class Batch {
  constructor({
    id = null,
    batchName = '',
    batchCode = '',
    description = '',

    // Academic Information
    academicYear = '',
    semester = Semester.SPRING,

    // Timeline
    registrationStartDate = null,
    registrationEndDate = null,
    startDate = null,
    endDate = null,

    // Capacity & Enrollment
    maxStudents = 100,
    currentStudentsCount = 0,

    // Status - handle both isActive and active from backend
    isActive = true,
    active = null,

    // Relations
    internships = [],

    // Timestamps
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.batchName = batchName;
    this.batchCode = batchCode;
    this.description = description;

    this.academicYear = academicYear;
    this.semester = semester;

    this.registrationStartDate = registrationStartDate;
    this.registrationEndDate = registrationEndDate;
    this.startDate = startDate;
    this.endDate = endDate;

    this.maxStudents = maxStudents;
    this.currentStudentsCount = currentStudentsCount;

    // Handle both isActive and active from backend
    this._isActive = active !== null ? active : isActive;

    this.internships = Array.isArray(internships) ? internships : [];

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Alias properties for compatibility with frontend
  get name() {
    return this.batchName;
  }

  set name(value) {
    this.batchName = value;
  }

  get currentStudents() {
    return this.currentStudentsCount;
  }

  get internshipStartDate() {
    return this.startDate;
  }

  get internshipEndDate() {
    return this.endDate;
  }

  // Status check methods
  isActive() {
    return this._isActive === true;
  }

  isActiveStatus() {
    return this._isActive === true;
  }

  isDraft() {
    return !this._isActive;
  }

  isCompleted() {
    if (!this.endDate) return false;
    return new Date() > new Date(this.endDate);
  }

  // Registration methods
  isRegistrationOpen() {
    if (!this.registrationStartDate || !this.registrationEndDate) return false;
    const now = new Date();
    const regStart = new Date(this.registrationStartDate);
    const regEnd = new Date(this.registrationEndDate);
    return now >= regStart && now <= regEnd;
  }

  canRegister() {
    const hasCapacity = this.currentStudentsCount < this.maxStudents;
    return this.isRegistrationOpen() && hasCapacity && this._isActive;
  }

  // Capacity methods
  getAvailableStudentSlots() {
    return Math.max(0, this.maxStudents - this.currentStudentsCount);
  }

  getEnrollmentPercentage() {
    if (this.maxStudents === 0) return 0;
    return Math.round((this.currentStudentsCount / this.maxStudents) * 100);
  }

  getEnrollmentProgress() {
    return this.getEnrollmentPercentage();
  }

  // Label methods
  getStatusLabel() {
    if (!this._isActive) return 'Không hoạt động';
    if (this.isCompleted()) return 'Đã hoàn thành';
    if (this.isRegistrationOpen()) return 'Đang mở đăng ký';
    return 'Hoạt động';
  }

  getSemesterLabel() {
    const semesterLabels = {
      [Semester.SPRING]: 'Học kỳ Xuân',
      [Semester.SUMMER]: 'Học kỳ Hè',
      [Semester.FALL]: 'Học kỳ Thu',
      [Semester.WINTER]: 'Học kỳ Đông'
    };
    return semesterLabels[this.semester] || this.semester;
  }

  getFullName() {
    return `${this.batchName} - ${this.academicYear} ${this.getSemesterLabel()}`;
  }

  // Date formatting methods
  getFormattedRegistrationStartDate() {
    if (!this.registrationStartDate) return 'Chưa xác định';
    return new Date(this.registrationStartDate).toLocaleDateString('vi-VN');
  }

  getFormattedRegistrationEndDate() {
    if (!this.registrationEndDate) return 'Chưa xác định';
    return new Date(this.registrationEndDate).toLocaleDateString('vi-VN');
  }

  getFormattedInternshipStartDate() {
    if (!this.startDate) return 'Chưa xác định';
    return new Date(this.startDate).toLocaleDateString('vi-VN');
  }

  getFormattedInternshipEndDate() {
    if (!this.endDate) return 'Chưa xác định';
    return new Date(this.endDate).toLocaleDateString('vi-VN');
  }

  // Duration methods
  getDurationInWeeks() {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }

  getRegistrationTimeRemaining() {
    if (!this.registrationEndDate) return null;
    const now = new Date();
    const regEnd = new Date(this.registrationEndDate);
    const diffTime = regEnd - now;

    if (diffTime <= 0) return 'Đã hết hạn';

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} ngày`;
    return `${hours} giờ`;
  }

  // Validation methods
  isValid() {
    return this.batchName && this.academicYear && this.semester;
  }

  hasValidDates() {
    if (!this.registrationStartDate || !this.registrationEndDate ||
      !this.startDate || !this.endDate) return false;

    const regStart = new Date(this.registrationStartDate);
    const regEnd = new Date(this.registrationEndDate);
    const internStart = new Date(this.startDate);
    const internEnd = new Date(this.endDate);

    return regStart < regEnd && regEnd <= internStart && internStart < internEnd;
  }

  // Utility methods
  toJSON() {
    return {
      id: this.id,
      batchName: this.batchName,
      batchCode: this.batchCode,
      description: this.description,
      academicYear: this.academicYear,
      semester: this.semester,
      registrationStartDate: this.registrationStartDate,
      registrationEndDate: this.registrationEndDate,
      startDate: this.startDate,
      endDate: this.endDate,
      maxStudents: this.maxStudents,
      currentStudentsCount: this.currentStudentsCount,
      isActive: this._isActive,
      internships: this.internships,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Batch Request Models
export class CreateBatchRequest {
  constructor({
    name = '',
    description = '',
    academicYear = '',
    semester = Semester.SPRING,
    registrationStartDate = null,
    registrationEndDate = null,
    startDate = null,
    endDate = null,
    companies = []
  } = {}) {
    this.name = name;
    this.description = description;
    this.academicYear = academicYear;
    this.semester = semester;
    this.registrationStartDate = registrationStartDate;
    this.registrationEndDate = registrationEndDate;
    this.startDate = startDate;
    this.endDate = endDate;
    this.companies = companies;
  }

  // Alias for compatibility
  get batchName() {
    return this.name;
  }

  set batchName(value) {
    this.name = value;
  }
}

export class UpdateBatchRequest {
  constructor(batchData = {}) {
    Object.assign(this, batchData);
    // Ensure we use batchName if name is provided
    if (batchData.name && !batchData.batchName) {
      this.batchName = batchData.name;
    }
  }
}

// Batch Search Models
export class BatchSearchCriteria {
  constructor({
    keyword = '',
    academicYear = '',
    semester = '',
    status = '',
    registrationOpen = null
  } = {}) {
    this.keyword = keyword;
    this.academicYear = academicYear;
    this.semester = semester;
    this.status = status;
    this.registrationOpen = registrationOpen;
  }
} 