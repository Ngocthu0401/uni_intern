import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilSquareIcon,
  CalendarIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { internshipService, reportService, evaluationService } from '../../services';
import mentorService from '../../services/mentorService';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      activeInternships: 0,
      pendingReports: 0,
      completedEvaluations: 0
    },
    students: [],
    weeklyReports: [],
    upcomingTasks: []
  });

  // Load dashboard data from API
  useEffect(() => {
    console.log('MentorDashboard - User object:', user);
    if (user?.id) {
      loadDashboardData();
    } else {
      console.log('No user or user.id found');
      setError('Không tìm thấy thông tin mentor. Vui lòng đăng nhập lại.');
      setLoading(false);
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading dashboard data for user:', user);

      // First get mentor information from user ID
      const mentorResponse = await mentorService.getMentorByUserId(user.id);
      console.log('Mentor Response:', mentorResponse);
      const mentorId = mentorResponse.id;
      console.log('Using mentorId:', mentorId);

      // Set mentor info
      setMentorInfo({
        name: mentorResponse.user?.fullName || user?.fullName || 'N/A',
        position: mentorResponse.position || 'N/A',
        company: mentorResponse.company?.companyName || 'N/A',
        email: mentorResponse.user?.email || user?.email || 'N/A',
        phone: mentorResponse.user?.phoneNumber || 'N/A'
      });

      // Load internships for this mentor
      console.log('Fetching internships...');
      const internshipsResponse = await internshipService.getInternshipsByMentor(mentorId);
      const internships = internshipsResponse || [];
      console.log('Internships loaded:', internships);

      // Load reports for this mentor
      console.log('Fetching reports...');
      const reportsResponse = await reportService.getReportsByMentor(mentorId);
      const reports = reportsResponse || [];
      console.log('Reports loaded:', reports);

      // Load evaluations for this mentor
      console.log('Fetching evaluations...');
      const evaluationsResponse = await evaluationService.getEvaluationsByMentor(mentorId);
      const evaluations = evaluationsResponse || [];
      console.log('Evaluations loaded:', evaluations);

      // Calculate statistics  
      const activeInternships = internships.filter(i => 
        i.status === 'ACTIVE' || i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS'
      );
      const pendingReports = reports.filter(r => !r.approved && r.submittedAt);
      const completedEvaluations = evaluations.filter(e => e.overallScore);

      // Extract students from internships (show all internships, not just active)
      const students = internships.map(internship => ({
        id: internship.student?.id || internship.studentId,
        name: internship.student?.user?.fullName || internship.student?.fullName || 'N/A',
        class: internship.student?.className || 'N/A',
        university: 'Trường Đại học XYZ',
        teacher: internship.teacher?.user?.fullName || 'N/A',
        project: internship.jobTitle || internship.position || 'N/A',
        progress: calculateProgress(internship),
        lastReport: getLastReportDate(reports, internship.student?.id),
        status: getInternshipStatusText(internship.status),
        performance: getPerformanceFromEvaluations(evaluations, internship.student?.id),
        startDate: formatDate(internship.startDate),
        endDate: formatDate(internship.endDate),
        internshipId: internship.id
      }));

      // Process weekly reports
      const weeklyReports = reports
        .filter(r => r.submittedAt)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 5)
        .map(report => ({
          studentName: report.internship?.student?.user?.fullName || 'N/A',
          week: `Tuần ${getWeekNumber(report.submittedAt)}`,
          submittedDate: formatDate(report.submittedAt),
          content: report.content || report.summary || report.title || 'Không có nội dung',
          rating: report.score || 0,
          feedback: report.feedback || 'Chưa có phản hồi'
        }));

      // Generate upcoming tasks
      const upcomingTasks = generateUpcomingTasks(internships, reports, evaluations);

      setDashboardData({
        stats: {
          totalStudents: students.length,
          activeInternships: activeInternships.length,
          pendingReports: pendingReports.length,
          completedEvaluations: completedEvaluations.length
        },
        students,
        weeklyReports,
        upcomingTasks
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      
      // Set fallback empty data to prevent UI crashes
      setDashboardData({
        stats: {
          totalStudents: 0,
          activeInternships: 0,
          pendingReports: 0,
          completedEvaluations: 0
        },
        students: [],
        weeklyReports: [],
        upcomingTasks: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getInternshipStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Đang thực tập';
      case 'PENDING': return 'Chờ phê duyệt';
      case 'COMPLETED': return 'Hoàn thành';
      case 'SUSPENDED': return 'Tạm dừng';
      default: return 'Không xác định';
    }
  };

  const calculateProgress = (internship) => {
    if (!internship.startDate || !internship.endDate) return 0;
    const start = new Date(internship.startDate);
    const end = new Date(internship.endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
  };

  const getPerformanceFromEvaluations = (evaluations, studentId) => {
    const studentEvals = evaluations.filter(e => 
      e.internship?.student?.id === studentId || e.studentId === studentId
    );
    if (studentEvals.length === 0) return 'Chưa đánh giá';
    const avgScore = studentEvals.reduce((sum, e) => sum + (e.overallScore || 0), 0) / studentEvals.length;
    if (avgScore >= 8) return 'Tốt';
    if (avgScore >= 6.5) return 'Khá';
    if (avgScore >= 5) return 'Trung bình';
    return 'Yếu';
  };

  const getLastReportDate = (reports, studentId) => {
    const studentReports = reports.filter(r => 
      (r.internship?.student?.id === studentId || r.studentId === studentId) && r.submittedAt
    );
    if (studentReports.length === 0) return 'Chưa có báo cáo';
    const lastReport = studentReports.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
    return formatDate(lastReport.submittedAt);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getWeekNumber = (dateString) => {
    if (!dateString) return 1;
    const date = new Date(dateString);
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  const generateUpcomingTasks = (internships, reports, evaluations) => {
    const tasks = [];
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Check for pending evaluations
    internships.forEach(internship => {
      const studentEvals = evaluations.filter(e => 
        (e.internship?.student?.id === internship.student?.id || e.studentId === internship.studentId) &&
        new Date(e.createdAt) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      );
      
      if (studentEvals.length === 0) {
        tasks.push({
          task: `Đánh giá cho ${internship.student?.user?.fullName || 'sinh viên'}`,
          deadline: formatDate(nextWeek),
          priority: 'high'
        });
      }
    });

    // Check for pending report reviews
    const pendingReports = reports.filter(r => r.submittedAt && !r.approved);
    pendingReports.slice(0, 3).forEach(report => {
      tasks.push({
        task: `Review báo cáo của ${report.internship?.student?.user?.fullName || 'sinh viên'}`,
        deadline: formatDate(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)),
        priority: 'medium'
      });
    });

    return tasks.slice(0, 4);
  };

  // Mentor info state
  const [mentorInfo, setMentorInfo] = useState({
    name: user?.fullName || 'Loading...',
    position: 'Loading...',
    company: 'Loading...',
    email: user?.email || 'Loading...',
    phone: 'Loading...'
  });

  // Use data from state
  const { stats, students, weeklyReports, upcomingTasks } = dashboardData;

  const statsArray = [
    {
      title: 'Sinh viên hướng dẫn',
      value: stats.totalStudents.toString(),
      icon: UserGroupIcon,
      color: 'from-blue-500 to-blue-600',
      change: '+1 sinh viên mới'
    },
    {
      title: 'Dự án đang thực hiện',
      value: stats.activeInternships.toString(),
      icon: DocumentTextIcon,
      color: 'from-green-500 to-green-600',
      change: '2 dự án sắp hoàn thành'
    },
    {
      title: 'Báo cáo tuần này',
      value: stats.pendingReports.toString(),
      icon: ChartBarIcon,
      color: 'from-purple-500 to-purple-600',
      change: '1 báo cáo chưa nộp'
    },
    {
      title: 'Đánh giá hoàn thành',
      value: stats.completedEvaluations.toString(),
      icon: AcademicCapIcon,
      color: 'from-orange-500 to-orange-600',
      change: 'Tăng 0.2 điểm'
    }
  ];

  const quickActions = [
    {
      title: 'Đánh Giá Sinh Viên',
      description: 'Đánh giá tiến độ và hiệu suất làm việc',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-blue-600',
      link: '/mentor/evaluate-students'
    },
    {
      title: 'Xem Báo Cáo',
      description: 'Xem và phản hồi báo cáo tuần',
      icon: DocumentTextIcon,
      color: 'from-green-500 to-green-600',
      link: '/mentor/reports'
    },
    {
      title: 'Lịch Họp',
      description: 'Quản lý lịch họp với sinh viên',
      icon: CalendarIcon,
      color: 'from-purple-500 to-purple-600',
      link: '/mentor/meetings'
    },
    {
      title: 'Tin Nhắn',
      description: 'Trao đổi với sinh viên và giảng viên',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-orange-500 to-orange-600',
      link: '/mentor/messages'
    }
  ];



  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang thực tập':
        return 'bg-blue-100 text-blue-800';
      case 'Cần hỗ trợ':
        return 'bg-red-100 text-red-800';
      case 'Hoàn thành':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Tốt':
        return 'text-green-600';
      case 'Khá':
        return 'text-blue-600';
      case 'Trung bình':
        return 'text-yellow-600';
      case 'Yếu':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
          <button 
            onClick={loadDashboardData}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
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
              <h1 className="text-3xl font-bold text-gray-900">Bảng Điều Khiển Mentor</h1>
              <p className="mt-1 text-sm text-gray-500">Chào mừng {mentorInfo.name} - {mentorInfo.position}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{mentorInfo.company}</p>
                <p className="text-xs text-gray-500">{mentorInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsArray.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
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

            {/* Students List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Sinh Viên Đang Hướng Dẫn</h2>
                  <Link to="/mentor/students" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Xem chi tiết
                  </Link>
                </div>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.id} - {student.class} - {student.university}</p>
                          <p className="text-sm text-gray-600">Giảng viên: {student.teacher}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                          <p className={`text-sm font-medium mt-1 ${getPerformanceColor(student.performance)}`}>
                            {student.performance}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Dự án:</p>
                          <p className="text-sm text-gray-600">{student.project}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Thời gian:</p>
                          <p className="text-sm text-gray-600">{student.startDate} - {student.endDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Tiến độ:</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{width: `${student.progress}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{student.progress}%</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link 
                            to={`/mentor/student/${student.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <Link 
                            to={`/mentor/evaluate/${student.id}`}
                            className="text-green-600 hover:text-green-900 p-1"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Reports */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Báo Cáo Gần Đây</h3>
                <div className="space-y-4">
                  {weeklyReports.map((report, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-gray-900">{report.studentName}</p>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {report.rating}/10
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{report.week} - {report.submittedDate}</p>
                      <p className="text-sm text-gray-700 mb-2">{report.content}</p>
                      <p className="text-xs text-green-600 italic">{report.feedback}</p>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/mentor/reports"
                  className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-4"
                >
                  Xem tất cả báo cáo
                </Link>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhiệm Vụ Sắp Tới</h3>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        task.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{task.task}</p>
                        <p className="text-xs text-gray-500">Hạn: {task.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông Tin Công Ty</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{mentorInfo.company}</p>
                      <p className="text-xs text-gray-500">Phòng Phát triển Phần mềm</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <UserGroupIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">6 sinh viên thực tập</p>
                      <p className="text-xs text-gray-500">Kỳ thực tập Xuân 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;