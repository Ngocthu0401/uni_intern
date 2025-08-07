import { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button, Typography, Space, message, notification } from 'antd';
import { PlusOutlined, UserOutlined, ReloadOutlined, FileExcelOutlined, SettingOutlined, TrophyOutlined } from '@ant-design/icons';
import { studentService } from '../../../services';
import { Student, StudentSearchCriteria, PaginationOptions } from '../../../models';
import { StudentTable, StudentFilters, StudentFormModal, StudentViewModal, StudentDeleteModal, StudentInternshipsModal, StudentScoresModal } from './components';

const { Title, Text } = Typography;

const StudentManagement = () => {
    // States for data
    const [students, setStudents] = useState([]);
    const [studentInternships, setStudentInternships] = useState({});
    const [totalStudents, setTotalStudents] = useState(0);

    // States for UI
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // States for search and pagination
    const [searchCriteria, setSearchCriteria] = useState(new StudentSearchCriteria());
    const [pagination, setPagination] = useState(new PaginationOptions({ page: 1, size: 10 }));

    // States for modals
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modals, setModals] = useState({
        form: { isOpen: false, mode: 'create' },
        view: { isOpen: false },
        delete: { isOpen: false },
        internships: { isOpen: false },
        scores: { isOpen: false }
    });

    // States for form
    const [formLoading, setFormLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Load students when search criteria or pagination changes
    const loadStudents = useCallback(async () => {
        try {
            setLoading(true);

            const response = await studentService.searchStudents(searchCriteria, pagination);
            const studentList = response.data.map(student => new Student(student));

            setStudents(studentList);
            setTotalStudents(response.total);
            extractStudentInternships(response.data);
        } catch (err) {
            console.error('Error loading students:', err);
            notification.error({
                message: 'Lỗi tải dữ liệu',
                description: 'Không thể tải danh sách sinh viên. Vui lòng thử lại.',
                placement: 'topRight'
            });
        } finally {
            setLoading(false);
        }
    }, [searchCriteria, pagination]);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    const extractStudentInternships = (studentData) => {
        const internshipMap = {};
        studentData.forEach(student => {
            internshipMap[student.id] = student.internships || [];
        });
        setStudentInternships(internshipMap);
    };

    // Refresh data
    const handleRefresh = async () => {
        setRefreshing(true);
        await loadStudents();
        setRefreshing(false);
        message.success('Dữ liệu đã được cập nhật');
    };

    // Modal management
    const openModal = (modalType, mode = null, student = null) => {
        setSelectedStudent(student);
        setModals(prev => ({
            ...prev,
            [modalType]: { isOpen: true, mode }
        }));
        setFormErrors({});
    };

    const closeModal = (modalType) => {
        setModals(prev => ({
            ...prev,
            [modalType]: { isOpen: false, mode: null }
        }));
        setSelectedStudent(null);
        setFormErrors({});
    };

    const closeAllModals = () => {
        setModals({
            form: { isOpen: false, mode: 'create' },
            view: { isOpen: false },
            delete: { isOpen: false },
            internships: { isOpen: false }
        });
        setSelectedStudent(null);
        setFormErrors({});
    };

    // Search and filter handlers
    const handleSearchChange = (keyword) => {
        setSearchCriteria(prev => ({ ...prev, keyword }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (field, value) => {
        setSearchCriteria(prev => ({ ...prev, [field]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const clearFilters = () => {
        setSearchCriteria(new StudentSearchCriteria());
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Pagination handler
    const handlePageChange = ({ page, size }) => {
        setPagination({ page, size });
    };

    // Form submission
    const handleFormSubmit = async (formData) => {
        try {
            setFormLoading(true);
            setFormErrors({});

            if (modals.form.mode === 'create') {
                const studentData = {
                    username: formData.username,
                    email: formData.email,
                    fullName: formData.fullName,
                    phoneNumber: formData.phone,
                    password: formData.studentCode,
                    role: 'STUDENT',
                    studentCode: formData.studentCode,
                    className: formData.className,
                    major: formData.major,
                    academicYear: formData.academicYear,
                    gpa: parseFloat(formData.gpa) || 0.0
                };

                await studentService.createStudent(studentData);

                notification.success({
                    message: 'Thành công',
                    description: 'Thêm sinh viên thành công!',
                    placement: 'topRight'
                });
            } else if (modals.form.mode === 'edit') {
                const studentData = {
                    studentCode: formData.studentCode,
                    className: formData.className,
                    major: formData.major,
                    academicYear: formData.academicYear,
                    gpa: parseFloat(formData.gpa) || 0.0
                };

                await studentService.updateStudent(selectedStudent.id, studentData);

                notification.success({
                    message: 'Thành công',
                    description: 'Cập nhật thông tin sinh viên thành công!',
                    placement: 'topRight'
                });
            }

            closeAllModals();
            loadStudents();
        } catch (err) {
            console.error('Error saving student:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi lưu thông tin sinh viên.';
            setFormErrors({ general: errorMessage });

            notification.error({
                message: 'Lỗi',
                description: errorMessage,
                placement: 'topRight'
            });
        } finally {
            setFormLoading(false);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        if (!selectedStudent) return;

        try {
            setFormLoading(true);
            await studentService.deleteStudent(selectedStudent.id);

            closeAllModals();
            loadStudents();

            notification.success({
                message: 'Thành công',
                description: 'Xóa sinh viên thành công!',
                placement: 'topRight'
            });
        } catch (err) {
            console.error('Error deleting student:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa sinh viên.';

            notification.error({
                message: 'Lỗi',
                description: errorMessage,
                placement: 'topRight'
            });
        } finally {
            setFormLoading(false);
        }
    };

    // Action handlers
    const handleViewStudent = (student) => {
        openModal('view', null, student);
    };

    const handleEditStudent = (student) => {
        openModal('form', 'edit', student);
    };

    const handleDeleteStudent = (student) => {
        openModal('delete', null, student);
    };

    const handleViewInternships = (student) => {
        openModal('internships', null, student);
    };

    const handleExportExcel = () => {
        // TODO: Implement Excel export
        message.info('Tính năng xuất Excel đang được phát triển');
    };

    const antPagination = {
        page: pagination.page,
        size: pagination.size,
        total: totalStudents
    };

    return (
        <div className="p-6 space-y-6 fade-in">
            {/* Header */}
            <Card className="shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 !mb-4">
                <Row justify="space-between" align="middle">
                    <Col className=''>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                <UserOutlined className="text-2xl" />
                            </div>
                            <div>
                                <Title level={2} className="text-white mb-1">
                                    Quản lý Sinh viên
                                </Title>
                                <Text className="text-blue-100">
                                    Quản lý thông tin và tài khoản sinh viên • Tổng: {totalStudents} sinh viên
                                </Text>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <Space size="middle">
                            <Button
                                type="default"
                                icon={<ReloadOutlined />}
                                onClick={handleRefresh}
                                loading={refreshing}
                                className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30"
                            >
                                Làm mới
                            </Button>
                            <Button
                                type="default"
                                icon={<FileExcelOutlined />}
                                onClick={handleExportExcel}
                                className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30"
                            >
                                Xuất Excel
                            </Button>
                            <Button
                                color='cyan'
                                size='large'
                                variant="solid"
                                icon={<TrophyOutlined />}
                                onClick={() => openModal('scores')}
                                className="bg-yellow-500 bg-opacity-90 border-yellow-400 text-white hover:bg-yellow-400 font-semibold shadow-lg"
                            >
                                Bảng điểm
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => openModal('form', 'create')}
                                size="large"
                                className="bg-white text-blue-600 border-0 hover:bg-gray-100 font-semibold shadow-lg"
                            >
                                Thêm Sinh viên
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Filters */}
            <StudentFilters
                searchCriteria={searchCriteria}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                loading={loading}
            />

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className='mt-3'>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            {totalStudents}
                        </div>
                        <div className="text-gray-500 text-sm">Tổng sinh viên</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                            {students.filter(s => studentInternships[s.id]?.some(i => i.status === 'IN_PROGRESS')).length}
                        </div>
                        <div className="text-gray-500 text-sm">Đang thực tập</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                            {students.filter(s => !studentInternships[s.id]?.length).length}
                        </div>
                        <div className="text-gray-500 text-sm">Chưa có thực tập</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                            {students.filter(s => studentInternships[s.id]?.some(i => i.status === 'COMPLETED')).length}
                        </div>
                        <div className="text-gray-500 text-sm">Hoàn thành thực tập</div>
                    </Card>
                </Col>
            </Row>

            {/* Table */}
            <StudentTable
                students={students}
                loading={loading}
                studentInternships={studentInternships}
                pagination={antPagination}
                onPageChange={handlePageChange}
                onView={handleViewStudent}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onViewInternships={handleViewInternships}
            />

            {/* Modals */}
            <StudentFormModal
                isOpen={modals?.form?.isOpen}
                onClose={() => closeModal('form')}
                onSubmit={handleFormSubmit}
                mode={modals.form.mode}
                student={selectedStudent}
                loading={formLoading}
                errors={formErrors}
            />

            <StudentViewModal
                isOpen={modals?.view?.isOpen}
                onClose={() => closeModal('view')}
                student={selectedStudent}
            />

            <StudentDeleteModal
                isOpen={modals?.delete?.isOpen}
                onClose={() => closeModal('delete')}
                onConfirm={handleDelete}
                student={selectedStudent}
                loading={formLoading}
            />

            <StudentInternshipsModal
                isOpen={modals?.internships?.isOpen}
                onClose={() => closeModal('internships')}
                student={selectedStudent}
                internships={studentInternships[selectedStudent?.id] || []}
            />

            <StudentScoresModal
                isOpen={modals?.scores?.isOpen}
                onClose={() => closeModal('scores')}
            />
        </div>
    );
};

export default StudentManagement;