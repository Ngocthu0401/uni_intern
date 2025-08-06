// Internship Status Constants
export const InternshipStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED'
};

// Internship Type Constants
export const InternshipType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  REMOTE: 'REMOTE',
  ON_SITE: 'ON_SITE',
  HYBRID: 'HYBRID'
};

// Main Internship Model
export class Internship {
  constructor({
    id = null,
    internshipCode = '',
    jobTitle = '',
    jobDescription = '',
    requirements = '',
    startDate = null,
    endDate = null,
    status = InternshipStatus.PENDING,
    workingHoursPerWeek = 40,
    salary = 0,
    benefits = '',
    finalScore = null,
    teacherScore = null,
    mentorScore = null,
    teacherComment = '',
    mentorComment = '',
    notes = '',
    student = null,
    teacher = null,
    mentor = null,
    company = null,
    internshipBatch = null,
    reports = [],
    evaluations = [],
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.internshipCode = internshipCode;
    this.jobTitle = jobTitle;
    this.jobDescription = jobDescription;
    this.requirements = requirements;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.workingHoursPerWeek = workingHoursPerWeek;
    this.salary = salary;
    this.benefits = benefits;
    this.finalScore = finalScore;
    this.teacherScore = teacherScore;
    this.mentorScore = mentorScore;
    this.teacherComment = teacherComment;
    this.mentorComment = mentorComment;
    this.notes = notes;
    this.student = student;
    this.teacher = teacher;
    this.mentor = mentor;
    this.company = company;
    this.internshipBatch = internshipBatch;
    this.reports = Array.isArray(reports) ? reports : [];
    this.evaluations = Array.isArray(evaluations) ? evaluations : [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Utility methods
  isActive() {
    return this.status === InternshipStatus.ACTIVE;
  }

  isCompleted() {
    return this.status === InternshipStatus.COMPLETED;
  }

  isPending() {
    return this.status === InternshipStatus.PENDING;
  }

  isCancelled() {
    return this.status === InternshipStatus.CANCELLED;
  }

  getDurationInDays() {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  getDurationInWeeks() {
    return Math.ceil(this.getDurationInDays() / 7);
  }

  getProgress() {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  }

  hasTeacher() {
    return this.teacher && this.teacher.id;
  }

  hasMentor() {
    return this.mentor && this.mentor.id;
  }

  hasCompany() {
    return this.company && this.company.id;
  }

  getAverageScore() {
    const scores = [this.teacherScore, this.mentorScore].filter(score => score !== null && score !== undefined);
    if (scores.length === 0) return null;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  // Status label methods
  getStatusLabel() {
    switch (this.status) {
      case InternshipStatus.PENDING:
        return 'Chờ duyệt';
      case InternshipStatus.APPROVED:
        return 'Đã duyệt';
      case InternshipStatus.ACTIVE:
        return 'Đang thực tập';
      case InternshipStatus.COMPLETED:
        return 'Hoàn thành';
      case InternshipStatus.CANCELLED:
        return 'Đã hủy';
      case InternshipStatus.REJECTED:
        return 'Bị từ chối';
      default:
        return 'Chưa xác định';
    }
  }

  getTypeLabel() {
    switch (this.type) {
      case InternshipType.FULL_TIME:
        return 'Toàn thời gian';
      case InternshipType.PART_TIME:
        return 'Bán thời gian';
      case InternshipType.REMOTE:
        return 'Từ xa';
      case InternshipType.ON_SITE:
        return 'Tại văn phòng';
      case InternshipType.HYBRID:
        return 'Kết hợp';
      default:
        return 'Chưa xác định';
    }
  }

  getStatusColor() {
    switch (this.status) {
      case InternshipStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case InternshipStatus.APPROVED:
        return 'bg-blue-100 text-blue-800';
      case InternshipStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case InternshipStatus.COMPLETED:
        return 'bg-purple-100 text-purple-800';
      case InternshipStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case InternshipStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Date formatting methods
  getFormattedStartDate() {
    if (!this.startDate) return '';
    return new Date(this.startDate).toLocaleDateString('vi-VN');
  }

  getFormattedEndDate() {
    if (!this.endDate) return '';
    return new Date(this.endDate).toLocaleDateString('vi-VN');
  }

  getFormattedCreatedAt() {
    if (!this.createdAt) return '';
    return new Date(this.createdAt).toLocaleDateString('vi-VN');
  }

  // Display methods
  getDisplayTitle() {
    return this.jobTitle || 'Chưa có tiêu đề';
  }

  getStudentName() {
    return this.student?.fullName || 'Chưa phân công';
  }

  getTeacherName() {
    return this.teacher?.fullName || 'Chưa phân công';
  }

  getMentorName() {
    return this.mentor?.fullName || 'Chưa phân công';
  }

  getCompanyName() {
    return this.company?.name || 'Chưa có công ty';
  }

  getBatchName() {
    return this.internshipBatch?.name || 'Chưa có đợt';
  }

  // Salary formatting
  getFormattedSalary() {
    if (!this.salary) return 'Thỏa thuận';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(this.salary);
  }

  // Validation methods
  validate() {
    const errors = [];
    
    if (!this.jobTitle || this.jobTitle.trim() === '') {
      errors.push('Job title is required');
    }
    
    if (!this.jobDescription || this.jobDescription.trim() === '') {
      errors.push('Job description is required');
    }
    
    if (!this.startDate) {
      errors.push('Start date is required');
    }
    
    if (!this.endDate) {
      errors.push('End date is required');
    }
    
    if (this.startDate && this.endDate && new Date(this.startDate) >= new Date(this.endDate)) {
      errors.push('End date must be after start date');
    }
    
    if (this.workingHoursPerWeek && (this.workingHoursPerWeek < 1 || this.workingHoursPerWeek > 60)) {
      errors.push('Working hours per week must be between 1 and 60');
    }
    
    if (this.salary && this.salary < 0) {
      errors.push('Salary cannot be negative');
    }
    
    return errors;
  }

  isValid() {
    return this.validate().length === 0;
  }
}

// Create Internship Request Model
export class CreateInternshipRequest {
  constructor({
    jobTitle = '',
    jobDescription = '',
    requirements = '',
    startDate = null,
    endDate = null,
    workingHoursPerWeek = 40,
    salary = 0,
    benefits = '',
    notes = '',
    studentId = null,
    teacherId = null,
    mentorId = null,
    companyId = null,
    internshipBatchId = null
  } = {}) {
    this.jobTitle = jobTitle;
    this.jobDescription = jobDescription;
    this.requirements = requirements;
    this.startDate = startDate;
    this.endDate = endDate;
    this.workingHoursPerWeek = workingHoursPerWeek;
    this.salary = salary;
    this.benefits = benefits;
    this.notes = notes;
    this.studentId = studentId;
    this.teacherId = teacherId;
    this.mentorId = mentorId;
    this.companyId = companyId;
    this.internshipBatchId = internshipBatchId;
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.jobTitle || this.jobTitle.trim() === '') {
      errors.push('Job title is required');
    }
    
    if (!this.jobDescription || this.jobDescription.trim() === '') {
      errors.push('Job description is required');
    }
    
    if (!this.startDate) {
      errors.push('Start date is required');
    }
    
    if (!this.endDate) {
      errors.push('End date is required');
    }
    
    if (this.startDate && this.endDate && new Date(this.startDate) >= new Date(this.endDate)) {
      errors.push('End date must be after start date');
    }
    
    if (!this.studentId) {
      errors.push('Student is required');
    }
    
    if (!this.companyId) {
      errors.push('Company is required');
    }
    
    return errors;
  }

  isValid() {
    return this.validate().length === 0;
  }
}

// Update Internship Request Model
export class UpdateInternshipRequest {
  constructor(internshipData = {}) {
    Object.assign(this, internshipData);
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (this.jobTitle !== undefined && (!this.jobTitle || this.jobTitle.trim() === '')) {
      errors.push('Job title cannot be empty');
    }
    
    if (this.jobDescription !== undefined && (!this.jobDescription || this.jobDescription.trim() === '')) {
      errors.push('Job description cannot be empty');
    }
    
    if (this.startDate && this.endDate && new Date(this.startDate) >= new Date(this.endDate)) {
      errors.push('End date must be after start date');
    }
    
    if (this.workingHoursPerWeek !== undefined && (this.workingHoursPerWeek < 1 || this.workingHoursPerWeek > 60)) {
      errors.push('Working hours per week must be between 1 and 60');
    }
    
    if (this.salary !== undefined && this.salary < 0) {
      errors.push('Salary cannot be negative');
    }
    
    return errors;
  }

  isValid() {
    return this.validate().length === 0;
  }
}

// Search Criteria Model
export class InternshipSearchCriteria {
  constructor({
    keyword = '',
    status = null,
    studentId = null,
    teacherId = null,
    mentorId = null,
    companyId = null,
    batchId = null,
    startDateFrom = null,
    startDateTo = null,
    endDateFrom = null,
    endDateTo = null
  } = {}) {
    this.keyword = keyword;
    this.status = status;
    this.studentId = studentId;
    this.teacherId = teacherId;
    this.mentorId = mentorId;
    this.companyId = companyId;
    this.batchId = batchId;
    this.startDateFrom = startDateFrom;
    this.startDateTo = startDateTo;
    this.endDateFrom = endDateFrom;
    this.endDateTo = endDateTo;
  }

  hasFilters() {
    return this.keyword || this.status || this.studentId || this.teacherId || 
           this.mentorId || this.companyId || this.batchId || 
           this.startDateFrom || this.startDateTo || this.endDateFrom || this.endDateTo;
  }

  reset() {
    this.keyword = '';
    this.status = null;
    this.studentId = null;
    this.teacherId = null;
    this.mentorId = null;
    this.companyId = null;
    this.batchId = null;
    this.startDateFrom = null;
    this.startDateTo = null;
    this.endDateFrom = null;
    this.endDateTo = null;
  }
}

// Pagination Options Model
export class PaginationOptions {
  constructor({
    page = 0,
    size = 10,
    sortBy = 'id',
    sortDirection = 'desc'
  } = {}) {
    this.page = page;
    this.size = size;
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
  }

  getOffset() {
    return this.page * this.size;
  }

  nextPage() {
    return new PaginationOptions({
      ...this,
      page: this.page + 1
    });
  }

  previousPage() {
    return new PaginationOptions({
      ...this,
      page: Math.max(0, this.page - 1)
    });
  }

  withSize(size) {
    return new PaginationOptions({
      ...this,
      size,
      page: 0 // Reset to first page when changing size
    });
  }

  withSort(sortBy, sortDirection = 'asc') {
    return new PaginationOptions({
      ...this,
      sortBy,
      sortDirection
    });
  }
}

// Factory functions
export const InternshipFactory = {
  // Create a new Internship instance from API response
  fromApiResponse: (data) => new Internship(data),
  
  // Create multiple Internship instances from API response array
  createInternshipList: (dataArray) => dataArray.map(item => new Internship(item)),
  
  // Create a new CreateInternshipRequest
  createRequest: (data = {}) => new CreateInternshipRequest(data),
  
  // Create a new UpdateInternshipRequest
  updateRequest: (data = {}) => new UpdateInternshipRequest(data),
  
  // Create search criteria
  searchCriteria: (data = {}) => new InternshipSearchCriteria(data),
  
  // Create pagination options
  paginationOptions: (data = {}) => new PaginationOptions(data)
};

// Default export
export default Internship;