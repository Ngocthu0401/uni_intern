// Contract Models

export const ContractStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  SIGNED: 'SIGNED',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED',
  CANCELLED: 'CANCELLED'
};

export const ContractType = {
  INTERNSHIP: 'INTERNSHIP',
  EMPLOYMENT: 'EMPLOYMENT',
  PARTNERSHIP: 'PARTNERSHIP',
  NDA: 'NDA',
  SERVICE_AGREEMENT: 'SERVICE_AGREEMENT'
};

export const SignatureStatus = {
  PENDING: 'PENDING',
  SIGNED: 'SIGNED',
  REJECTED: 'REJECTED'
};

export class Contract {
  constructor({
    id = null,
    title = '',
    description = '',
    
    // Contract Information
    contractNumber = '',
    type = ContractType.INTERNSHIP,
    status = ContractStatus.DRAFT,
    version = '1.0',
    
    // Parties Information
    employerName = '',
    employerAddress = '',
    employerRepresentative = '',
    employeeFullName = '',
    employeeAddress = '',
    employeeId = '',
    
    // Timeline
    startDate = null,
    endDate = null,
    signedDate = null,
    effectiveDate = null,
    expirationDate = null,
    
    // Terms & Conditions
    workingHours = 40,
    salary = 0,
    currency = 'VND',
    paymentTerms = '',
    jobDescription = '',
    responsibilities = [],
    benefits = [],
    
    // Legal Terms
    terminationClause = '',
    confidentialityClause = '',
    intellectualPropertyClause = '',
    disputeResolutionClause = '',
    
    // Relations
    internshipId = null,
    internship = null,
    studentId = null,
    student = null,
    companyId = null,
    company = null,
    
    // Signatures
    studentSignature = null,
    studentSignedAt = null,
    studentSignatureStatus = SignatureStatus.PENDING,
    
    companySignature = null,
    companySignedAt = null,
    companySignatureStatus = SignatureStatus.PENDING,
    companySignedBy = '',
    
    schoolSignature = null,
    schoolSignedAt = null,
    schoolSignatureStatus = SignatureStatus.PENDING,
    schoolSignedBy = '',
    
    // Document Management
    documentUrl = null,
    templateId = null,
    attachments = [],
    
    // Compliance & Legal
    isCompliant = false,
    legalReviewedAt = null,
    legalReviewedBy = null,
    complianceNotes = '',
    
    // Termination Information
    terminationReason = '',
    terminationDate = null,
    terminationNotice = '',
    terminatedBy = null,
    
    // Timestamps
    createdAt = null,
    updatedAt = null,
    createdBy = null
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    
    this.contractNumber = contractNumber;
    this.type = type;
    this.status = status;
    this.version = version;
    
    this.employerName = employerName;
    this.employerAddress = employerAddress;
    this.employerRepresentative = employerRepresentative;
    this.employeeFullName = employeeFullName;
    this.employeeAddress = employeeAddress;
    this.employeeId = employeeId;
    
    this.startDate = startDate;
    this.endDate = endDate;
    this.signedDate = signedDate;
    this.effectiveDate = effectiveDate;
    this.expirationDate = expirationDate;
    
    this.workingHours = workingHours;
    this.salary = salary;
    this.currency = currency;
    this.paymentTerms = paymentTerms;
    this.jobDescription = jobDescription;
    this.responsibilities = Array.isArray(responsibilities) ? responsibilities : [];
    this.benefits = Array.isArray(benefits) ? benefits : [];
    
    this.terminationClause = terminationClause;
    this.confidentialityClause = confidentialityClause;
    this.intellectualPropertyClause = intellectualPropertyClause;
    this.disputeResolutionClause = disputeResolutionClause;
    
    this.internshipId = internshipId;
    this.internship = internship;
    this.studentId = studentId;
    this.student = student;
    this.companyId = companyId;
    this.company = company;
    
    this.studentSignature = studentSignature;
    this.studentSignedAt = studentSignedAt;
    this.studentSignatureStatus = studentSignatureStatus;
    
    this.companySignature = companySignature;
    this.companySignedAt = companySignedAt;
    this.companySignatureStatus = companySignatureStatus;
    this.companySignedBy = companySignedBy;
    
    this.schoolSignature = schoolSignature;
    this.schoolSignedAt = schoolSignedAt;
    this.schoolSignatureStatus = schoolSignatureStatus;
    this.schoolSignedBy = schoolSignedBy;
    
    this.documentUrl = documentUrl;
    this.templateId = templateId;
    this.attachments = Array.isArray(attachments) ? attachments : [];
    
    this.isCompliant = isCompliant;
    this.legalReviewedAt = legalReviewedAt;
    this.legalReviewedBy = legalReviewedBy;
    this.complianceNotes = complianceNotes;
    
    this.terminationReason = terminationReason;
    this.terminationDate = terminationDate;
    this.terminationNotice = terminationNotice;
    this.terminatedBy = terminatedBy;
    
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
  }

  // Status Helper Methods
  isDraft() {
    return this.status === ContractStatus.DRAFT;
  }

  isPending() {
    return this.status === ContractStatus.PENDING;
  }

  isSigned() {
    return this.status === ContractStatus.SIGNED;
  }

  isActive() {
    return this.status === ContractStatus.ACTIVE;
  }

  isExpired() {
    return this.status === ContractStatus.EXPIRED;
  }

  isTerminated() {
    return this.status === ContractStatus.TERMINATED;
  }

  isCancelled() {
    return this.status === ContractStatus.CANCELLED;
  }

  // Signature Helper Methods
  isStudentSigned() {
    return this.studentSignatureStatus === SignatureStatus.SIGNED;
  }

  isCompanySigned() {
    return this.companySignatureStatus === SignatureStatus.SIGNED;
  }

  isSchoolSigned() {
    return this.schoolSignatureStatus === SignatureStatus.SIGNED;
  }

  isFullySigned() {
    return this.isStudentSigned() && this.isCompanySigned() && this.isSchoolSigned();
  }

  getPendingSignatures() {
    const pending = [];
    if (this.studentSignatureStatus === SignatureStatus.PENDING) {
      pending.push('Sinh viên');
    }
    if (this.companySignatureStatus === SignatureStatus.PENDING) {
      pending.push('Công ty');
    }
    if (this.schoolSignatureStatus === SignatureStatus.PENDING) {
      pending.push('Trường');
    }
    return pending;
  }

  getSignedCount() {
    let count = 0;
    if (this.isStudentSigned()) count++;
    if (this.isCompanySigned()) count++;
    if (this.isSchoolSigned()) count++;
    return count;
  }

  getSignatureProgress() {
    return Math.round((this.getSignedCount() / 3) * 100);
  }

  // Timeline Helper Methods
  getDurationInDays() {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  getDaysUntilExpiration() {
    if (!this.expirationDate) return null;
    const now = new Date();
    const expiry = new Date(this.expirationDate);
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isNearExpiration(daysThreshold = 30) {
    const daysLeft = this.getDaysUntilExpiration();
    return daysLeft !== null && daysLeft <= daysThreshold && daysLeft > 0;
  }

  hasExpired() {
    if (!this.expirationDate) return false;
    const now = new Date();
    const expiry = new Date(this.expirationDate);
    return now > expiry;
  }

  // Validity & Compliance Methods
  canSign() {
    return this.isDraft() || this.isPending();
  }

  canActivate() {
    return this.isSigned() && this.isFullySigned() && this.isCompliant;
  }

  canTerminate() {
    return this.isActive() && !this.hasExpired();
  }

  isValid() {
    return this.isActive() && !this.hasExpired() && !this.isTerminated();
  }

  // Financial Methods
  getFormattedSalary() {
    if (!this.salary || this.salary === 0) return 'Không lương';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: this.currency || 'VND'
    }).format(this.salary);
  }

  getMonthlySalary() {
    if (!this.salary) return 0;
    // Assuming salary is monthly, but could be hourly or other
    return this.salary;
  }

  getTotalContractValue() {
    const duration = this.getDurationInDays();
    const months = Math.ceil(duration / 30);
    return this.getMonthlySalary() * months;
  }

  // Labeling Methods
  getStatusLabel() {
    const statusLabels = {
      [ContractStatus.DRAFT]: 'Nháp',
      [ContractStatus.PENDING]: 'Chờ ký',
      [ContractStatus.SIGNED]: 'Đã ký',
      [ContractStatus.ACTIVE]: 'Hiệu lực',
      [ContractStatus.EXPIRED]: 'Hết hạn',
      [ContractStatus.TERMINATED]: 'Đã chấm dứt',
      [ContractStatus.CANCELLED]: 'Đã hủy'
    };
    return statusLabels[this.status] || this.status;
  }

  getTypeLabel() {
    const typeLabels = {
      [ContractType.INTERNSHIP]: 'Hợp đồng thực tập',
      [ContractType.EMPLOYMENT]: 'Hợp đồng lao động',
      [ContractType.PARTNERSHIP]: 'Hợp đồng đối tác',
      [ContractType.NDA]: 'Thỏa thuận bảo mật',
      [ContractType.SERVICE_AGREEMENT]: 'Hợp đồng dịch vụ'
    };
    return typeLabels[this.type] || this.type;
  }

  getStudentName() {
    return this.student?.fullName || this.student?.getDisplayName?.() || this.employeeFullName || 'N/A';
  }

  getCompanyName() {
    return this.company?.name || this.company?.displayName || this.employerName || 'N/A';
  }

  // Document & Compliance Methods
  hasAttachments() {
    return this.attachments.length > 0;
  }

  needsLegalReview() {
    return !this.legalReviewedAt || !this.isCompliant;
  }

  getComplianceStatus() {
    if (this.isCompliant) return 'Đạt yêu cầu';
    if (this.legalReviewedAt) return 'Cần chỉnh sửa';
    return 'Chưa kiểm tra';
  }

  // Status Management Methods
  canEdit() {
    return this.isDraft() || (this.isPending() && !this.isFullySigned());
  }

  getNextAction() {
    if (this.isDraft()) return 'Hoàn thiện và gửi ký';
    if (this.isPending()) return `Chờ ký: ${this.getPendingSignatures().join(', ')}`;
    if (this.isSigned()) return 'Kích hoạt hợp đồng';
    if (this.isActive()) return 'Đang hiệu lực';
    if (this.isExpired()) return 'Đã hết hạn';
    if (this.isTerminated()) return 'Đã chấm dứt';
    return 'Không xác định';
  }
}

// Contract Request Models
export class CreateContractRequest {
  constructor({
    title = '',
    type = ContractType.INTERNSHIP,
    internshipId = null,
    studentId = null,
    companyId = null,
    startDate = null,
    endDate = null,
    salary = 0,
    workingHours = 40
  } = {}) {
    this.title = title;
    this.type = type;
    this.internshipId = internshipId;
    this.studentId = studentId;
    this.companyId = companyId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.salary = salary;
    this.workingHours = workingHours;
  }
}

export class UpdateContractRequest {
  constructor(contractData = {}) {
    Object.assign(this, contractData);
  }
}

export class ContractSignatureRequest {
  constructor({
    contractId = null,
    signatureType = '', // 'student', 'company', 'school'
    signedBy = '',
    signature = null,
    signedAt = null
  } = {}) {
    this.contractId = contractId;
    this.signatureType = signatureType;
    this.signedBy = signedBy;
    this.signature = signature;
    this.signedAt = signedAt || new Date().toISOString();
  }
}

export class ContractTerminationRequest {
  constructor({
    contractId = null,
    reason = '',
    terminationDate = null,
    notice = '',
    terminatedBy = null
  } = {}) {
    this.contractId = contractId;
    this.reason = reason;
    this.terminationDate = terminationDate || new Date().toISOString();
    this.notice = notice;
    this.terminatedBy = terminatedBy;
  }
}

// Contract Search Models
export class ContractSearchCriteria {
  constructor({
    keyword = '',
    internshipId = null,
    studentId = null,
    companyId = null,
    type = '',
    status = '',
    startDate = null,
    endDate = null,
    expiringWithin = null // days
  } = {}) {
    this.keyword = keyword;
    this.internshipId = internshipId;
    this.studentId = studentId;
    this.companyId = companyId;
    this.type = type;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.expiringWithin = expiringWithin;
  }
}