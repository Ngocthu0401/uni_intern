import { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  XCircleIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { studentService, internshipService } from '../../services';
import { 
  Student, 
  CreateStudentRequest,
  StudentSearchCriteria,
  PaginationOptions 
} from '../../models';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit', 'delete', 'internships'


  // Search and filtering
  const [searchCriteria, setSearchCriteria] = useState(new StudentSearchCriteria());
  const [pagination, setPagination] = useState(new PaginationOptions({ page: 1, size: 10 }));
  const [totalStudents, setTotalStudents] = useState(0);

  // Form data
  const [formData, setFormData] = useState(new CreateStudentRequest());
  const [formErrors, setFormErrors] = useState({});

  // Internship data
  const [studentInternships, setStudentInternships] = useState({});

  useEffect(() => {
    loadStudents();
  }, [searchCriteria, pagination]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await studentService.searchStudents(searchCriteria, pagination);
      // Backend already returns user information properly, no need to map
      const studentList = response.data.map(student => new Student(student));
      setStudents(studentList);
      setTotalStudents(response.total);

      // Extract internship information from embedded data
      extractStudentInternships(response.data);
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Không thể tải danh sách sinh viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const extractStudentInternships = (studentData) => {
    const internshipMap = {};
    studentData.forEach(student => {
      // Use embedded internships data from the API response
      internshipMap[student.id] = student.internships || [];
    });
    setStudentInternships(internshipMap);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchCriteria(prev => ({ ...prev, keyword }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page (1-based)
  };

  const handleFilterChange = (field, value) => {
    setSearchCriteria(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setSearchCriteria(new StudentSearchCriteria());
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const openModal = (mode, student = null) => {
    setModalMode(mode);
    setSelectedStudent(student);
    
    if (mode === 'create') {
      setFormData(new CreateStudentRequest());
    } else if (mode === 'edit' && student) {
      // Properly map student data for edit form
      setFormData({
        // User data (for display only in edit mode)
        username: student.user?.username || '',
        email: student.user?.email || '',
        fullName: student.user?.fullName || '',
        phone: student.user?.phoneNumber || '',
        
        // Student data (editable)
        studentCode: student.studentCode || '',
        className: student.className || '',
        major: student.major || '',
        academicYear: student.academicYear || '',
        gpa: student.gpa || 0
      });
    }
    
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setFormData(new CreateStudentRequest());
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username?.trim()) {
      errors.username = 'Tên đăng nhập không được để trống';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!formData.fullName?.trim()) {
      errors.fullName = 'Họ và tên không được để trống';
    }
    
    if (!formData.studentCode?.trim()) {
      errors.studentCode = 'Mã sinh viên không được để trống';
    }
    
    if (!formData.className?.trim()) {
      errors.className = 'Lớp không được để trống';
    }
    
    if (!formData.major?.trim()) {
      errors.major = 'Ngành học không được để trống';
    }
    
    if (formData.gpa && (formData.gpa < 0 || formData.gpa > 4)) {
      errors.gpa = 'GPA phải từ 0 đến 4';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (modalMode === 'create') {
        // Create student with all information in one request
        const studentData = {
          // User information
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phone,
          password: 'defaultPassword123', // Default password
          role: 'STUDENT',
          
          // Student specific information
          studentCode: formData.studentCode,
          className: formData.className,
          major: formData.major,
          academicYear: formData.academicYear,
          gpa: parseFloat(formData.gpa) || 0.0
        };

        await studentService.createStudent(studentData);
      } else if (modalMode === 'edit') {
        // For edit, only update student data (not user data)
        const studentData = {
          studentCode: formData.studentCode,
          className: formData.className,
          major: formData.major,
          academicYear: formData.academicYear,
          gpa: parseFloat(formData.gpa) || 0.0
        };

        await studentService.updateStudent(selectedStudent.id, studentData);
      }
      
      closeModal();
      loadStudents();
      
      // Show success message
      const successMessage = modalMode === 'create' 
        ? 'Thêm sinh viên thành công!' 
        : 'Cập nhật thông tin sinh viên thành công!';
      setSuccess(successMessage);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving student:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi lưu thông tin sinh viên.';
      setFormErrors({ general: errorMessage });
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    
    try {
      await studentService.deleteStudent(selectedStudent.id);
      closeModal();
      loadStudents();
      
      // Show success message
      setSuccess('Xóa sinh viên thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting student:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa sinh viên.';
      setFormErrors({ general: errorMessage });
    }
  };



  const totalPages = Math.ceil(totalStudents / pagination.size);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Sinh viên</h1>
          <p className="text-gray-600">Quản lý thông tin và tài khoản sinh viên</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Sinh viên
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã sinh viên, email..."
              value={searchCriteria.keyword}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
              <input
                type="text"
                placeholder="Tất cả lớp"
                value={searchCriteria.className || ''}
                onChange={(e) => handleFilterChange('className', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngành học</label>
              <input
                type="text"
                placeholder="Tất cả ngành"
                value={searchCriteria.major || ''}
                onChange={(e) => handleFilterChange('major', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Năm học</label>
              <input
                type="text"
                placeholder="Tất cả năm học"
                value={searchCriteria.academicYear || ''}
                onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={`border rounded-lg p-4 ${
          error.includes('thành công') 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={error.includes('thành công') ? 'text-green-600' : 'text-red-600'}>
            {error}
          </p>
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lớp / Ngành
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thực tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy sinh viên nào
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.user?.fullName || 'Chưa có thông tin'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.studentCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.className || 'Chưa xác định'}</div>
                      <div className="text-sm text-gray-500">{student.major || 'Chưa xác định'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.gpa?.toFixed(2) || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{student.academicYear || 'Chưa xác định'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.user?.email || 'Chưa có email'}</div>
                      <div className="text-sm text-gray-500">{student.user?.phoneNumber || 'Chưa có SĐT'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const internships = studentInternships[student.id] || [];
                        const activeInternship = internships.find(i => i.status === 'IN_PROGRESS') || internships[0];
                        
                        if (!activeInternship) {
                          return (
                            <div className="flex items-center text-gray-400">
                              <BriefcaseIcon className="h-4 w-4 mr-2" />
                              <span className="text-sm">Chưa có thực tập</span>
                            </div>
                          );
                        }

                        return (
                          <div className="flex items-center">
                            <BriefcaseIcon className="h-4 w-4 text-indigo-600 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {activeInternship.company?.companyName || 'Chưa phân công'}
                              </div>
                              <div className="text-xs text-gray-500 mb-1">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                  activeInternship.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' :
                                  activeInternship.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  activeInternship.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                  activeInternship.status === 'ASSIGNED' ? 'bg-purple-100 text-purple-800' :
                                  activeInternship.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {activeInternship.status === 'IN_PROGRESS' ? 'Đang thực tập' :
                                   activeInternship.status === 'PENDING' ? 'Chờ duyệt' :
                                   activeInternship.status === 'APPROVED' ? 'Đã duyệt' :
                                   activeInternship.status === 'ASSIGNED' ? 'Đã phân công' :
                                   activeInternship.status === 'COMPLETED' ? 'Hoàn thành' :
                                   activeInternship.status}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400">
                                Tổng: {internships.length} thực tập
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal('view', student)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('internships', student)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="Xem thực tập"
                        >
                          <ClipboardDocumentListIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('edit', student)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('delete', student)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Xóa"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {((pagination.page - 1) * pagination.size) + 1} - {Math.min(pagination.page * pagination.size, totalStudents)} trong {totalStudents} sinh viên
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, pagination.page - 2);
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm border rounded-lg ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === 'view' && 'Chi tiết Sinh viên'}
                {modalMode === 'create' && 'Thêm Sinh viên mới'}
                {modalMode === 'edit' && 'Chỉnh sửa Sinh viên'}
                {modalMode === 'delete' && 'Xác nhận xóa'}
                {modalMode === 'internships' && 'Thông tin Thực tập'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            {formErrors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{formErrors.general}</p>
              </div>
            )}

            {modalMode === 'delete' ? (
              <div>
                <p className="mb-6 text-gray-700">
                  Bạn có chắc chắn muốn xóa sinh viên{' '}
                  <span className="font-semibold">{selectedStudent?.user?.fullName}</span>?
                  Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ) : modalMode === 'view' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStudent?.user?.fullName || 'Chưa có thông tin'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã sinh viên</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStudent?.studentCode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStudent?.user?.email || 'Chưa có email'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStudent?.user?.phoneNumber || 'Chưa có SĐT'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lớp</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStudent?.className || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngành học</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStudent?.major || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">GPA</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStudent?.gpa?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedStudent?.isActive() 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedStudent?.getStatusLabel()}
                    </span>
                  </div>
                </div>
              </div>
            ) : modalMode === 'internships' ? (
              <div className="space-y-6">
                {/* Student Info Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-800">Thông tin sinh viên</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Họ tên:</span> {selectedStudent?.user?.fullName || 'N/A'}
                    </div>
                    <div>
                      <span className="text-blue-700">Mã SV:</span> {selectedStudent?.studentCode || 'N/A'}
                    </div>
                    <div>
                      <span className="text-blue-700">Lớp:</span> {selectedStudent?.className || 'N/A'} - {selectedStudent?.major || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Internships List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800 flex items-center">
                      <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                      Danh sách thực tập ({(studentInternships[selectedStudent?.id] || []).length})
                    </h4>
                  </div>

                  {(() => {
                    const internships = studentInternships[selectedStudent?.id] || [];
                    
                    if (internships.length === 0) {
                      return (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border">
                          <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Sinh viên chưa có thực tập nào</p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {internships.map((internship, index) => (
                          <div key={internship.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            {/* Internship Header */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <BriefcaseIcon className="h-5 w-5 text-indigo-600 mr-2" />
                                  <h5 className="font-semibold text-lg text-gray-900">
                                    {internship.jobTitle || 'Chưa có tiêu đề'}
                                  </h5>
                                </div>
                                <p className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                  Mã: {internship.internshipCode || 'N/A'}
                                </p>
                              </div>
                              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                                internship.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' :
                                internship.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                internship.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                internship.status === 'ASSIGNED' ? 'bg-purple-100 text-purple-800' :
                                internship.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                internship.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {internship.status === 'IN_PROGRESS' ? 'Đang thực tập' :
                                 internship.status === 'PENDING' ? 'Chờ phê duyệt' :
                                 internship.status === 'APPROVED' ? 'Đã phê duyệt' :
                                 internship.status === 'ASSIGNED' ? 'Đã phân công' :
                                 internship.status === 'COMPLETED' ? 'Hoàn thành' :
                                 internship.status === 'REJECTED' ? 'Bị từ chối' :
                                 internship.status}
                              </span>
                            </div>

                            {/* Internship Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Company Info */}
                              <div className="space-y-3">
                                <div className="flex items-center text-gray-700">
                                  <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                                  <div>
                                    <p className="font-medium">{internship.company?.companyName || 'Chưa phân công'}</p>
                                    <p className="text-sm text-gray-500">{internship.company?.address || 'Chưa có địa chỉ'}</p>
                                    {internship.company?.industry && (
                                      <p className="text-xs text-gray-400">
                                        Ngành: {internship.company.industry} | Quy mô: {internship.company.companySize}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center text-gray-700">
                                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                                  <div>
                                    <p className="font-medium">GV: {internship.teacher?.user?.fullName || 'Chưa phân công'}</p>
                                    <p className="text-sm text-gray-500">Khoa: {internship.teacher?.department || 'N/A'}</p>
                                    {internship.teacher?.position && (
                                      <p className="text-xs text-gray-400">
                                        Chức vụ: {internship.teacher.position} | Trình độ: {internship.teacher.degree || 'N/A'}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center text-gray-700">
                                  <UserIcon className="h-4 w-4 mr-2" />
                                  <div>
                                    <p className="font-medium">Mentor: {internship.mentor?.user?.fullName || 'Chưa phân công'}</p>
                                    <p className="text-sm text-gray-500">Vị trí: {internship.mentor?.position || 'N/A'}</p>
                                    {internship.mentor?.expertiseLevel && (
                                      <p className="text-xs text-gray-400">
                                        Trình độ: {internship.mentor.expertiseLevel} | Kinh nghiệm: {internship.mentor.yearsOfExperience || 0} năm
                                      </p>
                                    )}
                                    {internship.mentor?.company && (
                                      <p className="text-xs text-gray-400">Công ty mentor: {internship.mentor.company.companyName}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Time & Details */}
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Thời gian</p>
                                  <p className="text-sm text-gray-900">{internship.startDate || 'N/A'} - {internship.endDate || 'N/A'}</p>
                                  <p className="text-xs text-gray-500">{internship.workingHoursPerWeek || 40}h/tuần</p>
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-gray-700">Mức lương</p>
                                  <p className="text-sm text-gray-900 font-semibold text-green-600">
                                    {internship.salary ? `${new Intl.NumberFormat('vi-VN').format(internship.salary)} VND/tháng` : 'Thỏa thuận'}
                                  </p>
                                </div>

                                {(internship.teacherScore || internship.mentorScore || internship.finalScore) && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Điểm đánh giá</p>
                                    <div className="flex space-x-4 text-sm">
                                      {internship.teacherScore && (
                                        <span className="text-blue-600">GV: {internship.teacherScore}</span>
                                      )}
                                      {internship.mentorScore && (
                                        <span className="text-green-600">Mentor: {internship.mentorScore}</span>
                                      )}
                                      {internship.finalScore && (
                                        <span className="text-purple-600 font-semibold">Tổng: {internship.finalScore}</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Job Description */}
                            {internship.jobDescription && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">Mô tả công việc</p>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                                  {internship.jobDescription}
                                </p>
                              </div>
                            )}

                            {/* Requirements & Benefits */}
                            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {internship.requirements && internship.requirements !== 'Chưa xác định' && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">Yêu cầu</p>
                                  <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg whitespace-pre-line">
                                    {internship.requirements}
                                  </p>
                                </div>
                              )}
                              {internship.benefits && internship.benefits !== 'Chưa xác định' && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">Phúc lợi</p>
                                  <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg whitespace-pre-line">
                                    {internship.benefits}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* System Info */}
                            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                              <div className="flex justify-between">
                                <span>Tạo: {internship.createdAt ? new Date(internship.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                <span>Cập nhật: {internship.updatedAt ? new Date(internship.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username || ''}
                      onChange={handleFormChange}
                      disabled={modalMode === 'edit'}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.username ? 'border-red-300' : 'border-gray-300'
                      } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="student123"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleFormChange}
                      disabled={modalMode === 'edit'}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="student@university.edu.vn"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleFormChange}
                      disabled={modalMode === 'edit'}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.fullName ? 'border-red-300' : 'border-gray-300'
                      } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Nguyễn Văn A"
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleFormChange}
                      disabled={modalMode === 'edit'}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="0123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã sinh viên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentCode"
                      value={formData.studentCode || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.studentCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="SV001"
                    />
                    {formErrors.studentCode && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.studentCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lớp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="className"
                      value={formData.className || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.className ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="CNTT-K19"
                    />
                    {formErrors.className && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.className}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngành học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="major"
                      value={formData.major || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.major ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Công nghệ Thông tin"
                    />
                    {formErrors.major && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.major}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Năm học
                    </label>
                    <input
                      type="text"
                      name="academicYear"
                      value={formData.academicYear || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2023-2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GPA
                    </label>
                    <input
                      type="number"
                      name="gpa"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpa || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.gpa ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="3.50"
                    />
                    {formErrors.gpa && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.gpa}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {modalMode === 'create' ? 'Thêm' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;