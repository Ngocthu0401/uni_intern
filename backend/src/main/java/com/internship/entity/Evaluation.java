package com.internship.entity;

import com.internship.enums.RoleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "evaluations")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Evaluation extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "internship_id", referencedColumnName = "id")
    private Internship internship;

    @ManyToOne
    @JoinColumn(name = "evaluator_id", referencedColumnName = "id")
    private User evaluator;

    @Enumerated(EnumType.STRING)
    @Column(name = "evaluator_type")
    private RoleType evaluatorType;

    @Column(name = "evaluation_date")
    private LocalDate evaluationDate;

    // I. Tinh thần kỷ luật, thái độ (6.0 điểm tối đa)
    @Column(name = "understanding_organization")
    private Double understandingOrganization; // Hiểu biết về cơ quan nơi thực tập (1.0 điểm)

    @Column(name = "following_rules")
    private Double followingRules; // Thực hiện nội quy của cơ quan, đơn vị (1.0 điểm)

    @Column(name = "work_schedule_compliance")
    private Double workScheduleCompliance; // Chấp hành giờ giấc làm việc (1.0 điểm)

    @Column(name = "communication_attitude")
    private Double communicationAttitude; // Thái độ giao tiếp với cán bộ, nhân viên (1.0 điểm)

    @Column(name = "property_protection")
    private Double propertyProtection; // Ý thức bảo vệ của công (1.0 điểm)

    @Column(name = "work_enthusiasm")
    private Double workEnthusiasm; // Tích cực trong công việc (1.0 điểm)

    // II. Khả năng chuyên môn, nghiệp vụ (4.0 điểm tối đa)
    @Column(name = "job_requirements_fulfillment")
    private Double jobRequirementsFulfillment; // Đáp ứng yêu cầu công việc (2.0 điểm)

    @Column(name = "learning_spirit")
    private Double learningSpirit; // Tinh thần học hỏi, nâng cao trình độ chuyên môn, nghiệp vụ (1.0 điểm)

    @Column(name = "initiative_creativity")
    private Double initiativeCreativity; // Có đề xuất, sáng kiến, năng động trong công việc (1.0 điểm)

    // Tổng điểm
    @Column(name = "discipline_score")
    private Double disciplineScore; // Tổng điểm phần I (6.0 điểm tối đa)

    @Column(name = "professional_score")
    private Double professionalScore; // Tổng điểm phần II (4.0 điểm tối đa)

    @Column(name = "overall_score")
    private Double overallScore; // Tổng điểm chung (10.0 điểm tối đa)

    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "weaknesses", columnDefinition = "TEXT")
    private String weaknesses;

    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "is_final_evaluation")
    private Boolean isFinalEvaluation = false;

    // Helper methods
    public Double getScore() {
        return this.overallScore;
    }

    public void setScore(Double score) {
        this.overallScore = score;
    }

    // Calculate discipline score (Part I)
    public void calculateDisciplineScore() {
        this.disciplineScore = (understandingOrganization != null ? understandingOrganization : 0.0) +
                (followingRules != null ? followingRules : 0.0) +
                (workScheduleCompliance != null ? workScheduleCompliance : 0.0) +
                (communicationAttitude != null ? communicationAttitude : 0.0) +
                (propertyProtection != null ? propertyProtection : 0.0) +
                (workEnthusiasm != null ? workEnthusiasm : 0.0);
    }

    // Calculate professional score (Part II)
    public void calculateProfessionalScore() {
        this.professionalScore = (jobRequirementsFulfillment != null ? jobRequirementsFulfillment : 0.0) +
                (learningSpirit != null ? learningSpirit : 0.0) +
                (initiativeCreativity != null ? initiativeCreativity : 0.0);
    }

    // Calculate overall score
    public void calculateOverallScore() {
        calculateDisciplineScore();
        calculateProfessionalScore();
        this.overallScore = (disciplineScore != null ? disciplineScore : 0.0) +
                (professionalScore != null ? professionalScore : 0.0);
    }
}