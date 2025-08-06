import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { teacherService } from '../../services';
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const StatisticsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState({
    overview: {
      totalStudents: 0,
      activeInternships: 0,
      completedInternships: 0,
      pendingReports: 0,
      averageGrade: 0,
      completionRate: 0
    },
    gradeDistribution: {
      excellent: 0, // 9-10
      good: 0,      // 7-8.9
      average: 0,   // 5-6.9
      poor: 0       // <5
    },
    reportStatistics: {
      totalReports: 0,
      approvedReports: 0,
      pendingReports: 0,
      rejectedReports: 0,
      averageSubmissionTime: 0
    },
    companyDistribution: [],
    monthlyProgress: [],
    topPerformers: []
  });
  const [timeRange, setTimeRange] = useState('current_semester');

  useEffect(() => {
    loadStatistics();
  }, [user, timeRange]);

  const loadStatistics = async () => {
    if (!user?.id) {
      console.log('User ID not available yet, skipping statistics load');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Loading statistics for teacher ID:', user.id);

      // Use single API call to get all statistics using user ID
      const statisticsData = await teacherService.getTeacherStatisticsByUserId(user.id);

      console.log('Statistics data received:', statisticsData);
      console.log('Overview:', statisticsData.overview);
      console.log('Monthly progress:', statisticsData.monthlyProgress);
      console.log('Company distribution:', statisticsData.companyDistribution);
      console.log('Top performers:', statisticsData.topPerformers);

      setStatistics({
        overview: statisticsData.overview || {
          totalStudents: 0,
          activeInternships: 0,
          completedInternships: 0,
          pendingReports: 0,
          averageGrade: 0,
          completionRate: 0
        },
        gradeDistribution: statisticsData.gradeDistribution || {
          excellent: 0,
          good: 0,
          average: 0,
          poor: 0
        },
        reportStatistics: statisticsData.reportStatistics || {
          totalReports: 0,
          approvedReports: 0,
          pendingReports: 0,
          rejectedReports: 0,
          averageSubmissionTime: 0
        },
        companyDistribution: statisticsData.companyDistribution || [],
        monthlyProgress: statisticsData.monthlyProgress || [],
        topPerformers: statisticsData.topPerformers || []
      });

    } catch (err) {
      console.error('Error loading statistics:', err);

      // Check if it's a specific error message from the backend
      if (err.response?.data?.message) {
        if (err.response.data.message.includes('Teacher not found')) {
          setError('Không tìm thấy thông tin giảng viên. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getGradeColor = (grade) => {
    if (grade >= 9) return 'text-green-600';
    if (grade >= 7) return 'text-blue-600';
    if (grade >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (grade) => {
    if (grade >= 9) return 'bg-green-100';
    if (grade >= 7) return 'bg-blue-100';
    if (grade >= 5) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadStatistics}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      title: 'Tổng Sinh Viên',
      value: statistics.overview.totalStudents,
      icon: UserGroupIcon,
      color: 'from-blue-500 to-blue-600',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Đang Thực Tập',
      value: statistics.overview.activeInternships,
      icon: ClockIcon,
      color: 'from-orange-500 to-orange-600',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Đã Hoàn Thành',
      value: statistics.overview.completedInternships,
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Báo Cáo Chờ Duyệt',
      value: statistics.overview.pendingReports,
      icon: DocumentTextIcon,
      color: 'from-purple-500 to-purple-600',
      trend: '-15%',
      trendUp: false
    },
    {
      title: 'Điểm Trung Bình',
      value: `${statistics.overview.averageGrade}/10`,
      icon: TrophyIcon,
      color: 'from-indigo-500 to-indigo-600',
      trend: '+0.3',
      trendUp: true
    },
    {
      title: 'Tỷ Lệ Hoàn Thành',
      value: `${statistics.overview.completionRate}%`,
      icon: ChartBarIcon,
      color: 'from-cyan-500 to-cyan-600',
      trend: '+5%',
      trendUp: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thống Kê Kết Quả</h1>
              <p className="mt-1 text-sm text-gray-500">Báo cáo tổng hợp về tiến độ và kết quả thực tập sinh viên</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="current_semester">Học kỳ hiện tại</option>
                <option value="last_semester">Học kỳ trước</option>
                <option value="academic_year">Năm học</option>
                <option value="all_time">Tất cả</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {overviewCards.map((card, index) => {
            const IconComponent = card.icon;
            const TrendIcon = card.trendUp ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className={`bg-gradient-to-r ${card.color} p-3 rounded-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    {card.trend}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Grade Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Phân Bố Điểm</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">Xuất sắc (9-10)</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{statistics.gradeDistribution.excellent}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">Giỏi (7-8.9)</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{statistics.gradeDistribution.good}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">Khá (5-6.9)</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{statistics.gradeDistribution.average}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">Yếu (&lt;5)</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">{statistics.gradeDistribution.poor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Thống Kê Báo Cáo</h3>
              {statistics.reportStatistics.totalReports > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{statistics.reportStatistics.totalReports}</p>
                    <p className="text-sm text-gray-600">Tổng báo cáo</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                    <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{statistics.reportStatistics.approvedReports}</p>
                    <p className="text-sm text-gray-600">Đã duyệt</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200">
                    <ClockIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">{statistics.reportStatistics.pendingReports}</p>
                    <p className="text-sm text-gray-600">Chờ duyệt</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{statistics.reportStatistics.rejectedReports}</p>
                    <p className="text-sm text-gray-600">Từ chối</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Chưa có báo cáo nào</p>
                  <p className="text-gray-400 text-xs mt-1">Báo cáo sẽ hiển thị khi sinh viên nộp</p>
                </div>
              )}
            </div>
          </div>

          {/* Company Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Phân Bố Theo Công Ty</h3>
              <div className="space-y-4">
                {statistics.companyDistribution.length > 0 ? (
                  statistics.companyDistribution.map((company, index) => {
                    const maxCount = Math.max(...statistics.companyDistribution.map(c => c.count), 1);
                    const percentage = (company.count / maxCount) * 100;

                    return (
                      <div key={index} className="flex items-center justify-between p-2">
                        <div className="flex items-center flex-1 min-w-0">
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-900 truncate">{company.name}</span>
                        </div>
                        <div className="flex items-center ml-4">
                          <span className="text-sm font-medium text-gray-900 mr-2 w-6 text-right">{company.count}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Chưa có dữ liệu công ty</p>
                    <p className="text-gray-400 text-xs mt-1">Thông tin sẽ hiển thị khi có thực tập</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        {statistics.topPerformers && statistics.topPerformers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
                Sinh Viên Xuất Sắc
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statistics.topPerformers.slice(0, 6).map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getGradeColor(student.grade)}`}>
                        {student.grade}/10
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* Monthly Progress Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CalendarDaysIcon className="h-6 w-6 text-blue-500 mr-2" />
              Tiến Độ Theo Tháng
            </h3>
            {statistics.monthlyProgress && statistics.monthlyProgress.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 gap-4">
                {statistics.monthlyProgress.map((month, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200">
                    <p className="text-sm font-semibold text-blue-700 mb-3">{month.month}</p>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-green-600">{month.completed}</p>
                        <p className="text-xs text-gray-600">Hoàn thành</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                          <ClockIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-xl font-bold text-blue-600">{month.active}</p>
                        <p className="text-xs text-gray-600">Đang thực hiện</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-500 mb-2">Chưa có dữ liệu tiến độ</h4>
                <p className="text-gray-400 text-sm">Dữ liệu sẽ hiển thị khi có thực tập được bắt đầu</p>
                <div className="mt-6 flex justify-center">
                  <div className="bg-blue-50 rounded-lg p-4 max-w-md">
                    <p className="text-blue-700 text-sm">
                      💡 <strong>Gợi ý:</strong> Tiến độ sẽ tự động cập nhật khi sinh viên bắt đầu thực tập và nộp báo cáo
                    </p>
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

export default StatisticsPage;