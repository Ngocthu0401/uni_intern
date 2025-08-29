import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Button, Space, Tabs, Descriptions, Tag, Avatar, Divider, message, Spin, Row, Col, Card, Typography, Alert } from 'antd';
import { SaveOutlined, CloseOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, BookOutlined, DollarOutlined, CalendarOutlined, FileTextOutlined, TeamOutlined, BankOutlined, ClockCircleOutlined, TagOutlined, InfoCircleOutlined, EditOutlined, GiftOutlined, CopyOutlined } from '@ant-design/icons';
import { internshipService, companyService, studentService, teacherService, mentorService, batchService } from '../../../../services';
import dayjs from 'dayjs';
import './InternshipModal.css';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const InternshipModal = ({ visible, mode, internship, onClose, onSuccess }) => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [assignmentData, setAssignmentData] = useState({
        studentId: '',
        mentorId: ''
    });
    const [students, setStudents] = useState([]);
    const [availableMentors, setAvailableMentors] = useState([]);
    const [activeBatches, setActiveBatches] = useState([]);
    const [openBatches, setOpenBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);

    // Load data for assignment
    const loadAssignmentData = async () => {
        try {
            const [studentResponse, mentorResponse] = await Promise.all([
                studentService.getAvailableStudents(),
                mentorService.getMentors()
            ]);

            // Handle different response structures
            const studentsData = studentResponse?.data || studentResponse || [];
            const mentorsData = mentorResponse?.data || mentorResponse?.content || [];

            setStudents(studentsData);

            // If internship has a company, load mentors for that company
            if (internship?.company?.id !== null) {
                const mentorsForCompany = mentorsData?.filter(mentor => mentor?.company?.id === internship.company.id);

                setAvailableMentors(mentorsForCompany);
            } else {
                setAvailableMentors([]);
            }
        } catch (error) {
            console.error('Error loading assignment data:', error);
            message.error('Không thể tải dữ liệu phân công');
        }
    };

    // Load active batches and filter open ones
    const loadActiveBatches = async () => {
        try {
            const batchesResponse = await batchService.getActiveBatches();
            const allBatches = batchesResponse?.data || batchesResponse || [];

            // Filter batches that are still open for registration
            const now = new Date();
            const openBatches = allBatches.filter(batch => {
                if (!batch.registrationEndDate) return false;
                const regEndDate = new Date(batch.registrationEndDate);
                return regEndDate > now;
            });

            setActiveBatches(allBatches);
            setOpenBatches(openBatches);
        } catch (error) {
            console.error('Error loading active batches:', error);
            message.error('Không thể tải danh sách đợt thực tập');
        }
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
                internshipBatchId: values.batchId,
                companyId: values.companyId,
                teacherId: values.teacherId || null
            };

            if (mode === 'edit') {
                delete internshipData.internshipBatchId;
            }

            if (mode === 'create') {
                const quantity = values.quantity || 1;

                // Create multiple internships if quantity > 1
                if (quantity > 1) {
                    for (let i = 0; i < quantity; i++) {
                        const internshipWithSuffix = {
                            ...internshipData,
                            jobTitle: `${internshipData.jobTitle} ${i + 1}`
                        };
                        // Đợi 0.5s trước khi gọi request tiếp theo
                        // Wait 0.5s before next request
                        await internshipService.createInternship(internshipWithSuffix);
                        if (i < quantity - 1) {
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                    message.success(`Đã tạo thành công ${quantity} vị trí thực tập`);
                } else {
                    await internshipService.createInternship(internshipData);
                    message.success('Tạo thực tập thành công');
                }
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
                studentId: assignmentData.studentId || internship?.student?.id
            };

            if (assignmentData.mentorId) {
                cleanAssignmentData.mentorId = assignmentData.mentorId;
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
                    studentId: internship.student?.id || '',
                    mentorId: internship.mentor?.id || ''
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
            setSelectedBatch(null);
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

    // Auto-fill date range and company when batch is selected in create mode
    useEffect(() => {
        if (visible && mode === 'create' && activeBatches.length > 0) {
            const currentBatchId = form.getFieldValue('batchId');
            if (currentBatchId) {
                const selectedBatch = activeBatches.find(batch => batch.id === currentBatchId);
                if (selectedBatch) {
                    setSelectedBatch(selectedBatch);
                    const formValues = {};

                    // Auto-fill date range if available
                    if (selectedBatch.startDate && selectedBatch.endDate) {
                        formValues.dateRange = [
                            dayjs(selectedBatch.startDate),
                            dayjs(selectedBatch.endDate)
                        ];
                    }

                    // Auto-fill company if available
                    if (selectedBatch.company && selectedBatch.company.id) {
                        formValues.companyId = selectedBatch.company.id;
                    }

                    form.setFieldsValue(formValues);
                }
            }
        }
    }, [visible, mode, activeBatches, form]);

    // Render modal content based on mode
    const renderModalContent = () => {
        switch (mode) {
            case 'view':
                return <InternshipDetailView internship={internship} />;

            case 'delete':
                return (
                    <div className="text-center py-6">
                        <CloseCircleOutlined className="text-6xl text-red-500 mb-4" />
                        <Title level={4} className="mb-4">
                            Xác nhận xóa thực tập
                        </Title>
                        <Text className="text-gray-600 mb-4 block">
                            Bạn có chắc chắn muốn xóa thực tập{' '}
                            <Text strong className="text-blue-600">{internship?.jobTitle}</Text>?
                        </Text>
                        <Alert
                            message="Hành động này không thể hoàn tác"
                            type="warning"
                            showIcon
                            className="max-w-md mx-auto"
                        />
                    </div>
                );

            case 'approve':
            case 'reject':
                return (
                    <div className="text-center py-6">
                        {mode === 'approve' ? (
                            <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
                        ) : (
                            <CloseCircleOutlined className="text-6xl text-red-500 mb-4" />
                        )}
                        <Title level={4} className="mb-4">
                            {mode === 'approve' ? 'Phê duyệt' : 'Từ chối'} thực tập
                        </Title>
                        <Text className="text-gray-600">
                            Bạn có chắc chắn muốn {mode === 'approve' ? 'phê duyệt' : 'từ chối'} thực tập{' '}
                            <Text strong className="text-blue-600">{internship?.jobTitle}</Text>?
                        </Text>
                    </div>
                );

            case 'assign':
                return <AssignmentForm
                    assignmentData={assignmentData}
                    setAssignmentData={setAssignmentData}
                    students={students}
                    availableMentors={availableMentors}
                    internship={internship}
                />;

            default:
                return <InternshipForm
                    form={form}
                    onSubmit={handleSubmit}
                    activeBatches={activeBatches}
                    openBatches={openBatches}
                    mode={mode}
                    selectedBatch={selectedBatch}
                    setSelectedBatch={setSelectedBatch}
                />;
        }
    };

    // Render modal footer based on mode
    const renderModalFooter = (openBatches = []) => {
        switch (mode) {
            case 'view':
                return [
                    <Button key="close" onClick={onClose} type="primary">
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
                        icon={<CloseCircleOutlined />}
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
                        icon={mode === 'approve' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
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
                        disabled={!(assignmentData.studentId || internship?.student?.id)}
                        onClick={handleAssignment}
                        className="!text-white"
                        icon={<TeamOutlined />}
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
                        disabled={mode === 'create' && openBatches.length === 0}
                        onClick={() => form.submit()}
                        icon={<SaveOutlined />}
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
            footer={renderModalFooter(openBatches)}
            width={1000}
            destroyOnHidden
            className="internship-modal"
        >
            <Spin spinning={loading}>
                {renderModalContent()}
            </Spin>
        </Modal>
    );
};

// Internship Form Component
const CompanySelect = (props) => {
    const [options, setOptions] = React.useState([]);
    React.useEffect(() => {
        (async () => {
            try {
                const res = await companyService.getActiveCompanies();
                const list = res.data || res || [];
                setOptions(list.map(c => ({ label: `${c.companyName} (${c.companyCode})`, value: c.id })));
            } catch {
                // ignore
            }
        })();
    }, []);
    return (
        <Select
            placeholder="-- Chọn công ty --"
            options={options}
            showSearch
            optionFilterProp="label"
            {...props}
        />
    );
};

const TeacherSelect = (props) => {
    const [options, setOptions] = React.useState([]);
    React.useEffect(() => {
        (async () => {
            try {
                const res = await teacherService.getTeachers({ page: 0, size: 1000 });
                const list = res.data?.content || res.content || res || [];
                setOptions(list.map(t => ({ label: `${t.user?.fullName} - ${t.department || 'N/A'}`, value: t.id })));
            } catch {
                // ignore
            }
        })();
    }, []);
    return (
        <Select
            placeholder="-- Chọn giảng viên --"
            options={options}
            showSearch
            optionFilterProp="label"
            {...props}
        />
    );
};

const InternshipForm = ({ form, onSubmit, activeBatches = [], openBatches = [], mode, selectedBatch, setSelectedBatch }) => {
    // Handle batch selection to auto-fill date range and company
    const handleBatchChange = (batchId) => {
        if (batchId && mode === 'create') {
            const selectedBatch = activeBatches.find(batch => batch.id === batchId);
            if (selectedBatch) {
                // Update the selected batch state
                setSelectedBatch(selectedBatch);

                const formValues = {};

                // Auto-fill date range if available
                if (selectedBatch.startDate && selectedBatch.endDate) {
                    formValues.dateRange = [
                        dayjs(selectedBatch.startDate),
                        dayjs(selectedBatch.endDate)
                    ];
                }

                // Auto-fill company if available
                if (selectedBatch.company && selectedBatch.company.id) {
                    formValues.companyId = selectedBatch.company.id;
                }

                form.setFieldsValue(formValues);
            }
        }
    };

    return (
        <div className="p-6">
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                className="space-y-6"
            >
                <Card title="Thông tin cơ bản" className="mb-6">
                    {openBatches.length === 0 && (
                        <Alert
                            message="Không có đợt thực tập nào còn mở đăng ký"
                            description="Tất cả các đợt thực tập đã hết hạn đăng ký. Vui lòng tạo đợt thực tập mới hoặc chờ đợt thực tập tiếp theo."
                            type="warning"
                            showIcon
                            className="mb-4"
                        />
                    )}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="batchId"
                                label={
                                    <span>
                                        <CalendarOutlined className="mr-2 text-blue-500" />
                                        Đợt thực tập
                                    </span>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn đợt thực tập' }]}
                            >
                                <Select
                                    placeholder={openBatches.length === 0 ? "Không có đợt thực tập nào còn mở đăng ký" : "-- Chọn đợt thực tập --"}
                                    disabled={mode === 'edit' || openBatches.length === 0}
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={handleBatchChange}
                                >
                                    {openBatches.map(batch => (
                                        <Select.Option key={batch.id} value={batch.id}>
                                            {batch.batchName} - {batch.academicYear} ({batch.semester}) - Còn {batch.maxStudents - (batch.currentStudents || 0)} slot
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="title"
                                label={
                                    <span>
                                        <FileTextOutlined className="mr-2 text-green-500" />
                                        Tiêu đề
                                    </span>
                                }
                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                            >
                                <Input placeholder="Thực tập sinh Phát triển phần mềm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="quantity"
                                label={
                                    <span>
                                        <CopyOutlined className="mr-2 text-purple-500" />
                                        Số lượng vị trí tương tự
                                    </span>
                                }
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số lượng' },
                                    { type: 'number', min: 1, message: 'Số lượng tối thiểu là 1' },
                                    {
                                        validator: (_, value) => {
                                            if (selectedBatch && value > selectedBatch.maxStudents - (selectedBatch.currentStudents || 0)) {
                                                return Promise.reject(new Error(`Số lượng tối đa là ${selectedBatch.maxStudents - (selectedBatch.currentStudents || 0)}`));
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                                help={selectedBatch ? `Tối đa: ${selectedBatch.maxStudents - (selectedBatch.currentStudents || 0)} vị trí` : undefined}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="1"
                                    min={1}
                                    max={selectedBatch ? selectedBatch.maxStudents - (selectedBatch.currentStudents || 0) : undefined}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="companyId"
                                label={
                                    <span>
                                        <BankOutlined className="mr-2 text-purple-500" />
                                        Công ty
                                        {mode === 'create' && (
                                            <Text type="secondary" className="ml-2 text-sm">
                                                (Tự động lấy từ đợt thực tập)
                                            </Text>
                                        )}
                                    </span>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn công ty' }]}
                                help={mode === 'create' ? 'Công ty sẽ được tự động lấy từ đợt thực tập đã chọn' : undefined}
                            >
                                <CompanySelect
                                    onChange={() => { }}
                                    allowClear
                                    disabled={mode === 'create'}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="teacherId"
                                label={
                                    <span>
                                        <UserOutlined className="!mr-2 !text-orange-500" />
                                        Giảng viên phụ trách
                                    </span>
                                }
                            >
                                <TeacherSelect onChange={() => { }} allowClear />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title="Thời gian và lương" className="mb-6">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="dateRange"
                                label={
                                    <span>
                                        <CalendarOutlined className="mr-2 text-blue-500" />
                                        Thời gian thực tập
                                        {mode === 'create' && (
                                            <Text type="secondary" className="ml-2 text-sm">
                                                (Tự động lấy từ đợt thực tập)
                                            </Text>
                                        )}
                                    </span>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
                                help={mode === 'create' ? 'Thời gian thực tập sẽ được tự động lấy từ đợt thực tập đã chọn' : undefined}
                            >
                                <RangePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                    disabled={mode === 'create'}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="salary"
                                label={
                                    <span>
                                        <DollarOutlined className="mr-2 text-green-500" />
                                        Mức lương (VND/tháng)
                                    </span>
                                }
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
                                label={
                                    <span>
                                        <ClockCircleOutlined className="mr-2 text-orange-500" />
                                        Giờ làm việc/tuần
                                    </span>
                                }
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
                </Card>

                <Card title="Mô tả và yêu cầu" className="mb-6">
                    <Form.Item
                        name="description"
                        label={
                            <span>
                                <FileTextOutlined className="mr-2 text-blue-500" />
                                Mô tả công việc
                            </span>
                        }
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Mô tả chi tiết về công việc, trách nhiệm và môi trường làm việc..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="requirements"
                        label={
                            <span>
                                <CheckCircleOutlined className="mr-2 text-orange-500" />
                                Yêu cầu
                            </span>
                        }
                    >
                        <TextArea
                            rows={3}
                            placeholder="Yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="benefits"
                        label={
                            <span>
                                <GiftOutlined className="mr-2 text-green-500" />
                                Phúc lợi
                            </span>
                        }
                    >
                        <TextArea
                            rows={3}
                            placeholder="Các phúc lợi và quyền lợi cho thực tập sinh..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="notes"
                        label={
                            <span>
                                <EditOutlined className="mr-2 text-gray-500" />
                                Ghi chú
                            </span>
                        }
                    >
                        <TextArea
                            rows={2}
                            placeholder="Ghi chú bổ sung..."
                        />
                    </Form.Item>
                </Card>
            </Form>
        </div>
    );
};

// Assignment Form Component
const AssignmentForm = ({ assignmentData, setAssignmentData, students, availableMentors, internship }) => {
    return (
        <div className="!p-6 !space-y-6">
            {/* Current internship info */}
            <Card
                title={
                    <span>
                        <InfoCircleOutlined className="!mr-2 !text-blue-50" />
                        Thông tin thực tập hiện tại
                    </span>
                }
                className="!bg-blue-50 !border-blue-200"
            >
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item
                        label={
                            <span>
                                <FileTextOutlined className="!mr-2 !text-blue-500" />
                                Tiêu đề
                            </span>
                        }
                    >
                        <Text strong>{internship?.jobTitle}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <span>
                                <TagOutlined className="!mr-2 !text-green-500" />
                                Mã thực tập
                            </span>
                        }
                    >
                        <Tag color="blue" className="font-mono">{internship?.internshipCode}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <span>
                                <BankOutlined className="!mr-2 !text-purple-500" />
                                Công ty
                            </span>
                        }
                    >
                        <div className="!flex !items-center">
                            <BankOutlined className="!mr-2 !text-purple-500" />
                            <span>{internship?.company?.companyName || 'Chưa có'}</span>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <span>
                                <UserOutlined className="!mr-2 !text-orange-500" />
                                Giảng viên phụ trách
                            </span>
                        }
                    >
                        <div className="!flex !items-center">
                            <UserOutlined className="!mr-2 !text-orange-500" />
                            <span>{internship?.teacher?.user?.fullName || 'Chưa phân công'}</span>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <span>
                                <UserOutlined className="!mr-2 !text-green-500" />
                                Sinh viên hiện tại
                            </span>
                        }
                    >
                        <div className="!flex !items-center">
                            <UserOutlined className="!mr-2 !text-green-500" />
                            <span>{internship?.student?.user?.fullName || 'Chưa phân công'}</span>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={
                            <span>
                                <UserOutlined className="!mr-2 !text-orange-500" />
                                Mentor hiện tại
                            </span>
                        }
                    >
                        <div className="!flex !items-center">
                            <UserOutlined className="!mr-2 !text-orange-500" />
                            <span>{internship?.mentor?.user?.fullName || 'Chưa phân công'}</span>
                        </div>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Assignment form */}
            <Card
                title={
                    <span>
                        <TeamOutlined className="!mr-2 !text-green-50" />
                        Phân công thành viên
                    </span>
                }
            >
                <Alert
                    message="Lưu ý phân công"
                    description="Công ty và Giảng viên đã được chọn khi tạo thực tập. Bạn chỉ cần chọn Sinh viên và Mentor để hoàn tất việc phân công."
                    type="info"
                    showIcon
                    className="!mb-4"
                />

                <Row gutter={[24, 24]}>
                    {/* Chỉ hiển thị phần chọn sinh viên nếu chưa có studentId */}
                    {!assignmentData?.studentId && (
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span>
                                        <UserOutlined className="!mr-2 !text-blue-500" />
                                        Chọn Sinh viên <span className="!text-red-500">*</span>
                                    </span>
                                }
                                required
                            >
                                <Select
                                    value={assignmentData?.studentId}
                                    onChange={(value) => setAssignmentData(prev => ({ ...prev, studentId: value }))}
                                    placeholder="-- Chọn sinh viên --"
                                    style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="label"
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={students?.map(student => ({
                                        value: student.id,
                                        label: `${student?.user?.fullName} - ${student?.studentCode}`,
                                        children: (
                                            <div className="!flex !items-center !space-x-2">
                                                <Avatar size="small" icon={<UserOutlined />} />
                                                <span>{student?.user?.fullName} - {student?.studentCode}</span>
                                            </div>
                                        )
                                    })) || []}
                                />
                            </Form.Item>
                        </Col>
                    )}

                    {/* Hiển thị thông tin sinh viên đã được chọn */}
                    {assignmentData?.studentId && (
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span>
                                        <UserOutlined className="!mr-2 !text-green-500" />
                                        Sinh viên đã chọn
                                    </span>
                                }
                            >
                                <div className="!flex !items-center !space-x-2 !p-3 !bg-green-50 !border !border-green-200 !rounded-lg">
                                    <Avatar size="small" icon={<UserOutlined />} />
                                    <div>
                                        <div className="!font-medium">
                                            {internship?.student?.user?.fullName || 'Sinh viên đã apply'}
                                        </div>
                                        <div className="!text-sm !text-gray-500">
                                            Mã SV: {internship?.student?.studentCode || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </Form.Item>
                        </Col>
                    )}

                    <Col span={12}>
                        <Form.Item
                            label={
                                <span>
                                    <UserOutlined className="!mr-2 !text-orange-500" />
                                    Chọn Mentor
                                </span>
                            }
                        >
                            <Select
                                value={assignmentData?.mentorId}
                                onChange={(value) => setAssignmentData(prev => ({ ...prev, mentorId: value }))}
                                placeholder="-- Chọn mentor --"
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                disabled={!availableMentors || availableMentors.length === 0}
                                options={availableMentors?.map(mentor => ({
                                    value: mentor.id,
                                    label: `${mentor?.user?.fullName} - ${mentor?.company?.companyName}`,
                                    children: (
                                        <div className="!flex !items-center !space-x-2">
                                            <Avatar size="small" icon={<UserOutlined />} />
                                            <span>{mentor?.user?.fullName} - {mentor?.company?.companyName}</span>
                                        </div>
                                    )
                                })) || []}
                            />
                            {(!availableMentors || availableMentors.length === 0) && (
                                <Text type="secondary" className="!text-xs">
                                    Không có mentor nào cho công ty này
                                </Text>
                            )}
                        </Form.Item>
                    </Col>
                </Row>

                {(assignmentData.studentId || internship?.student?.id) && (
                    <Alert
                        message="Thông tin phân công"
                        description={
                            <div className="mt-2">
                                <div className="!flex !items-center !space-x-2 !mb-1">
                                    <UserOutlined className="!text-blue-500" />
                                    <Text strong>Sinh viên:</Text>
                                    <Text>
                                        {students.find(s => s.id === assignmentData.studentId)?.user?.fullName ||
                                            internship?.student?.user?.fullName ||
                                            'Sinh viên đã apply'}
                                    </Text>
                                </div>
                                {assignmentData.mentorId && (
                                    <div className="!flex !items-center !space-x-2">
                                        <UserOutlined className="!text-orange-500" />
                                        <Text strong>Mentor:</Text>
                                        <Text>{availableMentors.find(m => m.id === assignmentData.mentorId)?.user?.fullName}</Text>
                                    </div>
                                )}
                            </div>
                        }
                        type="info"
                        showIcon
                        className="mt-4"
                    />
                )}
            </Card>
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
        <div className="p-6">
            <Tabs defaultActiveKey="basic" className="internship-detail-tabs">
                <TabPane tab="Thông tin cơ bản" key="basic">
                    <Card>
                        <Descriptions column={2} bordered>
                            <Descriptions.Item label="Tiêu đề công việc" span={2}>
                                <Text strong>{internship.jobTitle || 'Chưa có tiêu đề'}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã thực tập">
                                <Tag color="blue" className="font-mono">{internship.internshipCode || 'Chưa có mã'}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={getStatusColor(internship.status)} className="status-tag">
                                    {getStatusText(internship.status)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian làm việc">
                                <ClockCircleOutlined className="!mr-2 !text-orange-500" />
                                {internship.workingHoursPerWeek || 40} giờ/tuần
                            </Descriptions.Item>
                            <Descriptions.Item label="Mức lương">
                                <DollarOutlined className="!mr-2 !text-green-500" />
                                {internship.salary ?
                                    new Intl.NumberFormat('vi-VN').format(internship.salary) + ' VND/tháng' :
                                    'Thỏa thuận'
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày bắt đầu">
                                <CalendarOutlined className="!mr-2 !text-blue-500" />
                                {internship.startDate ? dayjs(internship.startDate).format('DD/MM/YYYY') : 'Chưa xác định'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày kết thúc">
                                <CalendarOutlined className="!mr-2 !text-blue-500" />
                                {internship.endDate ? dayjs(internship.endDate).format('DD/MM/YYYY') : 'Chưa xác định'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </TabPane>

                <TabPane tab="Thông tin phân công" key="assignment">
                    <Card>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Công ty">
                                <div className="!flex !items-center">
                                    <BankOutlined className="!mr-2 !text-purple-500" />
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
                                    <UserOutlined className="!mr-2 !text-orange-500" />
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
                    </Card>
                </TabPane>

                <TabPane tab="Mô tả & Yêu cầu" key="details">
                    <div className="space-y-6">
                        <Card title="Mô tả công việc" className="mb-4">
                            <div className="!bg-gray-50 !border !border-gray-200 !rounded-lg !p-4">
                                {internship.jobDescription || 'Chưa có mô tả công việc'}
                            </div>
                        </Card>

                        {internship.requirements && (
                            <Card title="Yêu cầu" className="mb-4">
                                <div className="!bg-orange-50 !border !border-orange-200 !rounded-lg !p-4">
                                    {internship.requirements}
                                </div>
                            </Card>
                        )}

                        {internship.benefits && (
                            <Card title="Phúc lợi" className="mb-4">
                                <div className="!bg-green-50 !border !border-green-200 !rounded-lg !p-4">
                                    {internship.benefits}
                                </div>
                            </Card>
                        )}

                        {internship.notes && (
                            <Card title="Ghi chú" className="mb-4">
                                <div className="!bg-yellow-50 !border !border-yellow-200 !rounded-lg !p-4">
                                    {internship.notes}
                                </div>
                            </Card>
                        )}
                    </div>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default InternshipModal;
