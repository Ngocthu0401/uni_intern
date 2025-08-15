import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  reportService,
  teacherService
} from '../../services';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, CheckIcon, XMarkIcon, ChatBubbleLeftRightIcon, DocumentArrowDownIcon, ArrowDownTrayIcon, CalendarIcon, PaperClipIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, DocumentTextIcon, DocumentIcon } from '@heroicons/react/24/solid';
import { Modal, Button, Form, Input, Select } from 'antd';

const { Option } = Select;

const ReportReviewPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkFeedback, setBulkFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0
  });
  const [reviewData, setReviewData] = useState({
    status: 'APPROVED',
    feedback: '',
    score: 8
  });
  // Reintroduce bulkAction state
  const [bulkAction] = useState('approve');
  const [form] = Form.useForm();

  // Load reports data
  useEffect(() => {
    loadReports();
  }, [user, searchTerm, statusFilter, pagination.page, pagination.size]);

  useEffect(() => {
    if (selectedReport) {
      form.setFieldsValue({
        status: selectedReport.status === 'PENDING' ? 'APPROVED' : selectedReport.status,
        feedback: selectedReport.content || '',
      });
    }
  }, [selectedReport, form]);

  const loadReports = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');

      // First get teacher by user ID
      let teacherId;
      try {
        const teacherResponse = await teacherService.getTeacherByUserId(user.id);
        teacherId = teacherResponse.id;
      } catch (err) {
        console.error('Error getting teacher:', err);
        setError('Không tìm thấy thông tin giảng viên. Vui lòng liên hệ quản trị viên.');
        return;
      }

      const params = {
        teacherId: teacherId,
        keyword: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: pagination.page - 1, // Convert to 0-based
        size: pagination.size,
        sortBy: 'submittedAt',
        sortDir: 'desc'
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await reportService.getReportsByTeacher(teacherId, params);

      setReports(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 1
      }));

    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Không thể tải danh sách báo cáo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [user, searchTerm, statusFilter, pagination.page, pagination.size]);

  const handleReviewReport = async () => {
    try {
      setLoading(true);

      const reviewPayload = {
        status: reviewData.status,
        teacherComment: reviewData.feedback,
        teacherScore: reviewData.score,
        isApprovedByTeacher: reviewData.status === 'APPROVED',
        reviewedAt: new Date().toISOString()
      };

      await reportService.updateReport(selectedReport.id, reviewPayload);

      // Reload reports
      await loadReports();

      // Close modal and reset
      setShowReviewModal(false);
      setSelectedReport(null);
      setReviewData({
        status: 'APPROVED',
        feedback: '',
        score: 8
      });

    } catch (err) {
      console.error('Error reviewing report:', err);
      setError('Không thể duyệt báo cáo. Vui lòng thử lại.');
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

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Chờ duyệt',
      'APPROVED': 'Đã duyệt',
      'REJECTED': 'Từ chối',
      'REVISION_REQUIRED': 'Cần chỉnh sửa'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'REVISION_REQUIRED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách báo cáo...</p>
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
            onClick={loadReports}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Remove mock data - using API data instead

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'REJECTED':
      case 'REVISION_REQUIRED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Note: getStatusColor and getStatusText are already defined above

  const filteredReports = reports.filter(report => {
    // Get student from internship or direct relationship
    const student = report.internship?.student || report.student;
    const matchesSearch = !searchTerm ||
      (report.title && report.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student?.user?.fullName && student.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student?.studentCode && student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReview = (report) => {
    setSelectedReport(report);
    setReviewData({
      status: report.status === 'PENDING' ? 'APPROVED' : report.status,
      feedback: report.teacherComment || '',
      score: report.teacherScore || 8
    });
    setShowReviewModal(true);
  };

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleBulkSelect = (reportId) => {
    setSelectedReports(prev => {
      const isSelected = prev.includes(reportId);
      if (isSelected) {
        return prev.filter(id => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(r => r.id));
    }
  };

  const handleBulkAction = async () => {
    try {
      setLoading(true);

      const bulkReviewData = {
        status: bulkAction === 'approve' ? 'APPROVED' : 'REJECTED',
        teacherComment: bulkFeedback,
        teacherScore: bulkAction === 'approve' ? 8 : 5,
        isApprovedByTeacher: bulkAction === 'approve',
        reviewedAt: new Date().toISOString()
      };

      // Process each selected report
      await Promise.all(
        selectedReports.map(reportId =>
          reportService.updateReport(reportId, bulkReviewData)
        )
      );

      // Reload reports
      await loadReports();

      // Reset selection and close modal
      setSelectedReports([]);
      setShowBulkActions(false);
      setBulkFeedback('');

    } catch (err) {
      console.error('Error processing bulk action:', err);
      setError('Không thể thực hiện hành động hàng loạt. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (fileName) => {
    try {
      const blob = await reportService.downloadFile(fileName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Không thể tải xuống file. Vui lòng thử lại.');
    }
  };

  const stats = {
    total: pagination.total || 0,
    pending: reports.filter(r => r.status === 'PENDING').length,
    approved: reports.filter(r => r.status === 'APPROVED').length,
    revision: reports.filter(r => r.status === 'REJECTED' || r.status === 'REVISION_REQUIRED').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Duyệt báo cáo thực tập</h1>
          <p className="mt-2 text-gray-600">Xem xét và đánh giá báo cáo của sinh viên</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng báo cáo</p>
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
                <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cần sửa</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.revision}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="!bg-white !rounded-lg !shadow-sm !border !border-gray-200 !p-6 !mb-6">
          <div className="!flex !flex-col !md:flex-row !md:items-center !md:justify-between !space-y-4 !md:space-y-0 !md:space-x-4">
            <div className="!flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="!absolute !left-3 !top-1/2 !transform !-translate-y-1/2 !h-5 !w-5 !text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm báo cáo theo tiêu đề, tên sinh viên..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="!w-full !pl-10 !pr-3 !py-2 !border !border-gray-300 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="!flex !items-center !space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="!px-3 !py-2 !border !border-gray-300 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Từ chối</option>
                <option value="REVISION_REQUIRED">Cần chỉnh sửa</option>
              </select>

              {selectedReports.length > 0 && (
                <button
                  onClick={() => setShowBulkActions(true)}
                  className="!px-4 !py-2 !bg-blue-600 !text-white !rounded-lg !hover:bg-blue-700 !transition-colors !duration-200"
                >
                  Hành động ({selectedReports.length})
                </button>
              )}

              {/* <button
                onClick={handleExportReports}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <TableCellsIcon className="h-4 w-4 mr-2" />
                Xuất CSV
              </button> */}
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="!bg-white !rounded-lg !shadow-sm !border !border-gray-200">
          <div className="!px-6 !py-4 !border-b !border-gray-200 !flex !items-center !justify-between">
            <h2 className="!text-xl !font-semibold !text-gray-900">Danh sách báo cáo</h2>
            {filteredReports.length > 0 && (
              <div className="!flex !items-center !space-x-2">
                <input
                  type="checkbox"
                  checked={selectedReports.length === filteredReports.length}
                  onChange={handleSelectAll}
                  className="!h-4 !w-4 !text-blue-600 !focus:ring-blue-500 !border-gray-300 !rounded"
                />
                <label className="!text-sm !text-gray-600">Chọn tất cả</label>
              </div>
            )}
          </div>
          <div className="!p-6">
            {loading && reports.length > 0 && (
              <div className="!text-center !py-4">
                <div className="!animate-spin !rounded-full !h-8 !w-8 !border-b-2 !border-blue-600 !mx-auto"></div>
                <p className="mt-2 text-gray-600">Đang tải...</p>
              </div>
            )}

            {!loading && filteredReports.length === 0 && (
              <div className="!text-center !py-8">
                <DocumentTextIcon className="!h-12 !w-12 !text-gray-400 !mx-auto !mb-4" />
                <p className="!text-gray-600">Không có báo cáo nào phù hợp với tiêu chí tìm kiếm.</p>
              </div>
            )}

            <div className="!space-y-4">
              {filteredReports.map((report) => {
                const student = report.internship?.student || report.student;
                const company = report.internship?.company;

                return (
                  <div key={report.id} className="!border !border-gray-200 !rounded-lg !p-6 !hover:!shadow-md !transition-shadow !duration-200">
                    <div className="!flex !items-start !justify-between !mb-4">
                      <div className="!flex !items-start !space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report.id)}
                          onChange={() => handleBulkSelect(report.id)}
                          className="!mt-1 !h-4 !w-4 !text-blue-600 !focus:ring-blue-500 !border-gray-300 !rounded"
                        />
                        <div className="!flex-1">
                          <h3 className="!text-lg !font-semibold !text-gray-900">{report.title || 'Báo cáo không có tiêu đề'}</h3>
                          <div className="!flex !items-center !text-gray-600 !mt-1">
                            <span className="!text-sm">{student?.user?.fullName || 'N/A'} ({student?.studentCode || 'N/A'})</span>
                            <span className="!mx-2">•</span>
                            <span className="!text-sm">{company?.companyName || 'N/A'}</span>
                            <span className="!mx-2">•</span>
                            <span className="!text-sm">
                              {formatDate(report.submittedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="!flex !items-center !space-x-3">
                        <div className="!flex !items-center">
                          {getStatusIcon(report.status)}
                          <span className={`!ml-2 !px-3 !py-1 !rounded-full !text-sm !font-medium ${getStatusColor(report.status)}`}>
                            {getStatusText(report.status)}
                          </span>
                        </div>
                        {report.teacherScore && (
                          <div className="!text-sm !font-medium !text-gray-900">
                            Điểm: {report.teacherScore}/10
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="!text-gray-700 !mb-4 !line-clamp-3">{report.content || 'Không có nội dung'}</p>

                    {(report.tasks || report.achievements || report.challenges) && (
                      <div className="!grid !grid-cols-1 !md:grid-cols-3 !gap-4 !mb-4">
                        {report.tasks && report.tasks.length > 0 && (
                          <div>
                            <h4 className="!text-sm !font-medium !text-gray-900 !mb-2">Công việc đã làm</h4>
                            <ul className="!text-sm !text-gray-600 !space-y-1">
                              {report.tasks.slice(0, 2).map((task, index) => (
                                <li key={index} className="!flex !items-start">
                                  <span className="!w-1.5 !h-1.5 !bg-blue-500 !rounded-full !mt-2 !mr-2 !flex-shrink-0"></span>
                                  {task}
                                </li>
                              ))}
                              {report.tasks.length > 2 && (
                                <li className="!text-gray-400 !text-xs">+{report.tasks.length - 2} mục khác</li>
                              )}
                            </ul>
                          </div>
                        )}
                        {report.achievements && report.achievements.length > 0 && (
                          <div>
                            <h4 className="!text-sm !font-medium !text-gray-900 !mb-2">Thành tựu</h4>
                            <ul className="!text-sm !text-green-600 !space-y-1">
                              {report.achievements.slice(0, 2).map((achievement, index) => (
                                <li key={index} className="!flex !items-start">
                                  <span className="!w-1.5 !h-1.5 !bg-green-500 !rounded-full !mt-2 !mr-2 !flex-shrink-0"></span>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {report.challenges && report.challenges.length > 0 && (
                          <div>
                            <h4 className="!text-sm !font-medium !text-gray-900 !mb-2">Khó khăn</h4>
                            <ul className="!text-sm !text-orange-600 !space-y-1">
                              {report.challenges.slice(0, 2).map((challenge, index) => (
                                <li key={index} className="!flex !items-start">
                                  <span className="!w-1.5 !h-1.5 !bg-orange-500 !rounded-full !mt-2 !mr-2 !flex-shrink-0"></span>
                                  {challenge}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {report.teacherComment && (
                      <div className="!bg-blue-50 !border !border-blue-200 !rounded-lg !p-4 !mb-4">
                        <h4 className="!text-sm !font-medium !text-blue-900 !mb-2">Phản hồi từ giảng viên</h4>
                        <p className="!text-sm !text-blue-800">{report.teacherComment}</p>
                      </div>
                    )}

                    {report.attachments && report.attachments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="!text-sm !font-medium !text-gray-900 !mb-2 !flex !items-center">
                          <PaperClipIcon className="!h-4 !w-4 !mr-1" />
                          File đính kèm ({report.attachments.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {report.attachments.slice(0, 3).map((filename, index) => (
                            <button
                              key={index}
                              onClick={() => handleDownloadFile(filename)}
                              className="!inline-flex !items-center !px-3 !py-1 !bg-gray-100 !text-gray-700 !rounded-full !text-xs !hover:bg-gray-200 !transition-colors !duration-200"
                            >
                              <DocumentArrowDownIcon className="!h-3 !w-3 !mr-1" />
                              {filename.split('_').slice(1).join('_') || filename}
                            </button>
                          ))}
                          {report.attachments.length > 3 && (
                            <span className="!text-xs !text-gray-500 !px-2 !py-1">
                              +{report.attachments.length - 3} file khác
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="!flex !justify-end !space-x-3">
                      <button
                        onClick={() => handleViewDetail(report)}
                        className="!flex !items-center !px-4 !py-2 !bg-gray-600 !text-white !rounded-lg !hover:bg-gray-700 !transition-colors !duration-200"
                      >
                        <EyeIcon className="!h-4 !w-4 !mr-2" />
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleReview(report)}
                        className="!flex !items-center !px-4 !py-2 !bg-blue-600 !text-white !rounded-lg !hover:bg-blue-700 !transition-colors !duration-200"
                      >
                        <ChatBubbleLeftRightIcon className="!h-4 !w-4 !mr-2" />
                        {report.status === 'PENDING' ? 'Duyệt báo cáo' : 'Chỉnh sửa đánh giá'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="!flex !items-center !justify-between !mt-6 !pt-6 !border-t !border-gray-200">
                <div className="!text-sm !text-gray-600">
                  Hiển thị {((pagination.page - 1) * pagination.size) + 1} - {Math.min(pagination.page * pagination.size, pagination.total)} trong tổng số {pagination.total} báo cáo
                </div>
                <div className="!flex !items-center !space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1 || loading}
                    className="!px-3 !py-2 !text-sm !border !border-gray-300 !rounded-lg !hover:bg-gray-50 !disabled:opacity-50 !disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + Math.max(1, pagination.page - 2);
                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`!px-3 !py-2 !text-sm !border !rounded-lg ${pageNum === pagination.page
                          ? '!bg-blue-600 !text-white !border-blue-600'
                          : '!border-gray-300 !hover:bg-gray-50'
                          } !disabled:opacity-50 !disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages || loading}
                    className="!px-3 !py-2 !text-sm !border !border-gray-300 !rounded-lg !hover:bg-gray-50 !disabled:opacity-50 !disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedReport && (
          <Modal
            visible={showReviewModal}
            title={`Đánh giá báo cáo: ${selectedReport ? selectedReport.title : ''}`}
            onCancel={() => setShowReviewModal(false)}
            footer={null}
          // className="fade-in"
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: reviewData.status,
                feedback: selectedReport?.content || reviewData.feedback,
              }}
              onFinish={handleReviewReport}
            >
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Option value="APPROVED">Duyệt</Option>
                  <Option value="REJECTED">Từ chối</Option>
                  <Option value="REVISION_REQUIRED">Yêu cầu chỉnh sửa</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="feedback"
                label="Phản hồi"
                rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập phản hồi cho sinh viên..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} className="ant-btn-primary">
                  {loading ? 'Đang lưu...' : 'Lưu đánh giá'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}

        {/* Detail Modal */}
        <Modal
          visible={showDetailModal}
          title={`Chi tiết báo cáo: ${selectedReport ? selectedReport.title : ''}`}
          onCancel={() => setShowDetailModal(false)}
          footer={null}
        // className="fade-in"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Thông tin sinh viên</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Họ tên: {selectedReport?.internship?.student?.user?.fullName || selectedReport?.student?.user?.fullName || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Mã SV: {selectedReport?.internship?.student?.studentCode || selectedReport?.student?.studentCode || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Công ty: {selectedReport?.internship?.company?.companyName || 'N/A'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Thông tin báo cáo</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Loại: {selectedReport?.type || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Ngày nộp: {formatDate(selectedReport?.submittedAt)}</p>
                  <p className="text-sm text-gray-600 flex items-center">Trạng thái: <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedReport?.status)}`}>{getStatusText(selectedReport?.status)}</span></p>
                  {selectedReport?.teacherScore && <p className="text-sm text-gray-600">Điểm: {selectedReport?.teacherScore}/10</p>}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Nội dung báo cáo</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedReport?.content || 'Không có nội dung'}</p>
              </div>
            </div>
            {(selectedReport?.tasks || selectedReport?.achievements || selectedReport?.challenges) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedReport?.tasks && selectedReport?.tasks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Công việc đã làm</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <ul className="text-sm text-gray-700 space-y-2">
                        {selectedReport?.tasks.map((task, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {selectedReport?.achievements && selectedReport?.achievements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Thành tựu</h4>
                    <div className="bg-green-50 rounded-lg p-4">
                      <ul className="text-sm text-gray-700 space-y-2">
                        {selectedReport?.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {selectedReport?.challenges && selectedReport?.challenges.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Khó khăn</h4>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <ul className="text-sm text-gray-700 space-y-2">
                        {selectedReport?.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedReport?.attachments && selectedReport?.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <PaperClipIcon className="h-4 w-4 mr-1" />
                  File đính kèm ({selectedReport?.attachments.length})
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedReport?.attachments.map((filename, index) => (
                      <button
                        key={index}
                        onClick={() => handleDownloadFile(filename)}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <span className="text-sm text-gray-700 truncate">
                          {filename.split('_').slice(1).join('_') || filename}
                        </span>
                        <DocumentArrowDownIcon className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {selectedReport?.teacherComment && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Phản hồi từ giảng viên</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">
                    {selectedReport?.teacherComment}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Modal>

        {/* Bulk Actions Modal */}
        {showBulkActions && (
          <Modal
            visible={showBulkActions}
            title={`Hành động hàng loạt (${selectedReports.length} báo cáo)`}
            onCancel={() => {
              setShowBulkActions(false);
              setBulkFeedback('');
            }}
            footer={null}
            className="fade-in"
          >
            <Form
              layout="vertical"
              initialValues={{
                action: bulkAction,
                feedback: bulkFeedback,
              }}
              onFinish={handleBulkAction}
            >
              <Form.Item
                name="action"
                label="Hành động"
                rules={[{ required: true, message: 'Vui lòng chọn hành động!' }]}
              >
                <Select>
                  <Option value="approve">Duyệt tất cả</Option>
                  <Option value="reject">Từ chối tất cả</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="feedback"
                label="Phản hồi chung"
                rules={[{ required: true, message: 'Vui lòng nhập phản hồi áp dụng cho tất cả báo cáo được chọn!' }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập phản hồi áp dụng cho tất cả báo cáo được chọn..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} className="ant-btn-primary">
                  {loading ? 'Đang xử lý...' : 'Thực hiện'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ReportReviewPage;