// Report Models

export const ReportStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION_REQUIRED: 'REVISION_REQUIRED'
};

export const ReportType = {
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  FINAL: 'FINAL',
  PROGRESS: 'PROGRESS',
  INCIDENT: 'INCIDENT',
  SELF_EVALUATION: 'SELF_EVALUATION'
};

export const ApprovalLevel = {
  MENTOR: 'MENTOR',
  TEACHER: 'TEACHER',
  DEPARTMENT: 'DEPARTMENT'
};

export class Report {
  constructor({
    id = null,
    title = '',
    content = '',
    summary = '',
    
    // Report Information
    type = ReportType.WEEKLY,
    week = null,
    month = null,
    reportPeriodStart = null,
    reportPeriodEnd = null,
    
    // Status & Approval
    status = ReportStatus.DRAFT,
    approvalLevel = ApprovalLevel.MENTOR,
    requiresTeacherApproval = true,
    requiresMentorApproval = true,
    
    // Submission Information
    submittedAt = null,
    submittedBy = null,
    dueDate = null,
    isLateSubmission = false,
    
    // Review & Approval
    reviewedAt = null,
    reviewedBy = null,
    approvedAt = null,
    approvedBy = null,
    rejectedAt = null,
    rejectedBy = null,
    
    // Feedback & Comments
    mentorFeedback = '',
    teacherFeedback = '',
    mentorRating = null,
    teacherRating = null,
    
    // Relations
    internshipId = null,
    internship = null,
    studentId = null,
    student = null,
    mentorId = null,
    mentor = null,
    teacherId = null,
    teacher = null,
    batchId = null,
    batch = null,
    
    // Attachments & Resources
    attachments = [],
    images = [],
    documents = [],
    
    // Work Details
    tasksCompleted = [],
    challengesFaced = [],
    lessonsLearned = [],
    nextWeekPlans = [],
    hoursWorked = 0,
    
    // Self Assessment
    selfRating = null,
    skillsImproved = [],
    areasForImprovement = [],
    
    // Timestamps
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.summary = summary;
    
    this.type = type;
    this.week = week;
    this.month = month;
    this.reportPeriodStart = reportPeriodStart;
    this.reportPeriodEnd = reportPeriodEnd;
    
    this.status = status;
    this.approvalLevel = approvalLevel;
    this.requiresTeacherApproval = requiresTeacherApproval;
    this.requiresMentorApproval = requiresMentorApproval;
    
    this.submittedAt = submittedAt;
    this.submittedBy = submittedBy;
    this.dueDate = dueDate;
    this.isLateSubmission = isLateSubmission;
    
    this.reviewedAt = reviewedAt;
    this.reviewedBy = reviewedBy;
    this.approvedAt = approvedAt;
    this.approvedBy = approvedBy;
    this.rejectedAt = rejectedAt;
    this.rejectedBy = rejectedBy;
    
    this.mentorFeedback = mentorFeedback;
    this.teacherFeedback = teacherFeedback;
    this.mentorRating = mentorRating;
    this.teacherRating = teacherRating;
    
    this.internshipId = internshipId;
    this.internship = internship;
    this.studentId = studentId;
    this.student = student;
    this.mentorId = mentorId;
    this.mentor = mentor;
    this.teacherId = teacherId;
    this.teacher = teacher;
    this.batchId = batchId;
    this.batch = batch;
    
    this.attachments = Array.isArray(attachments) ? attachments : [];
    this.images = Array.isArray(images) ? images : [];
    this.documents = Array.isArray(documents) ? documents : [];
    
    this.tasksCompleted = Array.isArray(tasksCompleted) ? tasksCompleted : [];
    this.challengesFaced = Array.isArray(challengesFaced) ? challengesFaced : [];
    this.lessonsLearned = Array.isArray(lessonsLearned) ? lessonsLearned : [];
    this.nextWeekPlans = Array.isArray(nextWeekPlans) ? nextWeekPlans : [];
    this.hoursWorked = hoursWorked;
    
    this.selfRating = selfRating;
    this.skillsImproved = Array.isArray(skillsImproved) ? skillsImproved : [];
    this.areasForImprovement = Array.isArray(areasForImprovement) ? areasForImprovement : [];
    
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Status Helper Methods
  isDraft() {
    return this.status === ReportStatus.DRAFT;
  }

  isSubmitted() {
    return this.status === ReportStatus.SUBMITTED;
  }

  isUnderReview() {
    return this.status === ReportStatus.UNDER_REVIEW;
  }

  isApproved() {
    return this.status === ReportStatus.APPROVED;
  }

  isRejected() {
    return this.status === ReportStatus.REJECTED;
  }

  needsRevision() {
    return this.status === ReportStatus.REVISION_REQUIRED;
  }

  // Workflow Helper Methods
  canEdit() {
    return this.isDraft() || this.needsRevision();
  }

  canSubmit() {
    return this.isDraft() || this.needsRevision();
  }

  canApprove() {
    return this.isSubmitted() || this.isUnderReview();
  }

  canReject() {
    return this.isSubmitted() || this.isUnderReview();
  }

  // Timeline Methods
  isOverdue() {
    if (!this.dueDate) return false;
    const now = new Date();
    const due = new Date(this.dueDate);
    return now > due && !this.isSubmitted();
  }

  getDaysUntilDue() {
    if (!this.dueDate) return null;
    const now = new Date();
    const due = new Date(this.dueDate);
    const diffTime = due - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysLate() {
    if (!this.isLateSubmission || !this.submittedAt || !this.dueDate) return 0;
    const submitted = new Date(this.submittedAt);
    const due = new Date(this.dueDate);
    const diffTime = submitted - due;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Rating & Feedback Methods
  getAverageRating() {
    const ratings = [this.mentorRating, this.teacherRating, this.selfRating].filter(r => r !== null && r !== undefined);
    if (ratings.length === 0) return null;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }

  hasFeedback() {
    return this.mentorFeedback || this.teacherFeedback;
  }

  // Content Methods
  getWordCount() {
    if (!this.content) return 0;
    return this.content.trim().split(/\s+/).length;
  }

  hasAttachments() {
    return this.attachments.length > 0 || this.images.length > 0 || this.documents.length > 0;
  }

  // Labeling Methods
  getStatusLabel() {
    const statusLabels = {
      [ReportStatus.DRAFT]: 'Nháp',
      [ReportStatus.SUBMITTED]: 'Đã nộp',
      [ReportStatus.UNDER_REVIEW]: 'Đang xem xét',
      [ReportStatus.APPROVED]: 'Đã phê duyệt',
      [ReportStatus.REJECTED]: 'Bị từ chối',
      [ReportStatus.REVISION_REQUIRED]: 'Cần sửa đổi'
    };
    return statusLabels[this.status] || this.status;
  }

  getTypeLabel() {
    const typeLabels = {
      [ReportType.WEEKLY]: 'Báo cáo tuần',
      [ReportType.MONTHLY]: 'Báo cáo tháng',
      [ReportType.FINAL]: 'Báo cáo cuối kỳ',
      [ReportType.PROGRESS]: 'Báo cáo tiến độ',
      [ReportType.INCIDENT]: 'Báo cáo sự cố',
      [ReportType.SELF_EVALUATION]: 'Tự đánh giá'
    };
    return typeLabels[this.type] || this.type;
  }

  getReportPeriod() {
    if (this.reportPeriodStart && this.reportPeriodEnd) {
      const start = new Date(this.reportPeriodStart).toLocaleDateString('vi-VN');
      const end = new Date(this.reportPeriodEnd).toLocaleDateString('vi-VN');
      return `${start} - ${end}`;
    }
    if (this.week) return `Tuần ${this.week}`;
    if (this.month) return `Tháng ${this.month}`;
    return 'N/A';
  }

  getStudentName() {
    return this.student?.fullName || this.student?.getDisplayName?.() || 'N/A';
  }

  getMentorName() {
    return this.mentor?.fullName || this.mentor?.getDisplayName?.() || 'N/A';
  }

  getTeacherName() {
    return this.teacher?.fullName || this.teacher?.getDisplayName?.() || 'N/A';
  }
}

// Report Request Models
export class CreateReportRequest {
  constructor({
    title = '',
    content = '',
    type = ReportType.WEEKLY,
    internshipId = null,
    week = null,
    reportPeriodStart = null,
    reportPeriodEnd = null
  } = {}) {
    this.title = title;
    this.content = content;
    this.type = type;
    this.internshipId = internshipId;
    this.week = week;
    this.reportPeriodStart = reportPeriodStart;
    this.reportPeriodEnd = reportPeriodEnd;
  }
}

export class UpdateReportRequest {
  constructor(reportData = {}) {
    Object.assign(this, reportData);
  }
}

export class ReportApprovalRequest {
  constructor({
    reportId = null,
    feedback = '',
    rating = null,
    approved = true
  } = {}) {
    this.reportId = reportId;
    this.feedback = feedback;
    this.rating = rating;
    this.approved = approved;
  }
}

// Report Search Models
export class ReportSearchCriteria {
  constructor({
    keyword = '',
    internshipId = null,
    studentId = null,
    mentorId = null,
    teacherId = null,
    batchId = null,
    type = '',
    status = '',
    approvalStatus = '',
    startDate = null,
    endDate = null
  } = {}) {
    this.keyword = keyword;
    this.internshipId = internshipId;
    this.studentId = studentId;
    this.mentorId = mentorId;
    this.teacherId = teacherId;
    this.batchId = batchId;
    this.type = type;
    this.status = status;
    this.approvalStatus = approvalStatus;
    this.startDate = startDate;
    this.endDate = endDate;
  }
} 