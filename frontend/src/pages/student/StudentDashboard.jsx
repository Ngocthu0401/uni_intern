import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ArrowUpTrayIcon,
  ClipboardDocumentListIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { studentService, internshipService, reportService, evaluationService, contractService, apiHelpers } from '../../services';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [internshipInfo, setInternshipInfo] = useState(null);
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState({
    totalReports: 0,
    submittedReports: 0,
    averageGrade: 0,
    completionRate: 0,
    totalEvaluations: 0,
    averageEvaluationScore: 0,
    totalContracts: 0
  });
  const [evaluations, setEvaluations] = useState([]);
  const [contracts, setContracts] = useState([]);
  
  const { user, loading: authLoading } = useAuth();

  // Load dashboard data from API
  useEffect(() => {
    if (!authLoading && user?.id) {
      loadDashboardData();
    }
  }, [authLoading, user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) {
      setError('Không thể lấy thông tin người dùng');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Loading dashboard for user:', user)
      
      // Load student information
      const studentResponse = await studentService.getStudentByUserId(user.id);
      setStudentInfo({
        name: studentResponse.user?.fullName || studentResponse.fullName,
        studentId: studentResponse.studentCode,
        class: studentResponse.className,
        email: studentResponse.user?.email || studentResponse.email
      });

      // Load internship information
      try {
        const internshipResponse = await internshipService.getInternshipsByStudent(studentResponse.id);
        console.log('Internship Response:', internshipResponse);
        
        if (internshipResponse && internshipResponse.length > 0) {
          const currentInternship = internshipResponse[0]; // Get current/latest internship
          setInternshipInfo({
            id: currentInternship.id,
            company: currentInternship.company?.companyName || currentInternship.companyName,
            position: currentInternship.jobTitle || currentInternship.position,
            supervisor: currentInternship.mentor?.user?.fullName || currentInternship.mentorName,
            teacher: currentInternship.teacher?.user?.fullName || currentInternship.teacherName,
            startDate: currentInternship.startDate ? new Date(currentInternship.startDate).toLocaleDateString('vi-VN') : 'N/A',
            endDate: currentInternship.endDate ? new Date(currentInternship.endDate).toLocaleDateString('vi-VN') : 'N/A',
            status: getInternshipStatus(currentInternship.status)
          });

          // Load reports for current internship
          let processedReports = [];
          try {
            const reportsResponse = await reportService.getReportsByInternship(currentInternship.id);
            console.log('Reports Response:', reportsResponse);
            
            processedReports = reportsResponse.map((report, index) => ({
              id: report.id,
              title: report.title,
              week: report.reportType === 'WEEKLY' ? `Tuần ${index + 1}` : report.reportType,
              submitted: report.status === 'SUBMITTED' || report.status === 'APPROVED',
              grade: report.score || null,
              submittedDate: report.submittedAt ? new Date(report.submittedAt).toLocaleDateString('vi-VN') : null,
              status: report.status,
              type: report.reportType
            }));
            setReports(processedReports);
          } catch (reportError) {
            console.log('No reports found:', reportError);
            setReports([]);
          }

          // Calculate report statistics
          const submittedReports = processedReports.filter(r => r.submitted);
          const gradesReports = processedReports.filter(r => r.grade !== null);
          const averageGrade = gradesReports.length > 0 
            ? gradesReports.reduce((sum, r) => sum + r.grade, 0) / gradesReports.length 
            : 0;

          setStatistics(prev => ({
            ...prev,
            totalReports: processedReports.length,
            submittedReports: submittedReports.length,
            averageGrade: averageGrade,
            completionRate: processedReports.length > 0 ? (submittedReports.length / processedReports.length) * 100 : 0
          }));
        }
      } catch (internshipError) {
        console.log('No internship found for student:', internshipError);
        // Set default values if no internship
        setInternshipInfo(null);
      }

      // Load evaluations (independent of internship)
      try {
        const evaluationsResponse = await evaluationService.getEvaluationsByStudent(studentResponse.id);
        console.log('Evaluations Response:', evaluationsResponse);
        setEvaluations(evaluationsResponse);

        // Calculate evaluation average
        const evaluationAverage = evaluationsResponse.length > 0
          ? evaluationsResponse.reduce((sum, evaluation) => sum + (evaluation.overallScore || 0), 0) / evaluationsResponse.length
          : 0;

        setStatistics(prev => ({
          ...prev,
          totalEvaluations: evaluationsResponse.length,
          averageEvaluationScore: evaluationAverage
        }));
      } catch (evalError) {
        console.log('No evaluations found:', evalError);
        setEvaluations([]);
      }

      // Load contracts (independent of internship)
      try {
        const contractsResponse = await contractService.getContractsByStudent(studentResponse.id);
        console.log('Contracts Response:', contractsResponse);
        setContracts(contractsResponse);

        setStatistics(prev => ({
          ...prev,
          totalContracts: contractsResponse.length
        }));
      } catch (contractError) {
        console.log('No contracts found:', contractError);
        setContracts([]);
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(apiHelpers.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getInternshipStatus = (status) => {
    const statusMap = {
      'PENDING': 'Chờ duyệt',
      'APPROVED': 'Đã duyệt', 
      'ASSIGNED': 'Đã phân công',
      'IN_PROGRESS': 'Đang thực tập',
      'ACTIVE': 'Đang thực tập',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      'TERMINATED': 'Đã kết thúc'
    };
    return statusMap[status] || status;
  };

  const quickActions = [
    {
      title: 'Nộp Báo Cáo',
      description: 'Nộp báo cáo tuần hiện tại',
      icon: ArrowUpTrayIcon,
      color: 'from-blue-500 to-blue-600',
      link: '/student/reports'
    },
    {
      title: 'Xem Điểm',
      description: 'Xem điểm và đánh giá',
      icon: ChartBarIcon,
      color: 'from-green-500 to-green-600',
      link: '/student/reports'
    },
    {
      title: 'Ứng Tuyển',
      description: 'Tìm kiếm cơ hội thực tập',
      icon: CalendarIcon,
      color: 'from-purple-500 to-purple-600',
      link: '/student/internship-application'
    },
    {
      title: 'Hợp Đồng',
      description: 'Xem và quản lý hợp đồng',
      icon: ClipboardDocumentListIcon,
      color: 'from-indigo-500 to-indigo-600',
      link: '/student/contracts'
    },
    {
      title: 'Đánh Giá',
      description: 'Xem đánh giá từ mentor',
      icon: StarIcon,
      color: 'from-yellow-500 to-yellow-600',
      link: '/student/evaluations'
    },
    {
      title: 'Hồ Sơ',
      description: 'Cập nhật thông tin cá nhân',
      icon: UserIcon,
      color: 'from-orange-500 to-orange-600',
      link: '/student/profile'
    }
  ];

  const getUpcomingTasks = () => {
    const tasks = [];
    
    // Add task for next report if internship exists
    if (internshipInfo && reports.length > 0) {
      const nextWeek = reports.length + 1;
      const nextReportDue = new Date();
      nextReportDue.setDate(nextReportDue.getDate() + 7);
      
      tasks.push({
        task: `Nộp báo cáo tuần ${nextWeek}`,
        deadline: nextReportDue.toLocaleDateString('vi-VN'),
        priority: 'high'
      });
    }
    
    // Add other upcoming tasks based on internship timeline
    if (internshipInfo) {
      const endDate = new Date(internshipInfo.endDate.split('/').reverse().join('-'));
      const today = new Date();
      const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0 && daysLeft <= 30) {
        tasks.push({
          task: 'Chuẩn bị báo cáo cuối kỳ',
          deadline: internshipInfo.endDate,
          priority: 'medium'
        });
      }
    }
    
    return tasks;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
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
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!studentInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy thông tin sinh viên</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bảng Điều Khiển Sinh Viên</h1>
              <p className="mt-1 text-sm text-gray-500">Chào mừng {studentInfo.name} - {studentInfo.studentId}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{studentInfo.class}</p>
                <p className="text-xs text-gray-500">{studentInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trạng thái</p>
                <p className="text-lg font-bold text-green-600">{internshipInfo?.status || 'Chưa có thực tập'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Báo cáo đã nộp</p>
                <p className="text-lg font-bold text-gray-900">{statistics.submittedReports}/{statistics.totalReports}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Điểm đánh giá</p>
                <p className="text-lg font-bold text-gray-900">
                  {statistics.averageEvaluationScore > 0 ? statistics.averageEvaluationScore.toFixed(1) : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">{statistics.totalEvaluations} đánh giá</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-indigo-500 p-3 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hợp đồng</p>
                <p className="text-lg font-bold text-gray-900">{statistics.totalContracts}</p>
                <p className="text-xs text-gray-500">Tổng số hợp đồng</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Internship Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông Tin Thực Tập</h2>
                {!internshipInfo ? (
                  <div className="text-center py-8">
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Bạn chưa có thực tập nào</p>
                    <Link
                      to="/student/applications"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Tìm cơ hội thực tập
                    </Link>
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Công ty</p>
                        <p className="text-sm text-gray-600">{internshipInfo.company}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mentor</p>
                        <p className="text-sm text-gray-600">{internshipInfo.supervisor}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <AcademicCapIcon className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Giảng viên hướng dẫn</p>
                        <p className="text-sm text-gray-600">{internshipInfo.teacher}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Thời gian</p>
                        <p className="text-sm text-gray-600">{internshipInfo.startDate} - {internshipInfo.endDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Thao Tác Nhanh</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Reports Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tình Trạng Báo Cáo</h2>
                <div className="space-y-4">
                  {reports.length > 0 ? reports.map((report, index) => (
                    <div key={report.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {report.submitted ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{report.title || report.week}</p>
                          <p className="text-sm text-gray-600">
                            {report.submitted ? `Nộp ngày: ${report.submittedDate}` : 'Chưa nộp'}
                          </p>
                          <p className="text-xs text-gray-500">{report.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {report.grade && (
                          <p className="font-semibold text-lg text-gray-900">{report.grade}/10</p>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          report.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                          report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status === 'APPROVED' ? 'Đã duyệt' :
                           report.status === 'SUBMITTED' ? 'Đã nộp' :
                           report.status === 'PENDING' ? 'Chờ duyệt' :
                           report.status}
                        </span>
                        {!report.submitted && (
                          <Link to="/student/reports" className="block text-blue-600 hover:text-blue-800 text-sm font-medium mt-1">
                            Nộp ngay
                          </Link>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có báo cáo nào</p>
                      <Link to="/student/reports" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Tạo báo cáo đầu tiên
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhiệm Vụ Sắp Tới</h3>
                <div className="space-y-3">
                  {getUpcomingTasks().length > 0 ? (
                    getUpcomingTasks().map((task, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          task.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{task.task}</p>
                          <p className="text-xs text-gray-500">Hạn: {task.deadline}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <ClockIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">Không có nhiệm vụ sắp tới</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Evaluations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh Giá Gần Đây</h3>
                <div className="space-y-3">
                  {evaluations.length > 0 ? evaluations.slice(0, 3).map((evaluation) => (
                    <div key={evaluation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {evaluation.evaluatorType === 'TEACHER' ? 'Giảng viên' : 'Mentor'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {evaluation.evaluationDate ? new Date(evaluation.evaluationDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">
                          {evaluation.overallScore ? evaluation.overallScore.toFixed(1) : 'N/A'}/10
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4">
                      <StarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">Chưa có đánh giá nào</p>
                    </div>
                  )}
                </div>
                {evaluations.length > 0 && (
                  <Link to="/student/evaluations" className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-4">
                    Xem tất cả
                  </Link>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiến Độ Thực Tập</h3>
                {internshipInfo ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Hoàn thành</span>
                        <span className="font-medium">{statistics.completionRate.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: `${statistics.completionRate}%`}}></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {(() => {
                        const endDate = new Date(internshipInfo.endDate.split('/').reverse().join('-'));
                        const today = new Date();
                        const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                        return daysLeft > 0 ? `Còn ${daysLeft} ngày để hoàn thành thực tập` : 'Thực tập đã kết thúc';
                      })()} 
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <ChartBarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Chưa có thông tin tiến độ</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;