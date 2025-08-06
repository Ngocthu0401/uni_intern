// Student Models

export const StudentStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  GRADUATED: 'GRADUATED',
  SUSPENDED: 'SUSPENDED'
};

export const AcademicYear = {
  FIRST: 'FIRST_YEAR',
  SECOND: 'SECOND_YEAR', 
  THIRD: 'THIRD_YEAR',
  FOURTH: 'FOURTH_YEAR',
  FIFTH: 'FIFTH_YEAR'
};

export class Student {
  constructor({
    id = null,
    studentCode = '',
    className = '',
    major = '',
    academicYear = '',
    gpa = 0.0,
    dateOfBirth = null,
    address = '',
    parentName = '',
    parentPhone = '',
    status = StudentStatus.ACTIVE,
    
    // User information from backend
    user = null,
    
    // Legacy fields for backward compatibility
    firstName = '',
    lastName = '',
    fullName = '',
    email = '',
    phone = '',
    gender = '',
    
    // Additional Info
    skills = [],
    interests = [],
    cv = null,
    portfolio = null,
    emergencyContact = null,
    
    // Relations
    userId = null,
    currentBatchId = null,
    currentInternshipId = null,
    advisorId = null,
    internships = [],
    
    // Timestamps
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.studentCode = studentCode;
    this.className = className;
    this.major = major;
    this.academicYear = academicYear;
    this.gpa = parseFloat(gpa) || 0.0;
    this.dateOfBirth = dateOfBirth;
    this.address = address;
    this.parentName = parentName;
    this.parentPhone = parentPhone;
    this.status = status;
    
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
    
    // Additional fields
    this.skills = Array.isArray(skills) ? skills : [];
    this.interests = Array.isArray(interests) ? interests : [];
    this.cv = cv;
    this.portfolio = portfolio;
    this.emergencyContact = emergencyContact;
    
    // Relations
    this.userId = userId;
    this.currentBatchId = currentBatchId;
    this.currentInternshipId = currentInternshipId;
    this.advisorId = advisorId;
    this.internships = Array.isArray(internships) ? internships : [];
    
    // Timestamps
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Helper methods
  isActive() {
    return this.status === StudentStatus.ACTIVE;
  }

  isGraduated() {
    return this.status === StudentStatus.GRADUATED;
  }

  isSuspended() {
    return this.status === StudentStatus.SUSPENDED;
  }

  canApplyForInternship() {
    return this.isActive() && this.isEligibleForInternship;
  }

  hasCurrentInternship() {
    return this.currentInternshipId !== null;
  }

  getAge() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getDisplayName() {
    return this.user?.fullName || this.fullName || `${this.firstName} ${this.lastName}`.trim();
  }

  getStatusLabel() {
    const statusLabels = {
      [StudentStatus.ACTIVE]: 'Đang học',
      [StudentStatus.INACTIVE]: 'Tạm ngưng',
      [StudentStatus.GRADUATED]: 'Đã tốt nghiệp',
      [StudentStatus.SUSPENDED]: 'Đình chỉ'
    };
    return statusLabels[this.status] || this.status;
  }

  getAcademicYearLabel() {
    const yearLabels = {
      [AcademicYear.FIRST]: 'Năm 1',
      [AcademicYear.SECOND]: 'Năm 2',
      [AcademicYear.THIRD]: 'Năm 3',
      [AcademicYear.FOURTH]: 'Năm 4',
      [AcademicYear.FIFTH]: 'Năm 5'
    };
    return yearLabels[this.academicYear] || this.academicYear;
  }
}

// Student Request Models
export class CreateStudentRequest {
  constructor({
    studentCode = '',
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    major = '',
    className = '',
    academicYear = AcademicYear.FIRST
  } = {}) {
    this.studentCode = studentCode;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.major = major;
    this.className = className;
    this.academicYear = academicYear;
  }
}

export class UpdateStudentRequest {
  constructor(studentData = {}) {
    Object.assign(this, studentData);
  }
}

// Student Search Models
export class StudentSearchCriteria {
  constructor({
    keyword = '',
    major = '',
    className = '',
    academicYear = '',
    status = '',
    batchId = null,
    isEligibleForInternship = null
  } = {}) {
    this.keyword = keyword;
    this.major = major;
    this.className = className;
    this.academicYear = academicYear;
    this.status = status;
    this.batchId = batchId;
    this.isEligibleForInternship = isEligibleForInternship;
  }
} 