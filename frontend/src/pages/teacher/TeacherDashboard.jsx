import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  teacherService, 
  studentService, 
  reportService, 
  internshipService,
  evaluationService,
  contractService 
} from '../../services';
import {
  UserGroupIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilSquareIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  BellIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [supervisedStudents, setSupervisedStudents] = useState([]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load teacher info first
      let teacherId = null;
      if (user?.id) {
        try {
          const teacherData = await teacherService.getTeacherByUserId(user.id);
          setTeacherInfo(teacherData);
          teacherId = teacherData.id;
        } catch (teacherError) {
          console.warn('Teacher profile not found for user ID:', user.id);
          setTeacherInfo(null);
          setError('Không tìm thấy thông tin giảng viên. Vui lòng liên hệ quản trị viên.');
          return;
        }
      }

      if (!teacherId) {
        setError('Không thể xác định thông tin giảng viên.');
        return;
      }

      // Load dashboard statistics using teacher ID
      const [internshipsResponse, reportsResponse, contractsResponse] = await Promise.all([
        internshipService.getInternshipsByTeacher(teacherId),
        reportService.getReportsByTeacher(teacherId, { status: 'PENDING' }),
        contractService.getContractsByTeacher(teacherId, { page: 0, size: 100 })
      ]);

      // Process internships data
      const internships = internshipsResponse.data || internshipsResponse || [];
      const activeInternships = internships.filter(i => i.status === 'ACTIVE' || i.status === 'IN_PROGRESS');
      const completedInternships = internships.filter(i => i.status === 'COMPLETED');
      
      // Extract students from internships
      const studentsFromInternships = internships.map(i => i.student).filter(s => s);
      const uniqueStudents = studentsFromInternships.filter((student, index, self) => 
        index === self.findIndex(s => s.id === student.id)
      );

      setSupervisedStudents(uniqueStudents);

      // Process reports data
      const pendingReportsData = reportsResponse.data || [];
      setPendingReports(pendingReportsData);

      // Process contracts data
      const contracts = contractsResponse.content || contractsResponse.data || [];
      const pendingContracts = contracts.filter(c => c.approvalStatus === 'PENDING').length;
      
      // Calculate statistics
      setDashboardStats({
        totalStudents: uniqueStudents.length,
        pendingReports: pendingReportsData.length,
        completedStudents: completedInternships.length,
        activeInternships: activeInternships.length,
        totalInternships: internships.length,
        totalContracts: contracts.length,
        pendingContracts: pendingContracts
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Sinh viên được phân công',
      value: dashboardStats?.totalStudents?.toString() || '0',
      icon: UserGroupIcon,
      color: 'from-blue-500 to-blue-600',
      change: `${dashboardStats?.totalStudents || 0} sinh viên`
    },
    {
      title: 'Báo cáo chờ duyệt',
      value: dashboardStats?.pendingReports?.toString() || '0',
      icon: DocumentTextIcon,
      color: 'from-orange-500 to-orange-600',
      change: 'Cần xem xét'
    },
    {
      title: 'Sinh viên hoàn thành',
      value: dashboardStats?.completedStudents?.toString() || '0',
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      change: `${dashboardStats?.totalStudents > 0 ? Math.round((dashboardStats?.completedStudents / dashboardStats?.totalStudents) * 100) : 0}% tỷ lệ hoàn thành`
    },
    {
      title: 'Thực tập đang diễn ra',
      value: dashboardStats?.activeInternships?.toString() || '0',
      icon: ChartBarIcon,
      color: 'from-purple-500 to-purple-600',
      change: 'Đang theo dõi'
    }
  ];

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Get the most relevant internship (latest or active one)
  const getCurrentInternship = (internships) => {
    if (!internships || internships.length === 0) return null;
    
    // Priority: IN_PROGRESS > ASSIGNED > others, then by latest date
    const sortedInternships = [...internships].sort((a, b) => {
      const priorityOrder = {
        'IN_PROGRESS': 5,
        'ASSIGNED': 4,
        'ACTIVE': 3,
        'PENDING': 2,
        'COMPLETED': 1,
        'TERMINATED': 0,
        'CANCELLED': 0
      };
      
      const aPriority = priorityOrder[a.status] || 0;
      const bPriority = priorityOrder[b.status] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      // If same priority, sort by latest created date
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return sortedInternships[0];
  };

  const getStatusText = (status) => {
    const statusMap = {
      'ACTIVE': 'Đang thực tập',
      'COMPLETED': 'Hoàn thành',
      'PENDING': 'Chờ duyệt',
      'CANCELLED': 'Đã hủy',
      'ASSIGNED': 'Đã phân công',
      'IN_PROGRESS': 'Đang thực hiện',
      'PAUSED': 'Tạm dừng',
      'TERMINATED': 'Đã kết thúc'
    };
    return statusMap[status] || status;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
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
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Duyệt Báo Cáo',
      description: 'Xem và đánh giá báo cáo sinh viên',
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600',
      link: '/teacher/report-review',
      count: pendingReports.length
    },
    {
      title: 'Quản Lý Sinh Viên',
      description: 'Xem danh sách và tiến độ sinh viên',
      icon: UserGroupIcon,
      color: 'from-green-500 to-green-600',
      link: '/teacher/student-management'
    },
    {
      title: 'Quản Lý Hợp Đồng',
      description: 'Tạo và quản lý hợp đồng hỗ trợ',
      icon: ClipboardDocumentCheckIcon,
      color: 'from-indigo-500 to-indigo-600',
      link: '/teacher/contract-management',
      count: dashboardStats?.pendingContracts
    },
    {
      title: 'Thống Kê',
      description: 'Xem báo cáo thống kê chi tiết',
      icon: ChartBarIcon,
      color: 'from-purple-500 to-purple-600',
      link: '/teacher/statistics'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang thực tập':
      case 'Đang thực hiện':
        return 'bg-blue-100 text-blue-800';
      case 'Hoàn thành':
        return 'bg-green-100 text-green-800';
      case 'Chờ duyệt':
      case 'Đã phân công':
        return 'bg-yellow-100 text-yellow-800';
      case 'Tạm dừng':
        return 'bg-orange-100 text-orange-800';
      case 'Đã hủy':
      case 'Đã kết thúc':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bảng Điều Khiển Giảng Viên</h1>
              <p className="mt-1 text-sm text-gray-500">Chào mừng {teacherInfo?.user?.fullName || user?.fullName || 'Giảng viên'} - {teacherInfo?.department || 'Khoa Công nghệ Thông tin'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{teacherInfo?.department || 'Khoa Công nghệ Thông tin'}</p>
                <p className="text-xs text-gray-500">{teacherInfo?.user?.email || user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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
                      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group relative"
                    >
                      {action.count && (
                        <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {action.count}
                        </span>
                      )}
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
                  <h2 className="text-xl font-semibold text-gray-900">Danh Sách Sinh Viên</h2>
                  <Link to="/teacher/students" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Xem tất cả
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sinh viên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Công ty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiến độ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Điểm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {supervisedStudents.slice(0, 4).map((student) => {
                        // Find the student's internship from the teacher's internships
                        const studentInternships = student.internships || [];
                        const currentInternship = getCurrentInternship(studentInternships);
                        
                        return (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{student.user?.fullName || student.fullName || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{student.studentCode || 'N/A'} - {student.className || 'N/A'}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {currentInternship?.company?.companyName || 'Chưa có'}
                              </div>
                              <div className="text-sm text-gray-500">
                                Mentor: {currentInternship?.mentor?.user?.fullName || 'Chưa có'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {(() => {
                                // Calculate progress based on internship status and score
                                let progress = 0;
                                if (currentInternship?.finalScore) {
                                  progress = currentInternship.finalScore * 10;
                                } else if (currentInternship?.status === 'COMPLETED') {
                                  progress = 100;
                                } else if (currentInternship?.status === 'ACTIVE' || currentInternship?.status === 'IN_PROGRESS') {
                                  progress = 50;
                                } else if (currentInternship?.status === 'ASSIGNED') {
                                  progress = 25;
                                }
                                
                                return (
                                  <div className="flex items-center">
                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                      <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{width: `${progress}%`}}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-900">{Math.round(progress)}%</span>
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {(() => {
                                const status = currentInternship?.status || 'PENDING';
                                return (
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getStatusText(status))}`}>
                                    {getStatusText(status)}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {currentInternship?.finalScore 
                                ? `${currentInternship.finalScore}/10`
                                : 'Chưa có'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link to={`/teacher/student-management?student=${student.id}`} className="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                                  <EyeIcon className="h-4 w-4" />
                                </Link>
                                <Link to={`/teacher/evaluation-management?student=${student.id}`} className="text-green-600 hover:text-green-900" title="Đánh giá">
                                  <PencilSquareIcon className="h-4 w-4" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {supervisedStudents.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            Chưa có sinh viên được phân công
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Reports */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Báo Cáo Chờ Duyệt</h3>
                <div className="space-y-3">
                  {pendingReports.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {report.internship?.student?.user?.fullName || report.student?.user?.fullName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">{report.title} - {formatDate(report.submittedAt)}</p>
                        <p className="text-xs text-gray-500">{report.internship?.company?.companyName || 'N/A'}</p>
                      </div>
                      <Link 
                        to={`/teacher/report-review?report=${report.id}`}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Duyệt
                      </Link>
                    </div>
                  ))}
                  {pendingReports.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      Không có báo cáo chờ duyệt
                    </div>
                  )}
                </div>
                <Link 
                  to="/teacher/report-review"
                  className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-4"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>

            {/* Contract Management Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hợp Đồng Hỗ Trợ</h3>
                  <Link 
                    to="/teacher/contract-management"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Xem tất cả
                  </Link>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tổng hợp đồng</span>
                    <span className="text-sm font-medium text-gray-900">
                      {dashboardStats?.totalContracts || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chờ duyệt</span>
                    <span className="text-sm font-medium text-orange-600">
                      {dashboardStats?.pendingContracts || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Báo cáo chờ duyệt</span>
                    <span className="text-sm font-medium text-red-600">
                      {dashboardStats?.pendingReports || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sinh viên đang thực tập</span>
                    <span className="text-sm font-medium text-green-600">
                      {dashboardStats?.activeInternships || 0}
                    </span>
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

export default TeacherDashboard;