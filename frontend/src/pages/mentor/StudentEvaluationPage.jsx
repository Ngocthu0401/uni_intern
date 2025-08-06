import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  StarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { internshipService, evaluationService } from '../../services';
import mentorService from '../../services/mentorService';

const StudentEvaluationPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [evaluationForm, setEvaluationForm] = useState({
    technicalScore: 8,
    softSkillScore: 8,
    attitudeScore: 8,
    communicationScore: 8,
    comments: '',
    strengths: '',
    weaknesses: '',
    recommendations: '',
    isFinalEvaluation: false
  });

  // Quick score form for internship direct scoring
  const [showQuickScoreModal, setShowQuickScoreModal] = useState(false);
  const [quickScoreForm, setQuickScoreForm] = useState({
    mentorScore: '',
    mentorComment: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadStudentsData();
    }
  }, [user]);

  const loadStudentsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get mentor information first
      const mentorResponse = await mentorService.getMentorByUserId(user.id);
      const mentorId = mentorResponse.id;

      // Load internships for this mentor
      const internshipsResponse = await internshipService.getInternshipsByMentor(mentorId);
      const internships = internshipsResponse || [];

      // Load evaluations for this mentor
      const evaluationsResponse = await evaluationService.getEvaluationsByMentor(mentorId);
      const evaluations = evaluationsResponse || [];

      // Transform data to students with evaluation history
      const studentsData = internships.map(internship => {
        const studentEvaluations = evaluations.filter(evaluation => 
          evaluation.internship?.id === internship.id
        );

        // Calculate average score
        const avgScore = studentEvaluations.length > 0
          ? studentEvaluations.reduce((sum, evaluation) => sum + (evaluation.overallScore || 0), 0) / studentEvaluations.length
          : 0;

        return {
          id: internship.student?.id || internship.studentId,
          name: internship.student?.user?.fullName || internship.student?.fullName || 'N/A',
          studentCode: internship.student?.studentCode || 'N/A',
          email: internship.student?.user?.email || 'N/A',
          company: internship.company?.companyName || 'N/A',
          position: internship.jobTitle || 'N/A',
          startDate: internship.startDate,
          endDate: internship.endDate,
          status: internship.status,
          internshipId: internship.id,
          mentorScore: internship.mentorScore,
          mentorComment: internship.mentorComment,
          evaluations: studentEvaluations.map(evaluation => ({
            id: evaluation.id,
            date: evaluation.evaluationDate,
            technicalScore: evaluation.technicalScore || 0,
            softSkillScore: evaluation.softSkillScore || 0,
            attitudeScore: evaluation.attitudeScore || 0,
            communicationScore: evaluation.communicationScore || 0,
            overallScore: evaluation.overallScore || 0,
            comments: evaluation.comments || '',
            strengths: evaluation.strengths || '',
            weaknesses: evaluation.weaknesses || '',
            recommendations: evaluation.recommendations || '',
            isFinalEvaluation: evaluation.isFinalEvaluation || false
          })).sort((a, b) => new Date(b.date) - new Date(a.date)),
          averageScore: avgScore,
          lastEvaluationDate: studentEvaluations.length > 0 
            ? new Date(Math.max(...studentEvaluations.map(e => new Date(e.evaluationDate)))).toLocaleDateString('vi-VN')
            : 'Chưa có đánh giá'
        };
      });

      setStudents(studentsData);
    } catch (err) {
      console.error('Error loading students data:', err);
      setError('Không thể tải dữ liệu sinh viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvaluation = async () => {
    if (!selectedStudent) return;

    try {
      // Calculate overall score
      const overallScore = (
        evaluationForm.technicalScore + 
        evaluationForm.softSkillScore + 
        evaluationForm.attitudeScore + 
        evaluationForm.communicationScore
      ) / 4;

      const evaluationData = {
        internshipId: selectedStudent.internshipId.toString(),
        teacherId: null, // Mentor evaluation, not teacher
        technicalSkills: evaluationForm.technicalScore,
        softSkills: evaluationForm.softSkillScore,
        workAttitude: evaluationForm.attitudeScore,
        communication: evaluationForm.communicationScore,
        totalScore: overallScore,
        strengths: [evaluationForm.strengths],
        weaknesses: [evaluationForm.weaknesses],
        recommendations: evaluationForm.recommendations,
        comments: evaluationForm.comments,
        isFinalEvaluation: evaluationForm.isFinalEvaluation
      };

      await evaluationService.createEvaluation(evaluationData);

      // Reload data and close modal
      await loadStudentsData();
      setShowEvaluationModal(false);
      setSelectedStudent(null);
      setEvaluationForm({
        technicalScore: 8,
        softSkillScore: 8,
        attitudeScore: 8,
        communicationScore: 8,
        comments: '',
        strengths: '',
        weaknesses: '',
        recommendations: '',
        isFinalEvaluation: false
      });

    } catch (err) {
      console.error('Error creating evaluation:', err);
      setError('Không thể tạo đánh giá. Vui lòng thử lại.');
    }
  };

  const handleQuickScore = async () => {
    if (!selectedStudent) return;

    try {
      const updatePayload = {
        mentorScore: quickScoreForm.mentorScore ? parseFloat(quickScoreForm.mentorScore) : null,
        mentorComment: quickScoreForm.mentorComment || null
      };

      await internshipService.patchInternship(selectedStudent.internshipId, updatePayload);

      // Reload data and close modal
      await loadStudentsData();
      setShowQuickScoreModal(false);
      setSelectedStudent(null);
      setQuickScoreForm({
        mentorScore: '',
        mentorComment: ''
      });

    } catch (err) {
      console.error('Error updating mentor score:', err);
      setError('Không thể cập nhật điểm. Vui lòng thử lại.');
    }
  };

  const openQuickScoreModal = (student) => {
    setSelectedStudent(student);
    // Pre-fill with existing scores if available
    setQuickScoreForm({
      mentorScore: student.mentorScore || '',
      mentorComment: student.mentorComment || ''
    });
    setShowQuickScoreModal(true);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return 'Đang thực tập';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'PENDING':
        return 'Chờ duyệt';
      default:
        return status;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (score, onChange = null, readonly = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(star)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            {star <= score ? (
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">{score}/10</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu sinh viên...</p>
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
            onClick={loadStudentsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Đánh Giá Sinh Viên</h1>
              <p className="mt-1 text-sm text-gray-500">Quản lý và đánh giá tiến độ học tập của sinh viên thực tập</p>
            </div>
            <button
              onClick={() => setShowEvaluationModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tạo đánh giá mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang thực tập</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="PENDING">Chờ duyệt</option>
          </select>
        </div>

        {/* Students List */}
        <div className="space-y-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <div key={student.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* Student Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.studentCode} • {student.email}</p>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          {student.company}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(student.startDate).toLocaleDateString('vi-VN')} - {new Date(student.endDate).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {getStatusText(student.status)}
                    </span>
                    <div className="mt-2">
                      <span className={`text-2xl font-bold ${getScoreColor(student.averageScore)}`}>
                        {student.averageScore > 0 ? student.averageScore.toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">/10</span>
                    </div>
                    <p className="text-xs text-gray-500">Điểm trung bình</p>
                  </div>
                </div>

                {/* Latest Evaluation */}
                {student.evaluations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <AcademicCapIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Kỹ năng kỹ thuật</p>
                      <p className={`text-lg font-bold ${getScoreColor(student.evaluations[0].technicalScore)}`}>
                        {student.evaluations[0].technicalScore}/10
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <UserIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Kỹ năng mềm</p>
                      <p className={`text-lg font-bold ${getScoreColor(student.evaluations[0].softSkillScore)}`}>
                        {student.evaluations[0].softSkillScore}/10
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <CheckCircleIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Thái độ làm việc</p>
                      <p className={`text-lg font-bold ${getScoreColor(student.evaluations[0].attitudeScore)}`}>
                        {student.evaluations[0].attitudeScore}/10
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <ChartBarIcon className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Giao tiếp</p>
                      <p className={`text-lg font-bold ${getScoreColor(student.evaluations[0].communicationScore)}`}>
                        {student.evaluations[0].communicationScore}/10
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg mb-6">
                    <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có đánh giá nào cho sinh viên này</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{student.evaluations.length}</span> đánh giá 
                    {student.evaluations.length > 0 && (
                      <span> • Lần cuối: {student.lastEvaluationDate}</span>
                    )}
                    {student.mentorScore && (
                      <div className="mt-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Điểm mentor: {student.mentorScore}/10
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowEvaluationModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <PencilSquareIcon className="h-4 w-4 mr-1" />
                        Đánh giá chi tiết
                      </button>
                      <button
                        onClick={() => openQuickScoreModal(student)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <StarIcon className="h-4 w-4 mr-1" />
                        Chấm điểm
                      </button>
                    </div>
                  </div>
                </div>

                {/* Evaluation History */}
                {student.evaluations.length > 1 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Lịch sử đánh giá</h4>
                    <div className="space-y-2">
                      {student.evaluations.slice(1, 4).map(evaluation => (
                        <div key={evaluation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(evaluation.date).toLocaleDateString('vi-VN')}
                            </p>
                            {evaluation.isFinalEvaluation && (
                              <span className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                Đánh giá cuối kỳ
                              </span>
                            )}
                          </div>
                          <div className={`text-lg font-bold ${getScoreColor(evaluation.overallScore)}`}>
                            {evaluation.overallScore.toFixed(1)}/10
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy sinh viên nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Modal */}
      {showEvaluationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Tạo đánh giá mới</h2>
              {selectedStudent && (
                <p className="text-sm text-gray-600 mt-1">
                  Đánh giá cho: <span className="font-medium">{selectedStudent.name}</span>
                </p>
              )}
            </div>
            
            <div className="p-6 space-y-6">
              {!selectedStudent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn sinh viên
                  </label>
                  <select
                    value={selectedStudent?.id || ''}
                    onChange={(e) => {
                      const student = students.find(s => s.id === parseInt(e.target.value));
                      setSelectedStudent(student);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn sinh viên...</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.studentCode}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedStudent && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kỹ năng kỹ thuật
                    </label>
                    {renderStars(evaluationForm.technicalScore, (score) => 
                      setEvaluationForm(prev => ({ ...prev, technicalScore: score }))
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kỹ năng mềm
                    </label>
                    {renderStars(evaluationForm.softSkillScore, (score) => 
                      setEvaluationForm(prev => ({ ...prev, softSkillScore: score }))
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thái độ làm việc
                    </label>
                    {renderStars(evaluationForm.attitudeScore, (score) => 
                      setEvaluationForm(prev => ({ ...prev, attitudeScore: score }))
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kỹ năng giao tiếp
                    </label>
                    {renderStars(evaluationForm.communicationScore, (score) => 
                      setEvaluationForm(prev => ({ ...prev, communicationScore: score }))
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm mạnh
                    </label>
                    <textarea
                      value={evaluationForm.strengths}
                      onChange={(e) => setEvaluationForm(prev => ({ ...prev, strengths: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Mô tả điểm mạnh của sinh viên..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm cần cải thiện
                    </label>
                    <textarea
                      value={evaluationForm.weaknesses}
                      onChange={(e) => setEvaluationForm(prev => ({ ...prev, weaknesses: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Mô tả điểm cần cải thiện..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khuyến nghị
                    </label>
                    <textarea
                      value={evaluationForm.recommendations}
                      onChange={(e) => setEvaluationForm(prev => ({ ...prev, recommendations: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Đưa ra khuyến nghị cho sinh viên..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhận xét tổng quan
                    </label>
                    <textarea
                      value={evaluationForm.comments}
                      onChange={(e) => setEvaluationForm(prev => ({ ...prev, comments: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhận xét chi tiết về sinh viên..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFinalEvaluation"
                      checked={evaluationForm.isFinalEvaluation}
                      onChange={(e) => setEvaluationForm(prev => ({ ...prev, isFinalEvaluation: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFinalEvaluation" className="ml-2 block text-sm text-gray-900">
                      Đây là đánh giá cuối kỳ
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEvaluationModal(false);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateEvaluation}
                disabled={!selectedStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lưu đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Score Modal */}
      {showQuickScoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Chấm điểm sinh viên</h2>
              {selectedStudent && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedStudent.name} - {selectedStudent.studentCode}
                </p>
              )}
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm mentor (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={quickScoreForm.mentorScore}
                  onChange={(e) => setQuickScoreForm(prev => ({ ...prev, mentorScore: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nhập điểm từ 0 đến 10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhận xét
                </label>
                <textarea
                  rows={3}
                  value={quickScoreForm.mentorComment}
                  onChange={(e) => setQuickScoreForm(prev => ({ ...prev, mentorComment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nhập nhận xét về quá trình thực tập..."
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowQuickScoreModal(false);
                  setSelectedStudent(null);
                  setQuickScoreForm({ mentorScore: '', mentorComment: '' });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleQuickScore}
                disabled={!quickScoreForm.mentorScore}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lưu điểm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEvaluationPage;