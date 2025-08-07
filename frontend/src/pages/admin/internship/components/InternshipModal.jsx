import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Button, Space, Tabs, Descriptions, Tag, Avatar, Divider, message, Spin, Row, Col } from 'antd';
import {
    SaveOutlined,
    CloseOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined,
    BookOutlined,
    DollarOutlined,
    CalendarOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import {
    internshipService,
    companyService,
    studentService,
    teacherService,
    mentorService,
    batchService
} from '../../../../services';
import dayjs from 'dayjs';
import './InternshipModal.css';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const InternshipModal = ({ visible, mode, internship, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [assignmentData, setAssignmentData] = useState({
        companyId: '',
        studentId: '',
        mentorId: '',
        teacherId: ''
    });
    const [companies, setCompanies] = useState([]);
    const [students, setStudents] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [availableMentors, setAvailableMentors] = useState([]);
    const [activeBatches, setActiveBatches] = useState([]);

    console.log('activeBatches: ', activeBatches);

    // Load data for assignment
    const loadAssignmentData = async () => {
        try {
            const [companyResponse, studentResponse, mentorResponse, teacherResponse] = await Promise.all([
                companyService.getActiveCompanies(),
                studentService.getAvailableStudents(),
                mentorService.getMentors(),
                teacherService.getTeachers()
            ]);

            setCompanies(companyResponse.data || companyResponse || []);
            setStudents(studentResponse.data || studentResponse || []);
            setMentors(mentorResponse.data || mentorResponse || []);
            setTeachers(teacherResponse.data || teacherResponse || []);
        } catch (error) {
            console.error('Error loading assignment data:', error);
            message.error('Không thể tải dữ liệu phân công');
        }
    };

    // Load active batches
    const loadActiveBatches = async () => {
        try {
            const batchesResponse = await batchService.getActiveBatches();
            setActiveBatches(batchesResponse?.data || batchesResponse || []);
        } catch (error) {
            console.error('Error loading active batches:', error);
            message.error('Không thể tải danh sách đợt thực tập');
        }
    };

    // Load mentors for selected company
    const loadMentorsForCompany = async (companyId) => {
        if (!companyId) {
            setAvailableMentors([]);
            return;
        }

        try {
            const mentorsForCompany = mentors?.content?.filter(mentor => mentor?.company?.id === companyId);
            setAvailableMentors(mentorsForCompany);
        } catch (error) {
            console.error('Error loading mentors for company:', error);
        }
    };

    // Handle company selection
    const handleCompanyChange = (companyId) => {
        setAssignmentData(prev => ({ ...prev, companyId, mentorId: '' }));
        loadMentorsForCompany(companyId);
    };

    // Modal title based on mode
    const getModalTitle = () => {
        switch (mode) {
            case 'create':
                return 'Tạo Vị trí thực tập mới';
            case 'edit':
                return 'Chỉnh sửa Thực tập';
            case 'view':
                return 'Chi tiết Thực tập';
            case 'delete':
                return 'Xác nhận xóa';
            case 'approve':
                return 'Phê duyệt Thực tập';
            case 'reject':
                return 'Từ chối Thực tập';
            case 'assign':
                return 'Phân công Thực tập';
            default:
                return 'Thực tập';
        }
    };

    // Handle form submit
    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const internshipData = {
                jobTitle: values.title,
                jobDescription: values.description,
                requirements: values.requirements || 'Chưa xác định',
                startDate: values.dateRange[0].format('YYYY-MM-DD'),
                endDate: values.dateRange[1].format('YYYY-MM-DD'),
                status: 'PENDING',
                workingHoursPerWeek: values.workingHours || 40,
                salary: values.salary || 0,
                benefits: values.benefits || 'Chưa xác định',
                notes: values.notes || '',
                internshipBatchId: values.batchId
            };

            if (mode === 'edit') {
                delete internshipData.internshipBatchId;
            }

            if (mode === 'create') {
                await internshipService.createInternship(internshipData);
                message.success('Tạo thực tập thành công');
            } else if (mode === 'edit') {
                await internshipService.updateInternship(internship.id, internshipData);
                message.success('Cập nhật thực tập thành công');
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving internship:', error);
            message.error(error.message || 'Có lỗi xảy ra khi lưu thông tin thực tập');
        } finally {
            setLoading(false);
        }
    };

    // Handle status change
    const handleStatusChange = async () => {
        try {
            setLoading(true);

            if (mode === 'approve') {
                await internshipService.approveInternship(internship.id);
                message.success('Phê duyệt thực tập thành công');
            } else if (mode === 'reject') {
                await internshipService.rejectInternship(internship.id);
                message.success('Từ chối thực tập thành công');
            }

            onSuccess();
        } catch (error) {
            console.error('Error changing internship status:', error);
            message.error(error.message || 'Có lỗi xảy ra khi thay đổi trạng thái thực tập');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            setLoading(true);
            await internshipService.deleteInternship(internship.id);
            message.success('Xóa thực tập thành công');
            onSuccess();
        } catch (error) {
            console.error('Error deleting internship:', error);
            message.error(error.message || 'Có lỗi xảy ra khi xóa thực tập');
        } finally {
            setLoading(false);
        }
    };

    // Handle assignment
    const handleAssignment = async () => {
        try {
            setLoading(true);

            const cleanAssignmentData = {
                companyId: assignmentData.companyId,
                studentId: assignmentData.studentId
            };

            if (assignmentData.mentorId) {
                cleanAssignmentData.mentorId = assignmentData.mentorId;
            }

            if (assignmentData.teacherId) {
                cleanAssignmentData.teacherId = assignmentData.teacherId;
            }

            await internshipService.assignInternship(internship.id, cleanAssignmentData);
            message.success('Phân công thực tập thành công');
            onSuccess();
        } catch (error) {
            console.error('Error assigning internship:', error);
            message.error(error.message || 'Có lỗi xảy ra khi phân công thực tập');
        } finally {
            setLoading(false);
        }
    };

    // Initialize form data
    useEffect(() => {
        if (visible && mode === 'assign') {
            loadAssignmentData();
            if (internship) {
                setAssignmentData({
                    companyId: internship.company?.id || '',
                    studentId: internship.student?.id || '',
                    mentorId: internship.mentor?.id || '',
                    teacherId: internship.teacher?.id || ''
                });
            }
        } else if (visible && (mode === 'create' || mode === 'edit')) {
            loadActiveBatches();
        }
    }, [visible, mode, internship]);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (visible && mode === 'create') {
            form.resetFields();
        } else if (visible && mode === 'edit' && internship) {
            form.setFieldsValue({
                title: internship.jobTitle || '',
                batchId: internship.internshipBatch?.id || '',
                description: internship.jobDescription || '',
                requirements: internship.requirements || '',
                benefits: internship.benefits || '',
                notes: internship.notes || '',
                salary: internship.salary || 0,
                workingHours: internship.workingHoursPerWeek || 40,
                dateRange: internship.startDate && internship.endDate ? [
                    dayjs(internship.startDate),
                    dayjs(internship.endDate)
                ] : null
            });
        }
    }, [visible, mode, internship, form]);

    // Render modal content based on mode
    const renderModalContent = () => {
        switch (mode) {
            case 'view':
                return <InternshipDetailView internship={internship} />;

            case 'delete':
                return (
                    <div className="!text-center">
                        <p className="!mb-4">
                            Bạn có chắc chắn muốn xóa thực tập{' '}
                            <span className="!font-semibold">{internship?.jobTitle}</span>?
                        </p>
                        <p className="!text-red-500 !text-sm">
                            Hành động này không thể hoàn tác.
                        </p>
                    </div>
                );

            case 'approve':
            case 'reject':
                return (
                    <div className="text-center">
                        <p className="mb-4">
                            Bạn có chắc chắn muốn {mode === 'approve' ? 'phê duyệt' : 'từ chối'} thực tập{' '}
                            <span className="font-semibold">{internship?.jobTitle}</span>?
                        </p>
                    </div>
                );

            case 'assign':
                return <AssignmentForm
                    assignmentData={assignmentData}
                    setAssignmentData={setAssignmentData}
                    companies={companies?.content}
                    students={students}
                    availableMentors={availableMentors}
                    teachers={teachers?.content}
                    onCompanyChange={handleCompanyChange}
                    internship={internship}
                />;

            default:
                return <InternshipForm form={form} onSubmit={handleSubmit} activeBatches={activeBatches} mode={mode} />;
        }
    };

    // Render modal footer based on mode
    const renderModalFooter = () => {
        switch (mode) {
            case 'view':
                return [
                    <Button key="close" onClick={onClose}>
                        Đóng
                    </Button>
                ];

            case 'delete':
                return [
                    <Button key="cancel" onClick={onClose}>
                        Hủy
                    </Button>,
                    <Button
                        key="delete"
                        danger
                        loading={loading}
                        onClick={handleDelete}
                    >
                        Xóa
                    </Button>
                ];

            case 'approve':
            case 'reject':
                return [
                    <Button key="cancel" onClick={onClose}>
                        Hủy
                    </Button>,
                    <Button
                        key="confirm"
                        type={mode === 'approve' ? 'primary' : 'default'}
                        danger={mode === 'reject'}
                        loading={loading}
                        onClick={handleStatusChange}
                    >
                        {mode === 'approve' ? 'Phê duyệt' : 'Từ chối'}
                    </Button>
                ];

            case 'assign':
                return [
                    <Button key="cancel" onClick={onClose}>
                        Hủy
                    </Button>,
                    <Button
                        key="assign"
                        type="primary"
                        loading={loading}
                        disabled={!assignmentData.companyId || !assignmentData.studentId}
                        onClick={handleAssignment}
                    >
                        Phân công
                    </Button>
                ];

            default:
                return [
                    <Button key="cancel" onClick={onClose}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={() => form.submit()}
                    >
                        {mode === 'create' ? 'Tạo' : 'Cập nhật'}
                    </Button>
                ];
        }
    };

    return (
        <Modal
            title={getModalTitle()}
            open={visible}
            onCancel={onClose}
            footer={renderModalFooter()}
            width={800}
            destroyOnClose
        >
            <Spin spinning={loading}>
                {renderModalContent()}
            </Spin>
        </Modal>
    );
};

// Internship Form Component
const InternshipForm = ({ form, onSubmit, activeBatches = [], mode }) => {
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
        >
            <Form.Item
                name="batchId"
                label="Đợt thực tập"
                rules={[{ required: true, message: 'Vui lòng chọn đợt thực tập' }]}
            >
                <Select placeholder="-- Chọn đợt thực tập --"
                    disabled={mode === 'edit'}
                >
                    {activeBatches.map(batch => (
                        <Select.Option key={batch.id} value={batch.id}>
                            {batch.batchName} - {batch.academicYear} ({batch.semester})
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
                <Input placeholder="Thực tập sinh Phát triển phần mềm" />
            </Form.Item>

            <Form.Item
                name="dateRange"
                label="Thời gian thực tập"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
            >
                <RangePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="salary"
                        label="Mức lương (VND/tháng)"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="0"
                            min={0}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="workingHours"
                        label="Giờ làm việc/tuần"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="40"
                            min={1}
                            max={60}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="description"
                label="Mô tả công việc"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
                <TextArea
                    rows={4}
                    placeholder="Mô tả chi tiết về công việc, trách nhiệm và môi trường làm việc..."
                />
            </Form.Item>

            <Form.Item
                name="requirements"
                label="Yêu cầu"
            >
                <TextArea
                    rows={3}
                    placeholder="Yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                />
            </Form.Item>

            <Form.Item
                name="benefits"
                label="Phúc lợi"
            >
                <TextArea
                    rows={3}
                    placeholder="Các phúc lợi và quyền lợi cho thực tập sinh..."
                />
            </Form.Item>

            <Form.Item
                name="notes"
                label="Ghi chú"
            >
                <TextArea
                    rows={2}
                    placeholder="Ghi chú bổ sung..."
                />
            </Form.Item>
        </Form>
    );
};

// Assignment Form Component
const AssignmentForm = ({ assignmentData, setAssignmentData, companies, students, availableMentors, teachers, onCompanyChange, internship }) => {
    return (
        <div className="space-y-6">
            {/* Current internship info */}
            <div className="current-internship-info">
                <h4>Thông tin thực tập hiện tại</h4>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Tiêu đề:</span> {internship?.jobTitle}
                    </div>
                    <div className="info-item">
                        <span className="info-label">Mã:</span> {internship?.internshipCode}
                    </div>
                    <div className="info-item">
                        <span className="info-label">Công ty hiện tại:</span> {internship?.company?.companyName || 'Chưa có'}
                    </div>
                    <div className="info-item">
                        <span className="info-label">Sinh viên hiện tại:</span> {internship?.student?.user?.fullName || 'Chưa phân công'}
                    </div>
                    <div className="info-item">
                        <span className="info-label">Giảng viên hiện tại:</span> {internship?.teacher?.user?.fullName || 'Chưa phân công'}
                    </div>
                    <div className="info-item">
                        <span className="info-label">Mentor hiện tại:</span> {internship?.mentor?.user?.fullName || 'Chưa phân công'}
                    </div>
                </div>
            </div>

            {/* Assignment form */}
            <div className="assignment-form-grid">
                <div className="form-field">
                    <label>
                        Chọn Công ty <span className="required">*</span>
                    </label>
                    <Select
                        value={assignmentData?.companyId}
                        onChange={(value) => {
                            setAssignmentData(prev => ({ ...prev, companyId: value }));
                            onCompanyChange(value);
                        }}
                        placeholder="-- Chọn công ty --"
                        style={{ width: '100%' }}
                    >
                        {companies && companies?.length > 0 && companies?.map(company => (
                            <Select.Option key={company?.id} value={company?.id}>
                                {company?.companyName} ({company?.companyCode})
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <div className="form-field">
                    <label>
                        Chọn Sinh viên <span className="required">*</span>
                    </label>
                    <Select
                        value={assignmentData?.studentId}
                        onChange={(value) => setAssignmentData(prev => ({ ...prev, studentId: value }))}
                        placeholder="-- Chọn sinh viên --"
                        style={{ width: '100%' }}
                    >
                        {students && students?.length > 0 && students?.map(student => (
                            <Select.Option key={student?.id} value={student?.id}>
                                {student?.user?.fullName} - {student?.studentCode}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <div className="form-field">
                    <label>
                        Chọn Giảng viên phụ trách
                    </label>
                    <Select
                        value={assignmentData?.teacherId}
                        onChange={(value) => setAssignmentData(prev => ({ ...prev, teacherId: value }))}
                        placeholder="-- Chọn giảng viên --"
                        style={{ width: '100%' }}
                    >
                        {teachers && teachers?.length > 0 && teachers?.map(teacher => (
                            <Select.Option key={teacher?.id} value={teacher?.id}>
                                {teacher?.user?.fullName} - {teacher?.department}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <div className="form-field">
                    <label>
                        Chọn Mentor
                    </label>
                    <Select
                        value={assignmentData?.mentorId}
                        onChange={(value) => setAssignmentData(prev => ({ ...prev, mentorId: value }))}
                        placeholder="-- Chọn mentor --"
                        style={{ width: '100%' }}
                        disabled={!assignmentData.companyId}
                    >
                        {availableMentors && availableMentors?.length > 0 && availableMentors?.map(mentor => (
                            <Select.Option key={mentor?.id} value={mentor?.id}>
                                {mentor?.user?.fullName} - {mentor?.company?.companyName}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    );
};

// Internship Detail View Component
const InternshipDetailView = ({ internship }) => {
    if (!internship) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'orange';
            case 'APPROVED': return 'blue';
            case 'REJECTED': return 'red';
            case 'ASSIGNED': return 'purple';
            case 'IN_PROGRESS': return 'green';
            case 'COMPLETED': return 'cyan';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ phê duyệt';
            case 'APPROVED': return 'Đã phê duyệt';
            case 'REJECTED': return 'Bị từ chối';
            case 'ASSIGNED': return 'Đã phân công';
            case 'IN_PROGRESS': return 'Đang thực tập';
            case 'COMPLETED': return 'Hoàn thành';
            default: return 'Chưa xác định';
        }
    };

    return (
        <div className="internship-detail-tabs">
            <Tabs defaultActiveKey="basic">
                <TabPane tab="Thông tin cơ bản" key="basic">
                    <div className="internship-detail-content">
                        <Descriptions column={2} bordered>
                            <Descriptions.Item label="Tiêu đề công việc" span={2}>
                                {internship.jobTitle || 'Chưa có tiêu đề'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã thực tập">
                                <code>{internship.internshipCode || 'Chưa có mã'}</code>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={getStatusColor(internship.status)} className="status-tag">
                                    {getStatusText(internship.status)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian làm việc">
                                {internship.workingHoursPerWeek || 40} giờ/tuần
                            </Descriptions.Item>
                            <Descriptions.Item label="Mức lương">
                                {internship.salary ?
                                    new Intl.NumberFormat('vi-VN').format(internship.salary) + ' VND/tháng' :
                                    'Thỏa thuận'
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày bắt đầu">
                                {internship.startDate ? dayjs(internship.startDate).format('DD/MM/YYYY') : 'Chưa xác định'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày kết thúc">
                                {internship.endDate ? dayjs(internship.endDate).format('DD/MM/YYYY') : 'Chưa xác định'}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </TabPane>

                <TabPane tab="Thông tin phân công" key="assignment">
                    <div className="internship-detail-content">
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Công ty">
                                <div className="!flex !items-center">
                                    <BookOutlined className="!mr-2 !text-blue-500" />
                                    <div>
                                        <div className="!font-medium">{internship.company?.companyName || 'Chưa phân công'}</div>
                                        <div className="!text-sm !text-gray-500">{internship.company?.address || 'Chưa có địa chỉ'}</div>
                                    </div>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Sinh viên">
                                <div className="!flex !items-center">
                                    <UserOutlined className="!mr-2 !text-green-500" />
                                    <div>
                                        <div className="!font-medium">{internship.student?.user?.fullName || 'Chưa phân công'}</div>
                                        <div className="!text-sm !text-gray-500">Mã SV: {internship.student?.studentCode || 'N/A'}</div>
                                    </div>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Giảng viên phụ trách">
                                <div className="!flex !items-center">
                                    <BookOutlined className="!mr-2 !text-purple-500" />
                                    <div>
                                        <div className="!font-medium">{internship.teacher?.user?.fullName || 'Chưa phân công'}</div>
                                        <div className="!text-sm !text-gray-500">Khoa: {internship.teacher?.department || 'N/A'}</div>
                                    </div>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mentor">
                                <div className="!flex !items-center">
                                    <UserOutlined className="!mr-2 !text-orange-500" />
                                    <div>
                                        <div className="!font-medium">{internship.mentor?.user?.fullName || 'Chưa phân công'}</div>
                                        <div className="!text-sm !text-gray-500">Chức vụ: {internship.mentor?.position || 'N/A'}</div>
                                    </div>
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </TabPane>

                <TabPane tab="Mô tả & Yêu cầu" key="details">
                    <div className="internship-detail-content">
                        <div className="space-y-4">
                            <div className="detail-section">
                                <h4 className="!text-lg !font-semibold">Mô tả công việc</h4>
                                <div className="detail-content">
                                    {internship.jobDescription || 'Chưa có mô tả công việc'}
                                </div>
                            </div>

                            {internship.requirements && (
                                <div className="detail-section">
                                    <h4 className="!text-lg !font-semibold">Yêu cầu</h4>
                                    <div className="detail-content orange-bg">
                                        {internship.requirements}
                                    </div>
                                </div>
                            )}

                            {internship.benefits && (
                                <div className="detail-section">
                                    <h4 className="!text-lg !font-semibold">Phúc lợi</h4>
                                    <div className="detail-content green-bg">
                                        {internship.benefits}
                                    </div>
                                </div>
                            )}

                            {internship.notes && (
                                <div className="detail-section">
                                    <h4 className="!text-lg !font-semibold">Ghi chú</h4>
                                    <div className="detail-content yellow-bg">
                                        {internship.notes}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default InternshipModal;
