// Company Models

export const CompanyStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
  VERIFIED: 'VERIFIED'
};

export const CompanySize = {
  STARTUP: 'STARTUP',         // 1-10 employees
  SMALL: 'SMALL',             // 11-50 employees
  MEDIUM: 'MEDIUM',           // 51-200 employees
  LARGE: 'LARGE',             // 201-1000 employees
  ENTERPRISE: 'ENTERPRISE'    // 1000+ employees
};

export const CompanyType = {
  PRIVATE_LIMITED: 'PRIVATE_LIMITED',
  PUBLIC_LIMITED: 'PUBLIC_LIMITED',
  PARTNERSHIP: 'PARTNERSHIP',
  SOLE_PROPRIETORSHIP: 'SOLE_PROPRIETORSHIP',
  STATE_OWNED: 'STATE_OWNED',
  FOREIGN_INVESTED: 'FOREIGN_INVESTED',
  JOINT_VENTURE: 'JOINT_VENTURE',
  COOPERATIVE: 'COOPERATIVE',
  NON_PROFIT: 'NON_PROFIT',
  OTHER: 'OTHER'
};

export const IndustryType = {
  TECHNOLOGY: 'TECHNOLOGY',
  FINANCE: 'FINANCE',
  HEALTHCARE: 'HEALTHCARE',
  EDUCATION: 'EDUCATION',
  MANUFACTURING: 'MANUFACTURING',
  RETAIL: 'RETAIL',
  CONSULTING: 'CONSULTING',
  MEDIA: 'MEDIA',
  TELECOMMUNICATIONS: 'TELECOMMUNICATIONS',
  AUTOMOTIVE: 'AUTOMOTIVE',
  REAL_ESTATE: 'REAL_ESTATE',
  HOSPITALITY: 'HOSPITALITY',
  TRANSPORTATION: 'TRANSPORTATION',
  AGRICULTURE: 'AGRICULTURE',
  ENERGY: 'ENERGY',
  OTHER: 'OTHER'
};

export class Company {
  constructor({
    id = null,
    companyName = '',
    abbreviatedName = '',
    companyCode = '',
    companyType = CompanyType.PRIVATE_LIMITED,
    description = '',
    website = '',
    email = '',
    phoneNumber = '',
    
    // Business Information
    industry = IndustryType.TECHNOLOGY,
    companySize = CompanySize.MEDIUM,
    foundedYear = null,
    taxId = '',
    businessLicense = '',
    
    // Address Information
    address = '',
    city = '',
    state = '',
    country = 'Vietnam',
    postalCode = '',
    
    // Contact Information
    contactPerson = '',
    contactPosition = '',
    contactPhone = '',
    contactEmail = '',
    
    // Partnership Information
    isPartner = false,
    partnershipStartDate = null,
    partnershipLevel = '',
    
    // Internship Information
    maxInterns = 0,
    currentInternsCount = 0,
    preferredSkills = [],
    internshipDepartments = [],
    
    // Social & Media
    logo = null,
    socialMediaLinks = {},
    
    // Requirements & Benefits
    requirements = '',
    benefits = '',
    workingHours = '',
    dresscode = '',
    
    // Status & Verification
    isActive = true,
    status = CompanyStatus.PENDING,
    verified = false,
    verifiedAt = null,
    verifiedBy = null,
    
    // Relations
    mentors = [],
    internships = [],
    contracts = [],
    
    // Timestamps
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.companyName = companyName;
    this.abbreviatedName = abbreviatedName;
    this.companyCode = companyCode;
    this.companyType = companyType;
    this.description = description;
    this.website = website;
    this.email = email;
    this.phoneNumber = phoneNumber;
    
    this.industry = industry;
    this.companySize = companySize;
    this.foundedYear = foundedYear;
    this.taxId = taxId;
    this.businessLicense = businessLicense;
    
    this.address = address;
    this.city = city;
    this.state = state;
    this.country = country;
    this.postalCode = postalCode;
    
    this.contactPerson = contactPerson;
    this.contactPosition = contactPosition;
    this.contactPhone = contactPhone;
    this.contactEmail = contactEmail;
    
    this.isPartner = isPartner;
    this.partnershipStartDate = partnershipStartDate;
    this.partnershipLevel = partnershipLevel;
    
    this.maxInterns = maxInterns;
    this.currentInternsCount = currentInternsCount;
    this.preferredSkills = Array.isArray(preferredSkills) ? preferredSkills : [];
    this.internshipDepartments = Array.isArray(internshipDepartments) ? internshipDepartments : [];
    
    this.logo = logo;
    this.socialMediaLinks = socialMediaLinks || {};
    
    this.requirements = requirements;
    this.benefits = benefits;
    this.workingHours = workingHours;
    this.dresscode = dresscode;
    
    this.isActive = isActive;
    this.status = status;
    this.verified = verified;
    this.verifiedAt = verifiedAt;
    this.verifiedBy = verifiedBy;
    
    this.mentors = Array.isArray(mentors) ? mentors : [];
    this.internships = Array.isArray(internships) ? internships : [];
    this.contracts = Array.isArray(contracts) ? contracts : [];
    
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Helper methods
  isActive() {
    return this.status === CompanyStatus.ACTIVE;
  }

  isVerified() {
    return this.verified;
  }

  isPending() {
    return this.status === CompanyStatus.PENDING;
  }

  isSuspended() {
    return this.status === CompanyStatus.SUSPENDED;
  }

  canAcceptInterns() {
    return this.isActive() && this.currentInternsCount < this.maxInterns;
  }

  getAvailableInternSlots() {
    return Math.max(0, this.maxInterns - this.currentInternsCount);
  }

  getFullAddress() {
    const addressParts = [this.address, this.city, this.state, this.country].filter(Boolean);
    return addressParts.join(', ');
  }

  getDisplayName() {
    return this.companyName;
  }

  getCompanyTypeLabel() {
    const typeLabels = {
      [CompanyType.PRIVATE_LIMITED]: 'Công ty TNHH',
      [CompanyType.PUBLIC_LIMITED]: 'Công ty cổ phần',
      [CompanyType.PARTNERSHIP]: 'Công ty hợp danh',
      [CompanyType.SOLE_PROPRIETORSHIP]: 'Doanh nghiệp tư nhân',
      [CompanyType.STATE_OWNED]: 'Doanh nghiệp nhà nước',
      [CompanyType.FOREIGN_INVESTED]: 'Công ty có vốn đầu tư nước ngoài',
      [CompanyType.JOINT_VENTURE]: 'Liên doanh',
      [CompanyType.COOPERATIVE]: 'Hợp tác xã',
      [CompanyType.NON_PROFIT]: 'Tổ chức phi lợi nhuận',
      [CompanyType.OTHER]: 'Khác'
    };
    return typeLabels[this.companyType] || this.companyType;
  }

  getStatusLabel() {
    const statusLabels = {
      [CompanyStatus.ACTIVE]: 'Hoạt động',
      [CompanyStatus.INACTIVE]: 'Không hoạt động',
      [CompanyStatus.PENDING]: 'Chờ phê duyệt',
      [CompanyStatus.SUSPENDED]: 'Tạm ngưng',
      [CompanyStatus.VERIFIED]: 'Đã xác minh'
    };
    return statusLabels[this.status] || this.status;
  }

  getIndustryLabel() {
    const industryLabels = {
      [IndustryType.TECHNOLOGY]: 'Công nghệ',
      [IndustryType.FINANCE]: 'Tài chính',
      [IndustryType.HEALTHCARE]: 'Y tế',
      [IndustryType.EDUCATION]: 'Giáo dục',
      [IndustryType.MANUFACTURING]: 'Sản xuất',
      [IndustryType.RETAIL]: 'Bán lẻ',
      [IndustryType.CONSULTING]: 'Tư vấn',
      [IndustryType.MEDIA]: 'Truyền thông',
      [IndustryType.TELECOMMUNICATIONS]: 'Viễn thông',
      [IndustryType.AUTOMOTIVE]: 'Ô tô',
      [IndustryType.REAL_ESTATE]: 'Bất động sản',
      [IndustryType.HOSPITALITY]: 'Khách sạn',
      [IndustryType.TRANSPORTATION]: 'Vận tải',
      [IndustryType.AGRICULTURE]: 'Nông nghiệp',
      [IndustryType.ENERGY]: 'Năng lượng',
      [IndustryType.OTHER]: 'Khác'
    };
    return industryLabels[this.industry] || this.industry;
  }

  getCompanySizeLabel() {
    const sizeLabels = {
      [CompanySize.STARTUP]: 'Khởi nghiệp (1-10 người)',
      [CompanySize.SMALL]: 'Nhỏ (11-50 người)',
      [CompanySize.MEDIUM]: 'Trung bình (51-200 người)',
      [CompanySize.LARGE]: 'Lớn (201-1000 người)',
      [CompanySize.ENTERPRISE]: 'Doanh nghiệp (1000+ người)'
    };
    return sizeLabels[this.companySize] || this.companySize;
  }

  getCompanyAge() {
    if (!this.foundedYear) return null;
    return new Date().getFullYear() - this.foundedYear;
  }
}

// Company Request Models
export class CreateCompanyRequest {
  constructor({
    companyName = '',
    abbreviatedName = '',
    companyType = CompanyType.PRIVATE_LIMITED,
    description = '',
    website = '',
    email = '',
    phoneNumber = '',
    industry = IndustryType.TECHNOLOGY,
    companySize = CompanySize.MEDIUM,
    address = '',
    contactPerson = '',
    contactPosition = '',
    contactPhone = '',
    contactEmail = ''
  } = {}) {
    this.companyName = companyName;
    this.abbreviatedName = abbreviatedName;
    this.companyType = companyType;
    this.description = description;
    this.website = website;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.industry = industry;
    this.companySize = companySize;
    this.address = address;
    this.contactPerson = contactPerson;
    this.contactPosition = contactPosition;
    this.contactPhone = contactPhone;
    this.contactEmail = contactEmail;
  }
}

export class UpdateCompanyRequest {
  constructor(companyData = {}) {
    Object.assign(this, companyData);
  }
}

// Company Search Models
export class CompanySearchCriteria {
  constructor({
    keyword = '',
    industry = '',
    companySize = '',
    city = '',
    status = '',
    isPartner = null,
    verified = null
  } = {}) {
    this.keyword = keyword;
    this.industry = industry;
    this.companySize = companySize;
    this.city = city;
    this.status = status;
    this.isPartner = isPartner;
    this.verified = verified;
  }
} 