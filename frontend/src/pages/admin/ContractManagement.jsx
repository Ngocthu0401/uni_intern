import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TableCellsIcon,
  PrinterIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { contractService, internshipService, apiHelpers } from '../../services';
import { useAuth } from '../../context/AuthContext';

const ContractManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [availableInternships, setAvailableInternships] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [bulkAction, setBulkAction] = useState('approve');
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Form data for creating new contract
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    termsAndConditions: '',
    supportAmount: '',
    paymentTerms: '',
    startDate: '',
    endDate: '',
    internshipId: ''
  });

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user?.id) {
      loadContracts();
      loadAvailableInternships();
    }
  }, [authLoading, user?.id, pagination.page, pagination.size, searchKeyword, filterStatus]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy: 'id',
        sortDir: 'desc'
      };

      // For admin, get all contracts instead of by teacher
      const response = await contractService.getAllContracts(params);

      let filteredContracts = response.content || response.data || [];

      // Apply status filter
      if (filterStatus !== 'ALL') {
        filteredContracts = filteredContracts.filter(contract =>
          contract.status === filterStatus
        );
      }

      // Apply type filter
      if (filterType !== 'ALL') {
        filteredContracts = filteredContracts.filter(contract =>
          contract.contractType === filterType
        );
      }

      // Apply search filter
      if (searchKeyword.trim()) {
        filteredContracts = filteredContracts.filter(contract =>
          contract.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          contract.contractCode?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          contract.internship?.student?.user?.fullName?.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      // Apply date range filter
      if (dateRange.start && dateRange.end) {
        filteredContracts = filteredContracts.filter(contract => {
          const contractDate = new Date(contract.createdAt);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          return contractDate >= startDate && contractDate <= endDate;
        });
      }

      setContracts(filteredContracts);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalElements: response.totalElements || filteredContracts.length
      }));

    } catch (err) {
      console.error('Error loading contracts:', err);
      setError(apiHelpers.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContract = async () => {
    try {
      // Generate contract code
      const contractCode = await contractService.generateContractCode();

      const contractData = {
        ...formData,
        contractCode: contractCode,
        supportAmount: parseFloat(formData.supportAmount) || 0,
        contractType: 'SUPPORT',
        status: 'DRAFT',
        approvalStatus: 'PENDING'
      };

      // Only include internshipId if it's not empty
      if (formData.internshipId && formData.internshipId.trim() !== '') {
        contractData.internshipId = formData.internshipId;
      } else {
        // Remove empty internshipId to avoid confusion
        delete contractData.internshipId;
      }

      await contractService.createSupportContract(contractData);
      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        termsAndConditions: '',
        supportAmount: '',
        paymentTerms: '',
        startDate: '',
        endDate: '',
        internshipId: ''
      });
      loadContracts();
    } catch (err) {
      console.error('Error creating contract:', err);
      setError(apiHelpers.formatErrorMessage(err));
    }
  };

  const handleApproveContract = async (contractId) => {
    try {
      const approvedBy = user.fullName || user.username;
      await contractService.approveContract(contractId, approvedBy);
      loadContracts();
    } catch (err) {
      console.error('Error approving contract:', err);
      setError(apiHelpers.formatErrorMessage(err));
    }
  };

  const handleUpdatePayment = async (contractId, paymentStatus) => {
    try {
      await contractService.updatePaymentStatus(contractId, paymentStatus);
      loadContracts();
    } catch (err) {
      console.error('Error updating payment:', err);
      setError(apiHelpers.formatErrorMessage(err));
    }
  };

  const loadAvailableInternships = async () => {
    try {
      // Get all internships for admin
      const response = await internshipService.getInternships();
      setAvailableInternships(response.content || response.data || response || []);
    } catch (err) {
      console.error('Error loading internships:', err);
      // Don't set error state for this as it's optional
    }
  };

  const handleRejectContract = async (contractId) => {
    try {
      const rejectedBy = user.fullName || user.username;
      await contractService.rejectContract(contractId, rejectedBy);
      setShowDetailModal(false);
      loadContracts();
    } catch (err) {
      console.error('Error rejecting contract:', err);
      setError(apiHelpers.formatErrorMessage(err));
    }
  };

  const handleTerminateContract = async (contractId) => {
    if (!window.confirm('Bạn có chắc chắn muốn chấm dứt hợp đồng này?')) {
      return;
    }

    try {
      await contractService.terminateContract(contractId);
      setShowDetailModal(false);
      loadContracts();
    } catch (err) {
      console.error('Error terminating contract:', err);
      setError(apiHelpers.formatErrorMessage(err));
    }
  };

  const handleUpdateStatus = async () => {
    try {
      if (!selectedContract) return;

      // Update contract status
      if (newStatus !== selectedContract.status) {
        await contractService.updateContractStatus(selectedContract.id, newStatus);
      }

      // Update payment status
      if (newPaymentStatus !== selectedContract.paymentStatus) {
        await contractService.updatePaymentStatus(selectedContract.id, newPaymentStatus);
      }

      setShowStatusModal(false);
      setSelectedContract(null);
      loadContracts();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(apiHelpers.formatErrorMessage(err));
    }
  };

  const handleBulkAction = async () => {
    try {
      if (selectedContracts.length === 0) return;

      const promises = selectedContracts.map(contractId => {
        if (bulkAction === 'approve') {
          return contractService.approveContract(contractId, user.fullName || user.username);
        } else if (bulkAction === 'reject') {
          return contractService.rejectContract(contractId, user.fullName || user.username);
        } else if (bulkAction === 'payment') {
          return contractService.updatePaymentStatus(contractId, 'PAID');
        } else if (bulkAction === 'terminate') {
          return contractService.terminateContract(contractId);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setSelectedContracts([]);
      setShowBulkModal(false);
      loadContracts();
    } catch (err) {
      console.error('Error in bulk action:', err);
      setError(apiHelpers.formatErrorMessage(err));
    }
  };

  const handleSelectContract = (contractId) => {
    setSelectedContracts(prev => {
      if (prev.includes(contractId)) {
        return prev.filter(id => id !== contractId);
      } else {
        return [...prev, contractId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedContracts.length === contracts.length) {
      setSelectedContracts([]);
    } else {
      setSelectedContracts(contracts.map(c => c.id));
    }
  };

  // const handleExportContracts = () => {
  //   const csvData = [
  //     ['Tiêu đề', 'Mã hợp đồng', 'Sinh viên', 'Mức hỗ trợ', 'Trạng thái', 'Ngày tạo'].join(','),
  //     ...contracts.map(contract => [
  //       `"${contract.title || ''}",`,
  //       `"${contract.contractCode || ''}",`,
  //       `"${contract.internship?.student?.user?.fullName || ''}",`,
  //       `"${contract.supportAmount || '0'}",`,
  //       `"${getStatusText(contract.status)}",`,
  //       `"${formatDate(contract.createdAt)}"`
  //     ].join(''))
  //   ].join('\n');

  //   const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `contracts_${new Date().toISOString().split('T')[0]}.csv`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  // const getStatusText = (status) => {
  //   const statusMap = {
  //     'DRAFT': 'Bản nháp',
  //     'PENDING': 'Chờ duyệt',
  //     'SIGNED': 'Đã ký',
  //     'ACTIVE': 'Đang hoạt động',
  //     'PAID': 'Đã thanh toán',
  //     'REJECTED': 'Từ chối',
  //     'EXPIRED': 'Hết hạn',
  //     'TERMINATED': 'Chấm dứt'
  //   };
  //   return statusMap[status] || status;
  // };

  const getStatusBadge = (status) => {
    const statusMap = {
      'DRAFT': { color: 'gray', icon: DocumentTextIcon, text: 'Bản nháp' },
      'PENDING': { color: 'yellow', icon: ClockIcon, text: 'Chờ duyệt' },
      'SIGNED': { color: 'blue', icon: DocumentCheckIcon, text: 'Đã ký' },
      'ACTIVE': { color: 'green', icon: CheckCircleIcon, text: 'Đang hoạt động' },
      'PAID': { color: 'emerald', icon: BanknotesIcon, text: 'Đã thanh toán' },
      'REJECTED': { color: 'red', icon: XCircleIcon, text: 'Từ chối' },
      'EXPIRED': { color: 'gray', icon: ClockIcon, text: 'Hết hạn' },
      'TERMINATED': { color: 'red', icon: XCircleIcon, text: 'Chấm dứt' }
    };

    const config = statusMap[status] || statusMap['DRAFT'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải hợp đồng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadContracts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    total: contracts.length,
    pending: contracts.filter(c => c.status === 'PENDING').length,
    signed: contracts.filter(c => c.status === 'SIGNED' || c.status === 'ACTIVE').length,
    paid: contracts.filter(c => c.status === 'PAID').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Hợp đồng</h1>
              <p className="mt-2 text-gray-600">Tạo và quản lý hợp đồng hỗ trợ thực tập cho sinh viên</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="!flex !items-center !px-4 !py-2 !bg-blue-600 !text-white !rounded-lg !hover:bg-blue-700"
            >
              <PlusIcon className="!w-5 !h-5 !mr-2" />
              Tạo hợp đồng mới
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng hợp đồng</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã ký</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.signed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã thanh toán</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.paid}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Tìm theo tiêu đề, mã hợp đồng..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="DRAFT">Bản nháp</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="SIGNED">Đã ký</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="REJECTED">Từ chối</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại hợp đồng</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả loại</option>
                <option value="SUPPORT">Hỗ trợ</option>
                <option value="INTERNSHIP">Thực tập</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {selectedContracts.length > 0 && (
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <DocumentCheckIcon className="w-4 w-4 mr-2" />
                  Thao tác hàng loạt ({selectedContracts.length})
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* <button
                onClick={handleExportContracts}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <TableCellsIcon className="w-4 w-4 mr-2" />
                Xuất CSV
              </button> */}
              <button
                onClick={loadContracts}
                className="!px-4 !py-2 !bg-gray-600 !text-white !rounded-lg !hover:bg-gray-700"
              >
                Tải lại
              </button>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="!bg-white !rounded-lg !shadow-sm !border !border-gray-200">
          {contracts.length === 0 ? (
            <div className="p-8 text-center">
              <DocumentTextIcon className="!h-12 !w-12 !text-gray-400 !mx-auto !mb-4" />
              <h3 className="!text-lg !font-medium !text-gray-900 !mb-2">Chưa có hợp đồng nào</h3>
              <p className="!text-gray-600 !mb-4">Tạo hợp đồng hỗ trợ đầu tiên cho sinh viên thực tập.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="!flex !items-center !px-4 !py-2 !bg-blue-600 !text-white !rounded-lg !hover:bg-blue-700 !mx-auto"
              >
                <PlusIcon className="!w-5 !h-5 !mr-2" />
                Tạo hợp đồng mới
              </button>
            </div>
          ) : (
            <div className="!overflow-x-auto">
              <table className="!min-w-full !divide-y !divide-gray-200">
                <thead className="!bg-gray-50">
                  <tr>
                    <th className="!px-6 !py-3 !text-left !text-xs !font-medium !text-gray-500 !uppercase !tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedContracts.length === contracts.length && contracts.length > 0}
                        onChange={handleSelectAll}
                        className="!h-4 !w-4 !text-blue-600 !focus:ring-blue-500 !border-gray-300 !rounded"
                      />
                    </th>
                    <th className="!px-6 !py-3 !text-left !text-xs !font-medium !text-gray-500 !uppercase !tracking-wider">
                      Hợp đồng
                    </th>
                    <th className="!px-6 !py-3 !text-left !text-xs !font-medium !text-gray-500 !uppercase !tracking-wider">
                      Sinh viên
                    </th>
                    <th className="!px-6 !py-3 !text-left !text-xs !font-medium !text-gray-500 !uppercase !tracking-wider">
                      Mức hỗ trợ
                    </th>
                    <th className="!px-6 !py-3 !text-left !text-xs !font-medium !text-gray-500 !uppercase !tracking-wider">
                      Trạng thái
                    </th>
                    <th className="!px-6 !py-3 !text-left !text-xs !font-medium !text-gray-500 !uppercase !tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="!px-6 !py-3 !text-left !text-xs !font-medium !text-gray-500 !uppercase !tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="!bg-white !divide-y !divide-gray-200">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="!hover:bg-gray-50">
                      <td className="!px-6 !py-4 !whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedContracts.includes(contract.id)}
                          onChange={() => handleSelectContract(contract.id)}
                          className="!h-4 !w-4 !text-blue-600 !focus:ring-blue-500 !border-gray-300 !rounded"
                        />
                      </td>
                      <td className="!px-6 !py-4 !whitespace-nowrap">
                        <div className="flex items-center">
                          <DocumentTextIcon className="!h-5 !w-5 !text-gray-400 !mr-3" />
                          <div>
                            <div className="!text-sm !font-medium !text-gray-900">{contract.title}</div>
                            <div className="!text-sm !text-gray-500">{contract.contractCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="!px-6 !py-4 !whitespace-nowrap">
                        <div className="!text-sm !text-gray-900">
                          {contract.internship?.student?.user?.fullName || 'N/A'}
                        </div>
                        <div className="!text-sm !text-gray-500">
                          {contract.internship?.student?.studentCode || ''}
                        </div>
                      </td>
                      <td className="!px-6 !py-4 !whitespace-nowrap">
                        <div className="!text-sm !font-medium !text-gray-900">
                          {formatCurrency(contract.supportAmount)}
                        </div>
                      </td>
                      <td className="!px-6 !py-4 !whitespace-nowrap">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="!px-6 !py-4 !whitespace-nowrap !text-sm !text-gray-900">
                        {formatDate(contract.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedContract(contract);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Xem chi tiết"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContract(contract);
                              setNewStatus(contract.status);
                              setNewPaymentStatus(contract.paymentStatus || 'PENDING');
                              setShowStatusModal(true);
                            }}
                            className="text-purple-600 hover:text-purple-900"
                            title="Cập nhật trạng thái"
                          >
                            <Cog6ToothIcon className="w-5 h-5" />
                          </button>
                          {contract.status === 'PENDING' && (
                            <button
                              onClick={() => handleApproveContract(contract.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Duyệt hợp đồng"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                          )}
                          {contract.status === 'SIGNED' && (
                            <button
                              onClick={() => handleUpdatePayment(contract.id, 'PAID')}
                              className="text-emerald-600 hover:text-emerald-900"
                              title="Đánh dấu đã thanh toán"
                            >
                              <CurrencyDollarIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Contract Modal - Same as before but shortened for space */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Tạo hợp đồng hỗ trợ mới</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề hợp đồng</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tiêu đề hợp đồng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mức hỗ trợ (VNĐ)</label>
                    <input
                      type="number"
                      value={formData.supportAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, supportAmount: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập mức hỗ trợ"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chọn thực tập</label>
                    <select
                      value={formData.internshipId}
                      onChange={(e) => setFormData(prev => ({ ...prev, internshipId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Không chọn thực tập cụ thể --</option>
                      {availableInternships.map((internship) => (
                        <option key={internship.id} value={internship.id}>
                          {internship.jobTitle} - {internship.student?.user?.fullName} ({internship.student?.studentCode})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung hợp đồng</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập nội dung hợp đồng"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Điều khoản thanh toán</label>
                    <textarea
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập điều khoản thanh toán"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateContract}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Tạo hợp đồng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contract Detail Modal */}
        {showDetailModal && selectedContract && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Chi tiết hợp đồng</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{selectedContract.title}</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Mã hợp đồng:</span> {selectedContract.contractCode}</p>
                      <p><span className="font-medium">Sinh viên:</span> {selectedContract.internship?.student?.user?.fullName || 'N/A'}</p>
                      <p><span className="font-medium">Mức hỗ trợ:</span> {formatCurrency(selectedContract.supportAmount)}</p>
                      <p><span className="font-medium">Trạng thái:</span> {getStatusBadge(selectedContract.status)}</p>
                      <p><span className="font-medium">Trạng thái thanh toán:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedContract.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                          selectedContract.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {selectedContract.paymentStatus === 'PAID' ? 'Đã thanh toán' :
                            selectedContract.paymentStatus === 'PENDING' ? 'Chờ thanh toán' : 'Chưa xác định'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Thông tin thời gian</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Ngày tạo:</span> {formatDate(selectedContract.createdAt)}</p>
                      <p><span className="font-medium">Ngày bắt đầu:</span> {formatDate(selectedContract.startDate)}</p>
                      <p><span className="font-medium">Ngày kết thúc:</span> {formatDate(selectedContract.endDate)}</p>
                      {selectedContract.approvalDate && (
                        <p><span className="font-medium">Ngày duyệt:</span> {formatDate(selectedContract.approvalDate)}</p>
                      )}
                      {selectedContract.paymentDate && (
                        <p><span className="font-medium">Ngày thanh toán:</span> {formatDate(selectedContract.paymentDate)}</p>
                      )}
                      {selectedContract.approvedBy && (
                        <p><span className="font-medium">Người duyệt:</span> {selectedContract.approvedBy}</p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedContract.content && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Nội dung hợp đồng</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedContract.content}</p>
                    </div>
                  </div>
                )}

                {selectedContract.paymentTerms && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Điều khoản thanh toán</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 whitespace-pre-wrap">{selectedContract.paymentTerms}</p>
                    </div>
                  </div>
                )}

                {selectedContract.notes && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800 whitespace-pre-wrap">{selectedContract.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  {selectedContract.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApproveContract(selectedContract.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Duyệt hợp đồng
                      </button>
                      <button
                        onClick={() => handleRejectContract(selectedContract.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  {selectedContract.status === 'SIGNED' && selectedContract.paymentStatus !== 'PAID' && (
                    <button
                      onClick={() => handleUpdatePayment(selectedContract.id, 'PAID')}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Đánh dấu đã thanh toán
                    </button>
                  )}
                  {(selectedContract.status === 'ACTIVE' || selectedContract.status === 'SIGNED') && (
                    <button
                      onClick={() => handleTerminateContract(selectedContract.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Chấm dứt hợp đồng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedContract && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Cập nhật trạng thái hợp đồng</h2>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {selectedContract.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mã: {selectedContract.contractCode} - {selectedContract.internship?.student?.user?.fullName || 'N/A'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái hợp đồng
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DRAFT">Bản nháp</option>
                      <option value="PENDING">Chờ duyệt</option>
                      <option value="SIGNED">Đã ký</option>
                      <option value="ACTIVE">Đang hoạt động</option>
                      <option value="PAID">Đã thanh toán</option>
                      <option value="REJECTED">Từ chối</option>
                      <option value="EXPIRED">Hết hạn</option>
                      <option value="TERMINATED">Chấm dứt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái thanh toán
                    </label>
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">Chờ thanh toán</option>
                      <option value="PAID">Đã thanh toán</option>
                      <option value="OVERDUE">Quá hạn</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Lưu ý:</p>
                        <p>Việc thay đổi trạng thái sẽ ảnh hưởng đến workflow của hợp đồng. Hãy đảm bảo bạn hiểu rõ các trạng thái trước khi cập nhật.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Cập nhật trạng thái
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Action Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Thao tác hàng loạt</h2>
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Bạn đã chọn {selectedContracts.length} hợp đồng. Chọn thao tác muốn thực hiện:
                </p>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bulkAction"
                      value="approve"
                      checked={bulkAction === 'approve'}
                      onChange={(e) => setBulkAction(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Duyệt tất cả hợp đồng</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bulkAction"
                      value="reject"
                      checked={bulkAction === 'reject'}
                      onChange={(e) => setBulkAction(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Từ chối tất cả hợp đồng</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bulkAction"
                      value="payment"
                      checked={bulkAction === 'payment'}
                      onChange={(e) => setBulkAction(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Đánh dấu đã thanh toán</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bulkAction"
                      value="terminate"
                      checked={bulkAction === 'terminate'}
                      onChange={(e) => setBulkAction(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Chấm dứt hợp đồng</span>
                  </label>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleBulkAction}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Thực hiện
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractManagement;