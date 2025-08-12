import React, { useState, useEffect, useMemo } from 'react';
import { Card, Input, Select, message } from 'antd';
import { internshipService, studentService, apiHelpers } from '../../services';
import { useAuth } from '../../context/AuthContext';
import InternshipList from './internship-application/InternshipList';
import ApplicationHistory from './internship-application/ApplicationHistory';
import ApplyModal from './internship-application/ApplyModal';

const InternshipApplicationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [studentRecord, setStudentRecord] = useState(null);

  const { user, loading: authLoading } = useAuth();

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Chưa xác định';
      return date.toLocaleDateString('vi-VN');
    } catch {
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
    } catch {
      return 'Chưa xác định';
    }
  };

  // Load data from API
  useEffect(() => {
    if (!authLoading && user?.id) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id]);

  const loadData = async () => {
    if (!user?.id) {
      message.error('Không thể lấy thông tin người dùng');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // First get the student record from user ID
      const studentData = await studentService.getStudentByUserId(user.id);
      setStudentRecord(studentData);

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
        startDate: formatDate(internship.startDate),
        endDate: formatDate(internship.endDate),
        description: internship.jobDescription || 'Chưa có mô tả',
        jobDescription: internship.jobDescription || '',
        requirements: internship.requirements ? internship.requirements.split(',').map(r => r.trim()) : [],
        benefits: internship.benefits ? internship.benefits.split(',').map(b => b.trim()) : [],
        workingHoursPerWeek: internship.workingHoursPerWeek,
        status: internship.status || 'PENDING',
        hasStudent: Boolean(internship.student),
        isOpen: !internship.student && !['COMPLETED', 'CANCELLED', 'IN_PROGRESS', 'ASSIGNED'].includes(internship.status || ''),
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
      message.error(apiHelpers.formatErrorMessage(err));
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

  // Removed unused legacy helpers after refactor

  const inActiveInternship = useMemo(() => {
    return applications.some(app => ['IN_PROGRESS', 'ASSIGNED', 'APPROVED'].includes((app.status || '').toUpperCase()));
  }, [applications]);

  const handleApply = (internship) => {
    if (inActiveInternship) {
      message.warning('Bạn đang trong một kỳ thực tập, không thể ứng tuyển thêm.');
      return;
    }
    setSelectedInternship(internship);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async () => {
    try {
      await internshipService.applyForInternship(selectedInternship.id, { studentId: studentRecord.id });
      setInternships(prev => prev.map(i => i.id === selectedInternship.id ? { ...i, applied: true } : i));
      await loadData();
      setShowApplicationModal(false);
      setSelectedInternship(null);
      message.success('Ứng tuyển thành công');
    } catch (err) {
      console.error('Error submitting application:', err);
      message.error(apiHelpers.formatErrorMessage(err));
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

  // Error handled via AntD message; keep page render

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

  console.log('internships', internships);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Ứng tuyển thực tập</h1>
          <p className="mt-1 text-gray-600">Tìm kiếm cơ hội và theo dõi đơn ứng tuyển</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card bordered className="mb-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder="Tìm kiếm theo tiêu đề, công ty" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Select value={statusFilter} onChange={setStatusFilter} options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'pending', label: 'Đang xem xét' },
                  { value: 'approved', label: 'Được chấp nhận' },
                  { value: 'assigned', label: 'Đã phân công' },
                  { value: 'in_progress', label: 'Đang thực tập' },
                  { value: 'completed', label: 'Đã hoàn thành' },
                  { value: 'rejected', label: 'Bị từ chối' },
                  { value: 'cancelled', label: 'Đã hủy' },
                ]} />
              </div>
            </Card>

            <InternshipList
              internships={internships.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()))}
              canApply={!inActiveInternship}
              onApply={handleApply}
            />
          </div>

          <div className="lg:col-span-1">
            <ApplicationHistory applications={applications.filter(app => statusFilter === 'all' || app.status === statusFilter)} />
          </div>
        </div>

        <ApplyModal
          open={showApplicationModal}
          onCancel={() => setShowApplicationModal(false)}
          onSubmit={handleSubmitApplication}
          internship={selectedInternship}
        />
      </div>
    </div>
  );
};

export default InternshipApplicationPage;