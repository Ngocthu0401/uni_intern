import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  internshipService, 
  studentService, 
  reportService,
  mentorService 
} from '../../services';
import {
  ChartBarIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  UserGroupIcon,
  PlayIcon,
  PauseIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { 
  PaginationOptions 
} from '../../models';

const InternshipTracking = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  
  // Search and filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [progressFilter, setProgressFilter] = useState('ALL');
  
  // Task management
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    estimatedHours: 0
  });
  
  // Progress tracking
  const [progressData, setProgressData] = useState({
    currentWeek: 1,
    totalWeeks: 12,
    completedTasks: 0,
    totalTasks: 0,
    overallProgress: 0,
    weeklyReports: [],
    goals: []
  });
  
  // Statistics
  const [stats, setStats] = useState({
    totalInterns: 0,
    activeInterns: 0,
    completedTasks: 0,
    overdueReports: 0,
    averageProgress: 0
  });
  
  // Pagination - Use simple object instead of class to avoid confusion
  const [pagination, setPagination] = useState({ page: 0, size: 8 });
  const [totalInternships, setTotalInternships] = useState(0);

  useEffect(() => {
    console.log('InternshipTracking - User object:', user);
    if (user?.id) {
      loadTrackingData();
    } else if (user === null) {
      // User is explicitly null, show error
      console.log('User is null');
      setError('Không tìm thấy thông tin mentor. Vui lòng đăng nhập lại.');
      setLoading(false);
    } else {
      // User is undefined, still loading
      console.log('User is still loading...');
      setLoading(true);
    }
  }, [user, searchKeyword, statusFilter, progressFilter, pagination]);

  const calculateProgressFromDates = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
  };

  const loadTrackingData = async () => {
    if (!user?.id) {
      console.log('Cannot load tracking data: user not available');
      setError('Không tìm thấy thông tin người dùng');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      console.log('Loading tracking data for user:', user);
      
      // First get mentor information from user ID
      let mentorId = null;
      try {
        const mentorResponse = await mentorService.getMentorByUserId(user.id);
        console.log('Mentor Response:', mentorResponse);
        mentorId = mentorResponse.id;
        console.log('Using mentorId:', mentorId);
      } catch (mentorError) {
        console.error('Error getting mentor:', mentorError);
        console.log('Continuing without mentor ID - will use sample data');
        // Don't return here, continue with sample data instead
        mentorId = null;
      }
      
      // Load internships for this mentor
      console.log('Fetching internships...');
      let internships = [];
      
      if (mentorId) {
        try {
          const internshipsResponse = await internshipService.getInternshipsByMentor(mentorId);
          internships = internshipsResponse || [];
          console.log('Internships loaded:', internships);
          console.log('Internships count:', internships.length);
          console.log('First internship:', internships[0]);
        } catch (internshipError) {
          console.error('Error loading internships:', internshipError);
          internships = [];
        }
      }
      
      // Use real data only - no sample data
      console.log('Using real internships data:', internships);
      
      // Keep original internships for statistics before filtering
      const originalInternships = [...internships];
      
      // Apply filters
      console.log('Before filters - internships count:', internships.length);
      console.log('Status filter:', statusFilter, 'Search keyword:', searchKeyword);
      
      let filteredInternships = internships;
      if (statusFilter && statusFilter !== 'ALL') {
        const beforeCount = filteredInternships.length;
        filteredInternships = filteredInternships.filter(i => i.status === statusFilter);
        console.log(`Status filter applied: ${beforeCount} -> ${filteredInternships.length}`);
      }
      if (searchKeyword) {
        const beforeCount = filteredInternships.length;
        const searchLower = searchKeyword.toLowerCase();
        filteredInternships = filteredInternships.filter(i => 
          (i.student?.user?.fullName || i.student?.fullName || '').toLowerCase().includes(searchLower) ||
          (i.student?.studentCode || '').toLowerCase().includes(searchLower) ||
          (i.company?.companyName || i.company?.name || '').toLowerCase().includes(searchLower) ||
          (i.jobTitle || i.position || '').toLowerCase().includes(searchLower)
        );
        console.log(`Search filter applied: ${beforeCount} -> ${filteredInternships.length}`);
      }
      
      console.log('After filters - internships count:', filteredInternships.length);
      
      // Apply pagination - Fix page indexing (pagination.page can be 0-based)
      const currentPage = Math.max(0, pagination.page || 0);
      const pageSize = pagination.size || 8;
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      console.log('Pagination:', { page: currentPage, size: pageSize, startIndex, endIndex, totalItems: filteredInternships.length });
      
      const paginatedInternships = filteredInternships.slice(startIndex, endIndex);
      console.log('Paginated internships count:', paginatedInternships.length);
      
      setInternships(paginatedInternships);
      setTotalInternships(filteredInternships.length);
      
      console.log('Final internships to display:', paginatedInternships);
      
      // Calculate statistics from original internships data
      const allInternships = originalInternships || [];
      
      const activeInternships = allInternships.filter(i => 
        i.status === 'ACTIVE' || i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS'
      );
      
      // Calculate average progress
      const totalProgress = allInternships.reduce((sum, internship) => {
        const progress = calculateProgressFromDates(internship.startDate, internship.endDate);
        return sum + progress;
      }, 0);
      const averageProgress = allInternships.length > 0 ? Math.round(totalProgress / allInternships.length) : 0;
      
      // Calculate task statistics (will be 0 until we load real task data)
      const totalCompletedTasks = 0; // TODO: Load from task API
      const totalOverdueTasks = 0; // TODO: Load from task API
      
      setStats({
        totalInterns: allInternships.length,
        activeInterns: activeInternships.length,
        completedTasks: totalCompletedTasks,
        overdueReports: totalOverdueTasks,
        averageProgress: averageProgress
      });
      
    } catch (err) {
      console.error('Error loading tracking data:', err);
      console.error('Error details:', err.message);
      console.error('Error stack:', err.stack);
      setError(`Không thể tải dữ liệu theo dõi. Lỗi: ${err.message}`);
    } finally {
      console.log('Loading completed, setting loading to false');
      setLoading(false);
    }
  };

  const loadInternshipDetails = async (internshipId) => {
    try {
      setError(''); // Clear previous errors
      
      let loadedTasks = [];
      
      // Load tasks first
      try {
        const tasksResponse = await internshipService.getInternshipTasks(internshipId);
        console.log('Tasks response:', tasksResponse);
        loadedTasks = tasksResponse.data || [];
        setTasks(loadedTasks);
      } catch (err) {
        console.log('Tasks API error:', err);
        // Create sample tasks for demonstration
        loadedTasks = [
          {
            id: 1,
            title: 'Tìm hiểu codebase dự án',
            description: 'Đọc tài liệu và khám phá cấu trúc code của dự án',
            status: 'COMPLETED',
            priority: 'HIGH',
            dueDate: '2024-12-20',
            estimatedHours: 8
          },
          {
            id: 2,
            title: 'Phát triển tính năng đăng nhập',
            description: 'Implement authentication system',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            dueDate: '2024-12-25',
            estimatedHours: 16
          }
        ];
        setTasks(loadedTasks);
      }
      
      // Calculate progress based on loaded tasks
      const completedTasksCount = loadedTasks.filter(t => t.status === 'COMPLETED').length;
      const totalTasksCount = loadedTasks.length;
      const taskProgress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
      
      console.log('Task progress calculation:', {
        completedTasks: completedTasksCount,
        totalTasks: totalTasksCount,
        progress: taskProgress
      });
      
      // Load progress data
      try {
        const progressResponse = await internshipService.getInternshipProgress(internshipId);
        console.log('Progress response:', progressResponse);
        const progressData = progressResponse.data || {};
        
        setProgressData({
          currentWeek: progressData.currentWeek || 1,
          totalWeeks: progressData.totalWeeks || 12,
          completedTasks: completedTasksCount,
          totalTasks: totalTasksCount,
          overallProgress: taskProgress, // Use calculated progress from actual tasks
          weeklyReports: progressData.weeklyReports || []
        });
      } catch (err) {
        console.log('Progress API error:', err);
        // Create progress data based on actual tasks
        setProgressData({
          currentWeek: 1,
          totalWeeks: 12,
          completedTasks: completedTasksCount,
          totalTasks: totalTasksCount,
          overallProgress: taskProgress,
          weeklyReports: []
        });
      }
      
    } catch (err) {
      console.error('Error loading internship details:', err);
      setError('Không thể tải chi tiết thực tập: ' + err.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedInternship) return;
    
    try {
      // Get mentor information
      let mentorId = null;
      try {
        const mentorResponse = await mentorService.getMentorByUserId(user.id);
        mentorId = mentorResponse.id;
      } catch (err) {
        console.log('Could not get mentor ID:', err);
      }
      
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        internshipId: selectedInternship.id,
        mentorId: mentorId,
        studentId: selectedInternship.student?.id,
        priority: newTask.priority || 'MEDIUM',
        dueDate: newTask.dueDate,
        estimatedHours: newTask.estimatedHours || 0,
        status: 'PENDING'
      };
      
      console.log('Creating task with data:', taskData);
      await internshipService.createTask(taskData);
      
      // Reset form and reload
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        estimatedHours: 0
      });
      setShowTaskModal(false);
      loadInternshipDetails(selectedInternship.id);
      
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Không thể tạo nhiệm vụ mới: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateProgress = async (internshipId, progressUpdate) => {
    try {
      await internshipService.updateInternshipProgress(internshipId, progressUpdate);
      loadTrackingData(); // Refresh data
      setShowProgressModal(false);
    } catch (err) {
      console.error('Error updating progress:', err);
      setError('Không thể cập nhật tiến độ.');
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await internshipService.updateTaskStatus(taskId, newStatus);
      if (selectedInternship) {
        loadInternshipDetails(selectedInternship.id);
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Không thể cập nhật trạng thái nhiệm vụ.');
    }
  };

  const getStatusBadgeClass = (status) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'ACTIVE':
      case 'ASSIGNED':
      case 'IN_PROGRESS':
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
  
  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return 'Đang thực tập';
      case 'PENDING':
        return 'Chờ duyệt';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'SUSPENDED':
        return 'Tạm ngừng';
      default:
        return status || 'N/A';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarClass = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {user ? 'Đang tải dữ liệu theo dõi...' : 'Đang tải thông tin người dùng...'}
          </p>
        </div>
      </div>
    );
  }

  console.log('Render - internships state:', internships);
  console.log('Render - internships length:', internships.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theo dõi Thực tập</h1>
          <p className="text-gray-600">Theo dõi tiến độ và hỗ trợ các sinh viên thực tập</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  loadTrackingData();
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng thực tập sinh</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalInterns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeInterns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nhiệm vụ hoàn thành</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Báo cáo trễ</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.overdueReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tiến độ TB</p>
              <p className={`text-2xl font-semibold ${getProgressColor(stats.averageProgress)}`}>
                {stats.averageProgress}%
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Internships Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {internships.length === 0 ? (
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 text-center text-gray-500">
            <AcademicCapIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p>Chưa có sinh viên thực tập nào được phân công.</p>
          </div>
        ) : (
          internships.map((internship) => (
            <div key={internship.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {internship.student?.user?.fullName || internship.student?.fullName || 'N/A'}
                      </h3>
                      <span className={getStatusBadgeClass(internship.status)}>
                        {getStatusText(internship.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Mã SV:</strong> {internship.student?.studentCode || 'N/A'}</p>
                      <p><strong>Vị trí:</strong> {internship.jobTitle || internship.position || 'N/A'}</p>
                      <p><strong>Công ty:</strong> {internship.company?.companyName || internship.company?.name || 'N/A'}</p>
                      <p><strong>Bắt đầu:</strong> {internship.startDate ? new Date(internship.startDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    </div>
                  </div>
                </div>



                {/* Action Buttons */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setSelectedInternship(internship);
                      loadInternshipDetails(internship.id);
                    }}
                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed View Modal */}
      {selectedInternship && !showTaskModal && !showProgressModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Chi tiết Thực tập - {selectedInternship.student?.fullName}
              </h3>
              <button
                onClick={() => setSelectedInternship(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tasks List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">Danh sách Nhiệm vụ</h4>
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Thêm nhiệm vụ
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Chưa có nhiệm vụ nào.</p>
                  ) : (
                    tasks.map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-md p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{task.title}</h5>
                          <span className={getPriorityBadgeClass(task.priority)}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Hạn: {task.dueDate}</span>
                          <span>{task.estimatedHours}h</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <select
                            value={task.status}
                            onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                            className="text-xs rounded border-gray-300"
                          >
                            <option value="PENDING">Chờ làm</option>
                            <option value="IN_PROGRESS">Đang làm</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="CANCELLED">Hủy</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Progress Tracking */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">Theo dõi Tiến độ</h4>
                  <button
                    onClick={() => setShowProgressModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Cập nhật
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Overall Progress */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Tiến độ tổng thể</span>
                      <span className={`text-lg font-semibold ${getProgressColor(progressData.overallProgress)}`}>
                        {progressData.overallProgress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getProgressBarClass(progressData.overallProgress || 0)}`}
                        style={{ width: `${progressData.overallProgress || 0}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Debug: {progressData.completedTasks || 0}/{progressData.totalTasks || 0} tasks = {progressData.overallProgress || 0}%
                    </div>
                  </div>

                  {/* Task Status Summary */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Tuần {progressData.currentWeek}/{progressData.totalWeeks}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-green-50 p-2 rounded">
                        <p className="font-medium text-green-800">Hoàn thành</p>
                        <p className="text-green-600">{tasks.filter(t => t.status === 'COMPLETED').length} nhiệm vụ</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded">
                        <p className="font-medium text-yellow-800">Đang làm</p>
                        <p className="text-yellow-600">{tasks.filter(t => t.status === 'IN_PROGRESS').length} nhiệm vụ</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="font-medium text-blue-800">Chờ làm</p>
                        <p className="text-blue-600">{tasks.filter(t => t.status === 'PENDING').length} nhiệm vụ</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded">
                        <p className="font-medium text-red-800">Quá hạn</p>
                        <p className="text-red-600">{tasks.filter(t => t.status === 'OVERDUE').length} nhiệm vụ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && selectedInternship && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Tạo Nhiệm vụ mới</h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề nhiệm vụ *
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề nhiệm vụ..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Mô tả chi tiết nhiệm vụ..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn chót
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Độ ưu tiên
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="LOW">Thấp</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HIGH">Cao</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian (giờ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipTracking;