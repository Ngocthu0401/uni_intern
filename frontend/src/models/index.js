// Export all models and their related constants

// User & Authentication Models
export * from './User';

// Core Entity Models
export * from './Student';
export * from './Teacher';
export * from './Company';
export * from './Mentor';

// Academic & Process Models
export * from './Batch';
export * from './Internship';
export * from './Report';
export * from './Evaluation';
export * from './Contract';

// Common Status Constants
export const CommonStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// All duplicate class declarations removed - classes are now imported from individual files via export * statements above

// Common Response Models
export class ApiResponse {
  constructor({
    success = false,
    message = '',
    data = null,
    errors = [],
    timestamp = null,
    statusCode = 200
  } = {}) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = Array.isArray(errors) ? errors : [];
    this.timestamp = timestamp || new Date().toISOString();
    this.statusCode = statusCode;
  }

  isSuccess() {
    return this.success;
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  getFirstError() {
    return this.errors.length > 0 ? this.errors[0] : null;
  }
}

export class PaginatedResponse {
  constructor({
    content = [],
    totalElements = 0,
    totalPages = 0,
    currentPage = 0,
    size = 10,
    isEmpty = true,
    isFirst = true,
    isLast = true,
    hasNext = false,
    hasPrevious = false
  } = {}) {
    this.content = Array.isArray(content) ? content : [];
    this.totalElements = totalElements;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.size = size;
    this.isEmpty = isEmpty;
    this.isFirst = isFirst;
    this.isLast = isLast;
    this.hasNext = hasNext;
    this.hasPrevious = hasPrevious;
  }

  getItems() {
    return this.content;
  }

  hasContent() {
    return this.content.length > 0;
  }

  getStartIndex() {
    return this.currentPage * this.size + 1;
  }

  getEndIndex() {
    return Math.min(this.getStartIndex() + this.size - 1, this.totalElements);
  }

  getPageInfo() {
    if (this.totalElements === 0) return 'Không có dữ liệu';
    return `${this.getStartIndex()}-${this.getEndIndex()} của ${this.totalElements} kết quả`;
  }
}

// Common Search & Filter Models
export class DateRange {
  constructor({
    startDate = null,
    endDate = null
  } = {}) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  isValid() {
    if (!this.startDate || !this.endDate) return false;
    return new Date(this.startDate) <= new Date(this.endDate);
  }

  getDurationInDays() {
    if (!this.isValid()) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  contains(date) {
    if (!this.isValid() || !date) return false;
    const checkDate = new Date(date);
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return checkDate >= start && checkDate <= end;
  }

  toString() {
    if (!this.isValid()) return 'Invalid date range';
    const start = new Date(this.startDate).toLocaleDateString('vi-VN');
    const end = new Date(this.endDate).toLocaleDateString('vi-VN');
    return `${start} - ${end}`;
  }
}

// Common Sort Models
export class SortOption {
  constructor({
    field = 'id',
    direction = 'desc',
    label = ''
  } = {}) {
    this.field = field;
    this.direction = direction;
    this.label = label;
  }

  toString() {
    return `${this.field},${this.direction}`;
  }

  isAscending() {
    return this.direction === 'asc';
  }

  isDescending() {
    return this.direction === 'desc';
  }
}

// Common Pagination Models
export class PaginationOptions {
  constructor({
    page = 0,
    size = 10,
    sort = 'id,desc'
  } = {}) {
    this.page = Math.max(0, page);
    this.size = Math.max(1, Math.min(100, size)); // Limit between 1-100
    this.sort = sort;
  }

  toParams() {
    return {
      page: this.page,
      size: this.size,
      sort: this.sort
    };
  }

  nextPage() {
    return new PaginationOptions({
      page: this.page + 1,
      size: this.size,
      sort: this.sort
    });
  }

  previousPage() {
    return new PaginationOptions({
      page: Math.max(0, this.page - 1),
      size: this.size,
      sort: this.sort
    });
  }

  withSize(newSize) {
    return new PaginationOptions({
      page: 0, // Reset to first page when changing size
      size: newSize,
      sort: this.sort
    });
  }

  withSort(newSort) {
    return new PaginationOptions({
      page: this.page,
      size: this.size,
      sort: newSort
    });
  }
}

// Model Factory Functions
export const ModelFactory = {
  // Create models from API responses
  createUser: (data) => new User(data),
  createStudent: (data) => new Student(data),
  createTeacher: (data) => new Teacher(data),
  createCompany: (data) => new Company(data),
  createMentor: (data) => new Mentor(data),
  createBatch: (data) => new Batch(data),
  createInternship: (data) => new Internship(data),
  createReport: (data) => new Report(data),
  createEvaluation: (data) => new Evaluation(data),
  createContract: (data) => new Contract(data),

  // Create collections from API responses
  createUserList: (dataArray) => dataArray.map(item => new User(item)),
  createStudentList: (dataArray) => dataArray.map(item => new Student(item)),
  createTeacherList: (dataArray) => dataArray.map(item => new Teacher(item)),
  createCompanyList: (dataArray) => dataArray.map(item => new Company(item)),
  createMentorList: (dataArray) => dataArray.map(item => new Mentor(item)),
  createBatchList: (dataArray) => dataArray.map(item => new Batch(item)),
  createInternshipList: (dataArray) => dataArray.map(item => new Internship(item)),
  createReportList: (dataArray) => dataArray.map(item => new Report(item)),
  createEvaluationList: (dataArray) => dataArray.map(item => new Evaluation(item)),
  createContractList: (dataArray) => dataArray.map(item => new Contract(item)),

  // Create paginated responses
  createPaginatedResponse: (apiResponse) => {
    const { content = [], ...pagination } = apiResponse;
    return new PaginatedResponse({
      content,
      ...pagination
    });
  }
};

// Model Validation Utilities
export const ModelValidators = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone: (phone) => {
    const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
    return phoneRegex.test(phone);
  },

  isValidGPA: (gpa) => {
    return gpa >= 0 && gpa <= 4.0;
  },

  isValidScore: (score, maxScore = 10) => {
    return score >= 0 && score <= maxScore;
  },

  isValidDateRange: (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    return new Date(startDate) <= new Date(endDate);
  },

  isValidStudentCode: (code) => {
    // Example: CT123456 (2 letters + 6 digits)
    const codeRegex = /^[A-Z]{2}\d{6}$/;
    return codeRegex.test(code);
  },

  isValidTeacherCode: (code) => {
    // Example: GV123456 (2 letters + 6 digits)
    const codeRegex = /^[A-Z]{2}\d{6}$/;
    return codeRegex.test(code);
  }
};

// Export default object with all utilities
export default {
  ModelFactory,
  ModelValidators,
  CommonStatus,
  ApiResponse,
  PaginatedResponse,
  DateRange,
  SortOption,
  PaginationOptions
};