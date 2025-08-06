import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { mentorService } from '../../services';
import userService from '../../services/userService';
import { 
  Mentor, 
  CreateMentorRequest, 
  UpdateMentorRequest,
  MentorSearchCriteria,
  PaginationOptions,
  ExpertiseLevel 
} from '../../models';
import companyService from '../../services/companyService';

const MentorManagement = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit', 'delete'
  const [showFilters, setShowFilters] = useState(false);

  // Search and filtering
  const [searchCriteria, setSearchCriteria] = useState(new MentorSearchCriteria());
  const [pagination, setPagination] = useState(new PaginationOptions());
  const [totalMentors, setTotalMentors] = useState(0);

  // Form data
  const [formData, setFormData] = useState(new CreateMentorRequest());
  const [formErrors, setFormErrors] = useState({});
  
  // Companies list for dropdown
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadMentors();
    loadCompanies();
  }, [searchCriteria, pagination]);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getCompanies();
      // Handle different response structures
      let companiesData = [];
      if (response && Array.isArray(response)) {
        companiesData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        companiesData = response.data;
      } else if (response && response.content && Array.isArray(response.content)) {
        companiesData = response.content;
      }
      setCompanies(companiesData);
    } catch (err) {
      console.error('Error loading companies:', err);
      setCompanies([]); // Set empty array on error
    }
  };

  const loadMentors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await mentorService.searchMentors(searchCriteria, pagination);
      setMentors(response.data.map(mentor => {
        // Map backend fields to proper structure
        return {
          id: mentor.id,
          user: mentor.user,
          company: mentor.company,
          position: mentor.position,
          officeLocation: mentor.officeLocation,
          yearsOfExperience: mentor.yearsOfExperience,
          expertise: mentor.expertise,
          expertiseLevel: mentor.expertiseLevel,
          bio: mentor.bio,
          certifications: mentor.certifications,
          languages: mentor.languages,
          isActive: mentor.isActive,
          createdAt: mentor.createdAt,
          updatedAt: mentor.updatedAt
        };
      }));
      setTotalMentors(response.total);
    } catch (err) {
      console.error('Error loading mentors:', err);
      setError('Không thể tải danh sách mentor. Vui lòng thử lại.');
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
    setSearchCriteria(new MentorSearchCriteria());
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const openModal = (mode, mentor = null) => {
    setModalMode(mode);
    setSelectedMentor(mentor);
    
    if (mode === 'create') {
      setFormData(new CreateMentorRequest());
    } else if (mode === 'edit' && mentor) {
      // Properly map mentor data for edit form
      setFormData({
        // User data (for display only in edit mode)
        username: mentor.user?.username || '',
        email: mentor.user?.email || '',
        fullName: mentor.user?.fullName || '',
        phone: mentor.user?.phoneNumber || '',
        
        // Mentor data (editable)
        company: mentor.company?.id || '',
        position: mentor.position || '',
        department: mentor.department || '',
        yearsOfExperience: mentor.yearsOfExperience || 0,
        specialization: mentor.specialization || '',
        officeLocation: mentor.officeLocation || '',
        expertiseLevel: mentor.expertiseLevel || '',
        maxInterns: mentor.maxInterns || 1
      });
    }
    
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMentor(null);
    setFormData(new CreateMentorRequest());
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
    
    // Only validate user fields in create mode
    if (modalMode === 'create') {
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
    }
    
    // Always validate mentor-specific fields
    if (!formData.company?.trim()) {
      errors.company = 'Công ty không được để trống';
    }
    
    if (!formData.position?.trim()) {
      errors.position = 'Chức vụ không được để trống';
    }
    
    if (!formData.expertiseLevel) {
      errors.expertiseLevel = 'Vui lòng chọn trình độ chuyên môn';
    }
    
    if (formData.yearsOfExperience < 0) {
      errors.yearsOfExperience = 'Số năm kinh nghiệm không được âm';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (modalMode === 'create') {
        // Create mentor using CreateMentorRequest DTO structure
        const mentorData = {
          // User information
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phone,
          password: 'defaultPassword123', // Default password
          role: 'MENTOR',
          
          // Mentor specific information
          companyId: formData.company ? parseInt(formData.company) : null,
          position: formData.position,
          department: 'Chưa xác định',
          specialization: '',
          officeLocation: formData.officeLocation || 'Chưa cập nhật',
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0
        };

        await mentorService.createMentor(mentorData);
      } else if (modalMode === 'edit') {
        // For edit, only update mentor data (not user data)
        const companyId = formData.company ? parseInt(formData.company) : null;
        const mentorData = {
          company: companyId ? { id: companyId } : null,
          position: formData.position,
          department: formData.department || 'Chưa xác định',
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
          specialization: '',
          officeLocation: formData.officeLocation || 'Chưa cập nhật',
          expertiseLevel: formData.expertiseLevel || 'INTERMEDIATE'
        };

        await mentorService.updateMentor(selectedMentor.id, mentorData);
      }
      
      closeModal();
      loadMentors();
    } catch (err) {
      console.error('Error saving mentor:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi lưu thông tin mentor.' });
    }
  };

  const handleDelete = async () => {
    if (!selectedMentor) return;
    
    try {
      await mentorService.deleteMentor(selectedMentor.id);
      closeModal();
      loadMentors();
    } catch (err) {
      console.error('Error deleting mentor:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi xóa mentor.' });
    }
  };

  const expertiseLevelOptions = Object.values(ExpertiseLevel).map(level => ({
    value: level,
    label: new Mentor({ expertiseLevel: level }).getExpertiseLevelLabel()
  }));

  const totalPages = Math.ceil(totalMentors / pagination.size);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Mentor</h1>
          <p className="text-gray-600">Quản lý thông tin và tài khoản mentor doanh nghiệp</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Mentor
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
                placeholder="Tìm kiếm theo tên, email, công ty..."
                value={searchCriteria.keyword}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trình độ chuyên môn
                </label>
                <select
                  value={searchCriteria.expertiseLevel || ''}
                  onChange={(e) => handleFilterChange('expertiseLevel', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Tất cả trình độ</option>
                  {expertiseLevelOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Công ty
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên công ty"
                  value={searchCriteria.company || ''}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kinh nghiệm (năm)
                </label>
                <input
                  type="number"
                  placeholder="Số năm kinh nghiệm tối thiểu"
                  value={searchCriteria.minYearsOfExperience || ''}
                  onChange={(e) => handleFilterChange('minYearsOfExperience', parseInt(e.target.value) || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Xóa bộ lọc
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

      {/* Mentors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mentor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công ty / Chức vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chuyên môn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trình độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kinh nghiệm
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  </td>
                </tr>
              ) : mentors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy mentor nào
                  </td>
                </tr>
              ) : (
                mentors.map((mentor) => (
                  <tr key={mentor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <UserGroupIcon className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {mentor.user?.fullName || 'Chưa có thông tin'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {mentor.user?.email || 'Chưa có email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{mentor.company?.companyName || 'Chưa có công ty'}</div>
                          <div className="text-sm text-gray-500">{mentor.position || 'Chưa xác định'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {mentor.company?.industry || 'Chưa xác định'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {mentor.expertiseLevel ? new Mentor({ expertiseLevel: mentor.expertiseLevel }).getExpertiseLevelLabel() : 'Chưa xác định'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {mentor.yearsOfExperience || 0} năm
                      </div>
                      <div className="text-sm text-gray-500">
                        Phòng: {mentor.officeLocation || 'Chưa xác định'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal('view', mentor)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('edit', mentor)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('delete', mentor)}
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
                Hiển thị {((pagination.page - 1) * pagination.size) + 1} - {Math.min(pagination.page * pagination.size, totalMentors)} trong {totalMentors} mentor
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
                          ? 'bg-green-600 text-white border-green-600'
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
                {modalMode === 'view' && 'Chi tiết Mentor'}
                {modalMode === 'create' && 'Thêm Mentor mới'}
                {modalMode === 'edit' && 'Chỉnh sửa Mentor'}
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
                  Bạn có chắc chắn muốn xóa mentor{' '}
                  <span className="font-semibold">{selectedMentor?.user?.fullName}</span>?
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
                    <p className="mt-1 text-sm text-gray-900">{selectedMentor?.user?.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMentor?.user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMentor?.user?.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Công ty</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMentor?.company?.companyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chức vụ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMentor?.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Địa điểm làm việc</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMentor?.officeLocation || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trình độ chuyên môn</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMentor?.expertiseLevel ? new Mentor({ expertiseLevel: selectedMentor.expertiseLevel }).getExpertiseLevelLabel() : 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMentor?.yearsOfExperience} năm</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng hướng dẫn tối đa</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMentor?.maxInterns} sinh viên</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái hoạt động</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedMentor?.isActive() 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedMentor?.isActive() ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái sẵn sàng</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedMentor?.isAvailable() 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedMentor?.isAvailable() ? 'Sẵn sàng' : 'Không sẵn sàng'}
                    </span>
                  </div>
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formErrors.username ? 'border-red-300' : 'border-gray-300'
                      } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="mentor123"
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="mentor@company.com"
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleFormChange}
                      disabled={modalMode === 'edit'}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formErrors.phone ? 'border-red-300' : 'border-gray-300'
                      } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="0123456789"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Công ty <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="company"
                      value={formData.company || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formErrors.company ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Chọn công ty</option>
                      {Array.isArray(companies) && companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.companyName}
                        </option>
                      ))}
                    </select>
                    {formErrors.company && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.company}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chức vụ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formErrors.position ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Senior Developer"
                    />
                    {formErrors.position && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.position}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa điểm làm việc
                    </label>
                    <input
                      type="text"
                      name="officeLocation"
                      value={formData.officeLocation || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Tầng 3, Phòng 301"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trình độ chuyên môn <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="expertiseLevel"
                      value={formData.expertiseLevel || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formErrors.expertiseLevel ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Chọn trình độ</option>
                      {expertiseLevelOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.expertiseLevel && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.expertiseLevel}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số năm kinh nghiệm
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience || 0}
                      onChange={handleFormChange}
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        formErrors.yearsOfExperience ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.yearsOfExperience && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.yearsOfExperience}</p>
                    )}
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng hướng dẫn tối đa
                    </label>
                    <input
                      type="number"
                      name="maxInterns"
                      value={formData.maxInterns || 1}
                      onChange={handleFormChange}
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Help text for edit mode */}
                {modalMode === 'edit' && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Lưu ý:</strong> Thông tin tài khoản (tên đăng nhập, email, họ tên, số điện thoại) không thể chỉnh sửa. 
                      Chỉ có thể chỉnh sửa thông tin mentor.
                    </p>
                  </div>
                )}

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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

export default MentorManagement; 