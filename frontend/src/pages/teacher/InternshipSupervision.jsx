import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  internshipService, 
  studentService, 
  reportService, 
  evaluationService 
} from '../../services';
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  StarIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { 
  Internship, 
  Student, 
  Report, 
  Evaluation,
  PaginationOptions 
} from '../../models';

const InternshipSupervision = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters and search
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  // Statistics
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeInternships: 0,
    pendingReports: 0,
    overdueEvaluations: 0,
    averageProgress: 0
  });
  
  // Recent activities
  const [recentReports, setRecentReports] = useState([]);
  const [recentEvaluations, setRecentEvaluations] = useState([]);
  
  // Pagination
  const [pagination, setPagination] = useState(new PaginationOptions({ size: 10 }));
  const [totalInternships, setTotalInternships] = useState(0);

  useEffect(() => {
    loadSupervisionData();
  }, [user, searchKeyword, statusFilter, priorityFilter, pagination]);

  const loadSupervisionData = async () => {
    if (!user?.teacherId) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Load internships supervised by this teacher
      const internshipsResponse = await internshipService.getInternshipsByTeacher(
        user.teacherId,
        {
          keyword: searchKeyword,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
          page: pagination.page,
          size: pagination.size
        }
      );
      
      setInternships(internshipsResponse.data.map(internship => new Internship(internship)));
      setTotalInternships(internshipsResponse.total);
      
      // Load statistics
      const statsResponse = await internshipService.getSupervisionStats(user.teacherId);
      setStats(statsResponse.data);
      
      // Load recent activities
      const reportsResponse = await reportService.getRecentReportsByTeacher(user.teacherId);
      setRecentReports(reportsResponse.data.map(report => new Report(report)));
      
      const evaluationsResponse = await evaluationService.getRecentEvaluationsByTeacher(user.teacherId);
      setRecentEvaluations(evaluationsResponse.data.map(evaluation => new Evaluation(evaluation)));
      
    } catch (err) {
      console.error('Error loading supervision data:', err);
      setError('Không thể tải dữ liệu giám sát. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (internshipId, newStatus) => {
    try {
      await internshipService.updateInternshipStatus(internshipId, newStatus);
      loadSupervisionData(); // Refresh data
    } catch (err) {
      console.error('Error updating internship status:', err);
      setError('Không thể cập nhật trạng thái thực tập.');
    }
  };

  const getStatusBadgeClass = (status) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'ACTIVE':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'COMPLETED':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'SUSPENDED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (priority) {
      case 'HIGH':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'MEDIUM':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'LOW':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getProgressBarClass = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
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
          <h1 className="text-2xl font-bold text-gray-900">Giám sát Thực tập</h1>
          <p className="text-gray-600">Theo dõi và giám sát các sinh viên thực tập được phân công</p>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng sinh viên</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang thực tập</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeInternships}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Báo cáo chờ</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đánh giá trễ</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.overdueEvaluations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tiến độ TB</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên, công ty..."
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang thực tập</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="SUSPENDED">Tạm ngưng</option>
          </select>

          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">Tất cả độ ưu tiên</option>
            <option value="HIGH">Cao</option>
            <option value="MEDIUM">Trung bình</option>
            <option value="LOW">Thấp</option>
          </select>

          <button
            onClick={loadSupervisionData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Internships List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách Thực tập Giám sát ({totalInternships})
          </h3>
        </div>

        {internships.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <AcademicCapIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p>Chưa có sinh viên thực tập nào được phân công giám sát.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {internships.map((internship) => (
              <div key={internship.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {internship.student?.fullName || 'N/A'}
                      </h4>
                      <span className={getStatusBadgeClass(internship.status)}>
                        {internship.getStatusLabel()}
                      </span>
                      <span className={getPriorityBadgeClass(internship.priority)}>
                        {internship.priority}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Công ty</p>
                        <p className="font-medium">{internship.company?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Vị trí</p>
                        <p className="font-medium">{internship.position || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Thời gian</p>
                        <p className="font-medium">{internship.getDurationString()}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Tiến độ thực tập</span>
                        <span>{internship.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressBarClass(internship.progress || 0)}`}
                          style={{ width: `${internship.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Last Activity */}
                    <div className="text-sm text-gray-500">
                      <p>Hoạt động gần nhất: {internship.lastActivity || 'Chưa có hoạt động'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Link
                      to={`/teacher/internship/${internship.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </Link>
                    
                    <Link
                      to={`/teacher/evaluation/${internship.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <StarIcon className="h-4 w-4 mr-2" />
                      Đánh giá
                    </Link>
                    
                    <Link
                      to={`/teacher/reports/${internship.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Báo cáo
                    </Link>

                    <button
                      onClick={() => setSelectedInternship(internship)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                      Ghi chú
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalInternships > pagination.size && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                disabled={pagination.page === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={(pagination.page + 1) * pagination.size >= totalInternships}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activities Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Báo cáo gần đây</h3>
          </div>
          <div className="p-6">
            {recentReports.length === 0 ? (
              <p className="text-gray-500 text-center">Chưa có báo cáo nào gần đây.</p>
            ) : (
              <div className="space-y-4">
                {recentReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-start space-x-3">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {report.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {report.student?.fullName} • {report.getFormattedDate()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Evaluations */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Đánh giá gần đây</h3>
          </div>
          <div className="p-6">
            {recentEvaluations.length === 0 ? (
              <p className="text-gray-500 text-center">Chưa có đánh giá nào gần đây.</p>
            ) : (
              <div className="space-y-4">
                {recentEvaluations.slice(0, 5).map((evaluation) => (
                  <div key={evaluation.id} className="flex items-start space-x-3">
                    <StarIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Điểm: {evaluation.totalScore}/100
                      </p>
                      <p className="text-sm text-gray-500">
                        {evaluation.student?.fullName} • {evaluation.getFormattedDate()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipSupervision;