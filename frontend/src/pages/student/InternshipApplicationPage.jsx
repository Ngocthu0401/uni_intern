import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, PlusIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { BuildingOfficeIcon, MapPinIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { internshipService, studentService, apiHelpers } from '../../services';
import { useAuth } from '../../context/AuthContext';

const InternshipApplicationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    cv: null
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

  // Helper function to calculate duration in weeks
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Chưa xác định';
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Chưa xác định';
      const weeks = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
      return `${weeks} tuần`;
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

  const loadData = async () => {
    if (!user?.id) {
      setError('Không thể lấy thông tin người dùng');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First get the student record from user ID
      const studentData = await studentService.getStudentByUserId(user.id);
      
      // Load available internships
      const internshipsResponse = await internshipService.getInternships();
      const internshipsData = internshipsResponse.content || internshipsResponse || [];
      const processedInternships = internshipsData.map(internship => ({
        id: internship.id,
        title: internship.jobTitle || 'Chưa có tiêu đề',
        company: internship.company?.companyName || 'Chưa xác định',
        location: internship.company?.address || 'Chưa xác định',
        salary: internship.salary ? `${internship.salary.toLocaleString('vi-VN')} VNĐ` : 'Thỏa thuận',
        duration: calculateDuration(internship.startDate, internship.endDate),
        deadline: formatDate(internship.endDate),
        description: internship.jobDescription || 'Chưa có mô tả',
        requirements: internship.requirements ? internship.requirements.split(',').map(r => r.trim()) : ['Chưa xác định'],
        benefits: internship.benefits ? internship.benefits.split(',').map(b => b.trim()) : ['Chưa xác định'],
        applied: false // Will be updated based on applications
      }));

      // Load student's internships using student ID
      const studentInternships = await internshipService.getInternshipsByStudent(studentData.id);
      const processedApplications = studentInternships.map(internship => ({
        id: internship.id,
        internshipTitle: internship.jobTitle || 'Chưa có tiêu đề',
        company: internship.company?.companyName || 'Chưa xác định',
        appliedDate: formatDate(internship.createdAt),
        status: internship.status?.toLowerCase() || 'pending',
        statusText: getApplicationStatusText(internship.status || 'PENDING'),
        notes: internship.notes || '',
        startDate: formatDate(internship.startDate),
        endDate: formatDate(internship.endDate),
        salary: internship.salary ? `${internship.salary.toLocaleString('vi-VN')} VNĐ` : 'Thỏa thuận'
      }));

      // Mark internships as applied if student has applied
      const appliedInternshipIds = studentInternships.map(internship => internship.id);
      processedInternships.forEach(internship => {
        internship.applied = appliedInternshipIds.includes(internship.id);
      });

      setInternships(processedInternships);
      setApplications(processedApplications);

    } catch (err) {
      console.error('Error loading data:', err);
      setError(apiHelpers.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Đang xem xét',
      'APPROVED': 'Được chấp nhận',
      'ASSIGNED': 'Đã được phân công',
      'IN_PROGRESS': 'Đang thực hiện',
      'COMPLETED': 'Đã hoàn thành',
      'REJECTED': 'Bị từ chối',
      'WITHDRAWN': 'Đã rút',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'approved':
      case 'assigned':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'rejected':
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'assigned':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApply = (internship) => {
    setSelectedInternship(internship);
    setApplicationData({ coverLetter: '', cv: null });
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async () => {
    try {
      const formData = new FormData();
      formData.append('studentId', user.id);
      formData.append('internshipId', selectedInternship.id);
      formData.append('coverLetter', applicationData.coverLetter);
      if (applicationData.cv) {
        formData.append('cv', applicationData.cv);
      }

      await internshipService.applyForInternship(selectedInternship.id, formData);
      
      // Update local state
      setInternships(prev => prev.map(internship => 
        internship.id === selectedInternship.id 
          ? { ...internship, applied: true }
          : internship
      ));
      
      // Reload applications
      await loadData();
      
      setShowApplicationModal(false);
      setSelectedInternship(null);
      setApplicationData({ coverLetter: '', cv: null });
      
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(apiHelpers.formatErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ứng tuyển thực tập</h1>
          <p className="mt-2 text-gray-600">Quản lý đơn ứng tuyển và tìm kiếm cơ hội thực tập</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Internships */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Cơ hội thực tập</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {internships.map((internship) => (
                    <div key={internship.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm">{internship.company}</span>
                          </div>
                        </div>
                        {internship.applied && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Đã ứng tuyển
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4">{internship.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm">{internship.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm">{internship.salary}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm">{internship.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm">Hạn: {new Date(internship.deadline).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Yêu cầu:</h4>
                        <div className="flex flex-wrap gap-2">
                          {internship.requirements.map((req, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Quyền lợi:</h4>
                        <div className="flex flex-wrap gap-2">
                          {internship.benefits.map((benefit, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* My Applications */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Đơn ứng tuyển của tôi</h2>
              </div>

              {/* Search and Filter */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-3">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đơn ứng tuyển..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Đang xem xét</option>
                  <option value="accepted">Được chấp nhận</option>
                  <option value="rejected">Bị từ chối</option>
                </select>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{application.internshipTitle}</h3>
                        {getStatusIcon(application.status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{application.company}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.statusText}
                        </span>
                      </div>
                      {application.notes && (
                        <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                          {application.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Modal */}
        {showApplicationModal && selectedInternship && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ứng tuyển: {selectedInternship.title}
              </h3>
              <p className="text-gray-600 mb-4">{selectedInternship.company}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thư xin việc
                  </label>
                  <textarea
                    rows={4}
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Viết thư xin việc của bạn..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tải lên CV
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setApplicationData(prev => ({ ...prev, cv: e.target.files[0] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitApplication}
                  disabled={!applicationData.coverLetter.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Gửi đơn ứng tuyển
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipApplicationPage;