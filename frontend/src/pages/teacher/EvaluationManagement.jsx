import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  evaluationService, 
  studentService, 
  teacherService,
  internshipService 
} from '../../services';
import {
  StarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  DocumentTextIcon,
  ChartBarSquareIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { 
  Evaluation, 
  Student, 
  Internship,
  PaginationOptions 
} from '../../models';

const EvaluationManagement = () => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [students, setStudents] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  
  // Search and filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    studentId: '',
    internshipId: '',
    evaluationType: 'MIDTERM',
    semester: '',
    academicYear: '',
    technicalSkills: 0,
    softSkills: 0,
    workAttitude: 0,
    learningAbility: 0,
    teamwork: 0,
    communication: 0,
    problemSolving: 0,
    creativity: 0,
    punctuality: 0,
    responsibility: 0,
    overallPerformance: 0,
    strengths: '',
    weaknesses: '',
    recommendations: '',
    comments: '',
    totalScore: 0
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Statistics
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
    averageScore: 0,
    evaluationsByType: {}
  });
  
  // Pagination
  const [pagination, setPagination] = useState(new PaginationOptions({ size: 10 }));
  const [totalEvaluations, setTotalEvaluations] = useState(0);

  useEffect(() => {
    loadEvaluationData();
  }, [user, searchKeyword, statusFilter, semesterFilter, pagination]);

  const loadEvaluationData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError('');
      
      // First get teacher by user ID
      let teacherId;
      try {
        const teacherResponse = await teacherService.getTeacherByUserId(user.id);
        teacherId = teacherResponse.id;
      } catch (err) {
        console.error('Error getting teacher:', err);
        setError('Không tìm thấy thông tin giảng viên. Vui lòng liên hệ quản trị viên.');
        return;
      }
      
      // Load evaluations by teacher
      const evaluationsResponse = await evaluationService.getEvaluationsByTeacher(
        teacherId,
        {
          keyword: searchKeyword,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          semester: semesterFilter !== 'ALL' ? semesterFilter : undefined,
          page: pagination.page,
          size: pagination.size
        }
      );
      
      setEvaluations(evaluationsResponse.data.map(evaluation => ({
        ...evaluation,
        // Map backend fields to frontend fields for compatibility
        evaluationType: evaluation.isFinalEvaluation ? 'FINAL' : 'MIDTERM',
        totalScore: evaluation.overallScore || 0,
        student: evaluation.internship?.student,
        company: evaluation.internship?.company
      })));
      setTotalEvaluations(evaluationsResponse.total);
      
      // Load students for evaluation
      const studentsResponse = await studentService.getStudentsByTeacher(teacherId);
      setStudents(studentsResponse.data.map(student => new Student(student)));
      
      // Load internships for evaluation
      const internshipsResponse = await internshipService.getInternshipsByTeacher(teacherId);
      setInternships(internshipsResponse.map(internship => new Internship(internship)));
      
      // Load statistics
      const statsResponse = await evaluationService.getEvaluationStats(teacherId);
      setStats(statsResponse.data);
      
    } catch (err) {
      console.error('Error loading evaluation data:', err);
      setError('Không thể tải dữ liệu đánh giá. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalScore = (scores) => {
    const {
      technicalSkills, softSkills, workAttitude, learningAbility,
      teamwork, communication, problemSolving, creativity,
      punctuality, responsibility, overallPerformance
    } = scores;
    
    // Weighted average calculation
    const weightedTotal = (
      (technicalSkills * 0.20) +
      (softSkills * 0.15) +
      (workAttitude * 0.15) +
      (learningAbility * 0.10) +
      (teamwork * 0.10) +
      (communication * 0.10) +
      (problemSolving * 0.10) +
      (creativity * 0.05) +
      (punctuality * 0.05) +
      (responsibility * 0.10) +
      (overallPerformance * 0.10)
    );
    
    return Math.round(weightedTotal);
  };

  const handleScoreChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    const newFormData = { ...formData, [field]: numValue };
    
    // Recalculate total score
    newFormData.totalScore = calculateTotalScore(newFormData);
    
    setFormData(newFormData);
    
    // Clear error
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const openModal = (mode, evaluation = null) => {
    setModalMode(mode);
    setSelectedEvaluation(evaluation);
    
    if (mode === 'create') {
      setFormData({
        studentId: '',
        internshipId: '',
        evaluationType: 'MIDTERM',
        semester: '',
        academicYear: '',
        technicalSkills: 0,
        softSkills: 0,
        workAttitude: 0,
        learningAbility: 0,
        teamwork: 0,
        communication: 0,
        problemSolving: 0,
        creativity: 0,
        punctuality: 0,
        responsibility: 0,
        overallPerformance: 0,
        strengths: '',
        weaknesses: '',
        recommendations: '',
        comments: '',
        totalScore: 0
      });
    } else if (mode === 'edit' && evaluation) {
      setFormData({
        studentId: evaluation.internship?.student?.id || '',
        internshipId: evaluation.internship?.id || '',
        evaluationType: evaluation.isFinalEvaluation ? 'FINAL' : 'MIDTERM',
        semester: '',
        academicYear: '',
        technicalSkills: evaluation.technicalScore || 0,
        softSkills: evaluation.softSkillScore || 0,
        workAttitude: evaluation.attitudeScore || 0,
        learningAbility: 0,
        teamwork: 0,
        communication: evaluation.communicationScore || 0,
        problemSolving: 0,
        creativity: 0,
        punctuality: 0,
        responsibility: 0,
        overallPerformance: 0,
        strengths: evaluation.strengths || '',
        weaknesses: evaluation.weaknesses || '',
        recommendations: evaluation.recommendations || '',
        comments: evaluation.comments || '',
        totalScore: evaluation.overallScore || 0
      });
    }
    
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvaluation(null);
    setFormData({
      studentId: '',
      internshipId: '',
      evaluationType: 'MIDTERM',
      semester: '',
      academicYear: '',
      technicalSkills: 0,
      softSkills: 0,
      workAttitude: 0,
      learningAbility: 0,
      teamwork: 0,
      communication: 0,
      problemSolving: 0,
      creativity: 0,
      punctuality: 0,
      responsibility: 0,
      overallPerformance: 0,
      strengths: '',
      weaknesses: '',
      recommendations: '',
      comments: '',
      totalScore: 0
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.studentId) {
      errors.studentId = 'Vui lòng chọn sinh viên';
    }
    
    if (!formData.internshipId) {
      errors.internshipId = 'Vui lòng chọn thực tập';
    }
    
    if (!formData.evaluationType) {
      errors.evaluationType = 'Vui lòng chọn loại đánh giá';
    }
    
    if (!formData.semester) {
      errors.semester = 'Vui lòng nhập học kỳ';
    }
    
    if (!formData.academicYear) {
      errors.academicYear = 'Vui lòng nhập năm học';
    }
    
    // Validate scores (0-100)
    const scoreFields = [
      'technicalSkills', 'softSkills', 'workAttitude', 'learningAbility',
      'teamwork', 'communication', 'problemSolving', 'creativity',
      'punctuality', 'responsibility', 'overallPerformance'
    ];
    
    scoreFields.forEach(field => {
      const value = formData[field];
      if (value < 0 || value > 100) {
        errors[field] = 'Điểm số phải từ 0 đến 100';
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Get teacher ID first
      const teacherResponse = await teacherService.getTeacherByUserId(user.id);
      const teacherId = teacherResponse.id;
      
      const evaluationData = {
        ...formData,
        teacherId: teacherId,
        totalScore: calculateTotalScore(formData)
      };
      
      if (modalMode === 'create') {
        await evaluationService.createEvaluation(evaluationData);
      } else if (modalMode === 'edit') {
        await evaluationService.updateEvaluation(selectedEvaluation.id, evaluationData);
      }
      
      closeModal();
      loadEvaluationData();
    } catch (err) {
      console.error('Error saving evaluation:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi lưu đánh giá.' });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đánh giá</h1>
          <p className="text-gray-600">Tạo và quản lý đánh giá cho sinh viên thực tập</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tạo đánh giá mới</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalEvaluations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ đánh giá</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingEvaluations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedEvaluations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarSquareIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Điểm TB</p>
              <p className={`text-2xl font-semibold ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore}/100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sinh viên, đánh giá..."
                className="pl-10 w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="APPROVED">Đã phê duyệt</option>
            </select>

            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
            >
              <option value="ALL">Tất cả học kỳ</option>
              <option value="1">Học kỳ 1</option>
              <option value="2">Học kỳ 2</option>
              <option value="3">Học kỳ 3</option>
            </select>

            <button
              onClick={() => {
                setSearchKeyword('');
                setStatusFilter('ALL');
                setSemesterFilter('ALL');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Evaluations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách Đánh giá ({totalEvaluations})
          </h3>
        </div>

        {evaluations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <StarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p>Chưa có đánh giá nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {evaluation.internship?.student?.user?.fullName || 'N/A'}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreBadge(evaluation.overallScore || evaluation.totalScore)}`}>
                        {evaluation.overallScore || evaluation.totalScore || 0}/100
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {evaluation.isFinalEvaluation ? 'Cuối kỳ' : 'Giữa kỳ'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Sinh viên</p>
                        <p className="font-medium">
                          {evaluation.internship?.student?.studentCode || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Công ty</p>
                        <p className="font-medium">{evaluation.internship?.company?.companyName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ngày đánh giá</p>
                        <p className="font-medium">
                          {evaluation.evaluationDate 
                            ? new Date(evaluation.evaluationDate).toLocaleDateString('vi-VN')
                            : evaluation.createdAt 
                              ? new Date(evaluation.createdAt).toLocaleDateString('vi-VN')
                              : 'Chưa có ngày'
                          }
                        </p>
                      </div>
                    </div>

                    {evaluation.comments && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Nhận xét</p>
                        <p className="text-sm text-gray-800">{evaluation.comments}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => openModal('view', evaluation)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </button>
                    
                    <button
                      onClick={() => openModal('edit', evaluation)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalMode === 'create' ? 'Tạo đánh giá mới' : 
                 modalMode === 'edit' ? 'Chỉnh sửa đánh giá' : 'Chi tiết đánh giá'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sinh viên *
                  </label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={modalMode === 'view'}
                  >
                    <option value="">Chọn sinh viên</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.fullName} - {student.studentCode}
                      </option>
                    ))}
                  </select>
                  {formErrors.studentId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.studentId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thực tập *
                  </label>
                  <select
                    value={formData.internshipId}
                    onChange={(e) => {
                      const internshipId = e.target.value;
                      const selectedInternship = internships.find(i => i.id.toString() === internshipId);
                      setFormData(prev => ({ 
                        ...prev, 
                        internshipId: internshipId,
                        studentId: selectedInternship?.student?.id || prev.studentId
                      }));
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={modalMode === 'view'}
                  >
                    <option value="">Chọn thực tập</option>
                    {internships.map(internship => (
                      <option key={internship.id} value={internship.id}>
                        {internship.student?.fullName} - {internship.company?.companyName} ({internship.jobTitle})
                      </option>
                    ))}
                  </select>
                  {formErrors.internshipId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.internshipId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại đánh giá *
                  </label>
                  <select
                    value={formData.evaluationType}
                    onChange={(e) => setFormData(prev => ({ ...prev, evaluationType: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={modalMode === 'view'}
                  >
                    <option value="MIDTERM">Giữa kỳ</option>
                    <option value="FINAL">Cuối kỳ</option>
                    <option value="MONTHLY">Hàng tháng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Học kỳ *
                  </label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập học kỳ (VD: 1, 2, 3)"
                    disabled={modalMode === 'view'}
                  />
                  {formErrors.semester && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.semester}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Năm học *
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập năm học (VD: 2023-2024)"
                    disabled={modalMode === 'view'}
                  />
                  {formErrors.academicYear && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.academicYear}</p>
                  )}
                </div>
              </div>

              {/* Scoring Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Tiêu chí đánh giá (0-100 điểm)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Technical Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kỹ năng chuyên môn (20%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.technicalSkills}
                      onChange={(e) => handleScoreChange('technicalSkills', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  {/* Soft Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kỹ năng mềm (15%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.softSkills}
                      onChange={(e) => handleScoreChange('softSkills', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  {/* Work Attitude */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thái độ làm việc (15%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.workAttitude}
                      onChange={(e) => handleScoreChange('workAttitude', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  {/* Learning Ability */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khả năng học hỏi (10%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.learningAbility}
                      onChange={(e) => handleScoreChange('learningAbility', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  {/* Teamwork */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Làm việc nhóm (10%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.teamwork}
                      onChange={(e) => handleScoreChange('teamwork', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  {/* Communication */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giao tiếp (10%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.communication}
                      onChange={(e) => handleScoreChange('communication', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  {/* Problem Solving */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giải quyết vấn đề (10%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.problemSolving}
                      onChange={(e) => handleScoreChange('problemSolving', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  {/* Creativity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sáng tạo (5%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.creativity}
                      onChange={(e) => handleScoreChange('creativity', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  {/* Punctuality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tính đúng giờ (5%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.punctuality}
                      onChange={(e) => handleScoreChange('punctuality', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  {/* Responsibility */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trách nhiệm (10%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.responsibility}
                      onChange={(e) => handleScoreChange('responsibility', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  {/* Overall Performance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hiệu suất tổng thể (10%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.overallPerformance}
                      onChange={(e) => handleScoreChange('overallPerformance', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={modalMode === 'view'}
                    />
                  </div>
                </div>

                {/* Total Score Display */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Tổng điểm:</span>
                    <span className={`text-2xl font-bold ${getScoreColor(formData.totalScore)}`}>
                      {formData.totalScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-6 space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Nhận xét và Đánh giá</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm mạnh
                  </label>
                  <textarea
                    rows={3}
                    value={formData.strengths}
                    onChange={(e) => setFormData(prev => ({ ...prev, strengths: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Mô tả các điểm mạnh của sinh viên trong quá trình thực tập..."
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm yếu cần cải thiện
                  </label>
                  <textarea
                    rows={3}
                    value={formData.weaknesses}
                    onChange={(e) => setFormData(prev => ({ ...prev, weaknesses: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Mô tả các điểm yếu cần cải thiện..."
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đề xuất và khuyến nghị
                  </label>
                  <textarea
                    rows={3}
                    value={formData.recommendations}
                    onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Đưa ra các đề xuất để sinh viên cải thiện..."
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét chung
                  </label>
                  <textarea
                    rows={4}
                    value={formData.comments}
                    onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhận xét tổng thể về quá trình thực tập của sinh viên..."
                    disabled={modalMode === 'view'}
                  />
                </div>
              </div>

              {formErrors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">{formErrors.general}</p>
                </div>
              )}

              {/* Modal Actions */}
              {modalMode !== 'view' && (
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {modalMode === 'create' ? 'Tạo đánh giá' : 'Cập nhật'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationManagement;