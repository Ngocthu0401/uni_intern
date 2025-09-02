import { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { teacherService } from '../../services';
import userService from '../../services/userService';
import {
  Teacher,
  CreateTeacherRequest,
  UpdateTeacherRequest,
  TeacherSearchCriteria,
  PaginationOptions,
  AcademicTitle,
  TeacherDegree
} from '../../models';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit', 'delete'
  const [showFilters, setShowFilters] = useState(false);

  // Search and filtering
  const [searchCriteria, setSearchCriteria] = useState(new TeacherSearchCriteria());
  const [pagination, setPagination] = useState(new PaginationOptions());
  const [totalTeachers, setTotalTeachers] = useState(0);

  // Form data
  const [formData, setFormData] = useState(new CreateTeacherRequest());
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadTeachers();
  }, [searchCriteria, pagination]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await teacherService.searchTeachers(searchCriteria, pagination);
      // Backend already returns user information properly, no need to map
      setTeachers(response.data.map(teacher => new Teacher(teacher)));
      setTotalTeachers(response.total);
    } catch (err) {
      console.error('Error loading teachers:', err);
      setError('Không thể tải danh sách giảng viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchCriteria(prev => ({ ...prev, keyword }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleFilterChange = (field, value) => {
    setSearchCriteria(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setSearchCriteria(new TeacherSearchCriteria());
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const openModal = (mode, teacher = null) => {
    setModalMode(mode);
    setSelectedTeacher(teacher);

    if (mode === 'create') {
      setFormData(new CreateTeacherRequest());
    } else if (mode === 'edit' && teacher) {
      // Properly map teacher data for edit form
      setFormData({
        // User data (for display only in edit mode)
        username: teacher.user?.username || '',
        email: teacher.user?.email || '',
        fullName: teacher.user?.fullName || '',
        phone: teacher.user?.phoneNumber || '',

        // Teacher data (editable)
        teacherCode: teacher.teacherCode || '',
        department: teacher.department || '',
        title: teacher.position || '', // position -> title for form
        degree: teacher.degree || '',
        specialization: teacher.specialization || '',
        officeLocation: teacher.officeLocation || ''
      });
    }

    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeacher(null);
    setFormData(new CreateTeacherRequest());
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

    if (!formData.phone?.trim()) {
      errors.phone = 'Số điện thoại không được để trống';
    }

    if (!formData.teacherCode?.trim()) {
      errors.teacherCode = 'Mã giảng viên không được để trống';
    }

    if (!formData.title) {
      errors.title = 'Vui lòng chọn chức danh';
    }

    if (!formData.degree) {
      errors.degree = 'Vui lòng chọn học vị';
    }

    if (!formData.department?.trim()) {
      errors.department = 'Khoa/Bộ môn không được để trống';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (modalMode === 'create') {
        // Create teacher with all information in one request
        const teacherData = {
          // User information
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phone,
          password: formData.email.split('@')[0], // Default password
          role: 'TEACHER',

          // Teacher specific information
          teacherCode: formData.teacherCode,
          department: formData.department,
          position: formData.title, // Map title -> position for backend
          degree: formData.degree,
          specialization: formData.specialization || '',
          officeLocation: formData.officeLocation || ''
        };

        await teacherService.createTeacher(teacherData);
      } else if (modalMode === 'edit') {
        // For edit, only update teacher data (not user data)
        const teacherData = {
          teacherCode: formData.teacherCode,
          department: formData.department,
          position: formData.title,
          degree: formData.degree,
          specialization: formData.specialization || '',
          officeLocation: formData.officeLocation || ''
        };

        await teacherService.updateTeacher(selectedTeacher.id, teacherData);
      }

      closeModal();
      loadTeachers();

      // Show success message
      const successMessage = modalMode === 'create'
        ? 'Thêm giảng viên thành công!'
        : 'Cập nhật thông tin giảng viên thành công!';
      setSuccess(successMessage);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving teacher:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi lưu thông tin giảng viên.';
      setFormErrors({ general: errorMessage });
    }
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;

    try {
      await teacherService.deleteTeacher(selectedTeacher.id);
      closeModal();
      loadTeachers();

      // Show success message
      setSuccess('Xóa giảng viên thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting teacher:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa giảng viên.';
      setFormErrors({ general: errorMessage });
    }
  };

  const titleOptions = Object.values(AcademicTitle).map(title => ({
    value: title,
    label: new Teacher({ academicTitle: title }).getFullTitle().split(' ')[0]
  }));

  const degreeOptions = Object.values(TeacherDegree).map(degree => ({
    value: degree,
    label: new Teacher({ degree }).getDegreeLabel()
  }));

  const totalPages = Math.ceil(totalTeachers / pagination.size);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Giảng viên</h1>
          <p className="text-gray-600">Quản lý thông tin và tài khoản giảng viên</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Giảng viên
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, khoa..."
                value={searchCriteria.keyword}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Bộ lọc
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chức danh
                </label>
                <select
                  value={searchCriteria.academicTitle || ''}
                  onChange={(e) => handleFilterChange('academicTitle', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả chức danh</option>
                  <option value="INSTRUCTOR">Giảng viên</option>
                  <option value="LECTURER">Thầy/Cô giáo</option>
                  <option value="ASSISTANT_PROFESSOR">Trợ lý Giáo sư</option>
                  <option value="ASSOCIATE_PROFESSOR">Phó Giáo sư</option>
                  <option value="PROFESSOR">Giáo sư</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Học vị
                </label>
                <select
                  value={searchCriteria.degree || ''}
                  onChange={(e) => handleFilterChange('degree', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả học vị</option>
                  <option value="BACHELOR">Cử nhân</option>
                  <option value="MASTER">Thạc sĩ</option>
                  <option value="PHD">Tiến sĩ</option>
                  <option value="POSTDOC">Tiến sĩ khoa học</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khoa/Bộ môn
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên khoa/bộ môn"
                  value={searchCriteria.department || ''}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chuyên môn
                </label>
                <input
                  type="text"
                  placeholder="Nhập chuyên môn"
                  value={searchCriteria.specialization || ''}
                  onChange={(e) => handleFilterChange('specialization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={searchCriteria.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="ACTIVE">Đang công tác</option>
                  <option value="INACTIVE">Tạm ngưng</option>
                  <option value="RETIRED">Đã nghỉ hưu</option>
                  <option value="ON_LEAVE">Đang nghỉ phép</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khoa
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên khoa"
                  value={searchCriteria.faculty || ''}
                  onChange={(e) => handleFilterChange('faculty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                {searchCriteria.keyword || searchCriteria.academicTitle || searchCriteria.degree || searchCriteria.department || searchCriteria.specialization || searchCriteria.status || searchCriteria.faculty
                  ? `Đang áp dụng ${Object.values(searchCriteria).filter(v => v !== null && v !== undefined && v !== '').length} bộ lọc`
                  : 'Chưa áp dụng bộ lọc nào'
                }
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Teachers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giảng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chức danh / Học vị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khoa/Bộ môn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
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
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy giảng viên nào
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {teacher.user?.fullName || 'Chưa có thông tin'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {teacher.teacherCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.position || 'Chưa xác định'}</div>
                      <div className="text-sm text-gray-500">{teacher.degree || 'Chưa xác định'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.department || 'Chưa xác định'}</div>
                      <div className="text-sm text-gray-500">{teacher.specialization || 'Chưa xác định'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.user?.email || 'Chưa có email'}</div>
                      <div className="text-sm text-gray-500">{teacher.user?.phoneNumber || 'Chưa có SĐT'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal('view', teacher)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('edit', teacher)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('delete', teacher)}
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
                Hiển thị {((pagination.page - 1) * pagination.size) + 1} - {Math.min(pagination.page * pagination.size, totalTeachers)} trong {totalTeachers} giảng viên
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
                      className={`px-3 py-1 text-sm border rounded-lg ${page === pagination.page
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
                {modalMode === 'view' && 'Chi tiết Giảng viên'}
                {modalMode === 'create' && 'Thêm Giảng viên mới'}
                {modalMode === 'edit' && 'Chỉnh sửa Giảng viên'}
                {modalMode === 'delete' && 'Xác nhận xóa'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
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
                  Bạn có chắc chắn muốn xóa giảng viên{' '}
                  <span className="font-semibold">{selectedTeacher?.user?.fullName}</span>?
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
                    <p className="mt-1 text-sm text-gray-900">{selectedTeacher?.user?.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                    <p className="mt-1 text-sm text-gray-900">@{selectedTeacher?.user?.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTeacher?.user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTeacher?.user?.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chức danh</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTeacher?.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Học vị</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTeacher?.degree}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Khoa/Bộ môn</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTeacher?.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTeacher?.specialization}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vị trí văn phòng</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTeacher?.officeLocation || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Hoạt động
                    </span>
                  </div>
                </div>
                {selectedTeacher?.researchAreas?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lĩnh vực nghiên cứu</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedTeacher.researchAreas.map((area, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.username ? 'border-red-300' : 'border-gray-300'
                        } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="teacher123"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã giảng viên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="teacherCode"
                      value={formData.teacherCode || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.teacherCode ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="GV001"
                    />
                    {formErrors.teacherCode && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.teacherCode}</p>
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.email ? 'border-red-300' : 'border-gray-300'
                        } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="teacher@university.edu.vn"
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.fullName ? 'border-red-300' : 'border-gray-300'
                        } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Nguyễn Văn A"
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleFormChange}
                      disabled={modalMode === 'edit'}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.phone ? 'border-red-300' : 'border-gray-300'
                        } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="0123456789"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chức danh <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="title"
                      value={formData.title || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Chọn chức danh</option>
                      {titleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Học vị <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="degree"
                      value={formData.degree || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.degree ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Chọn học vị</option>
                      {degreeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.degree && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.degree}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khoa/Bộ môn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.department ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Khoa Công nghệ Thông tin"
                    />
                    {formErrors.department && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chuyên môn
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Công nghệ phần mềm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vị trí văn phòng
                    </label>
                    <input
                      type="text"
                      name="officeLocation"
                      value={formData.officeLocation || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Phòng 201, Tòa A"
                    />
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

            {/* Add help text for edit mode */}
            {modalMode === 'edit' && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Lưu ý:</strong> Thông tin tài khoản (tên đăng nhập, email, họ tên, số điện thoại) không thể chỉnh sửa.
                  Chỉ có thể chỉnh sửa thông tin giảng viên.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement; 