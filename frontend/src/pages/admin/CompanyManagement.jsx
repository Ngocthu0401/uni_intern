import { useState, useEffect } from 'react';
import {
  BuildingOfficeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { companyService } from '../../services';
import { 
  Company, 
  CreateCompanyRequest, 
  UpdateCompanyRequest,
  CompanySearchCriteria,
  PaginationOptions,
  CompanyType,
  IndustryType,
  CompanySize 
} from '../../models';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit', 'delete'
  const [showFilters, setShowFilters] = useState(false);

  // Search and filtering
  const [searchCriteria, setSearchCriteria] = useState(new CompanySearchCriteria());
  const [pagination, setPagination] = useState(new PaginationOptions());
  const [totalCompanies, setTotalCompanies] = useState(0);

  // Form data
  const [formData, setFormData] = useState(new CreateCompanyRequest());
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCompanies();
  }, [searchCriteria, pagination]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await companyService.searchCompanies(searchCriteria, pagination);
      setCompanies(response.data.map(company => {
        // Map backend fields to frontend model fields
        return {
          id: company.id,
          companyName: company.companyName,
          abbreviatedName: company.abbreviatedName,
          companyCode: company.companyCode,
          companyType: company.companyType,
          industry: company.industry,
          companySize: company.companySize,
          address: company.address,
          email: company.email,
          phoneNumber: company.phoneNumber,
          website: company.website,
          description: company.description,
          contactPerson: company.contactPerson,
          contactPosition: company.contactPosition,
          contactPhone: company.contactPhone,
          contactEmail: company.contactEmail,
          isActive: company.isActive,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt
        };
      }));
      setTotalCompanies(response.total);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Không thể tải danh sách công ty. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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
    setSearchCriteria(new CompanySearchCriteria());
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const openModal = (mode, company = null) => {
    setModalMode(mode);
    setSelectedCompany(company);
    
    if (mode === 'create') {
      setFormData(new CreateCompanyRequest());
    } else if (mode === 'edit' && company) {
      // Properly map company data for edit form
      setFormData({
        companyName: company.companyName || '',
        abbreviatedName: company.abbreviatedName || '',
        companyCode: company.companyCode || '',
        companyType: company.companyType || '',
        industry: company.industry || '',
        companySize: company.companySize || '',
        address: company.address || '',
        email: company.email || '',
        phoneNumber: company.phoneNumber || '',
        website: company.website || '',
        contactPerson: company.contactPerson || '',
        contactPosition: company.contactPosition || '',
        contactPhone: company.contactPhone || '',
        contactEmail: company.contactEmail || '',
        description: company.description || ''
      });
    }
    
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
    setFormData(new CreateCompanyRequest());
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
    
    if (!formData.companyName?.trim()) {
      errors.companyName = 'Tên công ty không được để trống';
    }
    
    if (!formData.abbreviatedName?.trim()) {
      errors.abbreviatedName = 'Tên viết tắt không được để trống';
    }
    
    if (!formData.companyType?.trim()) {
      errors.companyType = 'Loại hình công ty không được để trống';
    }
    
    if (!formData.industry?.trim()) {
      errors.industry = 'Ngành nghề không được để trống';
    }
    
    if (!formData.address?.trim()) {
      errors.address = 'Địa chỉ không được để trống';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Map frontend form data to backend Company entity structure
      const companyData = {
        companyName: formData.companyName,
        abbreviatedName: formData.abbreviatedName,
        companyCode: formData.companyCode || null,
        companyType: formData.companyType,
        industry: formData.industry,
        companySize: formData.companySize || null,
        address: formData.address,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        website: formData.website,
        contactPerson: formData.contactPerson,
        contactPosition: formData.contactPosition || null,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        description: formData.description,
        isActive: true
      };

      if (modalMode === 'create') {
        await companyService.createCompany(companyData);
      } else if (modalMode === 'edit') {
        await companyService.updateCompany(selectedCompany.id, companyData);
      }
      
      closeModal();
      loadCompanies();
    } catch (err) {
      console.error('Error saving company:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi lưu thông tin công ty.' });
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;
    
    try {
      await companyService.deleteCompany(selectedCompany.id);
      closeModal();
      loadCompanies();
    } catch (err) {
      console.error('Error deleting company:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi xóa công ty.' });
    }
  };

  const handleExport = async () => {
    try {
      const blob = await companyService.exportCompanies(searchCriteria);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `companies_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting companies:', err);
      setError('Không thể xuất danh sách công ty.');
    }
  };

  const totalPages = Math.ceil(totalCompanies / pagination.size);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Công ty</h1>
          <p className="text-gray-600">Quản lý thông tin và hợp tác với các công ty</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Xuất Excel
          </button>
          <button
            onClick={() => openModal('create')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm Công ty
          </button>
        </div>
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
                placeholder="Tìm kiếm theo tên công ty, ngành nghề..."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngành nghề
                </label>
                <input
                  type="text"
                  placeholder="Nhập ngành nghề"
                  value={searchCriteria.industry || ''}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại hình
                </label>
                <input
                  type="text"
                  placeholder="Nhập loại hình công ty"
                  value={searchCriteria.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm
                </label>
                <input
                  type="text"
                  placeholder="Nhập địa điểm"
                  value={searchCriteria.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công ty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại hình / Ngành
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
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
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy công ty nào
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {company.companyName || 'Chưa có tên'}
                            {company.abbreviatedName && <span className="ml-2 text-xs text-gray-500">({company.abbreviatedName})</span>}
                          </div>
                          <div className="text-sm text-gray-500">
                            {company.companyType ? new Company({ companyType: company.companyType }).getCompanyTypeLabel() : 'Chưa xác định'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.companySize ? new Company({ companySize: company.companySize }).getCompanySizeLabel() : 'Chưa xác định'}
                      </div>
                      <div className="text-sm text-gray-500">{company.industry || 'Chưa xác định'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.email || 'Chưa có email'}</div>
                      <div className="text-sm text-gray-500">{company.phoneNumber || 'Chưa có SĐT'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.address || 'Chưa có địa chỉ'}</div>
                      <div className="text-sm text-gray-500">{company.website || 'Chưa có website'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        company.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {company.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal('view', company)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('edit', company)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('delete', company)}
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
                Hiển thị {(pagination.page * pagination.size) + 1} - {Math.min((pagination.page + 1) * pagination.size, totalCompanies)} trong {totalCompanies} công ty
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 0}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(0, pagination.page - 2);
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
                      {page + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages - 1}
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
                {modalMode === 'view' && 'Chi tiết Công ty'}
                {modalMode === 'create' && 'Thêm Công ty mới'}
                {modalMode === 'edit' && 'Chỉnh sửa Công ty'}
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
                  Bạn có chắc chắn muốn xóa công ty{' '}
                  <span className="font-semibold">{selectedCompany?.companyName}</span>?
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
                    <label className="block text-sm font-medium text-gray-700">Tên công ty</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.companyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên viết tắt</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.abbreviatedName || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã công ty</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.companyCode || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Loại hình công ty</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.companyType ? new Company({ companyType: selectedCompany.companyType }).getCompanyTypeLabel() : 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quy mô</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedCompany?.companySize ? new Company({ companySize: selectedCompany.companySize }).getCompanySizeLabel() : 'Chưa xác định'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngành nghề</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.industry}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.website}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Người liên hệ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.contactPerson || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chức vụ người liên hệ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.contactPosition || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email liên hệ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.contactEmail || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SĐT liên hệ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany?.contactPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedCompany?.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedCompany?.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
                {selectedCompany?.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên công ty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.companyName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Công ty ABC"
                    />
                    {formErrors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.companyName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên viết tắt <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="abbreviatedName"
                      value={formData.abbreviatedName || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.abbreviatedName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="VD: ABC, XYZ..."
                    />
                    {formErrors.abbreviatedName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.abbreviatedName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại hình công ty <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="companyType"
                      value={formData.companyType || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.companyType ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Chọn loại hình công ty</option>
                      {Object.values(CompanyType).map(type => (
                        <option key={type} value={type}>
                          {new Company({ companyType: type }).getCompanyTypeLabel()}
                        </option>
                      ))}
                    </select>
                    {formErrors.companyType && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.companyType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngành nghề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.industry ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Công nghệ thông tin"
                    />
                    {formErrors.industry && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.industry}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quy mô công ty
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn quy mô công ty</option>
                      {Object.values(CompanySize).map(size => (
                        <option key={size} value={size}>
                          {new Company({ companySize: size }).getCompanySizeLabel()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="contact@company.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="028-1234-5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Người liên hệ
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chức vụ người liên hệ
                    </label>
                    <input
                      type="text"
                      name="contactPosition"
                      value={formData.contactPosition || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Giám đốc nhân sự"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SĐT người liên hệ
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email người liên hệ
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="hr@company.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description || ''}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mô tả về công ty..."
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement; 