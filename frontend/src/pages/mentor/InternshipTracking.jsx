import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  internshipService,
  studentService,
  mentorService
} from '../../services';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';
// models import removed (unused)
import { Form, message } from 'antd';
import InternshipsGrid from './internship-tracking/InternshipsGrid';
import DetailsModal from './internship-tracking/DetailsModal';
import CreateTaskModal from './internship-tracking/CreateTaskModal';
import EditStudentModal from './internship-tracking/EditStudentModal';
import ProgressModal from './internship-tracking/ProgressModal';
import { ChartBarIcon } from 'lucide-react';
// helper imported in child component

const InternshipTracking = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [internships, setInternships] = useState([]);
  const [allInternships, setAllInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm] = Form.useForm();

  // Search and filters
  const [searchKeyword, _setSearchKeyword] = useState('');
  const [statusFilter, _setStatusFilter] = useState('ALL');
  // const [progressFilter, _setProgressFilter] = useState('ALL');

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
  const [pagination, _setPagination] = useState({ page: 0, size: 8 });
  const [_totalInternships, setTotalInternships] = useState(0);

  const calculateProgressFromDates = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
  };

  const loadTrackingData = useCallback(async () => {
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
      setAllInternships(originalInternships);

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
  }, [user, searchKeyword, statusFilter, pagination.page, pagination.size]);

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
  }, [user, loadTrackingData]);

  // Open details/edit via URL params
  useEffect(() => {
    const paramStudentId = searchParams.get('studentId');
    const shouldEdit = searchParams.get('edit') === 'true';
    if (!paramStudentId) return;
    // Wait until internships loaded
    if (allInternships.length === 0) return;
    const target = allInternships.find(i => `${i.student?.id}` === `${paramStudentId}`);
    if (target) {
      setSelectedInternship(target);
      loadInternshipDetails(target.id);
      if (shouldEdit) {
        // Pre-fill form and open modal
        editForm.setFieldsValue({
          studentCode: target.student?.studentCode || '',
          className: target.student?.className || '',
          major: target.student?.major || '',
          academicYear: target.student?.academicYear || '',
          gpa: target.student?.gpa ?? ''
        });
        setShowEditModal(true);
      }
    }
  }, [searchParams, allInternships, editForm]);

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

  // const handleUpdateProgress = async (internshipId, progressUpdate) => {
  //   try {
  //     await internshipService.updateInternshipProgress(internshipId, progressUpdate);
  //     loadTrackingData(); // Refresh data
  //     setShowProgressModal(false);
  //   } catch (err) {
  //     console.error('Error updating progress:', err);
  //     setError('Không thể cập nhật tiến độ.');
  //   }
  // };

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

  // helpers moved to child components

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
              <p className={`text-2xl font-semibold ${stats.averageProgress >= 80 ? 'text-green-600' : stats.averageProgress >= 60 ? 'text-blue-600' : stats.averageProgress >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                {stats.averageProgress}%
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Internships Grid */}
      <InternshipsGrid
        internships={internships}
        onOpen={(internship) => {
          setSelectedInternship(internship);
          loadInternshipDetails(internship.id);
        }}
      />

      {/* Detailed View Modal */}
      {selectedInternship && !showTaskModal && !showProgressModal && (
        <DetailsModal
          internship={selectedInternship}
          tasks={tasks}
          progressData={progressData}
          onClose={() => setSelectedInternship(null)}
          onOpenTask={() => setShowTaskModal(true)}
          onOpenProgress={() => setShowProgressModal(true)}
          onOpenEdit={() => {
            editForm.setFieldsValue({
              studentCode: selectedInternship.student?.studentCode || '',
              className: selectedInternship.student?.className || '',
              major: selectedInternship.student?.major || '',
              academicYear: selectedInternship.student?.academicYear || '',
              gpa: selectedInternship.student?.gpa ?? ''
            });
            setShowEditModal(true);
          }}
          onChangeTaskStatus={handleTaskStatusChange}
        />
      )}

      {/* Create Task Modal */}
      {showTaskModal && selectedInternship && (
        <CreateTaskModal
          open={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleCreateTask}
          newTask={newTask}
          setNewTask={setNewTask}
        />
      )}

      {showProgressModal && selectedInternship && (
        <ProgressModal
          open={showProgressModal}
          onCancel={() => setShowProgressModal(false)}
          progressData={progressData}
          setProgressData={setProgressData}
          onSave={async () => {
            try {
              await internshipService.updateInternshipProgress(selectedInternship.id, {
                currentWeek: progressData.currentWeek,
                totalWeeks: progressData.totalWeeks,
                overallProgress: progressData.overallProgress
              });
              message.success('Cập nhật tiến độ thành công');
              setShowProgressModal(false);
              await loadTrackingData();
            } catch {
              message.error('Không thể cập nhật tiến độ');
            }
          }}
        />
      )}

      <EditStudentModal
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        form={editForm}
        onSave={async () => {
          try {
            const values = await editForm.validateFields();
            const studentId = selectedInternship?.student?.id;
            if (!studentId) return;
            const payload = {
              studentCode: values.studentCode,
              className: values.className,
              major: values.major,
              academicYear: values.academicYear,
              gpa: values.gpa ? parseFloat(values.gpa) : null
            };
            await studentService.updateStudent(studentId, payload);
            message.success('Cập nhật thông tin sinh viên thành công');
            setShowEditModal(false);
            await loadTrackingData();
            if (selectedInternship) {
              setSelectedInternship(prev => prev ? ({ ...prev, student: { ...prev.student, ...payload } }) : prev);
            }
          } catch (e) {
            if (e?.errorFields) return;
            message.error('Cập nhật thất bại');
          }
        }}
      />
    </div>
  );
};

export default InternshipTracking;