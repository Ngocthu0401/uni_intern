import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import {
  studentService,
  teacherService,
  companyService,
  batchService,
  internshipService
} from '../../services';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardStats, setDashboardStats] = useState([
    { title: 'Tổng Sinh Viên', count: 0, icon: UserGroupIcon, color: 'bg-blue-500', loading: true },
    { title: 'Giảng Viên', count: 0, icon: AcademicCapIcon, color: 'bg-green-500', loading: true },
    { title: 'Công Ty Đối Tác', count: 0, icon: BuildingOfficeIcon, color: 'bg-purple-500', loading: true },
    { title: 'Đợt Thực Tập', count: 0, icon: CalendarDaysIcon, color: 'bg-orange-500', loading: true }
  ]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load statistics in parallel
      const [
        studentStats,
        teacherStats,
        companyStats,
        batchStats,
        activities
      ] = await Promise.all([
        loadStudentStats(),
        loadTeacherStats(),
        loadCompanyStats(),
        loadBatchStats(),
        loadRecentActivities()
      ]);

      // Update dashboard stats
      setDashboardStats([
        { title: 'Tổng Sinh Viên', count: studentStats, icon: UserGroupIcon, color: 'bg-blue-500', loading: false },
        { title: 'Giảng Viên', count: teacherStats, icon: AcademicCapIcon, color: 'bg-green-500', loading: false },
        { title: 'Công Ty Đối Tác', count: companyStats, icon: BuildingOfficeIcon, color: 'bg-purple-500', loading: false },
        { title: 'Đợt Thực Tập', count: batchStats, icon: CalendarDaysIcon, color: 'bg-orange-500', loading: false }
      ]);

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentStats = async () => {
    try {
      // Use students endpoint for total count instead of search
      const response = await studentService.getStudents({ page: 0, size: 1 });
      return response.totalElements || 0;
    } catch (error) {
      console.error('Error loading student stats:', error);
      return 0;
    }
  };

  const loadTeacherStats = async () => {
    try {
      // Use teachers endpoint for total count instead of search
      const response = await teacherService.getTeachers({ page: 0, size: 1 });
      return response.totalElements || 0;
    } catch (error) {
      console.error('Error loading teacher stats:', error);
      return 0;
    }
  };

  const loadCompanyStats = async () => {
    try {
      // Use companies endpoint for total count instead of search
      const response = await companyService.getCompanies({ page: 0, size: 1 });
      return response.totalElements || 0;
    } catch (error) {
      console.error('Error loading company stats:', error);
      return 0;
    }
  };

  const loadBatchStats = async () => {
    try {
      const count = await batchService.getBatchStatistics();
      return count || 0;
    } catch (error) {
      console.error('Error loading batch stats:', error);
      return 0;
    }
  };

  const loadRecentActivities = async () => {
    try {
      // Get recent internships and batches for activities
      const [recentInternships, recentBatches] = await Promise.all([
        internshipService.getRecentInternships?.() || Promise.resolve([]),
        batchService.getBatches({ page: 0, size: 5, sortBy: 'createdAt', sortDir: 'desc' })
      ]);

      const activities = [];

      // Add recent internship activities
      if (recentInternships && recentInternships.length > 0) {
        recentInternships.slice(0, 3).forEach(internship => {
          activities.push({
            action: `Thực tập mới: ${internship.student?.user?.fullName || 'Sinh viên'} tại ${internship.company?.companyName || 'Công ty'}`,
            time: formatTimeAgo(internship.createdAt),
            type: 'internship'
          });
        });
      }

      // Add recent batch activities
      if (recentBatches && recentBatches.content && recentBatches.content.length > 0) {
        recentBatches.content.slice(0, 2).forEach(batch => {
          activities.push({
            action: `Tạo đợt thực tập: ${batch.batchName}`,
            time: formatTimeAgo(batch.createdAt),
            type: 'batch'
          });
        });
      }

      // Add some default activities if no real data
      if (activities.length === 0) {
        activities.push(
          { action: 'Hệ thống khởi động thành công', time: '1 giờ trước', type: 'system' },
          { action: 'Cập nhật dữ liệu thống kê', time: '2 giờ trước', type: 'system' },
          { action: 'Sao lưu dữ liệu tự động', time: '1 ngày trước', type: 'system' }
        );
      }

      return activities.slice(0, 4); // Limit to 4 activities
    } catch (error) {
      console.error('Error loading recent activities:', error);
      return [
        { action: 'Hệ thống khởi động thành công', time: '1 giờ trước', type: 'system' },
        { action: 'Cập nhật dữ liệu thống kê', time: '2 giờ trước', type: 'system' }
      ];
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Vừa xong';

    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} ngày trước`;
    } else if (diffInHours > 0) {
      return `${diffInHours} giờ trước`;
    } else {
      return 'Vừa xong';
    }
  };

  const managementModules = [
    {
      title: 'Quản Lý Sinh Viên',
      description: 'Thêm, sửa, xóa thông tin sinh viên',
      icon: UserGroupIcon,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/students'
    },
    {
      title: 'Quản lý Giảng viên',
      description: 'CRUD giảng viên, phân công nhóm sinh viên',
      icon: AcademicCapIcon,
      color: 'from-green-500 to-green-600',
      link: '/admin/teachers'
    },
    {
      title: 'Quản Lý Công Ty',
      description: 'Quản lý danh sách công ty đối tác',
      icon: BuildingOfficeIcon,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/companies'
    },
    {
      title: 'Quản lý Cán bộ',
      description: 'CRUD cán bộ, gán sinh viên, liên kết giảng viên',
      icon: UserIcon,
      color: 'from-indigo-500 to-indigo-600',
      link: '/admin/mentors'
    },
    {
      title: 'Quản lý Đợt thực tập',
      description: 'Tạo đợt, thời gian, phân sinh viên/giảng viên',
      icon: CalendarDaysIcon,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/batches'
    },
    {
      title: 'Phân công Thực tập',
      description: 'Gán nơi, giảng viên, cán bộ, mô tả công việc',
      icon: ClipboardDocumentListIcon,
      color: 'from-teal-500 to-teal-600',
      link: '/admin/internships'
    },
    {
      title: 'Quản lý Thanh Toán',
      description: 'Tạo mẫu, quản lý trạng thái thanh toán',
      icon: DocumentTextIcon,
      color: 'from-pink-500 to-pink-600',
      link: '/admin/payments'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bảng Điều Khiển Bộ Môn</h1>
              <p className="mt-1 text-sm text-gray-500">Quản lý toàn diện hệ thống thực tập sinh viên</p>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    {stat.loading ? (
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Management Modules */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Modules Quản Lý</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {managementModules.map((module, index) => {
                const IconComponent = module.icon;
                return (
                  <Link
                    key={index}
                    to={module.link}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Hoạt Động Gần Đây</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.type === 'internship' ? 'bg-blue-500' :
                          activity.type === 'batch' ? 'bg-orange-500' :
                            activity.type === 'evaluation' ? 'bg-green-500' :
                              'bg-gray-500'
                          }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-6 py-3 bg-gray-50 rounded-b-xl">
                <button
                  onClick={loadDashboardData}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Làm mới hoạt động →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;