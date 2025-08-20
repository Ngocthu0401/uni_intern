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
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    user && loadStudents();
  }, [user, searchTerm, pagination.current]);

  // Apply status filter when statusFilter changes
  useEffect(() => {
    if (allStudents.length > 0) {
      let filteredStudents = [...allStudents];

      console.log('allStudents: ', allStudents);
      console.log('filteredStudents: ', filteredStudents);

      if (statusFilter !== 'all') {
        filteredStudents = allStudents.filter(student => {
          if (student.internships && student.internships.length > 0) {
            // Sort internships by priority and get the most recent one
            const currentInternship = student.internships
              .sort((a, b) => {
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
              })[0];
            console.log('currentInternship: ', currentInternship);


            return currentInternship && currentInternship.status === statusFilter;
          }
          return false;
        });
      }

      setStudents(filteredStudents);
      setPagination(prev => ({
        ...prev,
        total: filteredStudents.length,
        current: 1
      }));
    }
  }, [statusFilter, allStudents]);

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

      const params = {
        _t: Date.now(),
        keyword: searchTerm || undefined
      };

      const response = await studentService.getStudentsByTeacher(teacherId, params);
      let studentsData = response.data || [];

      // Store all students (without status filter)
      setAllStudents(studentsData);
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
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  return (
    <div className="!min-h-screen !bg-gray-50 !py-8">
      {error && <Alert message={error} type="error" showIcon className="mb-4" />}
      <div className="!max-w-7xl !mx-auto !px-4 !sm:px-6 !lg:px-8">
        <div className="!flex !justify-between !items-center !mb-8">
          <div>
            <h1 className="!text-3xl !font-bold !text-gray-900">Quản lý sinh viên</h1>
            <p className="!mt-2 !text-gray-600">Theo dõi và quản lý sinh viên thực tập</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Section */}
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Tìm kiếm sinh viên theo tên, mã SV, email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  size="large"
                  className="w-full"
                  prefix={<EyeOutlined className="text-gray-400 text-lg" />}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  }}
                />
              </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Select
                value={statusFilter}
                onChange={handleStatusFilter}
                size="large"
                placeholder="Lọc theo trạng thái"
                className="min-w-[200px]"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              >
                <Option value="all">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Tất cả trạng thái</span>
                  </div>
                </Option>
                <Option value="IN_PROGRESS">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Đang thực tập</span>
                  </div>
                </Option>
                <Option value="PENDING">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Chờ phân công</span>
                  </div>
                </Option>
                <Option value="COMPLETED">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Hoàn thành</span>
                  </div>
                </Option>
              </Select>

              {/* Clear Filters Button */}
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Bộ lọc đang hoạt động:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    <span>Tìm kiếm: "{searchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full border border-green-200">
                    <span>Trạng thái: {statusFilter === 'IN_PROGRESS' ? 'Đang thực tập' : statusFilter === 'PENDING' ? 'Chờ phân công' : 'Hoàn thành'}</span>
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="ml-1 text-green-500 hover:text-green-700"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
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