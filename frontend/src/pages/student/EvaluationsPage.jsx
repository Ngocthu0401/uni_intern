import React, { useState, useEffect } from 'react';
import { 
  StarIcon, 
  EyeIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { evaluationService, internshipService, studentService, apiHelpers } from '../../services';
import { useAuth } from '../../context/AuthContext';

const EvaluationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [currentInternship, setCurrentInternship] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, teacher, mentor
  
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user?.id) {
      loadData();
    }
  }, [authLoading, user?.id]);

  const loadData = async () => {
    if (!user?.id) {
      setError('Không thể lấy thông tin người dùng');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First get student record from user ID
      const studentData = await studentService.getStudentByUserId(user.id);
      
      // Get current internship using student ID
      const internshipsResponse = await internshipService.getInternshipsByStudent(studentData.id);
      const activeInternship = internshipsResponse.find(i => 
        i.status === 'ACTIVE' || i.status === 'IN_PROGRESS' || i.status === 'COMPLETED'
      );
      
      if (activeInternship) {
        setCurrentInternship(activeInternship);
      }
      
      // Load all evaluations for this student
      try {
        const evaluationsResponse = await evaluationService.getEvaluationsByStudent(studentData.id);
          console.log('Evaluations Response:', evaluationsResponse);
          
          const processedEvaluations = evaluationsResponse.map(evaluation => {
            // Calculate overall score from individual scores
            const totalScore = (evaluation.technicalScore || 0) + 
                             (evaluation.softSkillScore || 0) + 
                             (evaluation.attitudeScore || 0) + 
                             (evaluation.communicationScore || 0);
            const avgScore = totalScore / 4;
            
            return {
              id: evaluation.id,
              evaluatorType: evaluation.evaluatorType,
              evaluatorName: evaluation.evaluator?.fullName || evaluation.evaluator?.username || 'N/A',
              score: evaluation.overallScore || avgScore,
              maxScore: 10,
              feedback: evaluation.comments || '',
              technicalScore: evaluation.technicalScore || 0,
              softSkillScore: evaluation.softSkillScore || 0,
              attitudeScore: evaluation.attitudeScore || 0,
              communicationScore: evaluation.communicationScore || 0,
              evaluationDate: evaluation.evaluationDate ? new Date(evaluation.evaluationDate).toLocaleDateString('vi-VN') : 'N/A',
              period: evaluation.isFinalEvaluation ? 'Đánh giá cuối kỳ' : 'Đánh giá giữa kỳ',
              strengths: evaluation.strengths || '',
              weaknesses: evaluation.weaknesses || '',
              recommendations: evaluation.recommendations || '',
              isFinalEvaluation: evaluation.isFinalEvaluation || false
            };
          });
          
        setEvaluations(processedEvaluations);
      } catch (evaluationError) {
        console.log('No evaluations found:', evaluationError);
        setEvaluations([]);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError(apiHelpers.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getEvaluatorIcon = (type) => {
    switch (type) {
      case 'TEACHER':
        return <AcademicCapIcon className="h-5 w-5 text-blue-600" />;
      case 'MENTOR':
        return <BuildingOfficeIcon className="h-5 w-5 text-green-600" />;
      case 'SELF':
        return <UserIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <UserIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEvaluatorTypeName = (type) => {
    const typeMap = {
      'TEACHER': 'Giảng viên',
      'MENTOR': 'Mentor công ty',
      'SELF': 'Tự đánh giá',
      'ADMIN': 'Bộ môn'
    };
    return typeMap[type] || type;
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 85) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-blue-100 text-blue-800';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const renderStars = (score, maxScore) => {
    const rating = (score / maxScore) * 5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <div key={i} className="relative">
          {i <= rating ? (
            <StarIconSolid className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon className="h-4 w-4 text-gray-300" />
          )}
        </div>
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    if (filter === 'all') return true;
    if (filter === 'teacher') return evaluation.evaluatorType === 'TEACHER';
    if (filter === 'mentor') return evaluation.evaluatorType === 'MENTOR';
    return true;
  });

  const calculateAverageScore = () => {
    if (evaluations.length === 0) return 0;
    const totalScore = evaluations.reduce((sum, evaluation) => {
      return sum + (evaluation.score / evaluation.maxScore) * 10;
    }, 0);
    return (totalScore / evaluations.length).toFixed(1);
  };

  const createSampleData = async () => {
    try {
      if (!user?.id) {
        setError('Không thể lấy thông tin người dùng');
        return;
      }

      // Get student data first
      const studentData = await studentService.getStudentByUserId(user.id);
      
      // Call API to create sample evaluations
      const response = await fetch(`http://localhost:8080/api/evaluations/test/create-sample/${studentData.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Reload data
        loadData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Không thể tạo dữ liệu mẫu');
      }
    } catch (err) {
      console.error('Error creating sample data:', err);
      setError('Lỗi khi tạo dữ liệu mẫu');
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đánh giá...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    totalEvaluations: evaluations.length,
    teacherEvaluations: evaluations.filter(e => e.evaluatorType === 'TEACHER').length,
    mentorEvaluations: evaluations.filter(e => e.evaluatorType === 'MENTOR').length,
    averageScore: calculateAverageScore()
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Đánh giá thực tập</h1>
              <p className="mt-2 text-gray-600">Xem đánh giá từ giảng viên và mentor công ty</p>
            </div>
            {evaluations.length === 0 && (
              <button
                onClick={createSampleData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tạo dữ liệu mẫu
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Điểm trung bình</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageScore}/10</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalEvaluations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Từ giảng viên</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.teacherEvaluations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Từ mentor</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.mentorEvaluations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setFilter('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tất cả đánh giá
              </button>
              <button
                onClick={() => setFilter('teacher')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === 'teacher'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Từ giảng viên
              </button>
              <button
                onClick={() => setFilter('mentor')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === 'mentor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Từ mentor
              </button>
            </nav>
          </div>
        </div>

        {/* Evaluations List */}
        {filteredEvaluations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đánh giá nào</h3>
            <p className="text-gray-600 mb-4">Chưa có đánh giá nào cho thực tập của bạn.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getEvaluatorIcon(evaluation.evaluatorType)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đánh giá từ {getEvaluatorTypeName(evaluation.evaluatorType)}
                      </h3>
                      <p className="text-sm text-gray-600">{evaluation.evaluatorName} • {evaluation.evaluationDate}</p>
                      <p className="text-xs text-gray-500">{evaluation.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className={`text-2xl font-bold ${getScoreColor(evaluation.score, evaluation.maxScore)}`}>
                          {evaluation.score}/{evaluation.maxScore}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(evaluation.score, evaluation.maxScore)}`}>
                          {((evaluation.score / evaluation.maxScore) * 100).toFixed(0)}%
                        </span>
                      </div>
                      {renderStars(evaluation.score, evaluation.maxScore)}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEvaluation(evaluation);
                        setShowDetailModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {evaluation.feedback && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Nhận xét tổng quan</h4>
                    <p className="text-sm text-gray-700">{evaluation.feedback}</p>
                  </div>
                )}

                {/* Score breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluation.technicalScore > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Kỹ năng chuyên môn</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-900">{evaluation.technicalScore}/10</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${(evaluation.technicalScore / 10) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {evaluation.softSkillScore > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Kỹ năng mềm</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-900">{evaluation.softSkillScore}/10</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{width: `${(evaluation.softSkillScore / 10) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {evaluation.attitudeScore > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Thái độ làm việc</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-900">{evaluation.attitudeScore}/10</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{width: `${(evaluation.attitudeScore / 10) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {evaluation.communicationScore > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Kỹ năng giao tiếp</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-900">{evaluation.communicationScore}/10</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{width: `${(evaluation.communicationScore / 10) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Evaluation Detail Modal */}
        {showDetailModal && selectedEvaluation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Chi tiết đánh giá</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ExclamationTriangleIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                {/* Header Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      {getEvaluatorIcon(selectedEvaluation.evaluatorType)}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getEvaluatorTypeName(selectedEvaluation.evaluatorType)}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedEvaluation.evaluatorName}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Thời gian:</span> {selectedEvaluation.evaluationDate}</p>
                      <p><span className="font-medium">Giai đoạn:</span> {selectedEvaluation.period}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {selectedEvaluation.score}/{selectedEvaluation.maxScore}
                    </div>
                    {renderStars(selectedEvaluation.score, selectedEvaluation.maxScore)}
                    <p className="text-sm text-gray-600 mt-2">
                      {((selectedEvaluation.score / selectedEvaluation.maxScore) * 100).toFixed(0)}% điểm
                    </p>
                  </div>
                </div>

                {/* Detailed Score Breakdown */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Chi tiết điểm số</h4>
                  <div className="space-y-3">
                    {selectedEvaluation.technicalScore > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Kỹ năng chuyên môn</h5>
                          <p className="text-sm text-gray-600 mt-1">Đánh giá khả năng kỹ thuật và chuyên môn</p>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <span className="text-lg font-semibold text-gray-900">{selectedEvaluation.technicalScore}/10</span>
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full" 
                              style={{width: `${(selectedEvaluation.technicalScore / 10) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedEvaluation.softSkillScore > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Kỹ năng mềm</h5>
                          <p className="text-sm text-gray-600 mt-1">Đánh giá kỹ năng làm việc nhóm, sáng tạo</p>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <span className="text-lg font-semibold text-gray-900">{selectedEvaluation.softSkillScore}/10</span>
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-600 h-3 rounded-full" 
                              style={{width: `${(selectedEvaluation.softSkillScore / 10) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedEvaluation.attitudeScore > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Thái độ làm việc</h5>
                          <p className="text-sm text-gray-600 mt-1">Đánh giá tinh thần, trách nhiệm trong công việc</p>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <span className="text-lg font-semibold text-gray-900">{selectedEvaluation.attitudeScore}/10</span>
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-purple-600 h-3 rounded-full" 
                              style={{width: `${(selectedEvaluation.attitudeScore / 10) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedEvaluation.communicationScore > 0 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Kỹ năng giao tiếp</h5>
                          <p className="text-sm text-gray-600 mt-1">Đánh giá khả năng trình bày, giao tiếp</p>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <span className="text-lg font-semibold text-gray-900">{selectedEvaluation.communicationScore}/10</span>
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-orange-600 h-3 rounded-full" 
                              style={{width: `${(selectedEvaluation.communicationScore / 10) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback Sections */}
                <div className="space-y-6">
                  {selectedEvaluation.feedback && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Nhận xét tổng quan</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">{selectedEvaluation.feedback}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvaluation.strengths && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Điểm mạnh</h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800">{selectedEvaluation.strengths}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvaluation.weaknesses && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Điểm cần cải thiện</h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">{selectedEvaluation.weaknesses}</p>
                      </div>
                    </div>
                  )}

                  {selectedEvaluation.recommendations && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Khuyến nghị</h4>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-purple-800">{selectedEvaluation.recommendations}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationsPage;