import { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  XMarkIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { batchService } from '../../services';
import { 
  Batch, 
  CreateBatchRequest, 
  UpdateBatchRequest,
  BatchSearchCriteria,
  PaginationOptions,
  BatchStatus,
  Semester 
} from '../../models';

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit', 'delete'
  const [showFilters, setShowFilters] = useState(false);

  // Search and filtering
  const [searchCriteria, setSearchCriteria] = useState(new BatchSearchCriteria());
  const [pagination, setPagination] = useState(new PaginationOptions());
  const [totalBatches, setTotalBatches] = useState(0);

  // Form data
  const [formData, setFormData] = useState(new CreateBatchRequest());
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadBatches();
  }, [searchCriteria, pagination]);

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await batchService.searchBatches(searchCriteria, pagination);
      
      if (response.error) {
        setError(response.error);
        setBatches([]);
        setTotalBatches(0);
      } else {
        setBatches(response.data.map(batch => new Batch(batch)));
        setTotalBatches(response.total);
      }
    } catch (err) {
      console.error('Error loading batches:', err);
      setError('Không thể tải danh sách đợt thực tập. Vui lòng thử lại.');
      setBatches([]);
      setTotalBatches(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchCriteria(prev => ({ ...prev, keyword }));
    setPagination(new PaginationOptions({ ...pagination, page: 1 })); // Reset to first page
  };

  const handleFilterChange = (field, value) => {
    setSearchCriteria(prev => ({ ...prev, [field]: value }));
    setPagination(new PaginationOptions({ ...pagination, page: 1 }));
  };

  const clearFilters = () => {
    setSearchCriteria(new BatchSearchCriteria());
    setPagination(new PaginationOptions({ ...pagination, page: 1 }));
  };

  const handlePageChange = (page) => {
    // Ensure page is valid
    const validPage = Math.max(1, Math.min(page, Math.ceil(totalBatches / pagination.size)));
    setPagination(new PaginationOptions({ ...pagination, page: validPage }));
  };

  const openModal = (mode, batch = null) => {
    setModalMode(mode);
    setSelectedBatch(batch);
    
    if (mode === 'create') {
      setFormData(new CreateBatchRequest());
    } else if (mode === 'edit' && batch) {
      // Properly map batch data for edit form
      setFormData({
        name: batch.batchName || batch.name || '',                    // batchName -> name for form
        batchCode: batch.batchCode || '',                            // Include batchCode
        semester: batch.semester || '',
        academicYear: batch.academicYear || '',
        maxStudents: batch.maxStudents || 0,
        registrationStartDate: batch.registrationStartDate || '',
        registrationEndDate: batch.registrationEndDate || '',
        internshipStartDate: batch.startDate || '',                  // startDate -> internshipStartDate for form
        internshipEndDate: batch.endDate || '',                      // endDate -> internshipEndDate for form
        description: batch.description || ''
      });
    }
    
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBatch(null);
    setFormData(new CreateBatchRequest());
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseInt(value) || 0 : value 
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Tên đợt thực tập không được để trống';
    }
    
    if (!formData.batchCode?.trim()) {
      errors.batchCode = 'Mã đợt thực tập không được để trống';
    }
    
    if (!formData.semester) {
      errors.semester = 'Vui lòng chọn học kỳ';
    }
    
    if (!formData.academicYear?.trim()) {
      errors.academicYear = 'Năm học không được để trống';
    }
    
    if (!formData.registrationStartDate) {
      errors.registrationStartDate = 'Ngày bắt đầu đăng ký không được để trống';
    }
    
    if (!formData.registrationEndDate) {
      errors.registrationEndDate = 'Ngày kết thúc đăng ký không được để trống';
    }
    
    if (!formData.internshipStartDate) {
      errors.internshipStartDate = 'Ngày bắt đầu thực tập không được để trống';
    }
    
    if (!formData.internshipEndDate) {
      errors.internshipEndDate = 'Ngày kết thúc thực tập không được để trống';
    }
    
    if (formData.maxStudents <= 0) {
      errors.maxStudents = 'Số lượng sinh viên tối đa phải lớn hơn 0';
    }
    
    // Date validation
    const regStart = new Date(formData.registrationStartDate);
    const regEnd = new Date(formData.registrationEndDate);
    const internStart = new Date(formData.internshipStartDate);
    const internEnd = new Date(formData.internshipEndDate);
    
    if (regStart >= regEnd) {
      errors.registrationEndDate = 'Ngày kết thúc đăng ký phải sau ngày bắt đầu';
    }
    
    if (internStart >= internEnd) {
      errors.internshipEndDate = 'Ngày kết thúc thực tập phải sau ngày bắt đầu';
    }
    
    if (regEnd >= internStart) {
      errors.internshipStartDate = 'Ngày bắt đầu thực tập phải sau ngày kết thúc đăng ký';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Map frontend form data to backend InternshipBatch entity structure
      const batchData = {
        batchName: formData.name,                           // name -> batchName
        batchCode: formData.batchCode || `BATCH_${Date.now()}`, // Auto-generate if not provided
        semester: formData.semester,
        academicYear: formData.academicYear,
        maxStudents: formData.maxStudents,
        registrationStartDate: formData.registrationStartDate,
        registrationEndDate: formData.registrationEndDate,
        startDate: formData.internshipStartDate,            // internshipStartDate -> startDate
        endDate: formData.internshipEndDate,                // internshipEndDate -> endDate
        description: formData.description
      };

      if (modalMode === 'create') {
        await batchService.createBatch(batchData);
      } else if (modalMode === 'edit') {
        await batchService.updateBatch(selectedBatch.id, batchData);
      }
      
      closeModal();
      loadBatches();
    } catch (err) {
      console.error('Error saving batch:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi lưu thông tin đợt thực tập.' });
    }
  };

  const handleDelete = async () => {
    if (!selectedBatch) return;
    
    try {
      await batchService.deleteBatch(selectedBatch.id);
      closeModal();
      loadBatches();
    } catch (err) {
      console.error('Error deleting batch:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi xóa đợt thực tập.' });
    }
  };

  const statusOptions = Object.values(BatchStatus).map(status => ({
    value: status,
    label: new Batch({ status }).getStatusLabel()
  }));

  const semesterOptions = Object.values(Semester).map(semester => ({
    value: semester,
    label: new Batch({ semester }).getSemesterLabel()
  }));

  const totalPages = Math.ceil(totalBatches / pagination.size);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đợt thực tập</h1>
          <p className="text-gray-600">Quản lý các đợt thực tập theo học kỳ và năm học</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Tạo Đợt thực tập
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
                placeholder="Tìm kiếm theo tên, năm học..."
                value={searchCriteria.keyword}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  Trạng thái
                </label>
                <select
                  value={searchCriteria.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Tất cả trạng thái</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Học kỳ
                </label>
                <select
                  value={searchCriteria.semester || ''}
                  onChange={(e) => handleFilterChange('semester', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Tất cả học kỳ</option>
                  {semesterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Năm học
                </label>
                <input
                  type="text"
                  placeholder="VD: 2023-2024"
                  value={searchCriteria.academicYear || ''}
                  onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái đăng ký
                </label>
                <select
                  value={searchCriteria.registrationOpen || ''}
                  onChange={(e) => handleFilterChange('registrationOpen', e.target.value === 'true' ? true : e.target.value === 'false' ? false : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Tất cả</option>
                  <option value="true">Đang mở đăng ký</option>
                  <option value="false">Đã đóng đăng ký</option>
                </select>
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

      {/* Batches Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đợt thực tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học kỳ / Năm học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian thực tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy đợt thực tập nào
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {batch.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {batch.description || 'Không có mô tả'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{batch.getSemesterLabel()}</div>
                          <div className="text-sm text-gray-500">{batch.academicYear}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {batch.getFormattedRegistrationStartDate()}
                      </div>
                      <div className="text-sm text-gray-500">
                        đến {batch.getFormattedRegistrationEndDate()}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          batch.isRegistrationOpen() 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {batch.isRegistrationOpen() ? 'Đang mở' : 'Đã đóng'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {batch.getFormattedInternshipStartDate()}
                      </div>
                      <div className="text-sm text-gray-500">
                        đến {batch.getFormattedInternshipEndDate()}
                      </div>
                      <div className="text-sm text-gray-500">
                        ({batch.getDurationInWeeks()} tuần)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {batch.currentStudents}/{batch.maxStudents}
                          </div>
                          <div className="text-sm text-gray-500">
                            sinh viên
                          </div>
                        </div>
                      </div>
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${batch.getEnrollmentProgress()}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        batch.isActive() 
                          ? 'bg-green-100 text-green-800' 
                          : batch.isDraft()
                          ? 'bg-yellow-100 text-yellow-800'
                          : batch.isCompleted()
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {batch.getStatusLabel()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal('view', batch)}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('edit', batch)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('delete', batch)}
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
                Hiển thị {((pagination.page - 1) * pagination.size) + 1} - {Math.min(pagination.page * pagination.size, totalBatches)} trong {totalBatches} đợt thực tập
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
                          ? 'bg-purple-600 text-white border-purple-600'
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
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === 'view' && 'Chi tiết Đợt thực tập'}
                {modalMode === 'create' && 'Tạo Đợt thực tập mới'}
                {modalMode === 'edit' && 'Chỉnh sửa Đợt thực tập'}
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
                  Bạn có chắc chắn muốn xóa đợt thực tập{' '}
                  <span className="font-semibold">{selectedBatch?.name}</span>?
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên đợt thực tập</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBatch?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã đợt thực tập</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBatch?.batchCode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedBatch?.isActive() 
                        ? 'bg-green-100 text-green-800' 
                        : selectedBatch?.isDraft()
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedBatch?.getStatusLabel()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Học kỳ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBatch?.getSemesterLabel()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Năm học</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBatch?.academicYear}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Thời gian đăng ký</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedBatch?.getFormattedRegistrationStartDate()} - {selectedBatch?.getFormattedRegistrationEndDate()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Thời gian thực tập</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedBatch?.getFormattedInternshipStartDate()} - {selectedBatch?.getFormattedInternshipEndDate()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng sinh viên</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedBatch?.currentStudents}/{selectedBatch?.maxStudents} sinh viên
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Thời lượng</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedBatch?.getDurationInWeeks()} tuần
                    </p>
                  </div>
                </div>
                {selectedBatch?.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBatch.description}</p>
                  </div>
                )}
                {selectedBatch?.eligibilityRequirements?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yêu cầu tham gia</label>
                    <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                      {selectedBatch.eligibilityRequirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên đợt thực tập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Thực tập HK1 2023-2024"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã đợt thực tập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="batchCode"
                      value={formData.batchCode || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        formErrors.batchCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="BATCH_2024_1"
                    />
                    {formErrors.batchCode && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.batchCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Học kỳ <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="semester"
                      value={formData.semester || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        formErrors.semester ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Chọn học kỳ</option>
                      {semesterOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.semester && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.semester}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Năm học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="academicYear"
                      value={formData.academicYear || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        formErrors.academicYear ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="2023-2024"
                    />
                    {formErrors.academicYear && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.academicYear}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng sinh viên tối đa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="maxStudents"
                      value={formData.maxStudents || 0}
                      onChange={handleFormChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        formErrors.maxStudents ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.maxStudents && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.maxStudents}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu đăng ký <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="registrationStartDate"
                      value={formData.registrationStartDate || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        formErrors.registrationStartDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.registrationStartDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.registrationStartDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc đăng ký <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="registrationEndDate"
                      value={formData.registrationEndDate || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        formErrors.registrationEndDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.registrationEndDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.registrationEndDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu thực tập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="internshipStartDate"
                      value={formData.internshipStartDate || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        formErrors.internshipStartDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.internshipStartDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.internshipStartDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc thực tập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="internshipEndDate"
                      value={formData.internshipEndDate || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        formErrors.internshipEndDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.internshipEndDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.internshipEndDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Mô tả chi tiết về đợt thực tập..."
                  />
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
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {modalMode === 'create' ? 'Tạo' : 'Cập nhật'}
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

export default BatchManagement; 