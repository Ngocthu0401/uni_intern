import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  DocumentTextIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { reportService, mentorService } from '../../services';

const ReportsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [feedbackForm, setFeedbackForm] = useState({
    score: 8,
    feedback: '',
    approved: true
  });

  useEffect(() => {
    if (user?.id) {
      loadReports();
    }
  }, [user?.id]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get mentor information first
      const mentorResponse = await mentorService.getMentorByUserId(user.id);
      const mentorId = mentorResponse.id;

      // Load reports for this mentor
      const reportsResponse = await reportService.getReportsByMentor(mentorId);
      setReports(reportsResponse || []);

    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Không thể tải danh sách báo cáo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGiveFeedback = async () => {
    if (!selectedReport) return;

    try {
      // Update report with feedback
      await reportService.updateReport(selectedReport.id, {
        score: feedbackForm.score,
        feedback: feedbackForm.feedback,
        status: feedbackForm.approved ? 'APPROVED' : 'REJECTED'
      });

      // Reload reports
      await loadReports();
      
      // Close modal and reset form
      setShowFeedbackModal(false);
      setSelectedReport(null);
      setFeedbackForm({
        score: 8,
        feedback: '',
        approved: true
      });

    } catch (err) {
      console.error('Error giving feedback:', err);
      setError('Không thể gửi phản hồi. Vui lòng thử lại.');
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.internship?.student?.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.internship?.student?.studentCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'submittedAt':
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      case 'score':
        return (b.score || 0) - (a.score || 0);
      case 'studentName':
        const nameA = a.internship?.student?.user?.fullName || '';
        const nameB = b.internship?.student?.user?.fullName || '';
        return nameA.localeCompare(nameB);
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Từ chối';
      case 'SUBMITTED':
        return 'Đã nộp';
      case 'PENDING':
        return 'Chờ duyệt';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'REJECTED':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'SUBMITTED':
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (score, onChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            disabled={!onChange}
            className={`${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            {star <= score ? (
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">{score}/10</span>
      </div>
    );
  };

  if (loading) {
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
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadReports}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản Lý Báo Cáo</h1>
              <p className="mt-1 text-sm text-gray-500">Xem xét và đánh giá báo cáo từ sinh viên thực tập</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{reports.length}</span> báo cáo tổng
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sinh viên, mã SV, tiêu đề báo cáo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="SUBMITTED">Đã nộp</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Từ chối</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="submittedAt">Mới nhất</option>
              <option value="score">Điểm cao nhất</option>
              <option value="studentName">Tên sinh viên</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {sortedReports.length > 0 ? (
            sortedReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <UserIcon className="h-4 w-4 mr-1" />
                                {report.internship?.student?.user?.fullName || 'N/A'}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <AcademicCapIcon className="h-4 w-4 mr-1" />
                                {report.internship?.student?.studentCode || 'N/A'}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {new Date(report.submittedAt).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {report.content?.substring(0, 150) || report.description?.substring(0, 150) || 'Không có mô tả'}
                              {(report.content?.length > 150 || report.description?.length > 150) && '...'}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center space-x-2 mb-2">
                              {getStatusIcon(report.status)}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                                {getStatusText(report.status)}
                              </span>
                            </div>
                            {report.score && (
                              <div className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                                {report.score}/10
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Thực tập tại:</span> {report.internship?.company?.companyName || 'N/A'}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setShowDetailModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Xem chi tiết
                    </button>
                    {report.status === 'SUBMITTED' && (
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setFeedbackForm({
                            score: report.score || 8,
                            feedback: report.feedback || '',
                            approved: true
                          });
                          setShowFeedbackModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                        Đánh giá
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có báo cáo nào</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Không tìm thấy báo cáo phù hợp với bộ lọc hiện tại' 
                  : 'Chưa có báo cáo nào từ sinh viên thực tập'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Chi tiết báo cáo</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Thông tin báo cáo</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Tiêu đề:</span> {selectedReport.title}</div>
                    <div><span className="font-medium">Loại:</span> {selectedReport.reportType || 'N/A'}</div>
                    <div><span className="font-medium">Ngày nộp:</span> {new Date(selectedReport.submittedAt).toLocaleDateString('vi-VN')}</div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedReport.status)}`}>
                        {getStatusText(selectedReport.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Thông tin sinh viên</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Tên:</span> {selectedReport.internship?.student?.user?.fullName || 'N/A'}</div>
                    <div><span className="font-medium">Mã SV:</span> {selectedReport.internship?.student?.studentCode || 'N/A'}</div>
                    <div><span className="font-medium">Công ty:</span> {selectedReport.internship?.company?.companyName || 'N/A'}</div>
                    <div><span className="font-medium">Vị trí:</span> {selectedReport.internship?.jobTitle || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Nội dung báo cáo</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedReport.content || selectedReport.description || 'Không có nội dung'}
                  </p>
                </div>
              </div>

              {selectedReport.score && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Đánh giá</h3>
                  <div className="flex items-center space-x-4">
                    <div className={`text-2xl font-bold ${getScoreColor(selectedReport.score)}`}>
                      {selectedReport.score}/10
                    </div>
                    {renderStars(selectedReport.score)}
                  </div>
                  {selectedReport.feedback && (
                    <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">{selectedReport.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Đánh giá báo cáo</h2>
              <p className="text-sm text-gray-600 mt-1">
                Báo cáo: <span className="font-medium">{selectedReport.title}</span>
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm số
                </label>
                {renderStars(feedbackForm.score, (score) => 
                  setFeedbackForm(prev => ({ ...prev, score }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phản hồi chi tiết
                </label>
                <textarea
                  value={feedbackForm.feedback}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, feedback: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập phản hồi chi tiết về báo cáo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quyết định
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={feedbackForm.approved}
                      onChange={() => setFeedbackForm(prev => ({ ...prev, approved: true }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Chấp nhận</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!feedbackForm.approved}
                      onChange={() => setFeedbackForm(prev => ({ ...prev, approved: false }))}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Từ chối</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleGiveFeedback}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;