import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { contractService, internshipService, studentService, apiHelpers } from '../../services';
import { useAuth } from '../../context/AuthContext';

const ContractsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [currentInternship, setCurrentInternship] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user?.id) {
      loadData();
    }
  }, [authLoading, user?.id]);

  const loadData = async () => {
    if (!user?.id) {
      setError('Không thể lấy thông tin người dùng');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First get student record from user ID
      const studentData = await studentService.getStudentByUserId(user.id);

      // Get current internship using student ID
      const internshipsResponse = await internshipService.getInternshipsByStudent(studentData.id);
      const activeInternship = internshipsResponse.find(i =>
        i.status === 'ACTIVE' || i.status === 'IN_PROGRESS' || i.status === 'APPROVED'
      );

      if (activeInternship) {
        setCurrentInternship(activeInternship);

        // Load contracts for current internship
        try {
          const contractsResponse = await contractService.getContractsByInternship(activeInternship.id);
          const processedContracts = contractsResponse.map(contract => ({
            id: contract.id,
            title: contract.title || 'Hợp đồng thực tập',
            type: contract.type || 'INTERNSHIP',
            status: contract.status.toLowerCase(),
            createdDate: new Date(contract.createdDate).toLocaleDateString('vi-VN'),
            signedDate: contract.signedDate ? new Date(contract.signedDate).toLocaleDateString('vi-VN') : null,
            validFrom: contract.validFrom ? new Date(contract.validFrom).toLocaleDateString('vi-VN') : null,
            validTo: contract.validTo ? new Date(contract.validTo).toLocaleDateString('vi-VN') : null,
            content: contract.content || '',
            terms: contract.terms || '',
            fileName: contract.fileName || '',
            fileSize: contract.fileSize || 0,
            companyName: activeInternship.companyName,
            mentorName: activeInternship.mentorName
          }));

          setContracts(processedContracts);
        } catch (contractError) {
          console.log('No contracts found:', contractError);
          setContracts([]);
        }
      } else {
        setContracts([]);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError(apiHelpers.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'signed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Đã ký
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            Chờ ký
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <DocumentIcon className="w-4 h-4 mr-1" />
            Bản nháp
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  const getContractTypeText = (type) => {
    const typeMap = {
      'INTERNSHIP': 'Hợp đồng thực tập',
      'SUPPORT': 'Hợp đồng hỗ trợ',
      'AGREEMENT': 'Thỏa thuận hợp tác',
      'NDA': 'Thỏa thuận bảo mật'
    };
    return typeMap[type] || type;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (contractId) => {
    try {
      // This would typically download the contract file
      console.log('Downloading contract:', contractId);
      // await contractService.downloadContract(contractId);
    } catch (err) {
      console.error('Error downloading contract:', err);
      setError('Không thể tải xuống hợp đồng');
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (loading) {
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
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    totalContracts: contracts.length,
    signedContracts: contracts.filter(c => c.status === 'signed').length,
    pendingContracts: contracts.filter(c => c.status === 'pending').length,
    draftContracts: contracts.filter(c => c.status === 'draft').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hợp đồng thực tập</h1>
          <p className="mt-2 text-gray-600">Quản lý và theo dõi các hợp đồng liên quan đến thực tập</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.totalContracts}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.signedContracts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ ký</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingContracts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentIcon className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bản nháp</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.draftContracts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts List */}
        {!currentInternship ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thực tập</h3>
            <p className="text-gray-600">Bạn cần có thực tập đang hoạt động để xem hợp đồng.</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hợp đồng nào</h3>
            <p className="text-gray-600 mb-4">Chưa có hợp đồng nào được tạo cho thực tập của bạn.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hợp đồng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hiệu lực
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                            <div className="text-sm text-gray-500">{contract.companyName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getContractTypeText(contract.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.createdDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.validFrom && contract.validTo ? (
                          `${contract.validFrom} - ${contract.validTo}`
                        ) : (
                          'Chưa xác định'
                        )}
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
                          {contract.fileName && (
                            <button
                              onClick={() => handleDownload(contract.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Tải xuống"
                            >
                              <ArrowDownTrayIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                      <p><span className="font-medium">Công ty:</span> {selectedContract.companyName}</p>
                      <p><span className="font-medium">Mentor:</span> {selectedContract.mentorName}</p>
                      <p><span className="font-medium">Loại:</span> {getContractTypeText(selectedContract.type)}</p>
                      <p><span className="font-medium">Trạng thái:</span> {getStatusBadge(selectedContract.status)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Thông tin thời gian</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Ngày tạo:</span> {selectedContract.createdDate}</p>
                      {selectedContract.signedDate && (
                        <p><span className="font-medium">Ngày ký:</span> {selectedContract.signedDate}</p>
                      )}
                      {selectedContract.validFrom && (
                        <p><span className="font-medium">Hiệu lực từ:</span> {selectedContract.validFrom}</p>
                      )}
                      {selectedContract.validTo && (
                        <p><span className="font-medium">Hiệu lực đến:</span> {selectedContract.validTo}</p>
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

                {selectedContract.terms && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Điều khoản</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 whitespace-pre-wrap">{selectedContract.terms}</p>
                    </div>
                  </div>
                )}

                {selectedContract.fileName && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">File đính kèm</h4>
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedContract.fileName}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(selectedContract.fileSize)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(selectedContract.id)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                        Tải xuống
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsPage;