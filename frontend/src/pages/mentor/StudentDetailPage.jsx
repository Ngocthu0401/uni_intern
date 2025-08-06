import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilSquareIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { internshipService, reportService, evaluationService, mentorService, studentService } from '../../services';

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [internshipData, setInternshipData] = useState(null);
  const [reports, setReports] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (studentId && user?.id) {
      loadStudentData();
    }
  }, [studentId, user?.id]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get mentor information first
      const mentorResponse = await mentorService.getMentorByUserId(user.id);
      const mentorId = mentorResponse.id;

      // Load internships for this mentor
      const internshipsResponse = await internshipService.getInternshipsByMentor(mentorId);
      const mentorInternship = internshipsResponse.find(internship => 
        internship.student?.id == studentId
      );
      
      if (!mentorInternship) {
        throw new Error('Sinh viên không thuộc quyền hướng dẫn của bạn');
      }
      
      // Get student data from internship
      setStudentData(mentorInternship.student);
      setInternshipData(mentorInternship);

      if (mentorInternship) {
        // Load reports for this internship
        const reportsResponse = await reportService.getReportsByInternship(mentorInternship.id);
        setReports(reportsResponse || []);

        // Load evaluations for this internship
        const evaluationsResponse = await evaluationService.getEvaluationsByInternship(mentorInternship.id);
        setEvaluations(evaluationsResponse || []);
      }

    } catch (err) {
      console.error('Error loading student data:', err);
      setError('Không thể tải dữ liệu sinh viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5.5) return 'text-yellow-600';
    return 'text-red-600';
  };

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

  const renderStars = (score) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
          <div key={star}>
            {star <= score ? (
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4 text-gray-300" />
            )}
          </div>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">{score}/10</span>
      </div>
    );
  };

  const calculateProgress = () => {
    if (!internshipData?.startDate || !internshipData?.endDate) return 0;
    const start = new Date(internshipData.startDate);
    const end = new Date(internshipData.endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
  };

  const calculateAverageScore = () => {
    if (evaluations.length === 0) return 0;
    return evaluations.reduce((sum, evaluation) => sum + (evaluation.overallScore || 0), 0) / evaluations.length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin sinh viên...</p>
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
            onClick={loadStudentData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
          >
            Thử lại
          </button>
          <button
            onClick={() => navigate('/mentor')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy thông tin sinh viên</p>
          <button
            onClick={() => navigate('/mentor')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const averageScore = calculateAverageScore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/mentor')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chi Tiết Sinh Viên</h1>
                <p className="mt-1 text-sm text-gray-500">Thông tin chi tiết và tiến độ thực tập</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/mentor/student-evaluation?student=${studentId}`)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PencilSquareIcon className="h-5 w-5 mr-2" />
                Đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-12 w-12 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {studentData.user?.fullName || studentData.fullName}
                  </h2>
                  <p className="text-lg text-gray-600">{studentData.studentCode}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      {studentData.user?.email || studentData.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {studentData.user?.phoneNumber || 'Chưa cập nhật'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      {studentData.major} - {studentData.className}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {internshipData && (
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(internshipData.status)}`}>
                      {getStatusText(internshipData.status)}
                    </span>
                  )}
                  <div className="mt-2">
                    <span className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                      {averageScore > 0 ? averageScore.toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-lg text-gray-500">/10</span>
                  </div>
                  <p className="text-sm text-gray-500">Điểm trung bình</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tiến độ</p>
                <p className="text-2xl font-bold text-gray-900">{progress}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Báo cáo</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">{evaluations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Công ty</p>
                <p className="text-sm font-bold text-gray-900">
                  {internshipData?.company?.companyName || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Tổng quan', icon: UserIcon },
                { id: 'reports', name: 'Báo cáo', icon: DocumentTextIcon },
                { id: 'evaluations', name: 'Đánh giá', icon: ChartBarIcon },
                { id: 'internship', name: 'Thực tập', icon: BuildingOfficeIcon }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Mã sinh viên:</span>
                        <span className="ml-2 text-sm text-gray-900">{studentData.studentCode}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Lớp:</span>
                        <span className="ml-2 text-sm text-gray-900">{studentData.className || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Ngành:</span>
                        <span className="ml-2 text-sm text-gray-900">{studentData.major}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Khóa học:</span>
                        <span className="ml-2 text-sm text-gray-900">{studentData.academicYear}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">GPA:</span>
                        <span className="ml-2 text-sm text-gray-900">{studentData.gpa || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {internshipData && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thực tập</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Vị trí:</span>
                          <span className="ml-2 text-sm text-gray-900">{internshipData.jobTitle}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Thời gian:</span>
                          <span className="ml-2 text-sm text-gray-900">
                            {new Date(internshipData.startDate).toLocaleDateString('vi-VN')} - 
                            {new Date(internshipData.endDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Giảng viên hướng dẫn:</span>
                          <span className="ml-2 text-sm text-gray-900">
                            {internshipData.teacher?.user?.fullName || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Tiến độ:</span>
                          <div className="ml-2 flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{width: `${progress}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Danh sách báo cáo</h3>
                  <span className="text-sm text-gray-500">{reports.length} báo cáo</span>
                </div>
                {reports.length > 0 ? (
                  reports.map((report, index) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Tuần {index + 1} • {new Date(report.submittedAt).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">
                            {report.content || report.description || 'Không có mô tả'}
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          {report.score && (
                            <div className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                              {report.score}/10
                            </div>
                          )}
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            report.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status === 'APPROVED' ? 'Đã duyệt' :
                             report.status === 'SUBMITTED' ? 'Đã nộp' : 'Chờ duyệt'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có báo cáo nào</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'evaluations' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Lịch sử đánh giá</h3>
                  <span className="text-sm text-gray-500">{evaluations.length} đánh giá</span>
                </div>
                {evaluations.length > 0 ? (
                  evaluations.map((evaluation) => (
                    <div key={evaluation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {evaluation.isFinalEvaluation ? 'Đánh giá cuối kỳ' : 'Đánh giá định kỳ'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(evaluation.evaluationDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
                          {evaluation.overallScore}/10
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Kỹ thuật</p>
                          <p className="text-lg font-bold text-blue-600">{evaluation.technicalScore}/10</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Kỹ năng mềm</p>
                          <p className="text-lg font-bold text-green-600">{evaluation.softSkillScore}/10</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">Thái độ</p>
                          <p className="text-lg font-bold text-purple-600">{evaluation.attitudeScore}/10</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-gray-600">Giao tiếp</p>
                          <p className="text-lg font-bold text-orange-600">{evaluation.communicationScore}/10</p>
                        </div>
                      </div>
                      
                      {evaluation.comments && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{evaluation.comments}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có đánh giá nào</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'internship' && internshipData && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết thực tập</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Thông tin công việc</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Vị trí:</span> {internshipData.jobTitle}</div>
                          <div><span className="font-medium">Mô tả:</span> {internshipData.jobDescription || 'N/A'}</div>
                          <div><span className="font-medium">Yêu cầu:</span> {internshipData.requirements || 'N/A'}</div>
                          <div><span className="font-medium">Lương:</span> {internshipData.salary ? `${internshipData.salary.toLocaleString()} VND` : 'N/A'}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Thông tin khác</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Giờ làm/tuần:</span> {internshipData.workingHoursPerWeek} giờ</div>
                          <div><span className="font-medium">Phúc lợi:</span> {internshipData.benefits || 'N/A'}</div>
                          <div><span className="font-medium">Ghi chú:</span> {internshipData.notes || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;