import { Modal, Card, Row, Col, Typography, Avatar, Tag, Descriptions, Progress, Statistic, Space, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, BookOutlined, CalendarOutlined, TrophyOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StudentViewModal = ({ isOpen, onClose, student }) => {
    if (!student) return null;

    const getGPAColor = (gpa) => {
        if (gpa >= 3.5) return '#52c41a';
        if (gpa >= 3.0) return '#1890ff';
        if (gpa >= 2.5) return '#faad14';
        return '#ff4d4f';
    };

    const getGPAStatus = (gpa) => {
        if (gpa >= 3.5) return 'Xuất sắc';
        if (gpa >= 3.0) return 'Giỏi';
        if (gpa >= 2.5) return 'Khá';
        if (gpa >= 2.0) return 'Trung bình';
        return 'Yếu';
    };

    const getStatusIcon = () => {
        if (student.isActive?.()) {
            return <CheckCircleOutlined className="text-green-500" />;
        }
        return <CloseCircleOutlined className="text-red-500" />;
    };

    return (
        <Modal
            title={
                <div className="gradient-header -m-6 mb-4">
                    <div className="!flex !items-center !space-x-4">
                        <Avatar
                            size={64}
                            style={{
                                backgroundColor: '#1890ff',
                                color: 'white',
                                border: '3px solid rgba(255,255,255,0.3)'
                            }}
                            icon={<UserOutlined />}
                        >
                            {student.user?.fullName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <div>
                            <Title level={3} className="!text-white !mb-1">
                                {student.user?.fullName || 'Chưa có thông tin'}
                            </Title>
                            <Text className="!text-blue-100">
                                {student.studentCode} • {student.className || 'Chưa xác định'}
                            </Text>
                        </div>
                    </div>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={1100}
            footer={null}
            destroyOnClose
            maskStyle={{ backdropFilter: 'blur(4px)' }}
        >
            <div className="!space-y-6">
                {/* Status and Quick Stats */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <Card className="!text-center">
                            <Statistic
                                title="Trạng thái"
                                value={student.getStatusLabel?.() || 'Hoạt động'}
                                prefix={getStatusIcon()}
                                valueStyle={{
                                    color: student.isActive?.() ? '#52c41a' : '#ff4d4f',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="!text-center">
                            <Statistic
                                title="GPA"
                                value={student.gpa?.toFixed(2) || 'N/A'}
                                suffix="/ 4.0"
                                valueStyle={{
                                    color: student.gpa ? getGPAColor(student.gpa) : '#666',
                                    fontWeight: 'bold'
                                }}
                            />
                            {student.gpa && (
                                <div className="mt-2">
                                    <Progress
                                        percent={(student.gpa / 4) * 100}
                                        strokeColor={getGPAColor(student.gpa)}
                                        showInfo={false}
                                        size="small"
                                    />
                                    <Text className="text-xs text-gray-500">
                                        {getGPAStatus(student.gpa)}
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="!text-center">
                            <Statistic
                                title="Ngành học"
                                value={student.major || 'Chưa xác định'}
                                prefix={<BookOutlined />}
                                valueStyle={{ fontSize: '14px' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Personal Information */}
                <Card
                    title={
                        <div className="!flex !items-center">
                            <UserOutlined className="!text-blue-500 !mr-2" />
                            <span>Thông tin cá nhân</span>
                        </div>
                    }
                    className="!shadow-sm"
                >
                    <Descriptions
                        column={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
                        size="middle"
                        bordered
                        items={[
                            {
                                key: 'fullName',
                                label: (
                                    <span>
                                        <UserOutlined className="!mr-2" />
                                        Họ và tên
                                    </span>
                                ),
                                children: (
                                    <Text strong>
                                        {student.user?.fullName || 'Chưa có thông tin'}
                                    </Text>
                                ),
                                span: 2
                            },
                            {
                                key: 'username',
                                label: (
                                    <span>
                                        <IdcardOutlined className="!mr-2" />
                                        Tên đăng nhập
                                    </span>
                                ),
                                children: (
                                    <Text code>
                                        {student.user?.username || 'Chưa có thông tin'}
                                    </Text>
                                ),
                                span: 2
                            },
                            {
                                key: 'email',
                                label: (
                                    <span>
                                        <MailOutlined className="!mr-2" />
                                        Email
                                    </span>
                                ),
                                children: (
                                    <Text copyable>
                                        {student.user?.email || 'Chưa có email'}
                                    </Text>
                                ),
                                span: 2
                            },
                            {
                                key: 'phone',
                                label: (
                                    <span>
                                        <PhoneOutlined className="!mr-2" />
                                        Số điện thoại
                                    </span>
                                ),
                                children: (
                                    <Text copyable>
                                        {student.user?.phoneNumber || 'Chưa có SĐT'}
                                    </Text>
                                ),
                                span: 2
                            }
                        ]}
                    />
                </Card>

                {/* Academic Information */}
                <Card
                    title={
                        <div className="!flex !items-center">
                            <BookOutlined className="!text-green-500 !mr-2" />
                            <span>Thông tin học tập</span>
                        </div>
                    }
                    className="shadow-sm"
                >
                    <Descriptions
                        column={{ xs: 1, sm: 2 }}
                        size="middle"
                        bordered
                        items={[
                            {
                                key: 'studentCode',
                                label: (
                                    <span>
                                        <IdcardOutlined className="mr-2" />
                                        Mã sinh viên
                                    </span>
                                ),
                                children: (
                                    <Text strong className="text-lg">
                                        {student.studentCode}
                                    </Text>
                                ),
                                span: 2
                            },
                            {
                                key: 'className',
                                label: (
                                    <span>
                                        <UserOutlined className="mr-2" />
                                        Lớp
                                    </span>
                                ),
                                children: (
                                    <Tag color="blue" className="rounded-full">
                                        {student.className || 'Chưa xác định'}
                                    </Tag>
                                ),
                                span: 2
                            },
                            {
                                key: 'major',
                                label: (
                                    <span>
                                        <BookOutlined className="mr-2" />
                                        Ngành học
                                    </span>
                                ),
                                children: (
                                    <Tag color="green" className="rounded-full">
                                        {student.major || 'Chưa xác định'}
                                    </Tag>
                                ),
                                span: 2
                            },
                            {
                                key: 'academicYear',
                                label: (
                                    <span>
                                        <CalendarOutlined className="mr-2" />
                                        Năm học
                                    </span>
                                ),
                                children: (
                                    <Tag color="orange" className="rounded-full">
                                        {student.academicYear || 'Chưa xác định'}
                                    </Tag>
                                ),
                                span: 2
                            }
                        ]}
                    />

                    {/* GPA Detail */}
                    {student.gpa && (
                        <>
                            <Divider orientation="left">
                                <TrophyOutlined className="mr-2" />
                                Chi tiết GPA
                            </Divider>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Card className="!text-center !bg-gradient-to-br !from-yellow-50 !to-orange-50 !border-yellow-200">
                                        <div className="!space-y-2">
                                            <div className="!text-3xl !font-bold" style={{ color: getGPAColor(student.gpa) }}>
                                                {student.gpa.toFixed(2)}
                                            </div>
                                            <div className="!text-sm !text-gray-600">Điểm trung bình tích lũy</div>
                                            <Progress
                                                type="circle"
                                                percent={(student.gpa / 4) * 100}
                                                strokeColor={{
                                                    '0%': getGPAColor(student.gpa),
                                                    '100%': getGPAColor(student.gpa)
                                                }}
                                                size={80}
                                                format={() => getGPAStatus(student.gpa)}
                                            />
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <div className="!space-y-3">
                                        <div className="!flex !justify-between !items-center">
                                            <span>Thang điểm 4.0</span>
                                            <Progress
                                                percent={(student.gpa / 4) * 100}
                                                strokeColor={getGPAColor(student.gpa)}
                                                showInfo={false}
                                            />
                                        </div>
                                        <div className="!space-y-2 !text-sm">
                                            <div className="!flex !justify-between">
                                                <span>Xếp loại:</span>
                                                <Tag color={student.gpa >= 3.5 ? 'red' : student.gpa >= 3.0 ? 'blue' : student.gpa >= 2.5 ? 'orange' : 'default'}>
                                                    {getGPAStatus(student.gpa)}
                                                </Tag>
                                            </div>
                                            <div className="!flex !justify-between">
                                                <span>Hoàn thành:</span>
                                                <Text strong>{((student.gpa / 4) * 100).toFixed(1)}%</Text>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    )}
                </Card>

                {/* System Information */}
                <Card
                    title={
                        <div className="!flex !items-center">
                            <ClockCircleOutlined className="!text-purple-500 !mr-2" />
                            <span>Thông tin hệ thống</span>
                        </div>
                    }
                    className="!shadow-sm"
                    size="small"
                >
                    <Row gutter={[16, 16]} className="text-center">
                        <Col xs={24} sm={8}>
                            <div>
                                <div className="!text-lg !font-bold !text-purple-600">
                                    {student.user?.createdAt ?
                                        new Date(student.user.createdAt).toLocaleDateString('vi-VN') : 'N/A'
                                    }
                                </div>
                                <div className="!text-sm !text-gray-500">Ngày tạo tài khoản</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={8}>
                            <div>
                                <div className="!text-lg !font-bold !text-purple-600">
                                    {student.user?.role || 'STUDENT'}
                                </div>
                                <div className="!text-sm !text-gray-500">Vai trò</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={8}>
                            <div>
                                <div className="!text-lg !font-bold !text-purple-600">
                                    {student.user?.updatedAt ?
                                        new Date(student.user.updatedAt).toLocaleDateString('vi-VN') : 'N/A'
                                    }
                                </div>
                                <div className="!text-sm !text-gray-500">Cập nhật cuối</div>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        </Modal>
    );
};

export default StudentViewModal;