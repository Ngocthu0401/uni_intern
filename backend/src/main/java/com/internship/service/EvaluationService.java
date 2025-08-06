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
        
        // Map scores from detailed frontend fields to simplified backend fields
        evaluation.setTechnicalScore(request.getTechnicalSkills());
        evaluation.setSoftSkillScore(request.getSoftSkills());
        evaluation.setAttitudeScore(request.getWorkAttitude());
        evaluation.setCommunicationScore(request.getCommunication());
        evaluation.setOverallScore(request.getTotalScore());
        
        // Set text fields
        evaluation.setStrengths(convertToString(request.getStrengths()));
        evaluation.setWeaknesses(convertToString(request.getWeaknesses()));
        evaluation.setRecommendations(request.getRecommendations());
        evaluation.setComments(request.getComments());
        evaluation.setIsFinalEvaluation(request.getIsFinalEvaluation());
        
        // Validate score range
        if (evaluation.getOverallScore() != null && (evaluation.getOverallScore() < 0 || evaluation.getOverallScore() > 100)) {
            throw new RuntimeException("Overall score must be between 0 and 100");
        }
        
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
        
        // Map scores from detailed frontend fields to simplified backend fields
        if (request.getTechnicalSkills() != null) {
            evaluation.setTechnicalScore(request.getTechnicalSkills());
        }
        if (request.getSoftSkills() != null) {
            evaluation.setSoftSkillScore(request.getSoftSkills());
        }
        if (request.getWorkAttitude() != null) {
            evaluation.setAttitudeScore(request.getWorkAttitude());
        }
        if (request.getCommunication() != null) {
            evaluation.setCommunicationScore(request.getCommunication());
        }
        if (request.getTotalScore() != null) {
            evaluation.setOverallScore(request.getTotalScore());
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
        
        // Validate score range
        if (evaluation.getOverallScore() != null && (evaluation.getOverallScore() < 0 || evaluation.getOverallScore() > 100)) {
            throw new RuntimeException("Overall score must be between 0 and 100");
        }
        
        return evaluationRepository.save(evaluation);
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
        double averageScore = validEvaluations.isEmpty() ? 0 : 
            validEvaluations.stream().mapToDouble(Evaluation::getOverallScore).average().orElse(0);
        statistics.put("averageScore", Math.round(averageScore * 100.0) / 100.0);
        
        // Score distribution
        Map<String, Long> scoreDistribution = new HashMap<>();
        scoreDistribution.put("excellent", validEvaluations.stream().filter(e -> e.getOverallScore() >= 9).count());
        scoreDistribution.put("good", validEvaluations.stream().filter(e -> e.getOverallScore() >= 7 && e.getOverallScore() < 9).count());
        scoreDistribution.put("average", validEvaluations.stream().filter(e -> e.getOverallScore() >= 5 && e.getOverallScore() < 7).count());
        scoreDistribution.put("poor", validEvaluations.stream().filter(e -> e.getOverallScore() < 5).count());
        statistics.put("scoreDistribution", scoreDistribution);
        
        // Completed vs pending evaluations
        long completedEvaluations = evaluations.stream().filter(e -> e.getOverallScore() != null && e.getOverallScore() > 0).count();
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
        teacherEval.setTechnicalScore(8.5);
        teacherEval.setSoftSkillScore(8.0);
        teacherEval.setAttitudeScore(9.0);
        teacherEval.setCommunicationScore(7.5);
        teacherEval.setOverallScore(8.25);
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
            mentorEval.setTechnicalScore(8.0);
            mentorEval.setSoftSkillScore(8.5);
            mentorEval.setAttitudeScore(8.5);
            mentorEval.setCommunicationScore(8.0);
            mentorEval.setOverallScore(8.25);
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
        finalEval.setTechnicalScore(8.8);
        finalEval.setSoftSkillScore(8.2);
        finalEval.setAttitudeScore(9.2);
        finalEval.setCommunicationScore(8.0);
        finalEval.setOverallScore(8.55);
        finalEval.setStrengths("Đã cải thiện đáng kể các kỹ năng, hoàn thành tốt dự án");
        finalEval.setWeaknesses("Vẫn cần luyện tập thêm kỹ năng thuyết trình");
        finalEval.setRecommendations("Tiếp tục phát triển để trở thành developer giỏi");
        finalEval.setComments("Kết quả thực tập rất tốt, đạt yêu cầu");
        finalEval.setIsFinalEvaluation(true);
        
        evaluationRepository.save(finalEval);
    }
} 