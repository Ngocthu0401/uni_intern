import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { studentService, teacherService } from '../../../services';
import { Table, Modal, Input, Select, Alert } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import StudentTable from './components/StudentTable';
import StudentDetailModal from './components/StudentDetailModal';

const { Option } = Select;

const StudentManagementPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    user && loadStudents();
  }, [user, searchTerm, statusFilter, pagination.current]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');

      let teacherId;
      try {
        const teacherResponse = await teacherService.getTeacherByUserId(user?.id);
        teacherId = teacherResponse.id;
      } catch (err) {
        console.error('Error getting teacher:', err);
        setError('Không tìm thấy thông tin giảng viên. Vui lòng liên hệ quản trị viên.');
        return;
      }

      const response = await studentService.getStudentsByTeacher(teacherId, { _t: Date.now() });
      let studentsData = response.data || [];

      if (searchTerm) {
        studentsData = studentsData.filter(student =>
          student.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== 'all') {
        studentsData = studentsData.filter(student => {
          const currentInternship = getCurrentInternship(student.internships);
          return currentInternship?.status === statusFilter;
        });
      }

      setStudents(studentsData);
      setPagination(prev => ({
        ...prev,
        total: studentsData.length
      }));

    } catch (err) {
      console.error('Error loading students:', err);
      setError('Không thể tải danh sách sinh viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const getCurrentInternship = (internships) => {
    if (!internships || internships.length === 0) return null;

    const sortedInternships = [...internships].sort((a, b) => {
      const priorityOrder = {
        'IN_PROGRESS': 5,
        'ASSIGNED': 4,
        'ACTIVE': 3,
        'PENDING': 2,
        'COMPLETED': 1,
        'TERMINATED': 0,
        'CANCELLED': 0
      };

      const aPriority = priorityOrder[a.status] || 0;
      const bPriority = priorityOrder[b.status] || 0;

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return sortedInternships[0];
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {error && <Alert message={error} type="error" showIcon className="mb-4" />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý sinh viên</h1>
            <p className="mt-2 text-gray-600">Theo dõi và quản lý sinh viên thực tập</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm sinh viên theo tên, mã SV, email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full !pl-10 !pr-3 !py-2 !border !border-gray-300 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
                prefix={<EyeOutlined className="text-gray-400" />}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="!px-3 !py-2 !border !border-gray-300 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="active">Đang thực tập</Option>
                <Option value="pending">Chờ phân công</Option>
                <Option value="completed">Hoàn thành</Option>
              </Select>
            </div>
          </div>
        </div>

        <StudentTable
          students={students}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
        />
      </div>

      <StudentDetailModal
        visible={showDetailModal}
        student={selectedStudent}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
};

export default StudentManagementPage;