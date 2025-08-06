// Search Criteria Models
export class StudentSearchCriteria {
  constructor({
    keyword = '',
    className = null,
    major = null,
    gpaMin = null,
    gpaMax = null,
    hasInternship = null,
    batchId = null,
    status = null,
    academicYear = null
  } = {}) {
    this.keyword = keyword;
    this.className = className;
    this.major = major;
    this.gpaMin = gpaMin;
    this.gpaMax = gpaMax;
    this.hasInternship = hasInternship;
    this.batchId = batchId;
    this.status = status;
    this.academicYear = academicYear;
  }
}

export class TeacherSearchCriteria {
  constructor({
    keyword = '',
    department = null,
    title = null,
    degree = null,
    status = null
  } = {}) {
    this.keyword = keyword;
    this.department = department;
    this.title = title;
    this.degree = degree;
    this.status = status;
  }
}

export class CompanySearchCriteria {
  constructor({
    keyword = '',
    industry = null,
    type = null,
    location = null,
    status = null,
    hasPositions = null
  } = {}) {
    this.keyword = keyword;
    this.industry = industry;
    this.type = type;
    this.location = location;
    this.status = status;
    this.hasPositions = hasPositions;
  }
}

export class MentorSearchCriteria {
  constructor({
    keyword = '',
    company = null,
    companyId = null,
    expertiseLevel = null,
    minYearsOfExperience = null,
    skills = null,
    status = null
  } = {}) {
    this.keyword = keyword;
    this.company = company;
    this.companyId = companyId;
    this.expertiseLevel = expertiseLevel;
    this.minYearsOfExperience = minYearsOfExperience;
    this.skills = skills;
    this.status = status;
  }
}

export class BatchSearchCriteria {
  constructor({
    keyword = '',
    semester = null,
    academicYear = null,
    status = null,
    registrationOpen = null,
    batchName = null,
    batchCode = null,
    isActive = null
  } = {}) {
    this.keyword = keyword;
    this.semester = semester;
    this.academicYear = academicYear;
    this.status = status;
    this.registrationOpen = registrationOpen;
    this.batchName = batchName;
    this.batchCode = batchCode;
    this.isActive = isActive;
  }

  // Convert to backend API parameters
  toSearchParams() {
    const params = {};
    
    if (this.keyword && this.keyword.trim()) {
      params.keyword = this.keyword.trim();
    }
    
    if (this.semester) {
      params.semester = this.semester;
    }
    
    if (this.academicYear) {
      params.academicYear = this.academicYear;
    }
    
    if (this.status) {
      params.status = this.status;
    }
    
    if (this.batchName) {
      params.batchName = this.batchName;
    }
    
    if (this.batchCode) {
      params.batchCode = this.batchCode;
    }
    
    if (this.isActive !== null) {
      params.isActive = this.isActive;
    }
    
    return params;
  }

  hasFilters() {
    return !!(this.keyword || this.semester || this.academicYear || 
              this.status || this.batchName || this.batchCode || 
              this.isActive !== null);
  }

  reset() {
    this.keyword = '';
    this.semester = null;
    this.academicYear = null;
    this.status = null;
    this.registrationOpen = null;
    this.batchName = null;
    this.batchCode = null;
    this.isActive = null;
  }
}

export class InternshipSearchCriteria {
  constructor({
    keyword = '',
    status = null,
    studentId = null,
    teacherId = null,
    mentorId = null,
    companyId = null,
    batchId = null,
    startDate = null,
    endDate = null,
    internshipCode = null,
    jobTitle = null
  } = {}) {
    this.keyword = keyword;
    this.status = status;
    this.studentId = studentId;
    this.teacherId = teacherId;
    this.mentorId = mentorId;
    this.companyId = companyId;
    this.batchId = batchId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.internshipCode = internshipCode;
    this.jobTitle = jobTitle;
  }

  // Convert to backend API parameters
  toSearchParams() {
    const params = {};
    
    if (this.keyword && this.keyword.trim()) {
      params.keyword = this.keyword.trim();
    }
    
    if (this.status) {
      params.status = this.status;
    }
    
    if (this.studentId) {
      params.studentId = this.studentId;
    }
    
    if (this.teacherId) {
      params.teacherId = this.teacherId;
    }
    
    if (this.mentorId) {
      params.mentorId = this.mentorId;
    }
    
    if (this.companyId) {
      params.companyId = this.companyId;
    }
    
    if (this.batchId) {
      params.batchId = this.batchId;
    }
    
    if (this.startDate) {
      params.startDate = this.startDate;
    }
    
    if (this.endDate) {
      params.endDate = this.endDate;
    }
    
    return params;
  }

  hasFilters() {
    return !!(this.keyword || this.status || this.studentId || 
              this.teacherId || this.mentorId || this.companyId || 
              this.batchId || this.startDate || this.endDate);
  }

  reset() {
    this.keyword = '';
    this.status = null;
    this.studentId = null;
    this.teacherId = null;
    this.mentorId = null;
    this.companyId = null;
    this.batchId = null;
    this.startDate = null;
    this.endDate = null;
    this.internshipCode = null;
    this.jobTitle = null;
  }
}

// Pagination Options
export class PaginationOptions {
  constructor({
    page = 1,
    size = 10,
    sortBy = 'id',
    sortDir = 'desc'
  } = {}) {
    this.page = Math.max(1, page); // Ensure page is always >= 1
    this.size = Math.max(1, size);
    this.sortBy = sortBy;
    this.sortDir = sortDir;
  }

  // Convert to backend API parameters (0-based indexing)
  toApiParams() {
    return {
      page: Math.max(0, this.page - 1), // Convert to 0-based, minimum 0
      size: this.size,
      sortBy: this.sortBy,
      sortDir: this.sortDir
    };
  }

  // Create from backend response (convert back to 1-based)
  static fromApiResponse(response) {
    return new PaginationOptions({
      page: (response.number || 0) + 1,
      size: response.size || 10,
      sortBy: 'id',
      sortDir: 'desc'
    });
  }
}

// Create/Update Request Models
export class CreateStudentRequest {
  constructor({
    username = '',
    email = '',
    fullName = '',
    phone = '',
    studentCode = '',
    className = '',
    major = '',
    academicYear = '',
    gpa = 0.0
  } = {}) {
    this.username = username;
    this.email = email;
    this.fullName = fullName;
    this.phone = phone;
    this.studentCode = studentCode;
    this.className = className;
    this.major = major;
    this.academicYear = academicYear;
    this.gpa = gpa;
  }
}

export class UpdateStudentRequest extends CreateStudentRequest {
  constructor(student = {}) {
    super(student);
  }
}

export class CreateTeacherRequest {
  constructor({
    username = '',
    email = '',
    fullName = '',
    phone = '',
    title = '',
    degree = '',
    department = ''
  } = {}) {
    this.username = username;
    this.email = email;
    this.fullName = fullName;
    this.phone = phone;
    this.title = title;
    this.degree = degree;
    this.department = department;
  }
}

export class UpdateTeacherRequest extends CreateTeacherRequest {
  constructor(teacher = {}) {
    super(teacher);
  }
}

export class CreateCompanyRequest {
  constructor({
    name = '',
    shortName = '',
    type = '',
    industry = '',
    address = '',
    phone = '',
    email = '',
    website = '',
    contactPerson = '',
    contactPhone = '',
    contactEmail = '',
    description = ''
  } = {}) {
    this.name = name;
    this.shortName = shortName;
    this.type = type;
    this.industry = industry;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.website = website;
    this.contactPerson = contactPerson;
    this.contactPhone = contactPhone;
    this.contactEmail = contactEmail;
    this.description = description;
  }
}

export class UpdateCompanyRequest extends CreateCompanyRequest {
  constructor(company = {}) {
    super(company);
  }
}

export class CreateMentorRequest {
  constructor({
    username = '',
    email = '',
    fullName = '',
    phone = '',
    company = '',
    position = '',
    expertiseLevel = '',
    yearsOfExperience = 0,
    skills = [],
    maxInterns = 1
  } = {}) {
    this.username = username;
    this.email = email;
    this.fullName = fullName;
    this.phone = phone;
    this.company = company;
    this.position = position;
    this.expertiseLevel = expertiseLevel;
    this.yearsOfExperience = yearsOfExperience;
    this.skills = Array.isArray(skills) ? skills : [];
    this.maxInterns = maxInterns;
  }
}

export class UpdateMentorRequest extends CreateMentorRequest {
  constructor(mentor = {}) {
    super(mentor);
  }
}

export class CreateBatchRequest {
  constructor({
    name = '',
    batchName = '',
    batchCode = '',
    description = '',
    semester = '',
    academicYear = '',
    registrationStartDate = '',
    registrationEndDate = '',
    internshipStartDate = '',
    internshipEndDate = '',
    startDate = '',
    endDate = '',
    maxStudents = 0,
    isActive = true
  } = {}) {
    // Support both 'name' and 'batchName' for flexibility
    this.name = name || batchName;
    this.batchName = batchName || name;
    this.batchCode = batchCode;
    this.description = description;
    this.semester = semester;
    this.academicYear = academicYear;
    this.registrationStartDate = registrationStartDate;
    this.registrationEndDate = registrationEndDate;
    this.internshipStartDate = internshipStartDate;
    this.internshipEndDate = internshipEndDate;
    // Support both date field naming conventions
    this.startDate = startDate || internshipStartDate;
    this.endDate = endDate || internshipEndDate;
    this.maxStudents = maxStudents;
    this.isActive = isActive;
  }

  // Convert to backend API format
  toApiPayload() {
    return {
      batchName: this.batchName || this.name,
      batchCode: this.batchCode || `BATCH_${Date.now()}`,
      description: this.description || '',
      semester: this.semester,
      academicYear: this.academicYear,
      registrationStartDate: this.registrationStartDate,
      registrationEndDate: this.registrationEndDate,
      startDate: this.startDate || this.internshipStartDate,
      endDate: this.endDate || this.internshipEndDate,
      maxStudents: this.maxStudents || 100,
      isActive: this.isActive !== undefined ? this.isActive : true
    };
  }
}

export class UpdateBatchRequest extends CreateBatchRequest {
  constructor(batch = {}) {
    super(batch);
    this.id = batch.id;
  }

  // Convert to backend API format for updates
  toApiPayload() {
    const payload = super.toApiPayload();
    payload.id = this.id;
    return payload;
  }
}

export class CreateInternshipRequest {
  constructor({
    title = '',
    description = '',
    studentId = null,
    companyId = null,
    batchId = null,
    teacherId = null,
    mentorId = null,
    startDate = '',
    endDate = '',
    requirements = '',
    benefits = '',
    jobTitle = '',
    internshipCode = ''
  } = {}) {
    this.title = title;
    this.description = description;
    this.studentId = studentId;
    this.companyId = companyId;
    this.batchId = batchId;
    this.teacherId = teacherId;
    this.mentorId = mentorId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.requirements = requirements;
    this.benefits = benefits;
    this.jobTitle = jobTitle;
    this.internshipCode = internshipCode;
  }
}

export class UpdateInternshipRequest extends CreateInternshipRequest {
  constructor(internship = {}) {
    super(internship);
    this.id = internship.id;
  }
} 