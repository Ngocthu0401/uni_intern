package com.internship.dto.request;

import com.internship.enums.RoleType;
import lombok.Data;

@Data
public class CreateEvaluationRequest {
    private String studentId;
    private String internshipId;
    private String evaluationType;
    private String semester;
    private String academicYear;

    // Part I: Tinh thần kỷ luật, thái độ (6.0 điểm tối đa)
    private Double understandingOrganization; // Hiểu biết về cơ quan nơi thực tập (1.0 điểm)
    private Double followingRules; // Thực hiện nội quy của cơ quan, đơn vị (1.0 điểm)
    private Double workScheduleCompliance; // Chấp hành giờ giấc làm việc (1.0 điểm)
    private Double communicationAttitude; // Thái độ giao tiếp với cán bộ, nhân viên (1.0 điểm)
    private Double propertyProtection; // Ý thức bảo vệ của công (1.0 điểm)
    private Double workEnthusiasm; // Tích cực trong công việc (1.0 điểm)

    // Part II: Khả năng chuyên môn, nghiệp vụ (4.0 điểm tối đa)
    private Double jobRequirementsFulfillment; // Đáp ứng yêu cầu công việc (2.0 điểm)
    private Double learningSpirit; // Tinh thần học hỏi, nâng cao trình độ chuyên môn, nghiệp vụ (1.0 điểm)
    private Double initiativeCreativity; // Có đề xuất, sáng kiến, năng động trong công việc (1.0 điểm)

    // Calculated scores
    private Double disciplineScore; // Tổng điểm phần I (6.0 điểm tối đa)
    private Double professionalScore; // Tổng điểm phần II (4.0 điểm tối đa)
    private Double overallScore; // Tổng điểm chung (10.0 điểm tối đa)

    // Comments and feedback
    private Object strengths; // Can be String or Array
    private Object weaknesses; // Can be String or Array
    private String recommendations;
    private String comments;

    // Teacher ID (evaluator)
    private Long teacherId;

    // Mentor ID (evaluator for mentor evaluations)
    private Long mentorId;

    // Additional fields
    private Boolean isFinalEvaluation = false;
}