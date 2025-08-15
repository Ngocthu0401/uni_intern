package com.internship.service;

import com.internship.dto.request.CreateEvaluationRequest;
import com.internship.dto.request.UpdateEvaluationRequest;
import com.internship.entity.Evaluation;
import com.internship.entity.Internship;
import com.internship.entity.Teacher;
import com.internship.entity.User;
import com.internship.enums.RoleType;
import com.internship.repository.EvaluationRepository;
import com.internship.repository.InternshipRepository;
import com.internship.repository.TeacherRepository;
import com.internship.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
@Transactional
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Evaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    public Page<Evaluation> getAllEvaluations(Pageable pageable) {
        return evaluationRepository.findAll(pageable);
    }

    public Optional<Evaluation> getEvaluationById(Long id) {
        return evaluationRepository.findById(id);
    }

    public List<Evaluation> getEvaluationsByInternshipId(Long internshipId) {
        return evaluationRepository.findByInternshipId(internshipId);
    }

    public List<Evaluation> getEvaluationsByStudentId(Long studentId) {
        return evaluationRepository.findByStudentId(studentId);
    }

    public List<Evaluation> getEvaluationsByTeacherId(Long teacherId) {
        return evaluationRepository.findByTeacherId(teacherId);
    }

    public List<Evaluation> getEvaluationsByMentorId(Long mentorId) {
        return evaluationRepository.findByMentorId(mentorId);
    }

    public List<Evaluation> getEvaluationsByBatchId(Long batchId) {
        return evaluationRepository.findByBatchId(batchId);
    }

    public List<Evaluation> getEvaluationsByScoreRange(Double minScore, Double maxScore) {
        return evaluationRepository.findByScoreRange(minScore, maxScore);
    }

    public Page<Evaluation> searchEvaluations(String keyword, Pageable pageable) {
        return evaluationRepository.searchEvaluations(keyword, pageable);
    }

    public Evaluation createEvaluation(CreateEvaluationRequest request) {
        // Validate and get internship
        Optional<Internship> internshipOpt = Optional.empty();
        if (request.getInternshipId() != null && !request.getInternshipId().trim().isEmpty()) {
            try {
                Long internshipId = Long.parseLong(request.getInternshipId());
                internshipOpt = internshipRepository.findById(internshipId);
                if (internshipOpt.isEmpty()) {
                    throw new RuntimeException("Internship not found with id: " + internshipId);
                }
            } catch (NumberFormatException e) {
                throw new RuntimeException("Invalid internship ID format: " + request.getInternshipId());
            }
        }

        // Validate and get teacher (evaluator)
        Optional<Teacher> teacherOpt = Optional.empty();
        if (request.getTeacherId() != null) {
            teacherOpt = teacherRepository.findById(request.getTeacherId());
            if (teacherOpt.isEmpty()) {
                throw new RuntimeException("Teacher not found with id: " + request.getTeacherId());
            }
        }

        // Create evaluation entity
        Evaluation evaluation = new Evaluation();

        // Set basic fields
        if (internshipOpt.isPresent()) {
            evaluation.setInternship(internshipOpt.get());
        }
        if (teacherOpt.isPresent()) {
            evaluation.setEvaluator(teacherOpt.get().getUser());
            evaluation.setEvaluatorType(RoleType.TEACHER);
        }

        evaluation.setEvaluationDate(LocalDate.now());

        // Set Part I: Tinh thần kỷ luật, thái độ (6.0 điểm tối đa)
        evaluation.setUnderstandingOrganization(request.getUnderstandingOrganization());
        evaluation.setFollowingRules(request.getFollowingRules());
        evaluation.setWorkScheduleCompliance(request.getWorkScheduleCompliance());
        evaluation.setCommunicationAttitude(request.getCommunicationAttitude());
        evaluation.setPropertyProtection(request.getPropertyProtection());
        evaluation.setWorkEnthusiasm(request.getWorkEnthusiasm());

        // Set Part II: Khả năng chuyên môn, nghiệp vụ (4.0 điểm tối đa)
        evaluation.setJobRequirementsFulfillment(request.getJobRequirementsFulfillment());
        evaluation.setLearningSpirit(request.getLearningSpirit());
        evaluation.setInitiativeCreativity(request.getInitiativeCreativity());

        // Set calculated scores
        evaluation.setDisciplineScore(request.getDisciplineScore());
        evaluation.setProfessionalScore(request.getProfessionalScore());
        evaluation.setOverallScore(request.getOverallScore());

        // Set text fields
        evaluation.setStrengths(convertToString(request.getStrengths()));
        evaluation.setWeaknesses(convertToString(request.getWeaknesses()));
        evaluation.setRecommendations(request.getRecommendations());
        evaluation.setComments(request.getComments());
        evaluation.setIsFinalEvaluation(request.getIsFinalEvaluation());

        // Validate score ranges
        validateScores(evaluation);

        return evaluationRepository.save(evaluation);
    }

    public Evaluation updateEvaluationWithDto(Long id, UpdateEvaluationRequest request) {
        // Get existing evaluation
        Optional<Evaluation> existingOpt = evaluationRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Evaluation not found with id: " + id);
        }

        Evaluation evaluation = existingOpt.get();

        // Validate and get internship if changed
        if (request.getInternshipId() != null && !request.getInternshipId().trim().isEmpty()) {
            try {
                Long internshipId = Long.parseLong(request.getInternshipId());
                Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
                if (internshipOpt.isEmpty()) {
                    throw new RuntimeException("Internship not found with id: " + internshipId);
                }
                evaluation.setInternship(internshipOpt.get());
            } catch (NumberFormatException e) {
                throw new RuntimeException("Invalid internship ID format: " + request.getInternshipId());
            }
        }

        // Validate and get teacher (evaluator) if changed
        if (request.getTeacherId() != null) {
            Optional<Teacher> teacherOpt = teacherRepository.findById(request.getTeacherId());
            if (teacherOpt.isPresent()) {
                evaluation.setEvaluator(teacherOpt.get().getUser());
                evaluation.setEvaluatorType(RoleType.TEACHER);
            }
        }

        // Update Part I: Tinh thần kỷ luật, thái độ
        if (request.getUnderstandingOrganization() != null) {
            evaluation.setUnderstandingOrganization(request.getUnderstandingOrganization());
        }
        if (request.getFollowingRules() != null) {
            evaluation.setFollowingRules(request.getFollowingRules());
        }
        if (request.getWorkScheduleCompliance() != null) {
            evaluation.setWorkScheduleCompliance(request.getWorkScheduleCompliance());
        }
        if (request.getCommunicationAttitude() != null) {
            evaluation.setCommunicationAttitude(request.getCommunicationAttitude());
        }
        if (request.getPropertyProtection() != null) {
            evaluation.setPropertyProtection(request.getPropertyProtection());
        }
        if (request.getWorkEnthusiasm() != null) {
            evaluation.setWorkEnthusiasm(request.getWorkEnthusiasm());
        }

        // Update Part II: Khả năng chuyên môn, nghiệp vụ
        if (request.getJobRequirementsFulfillment() != null) {
            evaluation.setJobRequirementsFulfillment(request.getJobRequirementsFulfillment());
        }
        if (request.getLearningSpirit() != null) {
            evaluation.setLearningSpirit(request.getLearningSpirit());
        }
        if (request.getInitiativeCreativity() != null) {
            evaluation.setInitiativeCreativity(request.getInitiativeCreativity());
        }

        // Update calculated scores
        if (request.getDisciplineScore() != null) {
            evaluation.setDisciplineScore(request.getDisciplineScore());
        }
        if (request.getProfessionalScore() != null) {
            evaluation.setProfessionalScore(request.getProfessionalScore());
        }
        if (request.getOverallScore() != null) {
            evaluation.setOverallScore(request.getOverallScore());
        }

        // Set text fields
        if (request.getStrengths() != null) {
            evaluation.setStrengths(convertToString(request.getStrengths()));
        }
        if (request.getWeaknesses() != null) {
            evaluation.setWeaknesses(convertToString(request.getWeaknesses()));
        }
        if (request.getRecommendations() != null) {
            evaluation.setRecommendations(request.getRecommendations());
        }
        if (request.getComments() != null) {
            evaluation.setComments(request.getComments());
        }
        if (request.getIsFinalEvaluation() != null) {
            evaluation.setIsFinalEvaluation(request.getIsFinalEvaluation());
        }

        // Validate score ranges
        validateScores(evaluation);

        return evaluationRepository.save(evaluation);
    }

    // Add validation method for new scoring structure
    private void validateScores(Evaluation evaluation) {
        // Validate Part I scores (0-1.0 each, total 6.0)
        if (evaluation.getUnderstandingOrganization() != null &&
                (evaluation.getUnderstandingOrganization() < 0 || evaluation.getUnderstandingOrganization() > 1.0)) {
            throw new RuntimeException("Understanding organization score must be between 0 and 1.0");
        }
        if (evaluation.getFollowingRules() != null &&
                (evaluation.getFollowingRules() < 0 || evaluation.getFollowingRules() > 1.0)) {
            throw new RuntimeException("Following rules score must be between 0 and 1.0");
        }
        if (evaluation.getWorkScheduleCompliance() != null &&
                (evaluation.getWorkScheduleCompliance() < 0 || evaluation.getWorkScheduleCompliance() > 1.0)) {
            throw new RuntimeException("Work schedule compliance score must be between 0 and 1.0");
        }
        if (evaluation.getCommunicationAttitude() != null &&
                (evaluation.getCommunicationAttitude() < 0 || evaluation.getCommunicationAttitude() > 1.0)) {
            throw new RuntimeException("Communication attitude score must be between 0 and 1.0");
        }
        if (evaluation.getPropertyProtection() != null &&
                (evaluation.getPropertyProtection() < 0 || evaluation.getPropertyProtection() > 1.0)) {
            throw new RuntimeException("Property protection score must be between 0 and 1.0");
        }
        if (evaluation.getWorkEnthusiasm() != null &&
                (evaluation.getWorkEnthusiasm() < 0 || evaluation.getWorkEnthusiasm() > 1.0)) {
            throw new RuntimeException("Work enthusiasm score must be between 0 and 1.0");
        }

        // Validate Part II scores
        if (evaluation.getJobRequirementsFulfillment() != null &&
                (evaluation.getJobRequirementsFulfillment() < 0 || evaluation.getJobRequirementsFulfillment() > 2.0)) {
            throw new RuntimeException("Job requirements fulfillment score must be between 0 and 2.0");
        }
        if (evaluation.getLearningSpirit() != null &&
                (evaluation.getLearningSpirit() < 0 || evaluation.getLearningSpirit() > 1.0)) {
            throw new RuntimeException("Learning spirit score must be between 0 and 1.0");
        }
        if (evaluation.getInitiativeCreativity() != null &&
                (evaluation.getInitiativeCreativity() < 0 || evaluation.getInitiativeCreativity() > 1.0)) {
            throw new RuntimeException("Initiative creativity score must be between 0 and 1.0");
        }

        // Validate overall score (0-10)
        if (evaluation.getOverallScore() != null &&
                (evaluation.getOverallScore() < 0 || evaluation.getOverallScore() > 10)) {
            throw new RuntimeException("Overall score must be between 0 and 10");
        }
    }

    // Keep existing method for backward compatibility
    public Evaluation createEvaluationEntity(Evaluation evaluation) {
        // Validate internship exists
        if (evaluation.getInternship() != null && evaluation.getInternship().getId() != null) {
            Optional<Internship> internshipOpt = internshipRepository.findById(evaluation.getInternship().getId());
            if (internshipOpt.isEmpty()) {
                throw new RuntimeException("Internship not found with id: " + evaluation.getInternship().getId());
            }
            evaluation.setInternship(internshipOpt.get());
        }

        // Validate score range
        if (evaluation.getScore() != null && (evaluation.getScore() < 0 || evaluation.getScore() > 10)) {
            throw new RuntimeException("Score must be between 0 and 10");
        }

        return evaluationRepository.save(evaluation);
    }

    public Evaluation updateEvaluation(Evaluation evaluation) {
        Optional<Evaluation> existingOpt = evaluationRepository.findById(evaluation.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Evaluation not found with id: " + evaluation.getId());
        }

        // Validate internship exists if being changed
        if (evaluation.getInternship() != null && evaluation.getInternship().getId() != null) {
            Optional<Internship> internshipOpt = internshipRepository.findById(evaluation.getInternship().getId());
            if (internshipOpt.isEmpty()) {
                throw new RuntimeException("Internship not found with id: " + evaluation.getInternship().getId());
            }
            evaluation.setInternship(internshipOpt.get());
        }

        // Validate score range
        if (evaluation.getScore() != null && (evaluation.getScore() < 0 || evaluation.getScore() > 10)) {
            throw new RuntimeException("Score must be between 0 and 10");
        }

        return evaluationRepository.save(evaluation);
    }

    public void deleteEvaluation(Long id) {
        if (!evaluationRepository.existsById(id)) {
            throw new RuntimeException("Evaluation not found with id: " + id);
        }
        evaluationRepository.deleteById(id);
    }

    public Double getAverageScoreByInternship(Long internshipId) {
        List<Evaluation> evaluations = evaluationRepository.findByInternshipId(internshipId);
        if (evaluations.isEmpty()) {
            return null;
        }

        double sum = evaluations.stream()
                .filter(e -> e.getScore() != null)
                .mapToDouble(Evaluation::getScore)
                .sum();
        long count = evaluations.stream()
                .filter(e -> e.getScore() != null)
                .count();

        return count > 0 ? sum / count : null;
    }

    public Double getAverageScoreByStudent(Long studentId) {
        List<Evaluation> evaluations = evaluationRepository.findByStudentId(studentId);
        if (evaluations.isEmpty()) {
            return null;
        }

        double sum = evaluations.stream()
                .filter(e -> e.getScore() != null)
                .mapToDouble(Evaluation::getScore)
                .sum();
        long count = evaluations.stream()
                .filter(e -> e.getScore() != null)
                .count();

        return count > 0 ? sum / count : null;
    }

    public long getTotalEvaluationCount() {
        return evaluationRepository.count();
    }

    public long getEvaluationCountByInternship(Long internshipId) {
        return evaluationRepository.findByInternshipId(internshipId).size();
    }

    public long getEvaluationCountByBatch(Long batchId) {
        return evaluationRepository.findByBatchId(batchId).size();
    }

    public Map<String, Object> getEvaluationStatisticsByTeacher(Long teacherId) {
        List<Evaluation> evaluations = evaluationRepository.findByTeacherId(teacherId);

        Map<String, Object> statistics = new HashMap<>();

        // Basic counts
        statistics.put("totalEvaluations", evaluations.size());

        // Filter evaluations with valid scores
        List<Evaluation> validEvaluations = evaluations.stream()
                .filter(e -> e.getOverallScore() != null && e.getOverallScore() > 0)
                .collect(Collectors.toList());

        // Average score
        double averageScore = validEvaluations.isEmpty() ? 0
                : validEvaluations.stream().mapToDouble(Evaluation::getOverallScore).average().orElse(0);
        statistics.put("averageScore", Math.round(averageScore * 100.0) / 100.0);

        // Score distribution
        Map<String, Long> scoreDistribution = new HashMap<>();
        scoreDistribution.put("excellent", validEvaluations.stream().filter(e -> e.getOverallScore() >= 9).count());
        scoreDistribution.put("good",
                validEvaluations.stream().filter(e -> e.getOverallScore() >= 7 && e.getOverallScore() < 9).count());
        scoreDistribution.put("average",
                validEvaluations.stream().filter(e -> e.getOverallScore() >= 5 && e.getOverallScore() < 7).count());
        scoreDistribution.put("poor", validEvaluations.stream().filter(e -> e.getOverallScore() < 5).count());
        statistics.put("scoreDistribution", scoreDistribution);

        // Completed vs pending evaluations
        long completedEvaluations = evaluations.stream()
                .filter(e -> e.getOverallScore() != null && e.getOverallScore() > 0).count();
        statistics.put("completedEvaluations", completedEvaluations);
        statistics.put("pendingEvaluations", evaluations.size() - completedEvaluations);

        // Recent evaluations (last 30 days - simplified)
        statistics.put("recentEvaluations", Math.min(evaluations.size(), 10));

        return statistics;
    }

    private String convertToString(Object obj) {
        if (obj == null) {
            return "";
        }
        if (obj instanceof String) {
            return (String) obj;
        }
        if (obj instanceof List) {
            List<?> list = (List<?>) obj;
            if (list.isEmpty()) {
                return "";
            }
            return list.stream()
                    .map(Object::toString)
                    .collect(java.util.stream.Collectors.joining(", "));
        }
        return obj.toString();
    }

    // Method for creating sample evaluation data for testing
    public void createSampleEvaluations(Long studentId) {
        // Find student's internships
        List<Internship> internships = internshipRepository.findByStudentId(studentId);
        if (internships.isEmpty()) {
            throw new RuntimeException("No internships found for student with id: " + studentId);
        }

        Internship internship = internships.get(0); // Use first internship

        // Create teacher evaluation
        Evaluation teacherEval = new Evaluation();
        teacherEval.setInternship(internship);
        teacherEval.setEvaluatorType(RoleType.TEACHER);
        if (internship.getTeacher() != null) {
            teacherEval.setEvaluator(internship.getTeacher().getUser());
        }
        teacherEval.setEvaluationDate(LocalDate.now().minusDays(5));
        teacherEval.setUnderstandingOrganization(0.9);
        teacherEval.setFollowingRules(0.8);
        teacherEval.setWorkScheduleCompliance(0.9);
        teacherEval.setCommunicationAttitude(0.9);
        teacherEval.setPropertyProtection(0.9);
        teacherEval.setWorkEnthusiasm(0.9);
        teacherEval.setJobRequirementsFulfillment(1.5);
        teacherEval.setLearningSpirit(0.9);
        teacherEval.setInitiativeCreativity(0.9);
        teacherEval.setDisciplineScore(5.7);
        teacherEval.setProfessionalScore(3.5);
        teacherEval.setOverallScore(9.2);
        teacherEval.setStrengths("Kỹ năng lập trình tốt, tiếp thu nhanh");
        teacherEval.setWeaknesses("Cần cải thiện kỹ năng giao tiếp");
        teacherEval.setRecommendations("Nên tham gia thêm các khóa học soft skill");
        teacherEval.setComments("Sinh viên có thái độ học tập tích cực");
        teacherEval.setIsFinalEvaluation(false);

        evaluationRepository.save(teacherEval);

        // Create mentor evaluation if mentor exists
        if (internship.getMentor() != null) {
            Evaluation mentorEval = new Evaluation();
            mentorEval.setInternship(internship);
            mentorEval.setEvaluatorType(RoleType.MENTOR);
            mentorEval.setEvaluator(internship.getMentor().getUser());
            mentorEval.setEvaluationDate(LocalDate.now().minusDays(3));
            mentorEval.setUnderstandingOrganization(0.8);
            mentorEval.setFollowingRules(0.7);
            mentorEval.setWorkScheduleCompliance(0.8);
            mentorEval.setCommunicationAttitude(0.8);
            mentorEval.setPropertyProtection(0.8);
            mentorEval.setWorkEnthusiasm(0.8);
            mentorEval.setJobRequirementsFulfillment(1.0);
            mentorEval.setLearningSpirit(0.8);
            mentorEval.setInitiativeCreativity(0.8);
            mentorEval.setDisciplineScore(5.2);
            mentorEval.setProfessionalScore(3.0);
            mentorEval.setOverallScore(8.0);
            mentorEval.setStrengths("Làm việc chăm chỉ, có trách nhiệm");
            mentorEval.setWeaknesses("Cần chủ động hơn trong việc đặt câu hỏi");
            mentorEval.setRecommendations("Nên tự tin hơn khi thảo luận ý tưởng");
            mentorEval.setComments("Thực tập sinh có thái độ làm việc tốt");
            mentorEval.setIsFinalEvaluation(false);

            evaluationRepository.save(mentorEval);
        }

        // Create final evaluation from teacher
        Evaluation finalEval = new Evaluation();
        finalEval.setInternship(internship);
        finalEval.setEvaluatorType(RoleType.TEACHER);
        if (internship.getTeacher() != null) {
            finalEval.setEvaluator(internship.getTeacher().getUser());
        }
        finalEval.setEvaluationDate(LocalDate.now().minusDays(1));
        finalEval.setUnderstandingOrganization(0.95);
        finalEval.setFollowingRules(0.9);
        finalEval.setWorkScheduleCompliance(0.95);
        finalEval.setCommunicationAttitude(0.95);
        finalEval.setPropertyProtection(0.95);
        finalEval.setWorkEnthusiasm(0.95);
        finalEval.setJobRequirementsFulfillment(1.8);
        finalEval.setLearningSpirit(0.95);
        finalEval.setInitiativeCreativity(0.95);
        finalEval.setDisciplineScore(6.0);
        finalEval.setProfessionalScore(4.0);
        finalEval.setOverallScore(9.5);
        finalEval.setStrengths("Đã cải thiện đáng kể các kỹ năng, hoàn thành tốt dự án");
        finalEval.setWeaknesses("Vẫn cần luyện tập thêm kỹ năng thuyết trình");
        finalEval.setRecommendations("Tiếp tục phát triển để trở thành developer giỏi");
        finalEval.setComments("Kết quả thực tập rất tốt, đạt yêu cầu");
        finalEval.setIsFinalEvaluation(true);

        evaluationRepository.save(finalEval);
    }
}