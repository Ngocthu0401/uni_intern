// Mentor Models

export const MentorStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE',
  UNAVAILABLE: 'UNAVAILABLE'
};

export const ExpertiseLevel = {
  JUNIOR: 'JUNIOR',
  INTERMEDIATE: 'INTERMEDIATE',
  SENIOR: 'SENIOR',
  EXPERT: 'EXPERT',
  LEAD: 'LEAD'
};

export class Mentor {
  constructor({
    id = null,
    user = null,
    
    // Professional Information
    position = '',
    department = '',
    yearsOfExperience = 0,
    specialization = '',
    officeLocation = '',
    
    // Company Relationship
    company = null,
    
    // Expertise & Skills
    expertiseAreas = [],
    skills = [],
    certifications = [],
    expertiseLevel = ExpertiseLevel.INTERMEDIATE,
    
    // Mentoring Information
    maxMentees = 5,
    currentMenteesCount = 0,
    mentoringSince = null,
    preferredMentoringStyle = '',
    availableHours = '',
    
    // Contact & Availability
    preferredCommunication = [],
    timeZone = 'Asia/Ho_Chi_Minh',
    workingHours = '',
    
    // Biography & Personal
    bio = '',
    education = '',
    achievements = [],
    languages = [],
    
    // Social & Professional Links
    linkedIn = '',
    personalWebsite = '',
    avatar = null,
    
    // Status
    status = MentorStatus.ACTIVE,
    verified = false,
    
    // Relations
    userId = null,
    internships = [],
    evaluations = [],
    
    // Timestamps
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.user = user;
    
    this.position = position;
    this.department = department;
    this.yearsOfExperience = yearsOfExperience;
    this.specialization = specialization;
    this.officeLocation = officeLocation;
    
    this.company = company;
    
    this.expertiseAreas = Array.isArray(expertiseAreas) ? expertiseAreas : [];
    this.skills = Array.isArray(skills) ? skills : [];
    this.certifications = Array.isArray(certifications) ? certifications : [];
    this.expertiseLevel = expertiseLevel;
    
    this.maxMentees = maxMentees;
    this.currentMenteesCount = currentMenteesCount;
    this.mentoringSince = mentoringSince;
    this.preferredMentoringStyle = preferredMentoringStyle;
    this.availableHours = availableHours;
    
    this.preferredCommunication = Array.isArray(preferredCommunication) ? preferredCommunication : [];
    this.timeZone = timeZone;
    this.workingHours = workingHours;
    
    this.bio = bio;
    this.education = education;
    this.achievements = Array.isArray(achievements) ? achievements : [];
    this.languages = Array.isArray(languages) ? languages : [];
    
    this.linkedIn = linkedIn;
    this.personalWebsite = personalWebsite;
    this.avatar = avatar;
    
    this.status = status;
    this.verified = verified;
    
    this.userId = userId;
    this.internships = Array.isArray(internships) ? internships : [];
    this.evaluations = Array.isArray(evaluations) ? evaluations : [];
    
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Helper methods
  isActive() {
    return this.status === MentorStatus.ACTIVE;
  }

  isAvailable() {
    return this.isActive() && this.currentMenteesCount < this.maxMentees;
  }

  isOnLeave() {
    return this.status === MentorStatus.ON_LEAVE;
  }

  getDisplayName() {
    return this.fullName || `${this.firstName} ${this.lastName}`.trim();
  }

  getAvailableSlots() {
    return Math.max(0, this.maxMentees - this.currentMenteesCount);
  }

  getStatusLabel() {
    const statusLabels = {
      [MentorStatus.ACTIVE]: 'Hoạt động',
      [MentorStatus.INACTIVE]: 'Không hoạt động',
      [MentorStatus.ON_LEAVE]: 'Nghỉ phép',
      [MentorStatus.UNAVAILABLE]: 'Không có sẵn'
    };
    return statusLabels[this.status] || this.status;
  }

  getExpertiseLevelLabel() {
    const levelLabels = {
      [ExpertiseLevel.JUNIOR]: 'Mới bắt đầu',
      [ExpertiseLevel.INTERMEDIATE]: 'Trung cấp',
      [ExpertiseLevel.SENIOR]: 'Cao cấp',
      [ExpertiseLevel.EXPERT]: 'Chuyên gia',
      [ExpertiseLevel.LEAD]: 'Trưởng nhóm'
    };
    return levelLabels[this.expertiseLevel] || this.expertiseLevel;
  }

  getAvailabilityLabel() {
    if (!this.isActive()) {
      return 'Không hoạt động';
    }
    
    if (this.isAvailable()) {
      return `Sẵn sàng (${this.getAvailableSlots()}/${this.maxMentees})`;
    } else {
      return 'Đã đầy';
    }
  }

  getYearsOfMentoring() {
    if (!this.mentoringSince) return 0;
    const today = new Date();
    const start = new Date(this.mentoringSince);
    return Math.floor((today - start) / (365.25 * 24 * 60 * 60 * 1000));
  }

  hasExpertiseIn(area) {
    return this.expertiseAreas.some(exp => 
      exp.toLowerCase().includes(area.toLowerCase())
    );
  }

  hasSkill(skill) {
    return this.skills.some(s => 
      s.toLowerCase().includes(skill.toLowerCase())
    );
  }

  getCompanyName() {
    return this.company?.name || this.company?.displayName || 'N/A';
  }
}

// Mentor Request Models
export class CreateMentorRequest {
  constructor({
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    position = '',
    companyId = null,
    expertiseAreas = [],
    yearsOfExperience = 0
  } = {}) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.position = position;
    this.companyId = companyId;
    this.expertiseAreas = expertiseAreas;
    this.yearsOfExperience = yearsOfExperience;
  }
}

export class UpdateMentorRequest {
  constructor(mentorData = {}) {
    Object.assign(this, mentorData);
  }
}

// Mentor Search Models
export class MentorSearchCriteria {
  constructor({
    keyword = '',
    companyId = null,
    expertiseArea = '',
    skill = '',
    expertiseLevel = '',
    status = '',
    available = null
  } = {}) {
    this.keyword = keyword;
    this.companyId = companyId;
    this.expertiseArea = expertiseArea;
    this.skill = skill;
    this.expertiseLevel = expertiseLevel;
    this.status = status;
    this.available = available;
  }
} 