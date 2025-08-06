import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  studentService, 
  internshipService, 
  reportService,
  evaluationService,
  teacherService 
} from '../../services';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, PencilIcon, UserPlusIcon, AcademicCapIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const StudentManagementPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [editData, setEditData] = useState({
    status: '',
    teacherComment: '',
    teacherScore: '',
    finalScore: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0
  });

  // Load students data
  useEffect(() => {
    loadStudents();
  }, [user, searchTerm, statusFilter, pagination.page]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');

      // First get teacher ID from user ID
      let teacherId;
      try {
        const teacherResponse = await teacherService.getTeacherByUserId(user.id);
        teacherId = teacherResponse.id;
      } catch (err) {
        console.error('Error getting teacher:', err);
        setError('Không tìm thấy thông tin giảng viên. Vui lòng liên hệ quản trị viên.');
        return;
      }

      // Load students by teacher (includes internships)
      // Add timestamp to force fresh data
      const response = await studentService.getStudentsByTeacher(teacherId, { _t: Date.now() });
      
      let studentsData = response.data || [];
      
      // Filter by search term if provided
      if (searchTerm) {
        studentsData = studentsData.filter(student => 
          student.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by status if provided
      if (statusFilter !== 'all') {
        studentsData = studentsData.filter(student => {
          const currentInternship = getCurrentInternship(student.internships);
          return currentInternship?.status === statusFilter;
        });
      }
      
      setStudents(studentsData);
      setPagination(prev => ({
        ...prev,
        total: studentsData.length,
        totalPages: Math.ceil(studentsData.length / prev.size)
      }));

    } catch (err) {
      console.error('Error loading students:', err);
      setError('Không thể tải danh sách sinh viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

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
      
      // If same priority, sort by latest updated date (to get most recently modified)
      return new Date(b.updatedAt) - new Date(a.updatedAt);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'IN_PROGRESS':
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'PENDING':
      case 'ASSIGNED':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'PAUSED':
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />;
      case 'CANCELLED':
      case 'TERMINATED':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách sinh viên...</p>
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
            onClick={loadStudents}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
      case 'ASSIGNED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAUSED':
        return 'bg-orange-100 text-orange-800';
      case 'CANCELLED':
      case 'TERMINATED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student => {
    const searchQuery = (searchTerm || '').toLowerCase();
    const matchesSearch = (student.user?.fullName || student.fullName || '').toLowerCase().includes(searchQuery) ||
                         (student.studentCode || '').toLowerCase().includes(searchQuery) ||
                         (student.user?.email || student.email || '').toLowerCase().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleEditInternship = (student, internship) => {
    setSelectedStudent(student);
    setSelectedInternship(internship);
    setEditData({
      status: internship.status || '',
      teacherComment: internship.teacherComment || '',
      teacherScore: internship.teacherScore || '',
      finalScore: internship.finalScore || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateInternship = async () => {
    try {
      setLoading(true);
      
      // Tạo payload chỉ với các trường cần cập nhật
      const updatePayload = {
        status: editData.status,
        teacherComment: editData.teacherComment,
        teacherScore: editData.teacherScore ? parseFloat(editData.teacherScore) : null,
        finalScore: editData.finalScore ? parseFloat(editData.finalScore) : null
      };

      console.log('Updating internship:', selectedInternship.id, 'with payload:', updatePayload);
      
      // Call internship service to patch update (partial update)
      const updateResult = await internshipService.patchInternship(selectedInternship.id, updatePayload);
      console.log('Update result:', updateResult);
      
      // Small delay to ensure database commit
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload students data
      await loadStudents();
      
      // Show success message
      setSuccessMessage('Cập nhật thông tin thực tập thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Close modal and reset
      setShowEditModal(false);
      setSelectedInternship(null);
      setEditData({
        status: '',
        teacherComment: '',
        teacherScore: '',
        finalScore: ''
      });

    } catch (err) {
      console.error('Error updating internship:', err);
      setError('Không thể cập nhật thông tin thực tập. Vui lòng thử lại.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'ACTIVE').length,
    pending: students.filter(s => s.status === 'PENDING').length,
    completed: students.filter(s => s.status === 'COMPLETED').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[100]">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[100]">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý sinh viên</h1>
            <p className="mt-2 text-gray-600">Theo dõi và quản lý sinh viên thực tập</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng sinh viên</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang thực tập</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ phân công</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sinh viên theo tên, mã SV, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang thực tập</option>
                <option value="pending">Chờ phân công</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Danh sách sinh viên</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sinh viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học tập
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thực tập
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {(student.user?.fullName || student.fullName || 'N').charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.user?.fullName || student.fullName || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{student.studentCode || 'N/A'} - {student.className || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.user?.email || student.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{student.user?.phoneNumber || student.phoneNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.major || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{student.academicYear || 'N/A'} - GPA: {student.gpa || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const currentInternship = getCurrentInternship(student.internships);
                        return (
                          <>
                            <div className="text-sm text-gray-900">
                              {currentInternship?.company?.companyName || 'Chưa có'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Mentor: {currentInternship?.mentor?.user?.fullName || 'Chưa có'}
                            </div>
                          </>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const currentInternship = getCurrentInternship(student.internships);
                        const status = currentInternship?.status || student.status || 'PENDING';
                        return (
                          <div className="flex items-center">
                            {getStatusIcon(status)}
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              {getStatusText(status)}
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {(() => {
                          const currentInternship = getCurrentInternship(student.internships);
                          return currentInternship && (
                            <button
                              onClick={() => handleEditInternship(student, currentInternship)}
                              className="text-green-600 hover:text-green-900"
                              title="Chấm điểm và nhận xét"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Detail Modal */}
        {showDetailModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết sinh viên</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Thông tin cá nhân</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                      <p className="text-gray-900">{selectedStudent.user?.fullName || selectedStudent.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mã sinh viên</label>
                      <p className="text-gray-900">{selectedStudent.studentCode || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedStudent.user?.email || selectedStudent.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                      <p className="text-gray-900">{selectedStudent.user?.phoneNumber || selectedStudent.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Chuyên ngành</label>
                      <p className="text-gray-900">{selectedStudent.major}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Năm học</label>
                      <p className="text-gray-900">{selectedStudent.academicYear || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">GPA</label>
                      <p className="text-gray-900">{selectedStudent.gpa || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Internship Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Thông tin thực tập</h4>
                  {selectedStudent.internships && selectedStudent.internships.length > 0 ? (
                    <div className="space-y-4">
                      {selectedStudent.internships.map((internship, index) => (
                        <div key={internship.id} className={`p-4 border rounded-lg ${index === 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900">
                              {index === 0 ? 'Thực tập hiện tại' : `Thực tập #${index + 1}`}
                            </h5>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {getStatusIcon(internship.status)}
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(internship.status)}`}>
                                  {getStatusText(internship.status)}
                                </span>
                              </div>
                              <button
                                onClick={() => handleEditInternship(selectedStudent, internship)}
                                className="text-green-600 hover:text-green-700 p-1"
                                title="Chỉnh sửa thực tập"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Công ty:</span>
                              <p className="text-gray-900">{internship.company?.companyName || 'Chưa có'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Mentor:</span>
                              <p className="text-gray-900">{internship.mentor?.user?.fullName || 'Chưa có'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Vị trí:</span>
                              <p className="text-gray-900">{internship.jobTitle || 'Chưa có'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Mã thực tập:</span>
                              <p className="text-gray-900 font-mono text-xs">{internship.internshipCode}</p>
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-medium text-gray-700">Thời gian:</span>
                              <p className="text-gray-900">
                                {internship.startDate && internship.endDate
                                  ? `${formatDate(internship.startDate)} - ${formatDate(internship.endDate)}`
                                  : 'Chưa có'}
                              </p>
                            </div>
                            {internship.salary && (
                              <div>
                                <span className="font-medium text-gray-700">Lương:</span>
                                <p className="text-gray-900">{internship.salary.toLocaleString('vi-VN')} VNĐ</p>
                              </div>
                            )}
                            {internship.workingHoursPerWeek && (
                              <div>
                                <span className="font-medium text-gray-700">Giờ làm/tuần:</span>
                                <p className="text-gray-900">{internship.workingHoursPerWeek} giờ</p>
                              </div>
                            )}
                            {internship.teacher && (
                              <div className="md:col-span-2">
                                <span className="font-medium text-gray-700">Giảng viên hướng dẫn:</span>
                                <p className="text-gray-900">{internship.teacher.user?.fullName} - {internship.teacher.department}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Chưa có thông tin thực tập</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Kỹ năng</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedStudent.skills || []).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                  {(!selectedStudent.skills || selectedStudent.skills.length === 0) && (
                    <span className="text-gray-500 text-sm">Chưa có thông tin kỹ năng</span>
                  )}
                </div>
              </div>

              {/* Reports */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Báo cáo thực tập</h4>
                {(selectedStudent.reports && selectedStudent.reports.length > 0) ? (
                  <div className="space-y-2">
                    {selectedStudent.reports.map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">Tuần {report.week || index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {report.submittedAt ? formatDate(report.submittedAt) : 'Chưa nộp'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {getStatusText(report.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Chưa có báo cáo nào</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Internship Modal */}
        {showEditModal && selectedInternship && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chấm điểm và nhận xét thực tập
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Sinh viên: <span className="font-medium">{selectedStudent?.user?.fullName || selectedStudent?.fullName}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Công ty: <span className="font-medium">{selectedInternship?.company?.companyName}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Mã thực tập: <span className="font-mono text-xs">{selectedInternship?.internshipCode}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái thực tập
                  </label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({...editData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="ASSIGNED">Đã phân công</option>
                    <option value="ACTIVE">Đang thực tập</option>
                    <option value="IN_PROGRESS">Đang thực hiện</option>
                    <option value="PAUSED">Tạm dừng</option>
                    <option value="COMPLETED">Hoàn thành</option>
                    <option value="TERMINATED">Đã kết thúc</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm giảng viên (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={editData.teacherScore}
                    onChange={(e) => setEditData({...editData, teacherScore: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập điểm từ 0 đến 10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm tổng kết (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={editData.finalScore}
                    onChange={(e) => setEditData({...editData, finalScore: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập điểm từ 0 đến 10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét của giảng viên
                  </label>
                  <textarea
                    rows={4}
                    value={editData.teacherComment}
                    onChange={(e) => setEditData({...editData, teacherComment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập nhận xét về quá trình thực tập của sinh viên..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateInternship}
                  disabled={loading || !editData.status}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang lưu...' : 'Lưu điểm và nhận xét'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagementPage;