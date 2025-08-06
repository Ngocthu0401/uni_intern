// Evaluation Models

export const EvaluationType = {
  MENTOR: 'MENTOR',
  TEACHER: 'TEACHER',
  STUDENT_SELF: 'STUDENT_SELF',
  COMPANY: 'COMPANY',
  PEER: 'PEER',
  FINAL: 'FINAL',
  MIDTERM: 'MIDTERM'
};

export const EvaluationStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  SUBMITTED: 'SUBMITTED',
  REVIEWED: 'REVIEWED'
};

export const ScoreScale = {
  FIVE_POINT: 'FIVE_POINT',      // 1-5
  TEN_POINT: 'TEN_POINT',        // 1-10
  HUNDRED_POINT: 'HUNDRED_POINT',// 1-100
  LETTER_GRADE: 'LETTER_GRADE'   // A, B, C, D, F
};

export class Evaluation {
  constructor({
    id = null,
    title = '',
    description = '',
    
    // Evaluation Information
    type = EvaluationType.MENTOR,
    status = EvaluationStatus.PENDING,
    evaluationPeriod = '',
    dueDate = null,
    
    // Scoring Information
    scoreScale = ScoreScale.TEN_POINT,
    totalScore = 0,
    maxScore = 10,
    percentage = 0,
    letterGrade = '',
    
    // Detailed Scores
    technicalSkillsScore = null,
    communicationScore = null,
    teamworkScore = null,
    problemSolvingScore = null,
    adaptabilityScore = null,
    professionalismScore = null,
    attendanceScore = null,
    initiativeScore = null,
    
    // Custom Criteria Scores
    customCriteria = [],
    
    // Qualitative Assessment
    strengths = [],
    weaknesses = [],
    improvements = [],
    recommendations = '',
    overallComment = '',
    
    // Relations
    internshipId = null,
    internship = null,
    studentId = null,
    student = null,
    evaluatorId = null,
    evaluator = null,
    mentorId = null,
    mentor = null,
    teacherId = null,
    teacher = null,
    batchId = null,
    batch = null,
    
    // Evaluation Process
    startedAt = null,
    submittedAt = null,
    reviewedAt = null,
    evaluatedBy = null,
    reviewedBy = null,
    
    // Feedback & Comments
    studentFeedback = '',
    mentorFeedback = '',
    teacherFeedback = '',
    
    // Additional Assessment
    goalsAchieved = [],
    skillsDeveloped = [],
    areasForImprovement = [],
    futureRecommendations = '',
    
    // Timestamps
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    
    this.type = type;
    this.status = status;
    this.evaluationPeriod = evaluationPeriod;
    this.dueDate = dueDate;
    
    this.scoreScale = scoreScale;
    this.totalScore = totalScore;
    this.maxScore = maxScore;
    this.percentage = percentage;
    this.letterGrade = letterGrade;
    
    this.technicalSkillsScore = technicalSkillsScore;
    this.communicationScore = communicationScore;
    this.teamworkScore = teamworkScore;
    this.problemSolvingScore = problemSolvingScore;
    this.adaptabilityScore = adaptabilityScore;
    this.professionalismScore = professionalismScore;
    this.attendanceScore = attendanceScore;
    this.initiativeScore = initiativeScore;
    
    this.customCriteria = Array.isArray(customCriteria) ? customCriteria : [];
    
    this.strengths = Array.isArray(strengths) ? strengths : [];
    this.weaknesses = Array.isArray(weaknesses) ? weaknesses : [];
    this.improvements = Array.isArray(improvements) ? improvements : [];
    this.recommendations = recommendations;
    this.overallComment = overallComment;
    
    this.internshipId = internshipId;
    this.internship = internship;
    this.studentId = studentId;
    this.student = student;
    this.evaluatorId = evaluatorId;
    this.evaluator = evaluator;
    this.mentorId = mentorId;
    this.mentor = mentor;
    this.teacherId = teacherId;
    this.teacher = teacher;
    this.batchId = batchId;
    this.batch = batch;
    
    this.startedAt = startedAt;
    this.submittedAt = submittedAt;
    this.reviewedAt = reviewedAt;
    this.evaluatedBy = evaluatedBy;
    this.reviewedBy = reviewedBy;
    
    this.studentFeedback = studentFeedback;
    this.mentorFeedback = mentorFeedback;
    this.teacherFeedback = teacherFeedback;
    
    this.goalsAchieved = Array.isArray(goalsAchieved) ? goalsAchieved : [];
    this.skillsDeveloped = Array.isArray(skillsDeveloped) ? skillsDeveloped : [];
    this.areasForImprovement = Array.isArray(areasForImprovement) ? areasForImprovement : [];
    this.futureRecommendations = futureRecommendations;
    
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Status Helper Methods
  isPending() {
    return this.status === EvaluationStatus.PENDING;
  }

  isInProgress() {
    return this.status === EvaluationStatus.IN_PROGRESS;
  }

  isCompleted() {
    return this.status === EvaluationStatus.COMPLETED;
  }

  isSubmitted() {
    return this.status === EvaluationStatus.SUBMITTED;
  }

  isReviewed() {
    return this.status === EvaluationStatus.REVIEWED;
  }

  // Score Calculation Methods
  calculatePercentage() {
    if (this.maxScore === 0) return 0;
    return Math.round((this.totalScore / this.maxScore) * 100);
  }

  calculateLetterGrade() {
    const percentage = this.percentage || this.calculatePercentage();
    
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  getAverageSkillScore() {
    const skillScores = [
      this.technicalSkillsScore,
      this.communicationScore,
      this.teamworkScore,
      this.problemSolvingScore,
      this.adaptabilityScore,
      this.professionalismScore,
      this.attendanceScore,
      this.initiativeScore
    ].filter(score => score !== null && score !== undefined);
    
    if (skillScores.length === 0) return null;
    return skillScores.reduce((sum, score) => sum + score, 0) / skillScores.length;
  }

  // Validation Methods
  isOverdue() {
    if (!this.dueDate) return false;
    const now = new Date();
    const due = new Date(this.dueDate);
    return now > due && !this.isSubmitted();
  }

  isComplete() {
    // Check if all required scores are filled
    const requiredScores = [
      this.technicalSkillsScore,
      this.communicationScore,
      this.teamworkScore,
      this.problemSolvingScore
    ];
    
    return requiredScores.every(score => score !== null && score !== undefined);
  }

  canSubmit() {
    return this.isComplete() && (this.isPending() || this.isInProgress());
  }

  // Performance Analysis Methods
  getPerformanceLevel() {
    const percentage = this.percentage || this.calculatePercentage();
    
    if (percentage >= 90) return 'Xuất sắc';
    if (percentage >= 80) return 'Giỏi';
    if (percentage >= 70) return 'Khá';
    if (percentage >= 60) return 'Trung bình';
    return 'Yếu';
  }

  getTopSkills(limit = 3) {
    const skillScores = [
      { name: 'Kỹ thuật', score: this.technicalSkillsScore },
      { name: 'Giao tiếp', score: this.communicationScore },
      { name: 'Làm việc nhóm', score: this.teamworkScore },
      { name: 'Giải quyết vấn đề', score: this.problemSolvingScore },
      { name: 'Thích nghi', score: this.adaptabilityScore },
      { name: 'Chuyên nghiệp', score: this.professionalismScore },
      { name: 'Chuyên cần', score: this.attendanceScore },
      { name: 'Chủ động', score: this.initiativeScore }
    ].filter(skill => skill.score !== null && skill.score !== undefined)
     .sort((a, b) => b.score - a.score)
     .slice(0, limit);
    
    return skillScores;
  }

  getWeakestSkills(limit = 3) {
    const skillScores = [
      { name: 'Kỹ thuật', score: this.technicalSkillsScore },
      { name: 'Giao tiếp', score: this.communicationScore },
      { name: 'Làm việc nhóm', score: this.teamworkScore },
      { name: 'Giải quyết vấn đề', score: this.problemSolvingScore },
      { name: 'Thích nghi', score: this.adaptabilityScore },
      { name: 'Chuyên nghiệp', score: this.professionalismScore },
      { name: 'Chuyên cần', score: this.attendanceScore },
      { name: 'Chủ động', score: this.initiativeScore }
    ].filter(skill => skill.score !== null && skill.score !== undefined)
     .sort((a, b) => a.score - b.score)
     .slice(0, limit);
    
    return skillScores;
  }

  // Labeling Methods
  getStatusLabel() {
    const statusLabels = {
      [EvaluationStatus.PENDING]: 'Chờ đánh giá',
      [EvaluationStatus.IN_PROGRESS]: 'Đang đánh giá',
      [EvaluationStatus.COMPLETED]: 'Hoàn thành',
      [EvaluationStatus.SUBMITTED]: 'Đã nộp',
      [EvaluationStatus.REVIEWED]: 'Đã xem xét'
    };
    return statusLabels[this.status] || this.status;
  }

  getTypeLabel() {
    const typeLabels = {
      [EvaluationType.MENTOR]: 'Đánh giá từ Mentor',
      [EvaluationType.TEACHER]: 'Đánh giá từ Giảng viên',
      [EvaluationType.STUDENT_SELF]: 'Tự đánh giá',
      [EvaluationType.COMPANY]: 'Đánh giá từ Công ty',
      [EvaluationType.PEER]: 'Đánh giá từ Đồng nghiệp',
      [EvaluationType.FINAL]: 'Đánh giá cuối kỳ',
      [EvaluationType.MIDTERM]: 'Đánh giá giữa kỳ'
    };
    return typeLabels[this.type] || this.type;
  }

  getStudentName() {
    return this.student?.fullName || this.student?.getDisplayName?.() || 'N/A';
  }

  getEvaluatorName() {
    return this.evaluator?.fullName || this.evaluator?.getDisplayName?.() || 'N/A';
  }
}

// Evaluation Request Models
export class CreateEvaluationRequest {
  constructor({
    title = '',
    type = EvaluationType.MENTOR,
    internshipId = null,
    studentId = null,
    evaluatorId = null,
    dueDate = null
  } = {}) {
    this.title = title;
    this.type = type;
    this.internshipId = internshipId;
    this.studentId = studentId;
    this.evaluatorId = evaluatorId;
    this.dueDate = dueDate;
  }
}

export class UpdateEvaluationRequest {
  constructor(evaluationData = {}) {
    Object.assign(this, evaluationData);
  }
}

export class EvaluationScoreRequest {
  constructor({
    evaluationId = null,
    technicalSkillsScore = null,
    communicationScore = null,
    teamworkScore = null,
    problemSolvingScore = null,
    overallComment = ''
  } = {}) {
    this.evaluationId = evaluationId;
    this.technicalSkillsScore = technicalSkillsScore;
    this.communicationScore = communicationScore;
    this.teamworkScore = teamworkScore;
    this.problemSolvingScore = problemSolvingScore;
    this.overallComment = overallComment;
  }
}

// Evaluation Search Models
export class EvaluationSearchCriteria {
  constructor({
    keyword = '',
    internshipId = null,
    studentId = null,
    evaluatorId = null,
    mentorId = null,
    teacherId = null,
    batchId = null,
    type = '',
    status = '',
    minScore = null,
    maxScore = null
  } = {}) {
    this.keyword = keyword;
    this.internshipId = internshipId;
    this.studentId = studentId;
    this.evaluatorId = evaluatorId;
    this.mentorId = mentorId;
    this.teacherId = teacherId;
    this.batchId = batchId;
    this.type = type;
    this.status = status;
    this.minScore = minScore;
    this.maxScore = maxScore;
  }
}

// Evaluation Statistics Models
export class EvaluationStatistics {
  constructor({
    totalEvaluations = 0,
    completedEvaluations = 0,
    averageScore = 0,
    highestScore = 0,
    lowestScore = 0,
    gradeDistribution = {},
    skillAverages = {},
    evaluationsByType = {},
    evaluationsByPeriod = []
  } = {}) {
    this.totalEvaluations = totalEvaluations;
    this.completedEvaluations = completedEvaluations;
    this.averageScore = averageScore;
    this.highestScore = highestScore;
    this.lowestScore = lowestScore;
    this.gradeDistribution = gradeDistribution;
    this.skillAverages = skillAverages;
    this.evaluationsByType = evaluationsByType;
    this.evaluationsByPeriod = evaluationsByPeriod;
  }

  getCompletionRate() {
    if (this.totalEvaluations === 0) return 0;
    return Math.round((this.completedEvaluations / this.totalEvaluations) * 100);
  }
} 