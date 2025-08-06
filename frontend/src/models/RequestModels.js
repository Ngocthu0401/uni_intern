// Search Criteria Models
export class StudentSearchCriteria {
  constructor({
    keyword = '',
    className = null,
    major = null,
    gpaMin = null,
    gpaMax = null,
    hasInternship = null,
    batchId = null
  } = {}) {
    this.keyword = keyword;
    this.className = className;
    this.major = major;
    this.gpaMin = gpaMin;
    this.gpaMax = gpaMax;
    this.hasInternship = hasInternship;
    this.batchId = batchId;
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
    expertiseLevel = null,
    minYearsOfExperience = null,
    skills = null,
    status = null
  } = {}) {
    this.keyword = keyword;
    this.company = company;
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
    registrationOpen = null
  } = {}) {
    this.keyword = keyword;
    this.semester = semester;
    this.academicYear = academicYear;
    this.status = status;
    this.registrationOpen = registrationOpen;
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
    endDate = null
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
    teacherCode = '',
    title = '',
    degree = '',
    department = '',
    specialization = ''
  } = {}) {
    this.username = username;
    this.email = email;
    this.fullName = fullName;
    this.phone = phone;
    this.teacherCode = teacherCode;
    this.title = title;
    this.degree = degree;
    this.department = department;
    this.specialization = specialization;
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
    description = '',
    semester = '',
    academicYear = '',
    registrationStartDate = '',
    registrationEndDate = '',
    internshipStartDate = '',
    internshipEndDate = '',
    maxStudents = 0
  } = {}) {
    this.name = name;
    this.description = description;
    this.semester = semester;
    this.academicYear = academicYear;
    this.registrationStartDate = registrationStartDate;
    this.registrationEndDate = registrationEndDate;
    this.internshipStartDate = internshipStartDate;
    this.internshipEndDate = internshipEndDate;
    this.maxStudents = maxStudents;
  }
}

export class UpdateBatchRequest extends CreateBatchRequest {
  constructor(batch = {}) {
    super(batch);
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
    benefits = ''
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
  }
}

export class UpdateInternshipRequest extends CreateInternshipRequest {
  constructor(internship = {}) {
    super(internship);
  }
}

// Pagination Options
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