// Teacher Models

export const TeacherStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  RETIRED: 'RETIRED',
  ON_LEAVE: 'ON_LEAVE'
};

export const AcademicTitle = {
  INSTRUCTOR: 'INSTRUCTOR',
  LECTURER: 'LECTURER',
  ASSISTANT_PROFESSOR: 'ASSISTANT_PROFESSOR',
  ASSOCIATE_PROFESSOR: 'ASSOCIATE_PROFESSOR',
  PROFESSOR: 'PROFESSOR'
};

export const TeacherDegree = {
  BACHELOR: 'BACHELOR',
  MASTER: 'MASTER',
  PHD: 'PHD',
  POSTDOC: 'POSTDOC'
};

export class Teacher {
  constructor({
    id = null,
    teacherCode = '',
    department = '',
    position = '',
    degree = TeacherDegree.MASTER,
    specialization = '',
    officeLocation = '',
    
    // User information from backend
    user = null,
    
    // Legacy fields for backward compatibility
    firstName = '',
    lastName = '',
    fullName = '',
    email = '',
    phone = '',
    address = '',
    dateOfBirth = null,
    gender = '',
    
    // Academic Information
    faculty = '',
    academicTitle = AcademicTitle.LECTURER,
    subjects = [],
    
    // Professional Information
    yearsOfExperience = 0,
    hireDate = null,
    office = '',
    officeHours = '',
    
    // Research & Publications
    researchAreas = [],
    publications = [],
    awards = [],
    
    // Status
    status = TeacherStatus.ACTIVE,
    
    // Relations
    userId = null,
    headOfDepartment = false,
    supervisedStudents = [],
    internships = [],
    
    // Contact & Social
    personalEmail = '',
    website = '',
    socialProfiles = {},
    
    // Timestamps
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.teacherCode = teacherCode;
    this.department = department;
    this.position = position; // This maps to backend's position field
    this.degree = degree;
    this.specialization = specialization;
    this.officeLocation = officeLocation;
    
    // Handle user information from backend response
    this.user = user;
    
    // Legacy support - if no user object, use direct fields
    if (!this.user && (fullName || email || phone)) {
      this.user = {
        fullName: fullName,
        email: email,
        phoneNumber: phone,
        username: '',
        isActive: true
      };
    }
    
    // Academic Information
    this.faculty = faculty;
    this.academicTitle = academicTitle;
    this.subjects = Array.isArray(subjects) ? subjects : [];
    
    // Professional Information
    this.yearsOfExperience = yearsOfExperience;
    this.hireDate = hireDate;
    this.office = office;
    this.officeHours = officeHours;
    
    // Research & Publications
    this.researchAreas = Array.isArray(researchAreas) ? researchAreas : [];
    this.publications = Array.isArray(publications) ? publications : [];
    this.awards = Array.isArray(awards) ? awards : [];
    
    // Status
    this.status = status;
    
    // Relations
    this.userId = userId;
    this.headOfDepartment = headOfDepartment;
    this.supervisedStudents = Array.isArray(supervisedStudents) ? supervisedStudents : [];
    this.internships = Array.isArray(internships) ? internships : [];
    
    // Contact & Social
    this.personalEmail = personalEmail;
    this.website = website;
    this.socialProfiles = socialProfiles || {};
    
    // Timestamps
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Helper methods
  isActive() {
    return this.status === TeacherStatus.ACTIVE;
  }

  isRetired() {
    return this.status === TeacherStatus.RETIRED;
  }

  isOnLeave() {
    return this.status === TeacherStatus.ON_LEAVE;
  }

  isHeadOfDepartment() {
    return this.headOfDepartment;
  }

  canSuperviseInternships() {
    return this.isActive() && this.subjects.length > 0;
  }

  getDisplayName() {
    return this.user?.fullName || this.fullName || `${this.firstName} ${this.lastName}`.trim();
  }

  getFullTitle() {
    const titleLabels = {
      [AcademicTitle.INSTRUCTOR]: 'Giảng viên',
      [AcademicTitle.LECTURER]: 'Thầy/Cô giáo',
      [AcademicTitle.ASSISTANT_PROFESSOR]: 'Trợ lý Giáo sư',
      [AcademicTitle.ASSOCIATE_PROFESSOR]: 'Phó Giáo sư',
      [AcademicTitle.PROFESSOR]: 'Giáo sư'
    };
    const title = titleLabels[this.academicTitle] || this.academicTitle;
    return `${title} ${this.getDisplayName()}`;
  }

  getStatusLabel() {
    const statusLabels = {
      [TeacherStatus.ACTIVE]: 'Đang công tác',
      [TeacherStatus.INACTIVE]: 'Tạm ngưng',
      [TeacherStatus.RETIRED]: 'Đã nghỉ hưu',
      [TeacherStatus.ON_LEAVE]: 'Đang nghỉ phép'
    };
    return statusLabels[this.status] || this.status;
  }

  getDegreeLabel() {
    const degreeLabels = {
      [TeacherDegree.BACHELOR]: 'Cử nhân',
      [TeacherDegree.MASTER]: 'Thạc sĩ',
      [TeacherDegree.PHD]: 'Tiến sĩ',
      [TeacherDegree.POSTDOC]: 'Tiến sĩ khoa học'
    };
    return degreeLabels[this.degree] || this.degree;
  }

  getTitleLabel() {
    const titleLabels = {
      [AcademicTitle.INSTRUCTOR]: 'Giảng viên',
      [AcademicTitle.LECTURER]: 'Thầy/Cô giáo',
      [AcademicTitle.ASSISTANT_PROFESSOR]: 'Trợ lý Giáo sư',
      [AcademicTitle.ASSOCIATE_PROFESSOR]: 'Phó Giáo sư',
      [AcademicTitle.PROFESSOR]: 'Giáo sư'
    };
    return titleLabels[this.academicTitle] || this.academicTitle;
  }

  getYearsOfService() {
    if (!this.hireDate) return 0;
    const today = new Date();
    const hire = new Date(this.hireDate);
    return Math.floor((today - hire) / (365.25 * 24 * 60 * 60 * 1000));
  }
}

// Teacher Request Models
export class CreateTeacherRequest {
  constructor({
    username = '',
    teacherCode = '',
    fullName = '',
    email = '',
    phone = '',
    department = '',
    title = AcademicTitle.LECTURER,
    degree = TeacherDegree.MASTER,
    specialization = ''
  } = {}) {
    this.username = username;
    this.teacherCode = teacherCode;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.department = department;
    this.title = title;
    this.degree = degree;
    this.specialization = specialization;
  }
}

export class UpdateTeacherRequest {
  constructor(teacherData = {}) {
    Object.assign(this, teacherData);
  }
}

// Teacher Search Models
export class TeacherSearchCriteria {
  constructor({
    keyword = '',
    department = '',
    faculty = '',
    academicTitle = '',
    degree = '',
    specialization = '',
    status = ''
  } = {}) {
    this.keyword = keyword;
    this.department = department;
    this.faculty = faculty;
    this.academicTitle = academicTitle;
    this.degree = degree;
    this.specialization = specialization;
    this.status = status;
  }
} 