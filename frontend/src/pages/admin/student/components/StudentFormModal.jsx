import { useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Button,
    Row,
    Col,
    Card,
    Typography,
    Divider,
    Alert,
    Space
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    IdcardOutlined,
    BookOutlined,
    CalendarOutlined,
    TrophyOutlined,
    SaveOutlined,
    CloseOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const StudentFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    mode = 'create',
    student = null,
    loading = false,
    errors = {}
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isOpen) {
            if (mode === 'create') {
                form.resetFields();
            } else if (mode === 'edit' && student) {
                form.setFieldsValue({
                    username: student.user?.username || '',
                    email: student.user?.email || '',
                    fullName: student.user?.fullName || '',
                    phone: student.user?.phoneNumber || '',
                    studentCode: student.studentCode || '',
                    className: student.className || '',
                    major: student.major || '',
                    academicYear: student.academicYear || '',
                    gpa: student.gpa || 0
                });
            }
        }
    }, [isOpen, mode, student, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const modalTitle = mode === 'create' ? 'Thêm Sinh viên mới' : 'Chỉnh sửa Sinh viên';

    return (
        <Modal
            title={
                <div className="gradient-header -m-6 mb-4">
                    <Title level={3} className="text-white mb-1">
                        <UserOutlined className="mr-2" />
                        {modalTitle}
                    </Title>
                    <Text className="text-blue-100">
                        {mode === 'create' ? 'Nhập thông tin sinh viên mới' : 'Cập nhật thông tin sinh viên'}
                    </Text>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={800}
            footer={null}
            destroyOnClose
            className="ant-modal-student-form"
            maskStyle={{ backdropFilter: 'blur(4px)' }}
        >
            {/* Error Display */}
            {errors.general && (
                <Alert
                    message="Lỗi"
                    description={errors.general}
                    type="error"
                    showIcon
                    className="mb-4"
                    closable
                />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark="optional"
                scrollToFirstError
            >
                {/* User Information Section */}
                <Card
                    title={
                        <div className="flex items-center">
                            <UserOutlined className="text-blue-500 mr-2" />
                            <span>Thông tin tài khoản</span>
                        </div>
                    }
                    className="mb-6"
                    size="small"
                >
                    <Row gutter={[16, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Tên đăng nhập"
                                name="username"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                                    { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
                                ]}
                                validateStatus={errors.username ? 'error' : ''}
                                help={errors.username}
                            >
                                <Input
                                    prefix={<IdcardOutlined className="text-gray-400" />}
                                    placeholder="student123"
                                    disabled={mode === 'edit'}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                                validateStatus={errors.email ? 'error' : ''}
                                help={errors.email}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-gray-400" />}
                                    placeholder="student@university.edu.vn"
                                    disabled={mode === 'edit'}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Họ và tên"
                                name="fullName"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập họ và tên!' },
                                    { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                                ]}
                                validateStatus={errors.fullName ? 'error' : ''}
                                help={errors.fullName}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-gray-400" />}
                                    placeholder="Nguyễn Văn A"
                                    disabled={mode === 'edit'}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined className="text-gray-400" />}
                                    placeholder="0123456789"
                                    disabled={mode === 'edit'}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Academic Information Section */}
                <Card
                    title={
                        <div className="flex items-center">
                            <BookOutlined className="text-green-500 mr-2" />
                            <span>Thông tin học tập</span>
                        </div>
                    }
                    className="mb-6"
                    size="small"
                >
                    <Row gutter={[16, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Mã sinh viên"
                                name="studentCode"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã sinh viên!' },
                                    { min: 3, message: 'Mã sinh viên phải có ít nhất 3 ký tự!' }
                                ]}
                                validateStatus={errors.studentCode ? 'error' : ''}
                                help={errors.studentCode}
                            >
                                <Input
                                    prefix={<IdcardOutlined className="text-gray-400" />}
                                    placeholder="SV001"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Lớp"
                                name="className"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập lớp!' }
                                ]}
                                validateStatus={errors.className ? 'error' : ''}
                                help={errors.className}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-gray-400" />}
                                    placeholder="CNTT-K19"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Ngành học"
                                name="major"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập ngành học!' }
                                ]}
                                validateStatus={errors.major ? 'error' : ''}
                                help={errors.major}
                            >
                                <Input
                                    prefix={<BookOutlined className="text-gray-400" />}
                                    placeholder="Công nghệ Thông tin"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Năm học"
                                name="academicYear"
                            >
                                <Input
                                    prefix={<CalendarOutlined className="text-gray-400" />}
                                    placeholder="2023-2024"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                label="GPA (0.0 - 4.0)"
                                name="gpa"
                                rules={[
                                    { type: 'number', min: 0, max: 4, message: 'GPA phải từ 0.0 đến 4.0!' }
                                ]}
                                validateStatus={errors.gpa ? 'error' : ''}
                                help={errors.gpa}
                            >
                                <InputNumber
                                    prefix={<TrophyOutlined className="text-gray-400" />}
                                    placeholder="3.50"
                                    min={0}
                                    max={4}
                                    step={0.01}
                                    precision={2}
                                    size="large"
                                    className="w-full"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Divider />

                {/* Action Buttons */}
                <div className="flex justify-end">
                    <Space size="middle">
                        <Button
                            type="default"
                            icon={<CloseOutlined />}
                            onClick={onClose}
                            size="large"
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                        >
                            {mode === 'create' ? 'Thêm sinh viên' : 'Cập nhật'}
                        </Button>
                    </Space>
                </div>
            </Form>
        </Modal>
    );
};

export default StudentFormModal;