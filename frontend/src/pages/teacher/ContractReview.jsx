import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { contractService, internshipService, studentService } from '../../services';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  DocumentCheckIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { 
  Contract, 
  Student, 
  Internship,
  PaginationOptions 
} from '../../models';

const ContractReview = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'review'
  const [selectedContract, setSelectedContract] = useState(null);
  
  // Search and filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  
  // Review form
  const [reviewData, setReviewData] = useState({
    status: '',
    teacherComments: '',
    approvalDate: '',
    rejectionReason: '',
    recommendedChanges: ''
  });
  const [reviewErrors, setReviewErrors] = useState({});
  
  // Statistics
  const [stats, setStats] = useState({
    totalContracts: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    requiresRevision: 0
  });
  
  // Pagination
  const [pagination, setPagination] = useState(new PaginationOptions({ size: 10 }));
  const [totalContracts, setTotalContracts] = useState(0);

  useEffect(() => {
    loadContractData();
  }, [user, searchKeyword, statusFilter, priorityFilter, pagination]);

  const loadContractData = async () => {
    if (!user?.teacherId) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Load contracts for review by this teacher
      const contractsResponse = await contractService.getContractsForReview(
        user.teacherId,
        {
          keyword: searchKeyword,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
          page: pagination.page,
          size: pagination.size
        }
      );
      
      setContracts(contractsResponse.data.map(contract => new Contract(contract)));
      setTotalContracts(contractsResponse.total);
      
      // Load statistics
      const statsResponse = await contractService.getContractReviewStats(user.teacherId);
      setStats(statsResponse.data);
      
    } catch (err) {
      console.error('Error loading contract data:', err);
      setError('Không thể tải dữ liệu hợp đồng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, contract = null) => {
    setModalMode(mode);
    setSelectedContract(contract);
    
    if (mode === 'review' && contract) {
      setReviewData({
        status: contract.status || 'PENDING_REVIEW',
        teacherComments: contract.teacherComments || '',
        approvalDate: '',
        rejectionReason: contract.rejectionReason || '',
        recommendedChanges: contract.recommendedChanges || ''
      });
    }
    
    setReviewErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContract(null);
    setReviewData({
      status: '',
      teacherComments: '',
      approvalDate: '',
      rejectionReason: '',
      recommendedChanges: ''
    });
    setReviewErrors({});
  };

  const validateReviewForm = () => {
    const errors = {};
    
    if (!reviewData.status) {
      errors.status = 'Vui lòng chọn trạng thái xét duyệt';
    }
    
    if (!reviewData.teacherComments?.trim()) {
      errors.teacherComments = 'Vui lòng nhập nhận xét';
    }
    
    if (reviewData.status === 'REJECTED' && !reviewData.rejectionReason?.trim()) {
      errors.rejectionReason = 'Vui lòng nhập lý do từ chối';
    }
    
    if (reviewData.status === 'REQUIRES_REVISION' && !reviewData.recommendedChanges?.trim()) {
      errors.recommendedChanges = 'Vui lòng nhập các thay đổi được đề xuất';
    }
    
    setReviewErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateReviewForm()) return;
    
    try {
      const reviewPayload = {
        ...reviewData,
        teacherId: user.teacherId,
        reviewDate: new Date().toISOString(),
        approvalDate: reviewData.status === 'APPROVED' ? new Date().toISOString() : null
      };
      
      await contractService.reviewContract(selectedContract.id, reviewPayload);
      
      closeModal();
      loadContractData();
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewErrors({ general: err.message || 'Có lỗi xảy ra khi gửi đánh giá.' });
    }
  };

  const handleDownloadContract = async (contractId) => {
    try {
      const response = await contractService.downloadContract(contractId);
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contract_${contractId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading contract:', err);
      setError('Không thể tải xuống hợp đồng.');
    }
  };

  const getStatusBadgeClass = (status) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'PENDING_REVIEW':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'APPROVED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'REQUIRES_REVISION':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'SIGNED':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'PENDING_REVIEW': 'Chờ xét duyệt',
      'APPROVED': 'Đã phê duyệt',
      'REJECTED': 'Đã từ chối',
      'REQUIRES_REVISION': 'Cần chỉnh sửa',
      'SIGNED': 'Đã ký kết',
      'DRAFT': 'Bản nháp'
    };
    return statusLabels[status] || status;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Xét duyệt Hợp đồng</h1>
          <p className="text-gray-600">Xem xét và phê duyệt các hợp đồng thực tập</p>
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
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng hợp đồng</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalContracts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xét duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingReview}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã phê duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã từ chối</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PencilSquareIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cần chỉnh sửa</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.requiresRevision}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sinh viên, công ty..."
                className="pl-10 w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING_REVIEW">Chờ xét duyệt</option>
              <option value="APPROVED">Đã phê duyệt</option>
              <option value="REJECTED">Đã từ chối</option>
              <option value="REQUIRES_REVISION">Cần chỉnh sửa</option>
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
              onClick={() => {
                setSearchKeyword('');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Xóa bộ lọc
            </button>

            <button
              onClick={loadContractData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Làm mới
            </button>
          </div>
        )}
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách Hợp đồng ({totalContracts})
          </h3>
        </div>

        {contracts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p>Chưa có hợp đồng nào cần xét duyệt.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {contracts.map((contract) => (
              <div key={contract.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {contract.student?.fullName || 'N/A'}
                      </h4>
                      <span className={getStatusBadgeClass(contract.status)}>
                        {getStatusLabel(contract.status)}
                      </span>
                      {contract.priority && (
                        <span className={getPriorityBadgeClass(contract.priority)}>
                          {contract.priority}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Công ty</p>
                          <p className="font-medium">{contract.company?.name || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Vị trí</p>
                          <p className="font-medium">{contract.internship?.position || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Thời hạn</p>
                          <p className="font-medium">{contract.getDurationString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Ngày tạo: {contract.getFormattedCreatedDate()}</p>
                        {contract.reviewDate && (
                          <p className="text-gray-600">Ngày xét duyệt: {contract.getFormattedReviewDate()}</p>
                        )}
                      </div>
                      <div>
                        {contract.salary && (
                          <p className="text-gray-600">Lương: {contract.getFormattedSalary()}</p>
                        )}
                        {contract.workingHours && (
                          <p className="text-gray-600">Giờ làm việc: {contract.workingHours}</p>
                        )}
                      </div>
                    </div>

                    {/* Teacher Comments */}
                    {contract.teacherComments && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-gray-600 mb-1">Nhận xét của giảng viên:</p>
                        <p className="text-sm text-gray-800">{contract.teacherComments}</p>
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {contract.status === 'REJECTED' && contract.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 rounded-md">
                        <p className="text-sm text-gray-600 mb-1">Lý do từ chối:</p>
                        <p className="text-sm text-red-800">{contract.rejectionReason}</p>
                      </div>
                    )}

                    {/* Recommended Changes */}
                    {contract.status === 'REQUIRES_REVISION' && contract.recommendedChanges && (
                      <div className="mb-4 p-3 bg-orange-50 rounded-md">
                        <p className="text-sm text-gray-600 mb-1">Thay đổi đề xuất:</p>
                        <p className="text-sm text-orange-800">{contract.recommendedChanges}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => openModal('view', contract)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </button>
                    
                    {contract.status === 'PENDING_REVIEW' && (
                      <button
                        onClick={() => openModal('review', contract)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <DocumentCheckIcon className="h-4 w-4 mr-2" />
                        Xét duyệt
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDownloadContract(contract.id)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Tải xuống
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalContracts > pagination.size && (
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
                disabled={(pagination.page + 1) * pagination.size >= totalContracts}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contract Detail/Review Modal */}
      {showModal && selectedContract && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalMode === 'view' ? 'Chi tiết Hợp đồng' : 'Xét duyệt Hợp đồng'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="space-y-6">
                {/* Contract Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Thông tin Sinh viên</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Họ tên:</strong> {selectedContract.student?.fullName}</p>
                      <p><strong>Mã SV:</strong> {selectedContract.student?.studentCode}</p>
                      <p><strong>Email:</strong> {selectedContract.student?.email}</p>
                      <p><strong>Lớp:</strong> {selectedContract.student?.className}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Thông tin Công ty</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Tên công ty:</strong> {selectedContract.company?.name}</p>
                      <p><strong>Địa chỉ:</strong> {selectedContract.company?.address}</p>
                      <p><strong>Người liên hệ:</strong> {selectedContract.company?.contactPerson}</p>
                      <p><strong>Email:</strong> {selectedContract.company?.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Chi tiết Thực tập</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p><strong>Vị trí:</strong> {selectedContract.internship?.position}</p>
                    <p><strong>Thời gian:</strong> {selectedContract.getDurationString()}</p>
                    <p><strong>Lương:</strong> {selectedContract.getFormattedSalary()}</p>
                    <p><strong>Giờ làm việc:</strong> {selectedContract.workingHours}</p>
                  </div>
                </div>

                {selectedContract.description && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Mô tả công việc</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedContract.description}
                    </p>
                  </div>
                )}

                {selectedContract.terms && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Điều khoản hợp đồng</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedContract.terms}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Contract Summary */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Tóm tắt Hợp đồng</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p><strong>Sinh viên:</strong> {selectedContract.student?.fullName}</p>
                    <p><strong>Công ty:</strong> {selectedContract.company?.name}</p>
                    <p><strong>Vị trí:</strong> {selectedContract.internship?.position}</p>
                    <p><strong>Thời gian:</strong> {selectedContract.getDurationString()}</p>
                  </div>
                </div>

                {/* Review Form */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái xét duyệt *
                  </label>
                  <select
                    value={reviewData.status}
                    onChange={(e) => setReviewData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="APPROVED">Phê duyệt</option>
                    <option value="REJECTED">Từ chối</option>
                    <option value="REQUIRES_REVISION">Yêu cầu chỉnh sửa</option>
                  </select>
                  {reviewErrors.status && (
                    <p className="mt-1 text-sm text-red-600">{reviewErrors.status}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét của giảng viên *
                  </label>
                  <textarea
                    rows={4}
                    value={reviewData.teacherComments}
                    onChange={(e) => setReviewData(prev => ({ ...prev, teacherComments: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập nhận xét về hợp đồng thực tập..."
                  />
                  {reviewErrors.teacherComments && (
                    <p className="mt-1 text-sm text-red-600">{reviewErrors.teacherComments}</p>
                  )}
                </div>

                {reviewData.status === 'REJECTED' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lý do từ chối *
                    </label>
                    <textarea
                      rows={3}
                      value={reviewData.rejectionReason}
                      onChange={(e) => setReviewData(prev => ({ ...prev, rejectionReason: e.target.value }))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Nêu rõ lý do từ chối hợp đồng..."
                    />
                    {reviewErrors.rejectionReason && (
                      <p className="mt-1 text-sm text-red-600">{reviewErrors.rejectionReason}</p>
                    )}
                  </div>
                )}

                {reviewData.status === 'REQUIRES_REVISION' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thay đổi đề xuất *
                    </label>
                    <textarea
                      rows={3}
                      value={reviewData.recommendedChanges}
                      onChange={(e) => setReviewData(prev => ({ ...prev, recommendedChanges: e.target.value }))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Mô tả các thay đổi cần thiết..."
                    />
                    {reviewErrors.recommendedChanges && (
                      <p className="mt-1 text-sm text-red-600">{reviewErrors.recommendedChanges}</p>
                    )}
                  </div>
                )}

                {reviewErrors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-800">{reviewErrors.general}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Gửi xét duyệt
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

export default ContractReview;