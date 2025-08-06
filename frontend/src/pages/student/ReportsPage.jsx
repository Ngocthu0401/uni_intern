import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  XMarkIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { reportService, internshipService, studentService, apiHelpers } from '../../services';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('my-reports');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [currentInternship, setCurrentInternship] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Form state for new report
  const [newReport, setNewReport] = useState({
    title: '',
    type: 'WEEKLY',
    content: '',
    attachments: [],
    weekNumber: 1,
    reportPeriod: ''
  });

  // Form state for edit report
  const [editReport, setEditReport] = useState({
    id: null,
    title: '',
    type: 'WEEKLY',
    content: '',
    attachments: [],
    weekNumber: 1,
    reportPeriod: '',
    internshipId: null
  });

  const { user, loading: authLoading } = useAuth();

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Chưa xác định';
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'Chưa xác định';
    }
  };

  // Load data from API
  useEffect(() => {
    if (!authLoading && user?.id) {
      loadData();
    }
  }, [authLoading, user?.id]);

  // Load next week number when opening create modal
  const loadNextWeekNumber = async (studentId) => {
    try {
      const nextWeekData = await reportService.getNextWeekNumber(studentId);
      return nextWeekData.nextWeekNumber || 1;
    } catch (err) {
      console.log('Could not get next week number, defaulting to 1');
      return 1;
    }
  };

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
      
      // Get current internship for the student using student ID
      const internshipsResponse = await internshipService.getInternshipsByStudent(studentData.id);
      const activeInternship = internshipsResponse.find(i => 
        i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS' || i.status === 'COMPLETED'
      );
      
      if (activeInternship) {
        setCurrentInternship(activeInternship);
        
        // Load reports for current internship using API
        try {
          const reportsResponse = await reportService.getReportsByInternship(activeInternship.id);
          const processedReports = reportsResponse.map(report => ({
            id: report.id,
            title: report.title || `Báo cáo ${report.type?.toLowerCase()} ${report.weekNumber || ''}`,
            type: report.type || 'WEEKLY',
            content: report.content || '',
            reportPeriod: report.reportPeriod || '',
            weekNumber: report.weekNumber || 1,
            status: report.status || 'PENDING',
            submittedAt: report.submittedAt || report.createdAt,
            feedback: report.teacherComment || report.mentorComment || null,
            grade: report.teacherScore || report.mentorScore || null,
            attachments: Array.isArray(report.attachments) ? report.attachments : 
                        (report.attachments ? report.attachments.split(',').filter(a => a.trim()) : [])
          }));
          setReports(processedReports);
        } catch (reportError) {
          console.log('No reports found or error loading reports:', reportError);
          setReports([]);
        }
      } else {
        setError('Bạn chưa được phân công thực tập nào');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError(apiHelpers.formatErrorMessage(err));
      setLoading(false);
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!currentInternship) {
      setError('Không tìm thấy thông tin thực tập');
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Upload files first if any
      let uploadedFileNames = [];
      const filesToUpload = newReport.attachments.filter(file => file instanceof File);
      if (filesToUpload.length > 0) {
        const uploadResult = await reportService.uploadFiles(filesToUpload);
        uploadedFileNames = uploadResult.files || [];
      }
      
      // Create new report object
      const reportData = {
        title: newReport.title,
        type: newReport.type,
        content: newReport.content,
        weekNumber: newReport.weekNumber,
        reportPeriod: newReport.reportPeriod,
        internship: {
          id: currentInternship.id
        },
        attachments: uploadedFileNames.length > 0 ? uploadedFileNames : [], // Use uploaded file names
        status: 'PENDING'
      };

      // Call actual API to create report
      const createdReport = await reportService.createReport(reportData);
      
      // Process the created report for display
      const processedReport = {
        id: createdReport.id,
        title: createdReport.title,
        type: createdReport.type,
        content: createdReport.content,
        reportPeriod: createdReport.reportPeriod,
        weekNumber: createdReport.weekNumber,
        status: createdReport.status,
        submittedAt: createdReport.submittedAt || createdReport.createdAt,
        feedback: null,
        grade: null,
        attachments: Array.isArray(createdReport.attachments) ? createdReport.attachments : 
                    (createdReport.attachments ? createdReport.attachments.split(',').filter(a => a.trim()) : [])
      };

      setReports([processedReport, ...reports]);
      setShowCreateModal(false);
      setNewReport({
        title: '',
        type: 'WEEKLY',
        content: '',
        attachments: [],
        weekNumber: reports.filter(r => r.type === 'WEEKLY').length + 1,
        reportPeriod: ''
      });

      setSubmitLoading(false);
    } catch (err) {
      console.error('Error creating report:', err);
      setError(apiHelpers.formatErrorMessage(err));
      setSubmitLoading(false);
    }
  };

  const handleEditReport = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Upload new files first if any
      let uploadedFileNames = [];
      const filesToUpload = editReport.attachments.filter(file => file instanceof File);
      if (filesToUpload.length > 0) {
        const uploadResult = await reportService.uploadFiles(filesToUpload);
        uploadedFileNames = uploadResult.files || [];
      }

      // Keep existing attachments (strings) and add new uploaded files
      const existingAttachments = editReport.attachments.filter(file => typeof file === 'string');
      const allAttachments = [...existingAttachments, ...uploadedFileNames];

      // Update report object
      const reportData = {
        title: editReport.title,
        type: editReport.type,
        content: editReport.content,
        weekNumber: editReport.weekNumber,
        reportPeriod: editReport.reportPeriod,
        attachments: allAttachments,
        status: 'PENDING',
        internship: {
          id: editReport.internshipId || currentInternship?.id
        }
      };

      // Call actual API to update report
      const updatedReport = await reportService.updateReport(editReport.id, reportData);

      // Update reports list
      setReports(reports.map(report => 
        report.id === editReport.id 
          ? {
              ...report,
              title: updatedReport.title,
              type: updatedReport.type,
              content: updatedReport.content,
              reportPeriod: updatedReport.reportPeriod,
              weekNumber: updatedReport.weekNumber,
              attachments: Array.isArray(updatedReport.attachments) ? updatedReport.attachments : 
                          (updatedReport.attachments ? updatedReport.attachments.split(',').filter(a => a.trim()) : [])
            }
          : report
      ));

      setShowEditModal(false);
      setEditReport({
        id: null,
        title: '',
        type: 'WEEKLY',
        content: '',
        attachments: [],
        weekNumber: 1,
        reportPeriod: '',
        internshipId: null
      });

      setSubmitLoading(false);
    } catch (err) {
      console.error('Error updating report:', err);
      setError(apiHelpers.formatErrorMessage(err));
      setSubmitLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewReport(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setNewReport(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const removeEditAttachment = (index) => {
    setEditReport(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleEditFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setEditReport(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const openEditModal = (report) => {
    setEditReport({
      id: report.id,
      title: report.title,
      type: report.type,
      content: report.content,
      attachments: report.attachments || [],
      weekNumber: report.weekNumber || 1,
      reportPeriod: report.reportPeriod || '',
      internshipId: currentInternship?.id || null
    });
    setShowEditModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'DRAFT':
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadAttachment = async (fileName) => {
    try {
      // Download file using service
      const blob = await reportService.downloadFile(fileName);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Không thể tải xuống file. Vui lòng thử lại.');
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Đang chờ duyệt',
      'APPROVED': 'Đã được duyệt',
      'REJECTED': 'Bị từ chối',
      'DRAFT': 'Bản nháp'
    };
    return statusMap[status] || status;
  };

  const getTypeText = (type) => {
    const typeMap = {
      'WEEKLY': 'Báo cáo tuần',
      'MONTHLY': 'Báo cáo tháng',
      'FINAL': 'Báo cáo cuối kỳ'
    };
    return typeMap[type] || type;
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
          <p className="mt-4 text-gray-600">Đang tải báo cáo...</p>
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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo thực tập</h1>
          <p className="text-gray-600 mt-2">Quản lý và nộp báo cáo thực tập định kỳ</p>
        </div>

        {/* Current Internship Info */}
        {currentInternship && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
              Thông tin thực tập hiện tại
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Vị trí thực tập</p>
                <p className="font-medium text-gray-900">{currentInternship.jobTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Công ty</p>
                <p className="font-medium text-gray-900">{currentInternship.company?.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-medium text-gray-900">
                  {formatDate(currentInternship.startDate)} - {formatDate(currentInternship.endDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('my-reports')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'my-reports' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Báo cáo của tôi ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'statistics' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Thống kê
            </button>
          </div>

          <button
            onClick={async () => {
              if (currentInternship) {
                // Get student data first
                const studentData = await studentService.getStudentByUserId(user.id);
                const nextWeek = await loadNextWeekNumber(studentData.id);
                setNewReport(prev => ({ ...prev, weekNumber: nextWeek }));
              }
              setShowCreateModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Tạo báo cáo mới</span>
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'my-reports' && (
          <div className="space-y-6">
            {reports.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có báo cáo nào</h3>
                <p className="text-gray-600 mb-4">Bạn chưa nộp báo cáo thực tập nào. Hãy tạo báo cáo đầu tiên!</p>
                <button
                  onClick={async () => {
                    if (currentInternship) {
                      // Get student data first
                      const studentData = await studentService.getStudentByUserId(user.id);
                      const nextWeek = await loadNextWeekNumber(studentData.id);
                      setNewReport(prev => ({ ...prev, weekNumber: nextWeek }));
                    }
                    setShowCreateModal(true);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tạo báo cáo đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {getStatusText(report.status)}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {getTypeText(report.type)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Nộp: {formatDate(report.submittedAt)}</span>
                          </div>
                          {report.reportPeriod && (
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="h-4 w-4" />
                              <span>Kỳ: {report.reportPeriod}</span>
                            </div>
                          )}
                          {report.grade && (
                            <div className="flex items-center space-x-1">
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-green-600">Điểm: {report.grade}/10</span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-700 mb-3 line-clamp-2">{report.content}</p>

                        {report.attachments && report.attachments.length > 0 && (
                          <div className="flex items-center space-x-2 mb-3">
                            <DocumentIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {report.attachments.length} tệp đính kèm
                            </span>
                          </div>
                        )}

                        {report.feedback && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-blue-900 mb-1">Nhận xét từ giáo viên:</p>
                            <p className="text-sm text-blue-800">{report.feedback}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowViewModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {(report.status === 'PENDING' || report.status === 'DRAFT') && (
                          <button
                            onClick={() => openEditModal(report)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng báo cáo</p>
                  <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
                </div>
                <DocumentTextIcon className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã được duyệt</p>
                  <p className="text-3xl font-bold text-green-600">
                    {reports.filter(r => r.status === 'APPROVED').length}
                  </p>
                </div>
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chờ duyệt</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {reports.filter(r => r.status === 'PENDING').length}
                  </p>
                </div>
                <ClockIcon className="h-12 w-12 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bản nháp</p>
                  <p className="text-3xl font-bold text-gray-600">
                    {reports.filter(r => r.status === 'DRAFT').length}
                  </p>
                </div>
                <DocumentTextIcon className="h-12 w-12 text-gray-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Điểm trung bình</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {reports.filter(r => r.grade).length > 0 
                      ? (reports.filter(r => r.grade).reduce((sum, r) => sum + r.grade, 0) / reports.filter(r => r.grade).length).toFixed(1)
                      : 'N/A'
                    }
                  </p>
                </div>
                <ChartBarIcon className="h-12 w-12 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Create Report Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Tạo báo cáo mới</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateReport} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề báo cáo *
                    </label>
                    <input
                      type="text"
                      required
                      value={newReport.title}
                      onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: Báo cáo tuần 1 - Làm quen môi trường"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại báo cáo *
                    </label>
                    <select
                      required
                      value={newReport.type}
                      onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="WEEKLY">Báo cáo tuần</option>
                      <option value="MONTHLY">Báo cáo tháng</option>
                      <option value="FINAL">Báo cáo cuối kỳ</option>
                    </select>
                  </div>
                </div>

                {newReport.type === 'WEEKLY' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tuần thứ
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newReport.weekNumber}
                        onChange={(e) => setNewReport(prev => ({ ...prev, weekNumber: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kỳ báo cáo
                      </label>
                      <input
                        type="text"
                        value={newReport.reportPeriod}
                        onChange={(e) => setNewReport(prev => ({ ...prev, reportPeriod: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: 20/07/2025 - 26/07/2025"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung báo cáo *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={newReport.content}
                    onChange={(e) => setNewReport(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả chi tiết về công việc đã thực hiện, kiến thức đã học được, khó khăn gặp phải và kế hoạch cho giai đoạn tiếp theo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tệp đính kèm
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click để chọn file hoặc kéo thả vào đây</span>
                      <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, PNG, JPG (tối đa 10MB)</span>
                    </label>
                  </div>

                  {newReport.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {newReport.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <DocumentIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-700">{file.name || file}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {submitLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    <span>Nộp báo cáo</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Report Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Chỉnh sửa báo cáo</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditReport} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề báo cáo *
                    </label>
                    <input
                      type="text"
                      required
                      value={editReport.title}
                      onChange={(e) => setEditReport(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: Báo cáo tuần 1 - Làm quen môi trường"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại báo cáo *
                    </label>
                    <select
                      required
                      value={editReport.type}
                      onChange={(e) => setEditReport(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="WEEKLY">Báo cáo tuần</option>
                      <option value="MONTHLY">Báo cáo tháng</option>
                      <option value="FINAL">Báo cáo cuối kỳ</option>
                    </select>
                  </div>
                </div>

                {editReport.type === 'WEEKLY' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tuần thứ
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editReport.weekNumber}
                        onChange={(e) => setEditReport(prev => ({ ...prev, weekNumber: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kỳ báo cáo
                      </label>
                      <input
                        type="text"
                        value={editReport.reportPeriod}
                        onChange={(e) => setEditReport(prev => ({ ...prev, reportPeriod: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: 15/01/2024 - 21/01/2024"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung báo cáo *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={editReport.content}
                    onChange={(e) => setEditReport(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả chi tiết công việc đã thực hiện, kỹ năng học được, khó khăn gặp phải..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tệp đính kèm
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      onChange={handleEditFileUpload}
                      className="hidden"
                      id="edit-file-upload"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    />
                    <label
                      htmlFor="edit-file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click để chọn file hoặc kéo thả vào đây</span>
                      <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, PNG, JPG (tối đa 10MB)</span>
                    </label>
                  </div>

                  {editReport.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {editReport.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <DocumentIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-700">{file.name || file}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEditAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {submitLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    <span>Cập nhật báo cáo</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Report Modal */}
        {showViewModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Chi tiết báo cáo</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReport.status)}`}>
                      {getStatusText(selectedReport.status)}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {getTypeText(selectedReport.type)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Ngày nộp</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedReport.submittedAt)}</p>
                  </div>
                  {selectedReport.reportPeriod && (
                    <div>
                      <p className="text-sm text-gray-500">Kỳ báo cáo</p>
                      <p className="font-medium text-gray-900">{selectedReport.reportPeriod}</p>
                    </div>
                  )}
                  {selectedReport.grade && (
                    <div>
                      <p className="text-sm text-gray-500">Điểm số</p>
                      <p className="font-medium text-green-600">{selectedReport.grade}/10</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Nội dung báo cáo</h4>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.content}</p>
                  </div>
                </div>

                {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Tệp đính kèm</h4>
                    <div className="space-y-2">
                      {selectedReport.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <DocumentIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-700">{file}</span>
                          </div>
                          <button 
                            onClick={() => downloadAttachment(file)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            Tải xuống
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReport.feedback && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Nhận xét từ giáo viên</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800">{selectedReport.feedback}</p>
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

export default ReportsPage;