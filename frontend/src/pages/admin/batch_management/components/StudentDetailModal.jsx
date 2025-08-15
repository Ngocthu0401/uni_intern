import React from 'react';
import { Modal, Card, Descriptions, Tag, Avatar, Space, Divider, Button } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    IdcardOutlined,
    EnvironmentOutlined,
    BankOutlined,
    TrophyOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';

const StudentDetailModal = ({ student, visible, onClose }) => {
    if (!visible || !student) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'green';
            case 'PENDING':
                return 'orange';
            case 'COMPLETED':
                return 'blue';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'Đang học';
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'COMPLETED':
                return 'Đã tốt nghiệp';
            default:
                return 'Không xác định';
        }
    };

    const getInternshipStatusColor = (status) => {
        switch (status) {
            case 'ONGOING':
                return 'blue';
            case 'COMPLETED':
                return 'green';
            case 'PENDING':
                return 'orange';
            default:
                return 'default';
        }
    };

    const getInternshipStatusText = (status) => {
        switch (status) {
            case 'ONGOING':
                return 'Đang thực tập';
            case 'COMPLETED':
                return 'Đã hoàn thành';
            case 'PENDING':
                return 'Chờ xác nhận';
            default:
                return 'Không xác định';
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <UserOutlined className="text-blue-600" />
                    <span className="text-lg font-semibold">Chi tiết Sinh viên</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose} className="rounded-lg">
                    Đóng
                </Button>
            ]}
            width={800}
            className="student-detail-modal"
            destroyOnClose
        >
            <div className="space-y-6">
                {/* Student Header */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">{student.fullName}</h3>
                        <p className="text-gray-600">{student.studentCode}</p>
                        <Tag color={getStatusColor(student.status)} className="mt-1">
                            {getStatusText(student.status)}
                        </Tag>
                    </div>
                </div>

                {/* Personal Information */}
                <Card
                    title={
                        <div className="flex items-center space-x-2">
                            <UserOutlined className="text-purple-600" />
                            <span>Thông tin cá nhân</span>
                        </div>
                    }
                    className="shadow-sm border-gray-200"
                    size="small"
                >
                    <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="Họ và tên">
                            <span className="font-medium text-gray-900">{student.fullName}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã sinh viên">
                            <span className="font-mono text-gray-700">{student.studentCode}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            <Space>
                                <MailOutlined className="text-gray-400" />
                                <span className="text-gray-700">{student.email}</span>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            <Space>
                                <PhoneOutlined className="text-gray-400" />
                                <span className="text-gray-700">{student.phoneNumber || 'Chưa cập nhật'}</span>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            <Space>
                                <CalendarOutlined className="text-gray-400" />
                                <span className="text-gray-700">
                                    {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                </span>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Giới tính">
                            <span className="text-gray-700">{student.gender || 'Chưa cập nhật'}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số CCCD/CMND">
                            <Space>
                                <IdcardOutlined className="text-gray-400" />
                                <span className="text-gray-700">{student.identityNumber || 'Chưa cập nhật'}</span>
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Academic Information */}
                <Card
                    title={
                        <div className="flex items-center space-x-2">
                            <BankOutlined className="text-green-600" />
                            <span>Thông tin học tập</span>
                        </div>
                    }
                    className="shadow-sm border-gray-200"
                    size="small"
                >
                    <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="Lớp">
                            <span className="text-gray-700">{student.className}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngành">
                            <span className="text-gray-700">{student.major}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Khoa">
                            <span className="text-gray-700">{student.faculty}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="GPA">
                            <Space>
                                <TrophyOutlined className="text-gray-400" />
                                <span className="text-gray-700">{student.gpa || 'Chưa cập nhật'}</span>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Năm học">
                            <span className="text-gray-700">{student.academicYear}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={getStatusColor(student.status)}>
                                {getStatusText(student.status)}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Contact Information */}
                <Card
                    title={
                        <div className="flex items-center space-x-2">
                            <EnvironmentOutlined className="text-orange-600" />
                            <span>Thông tin liên hệ</span>
                        </div>
                    }
                    className="shadow-sm border-gray-200"
                    size="small"
                >
                    <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="Địa chỉ" span={2}>
                            <Space>
                                <EnvironmentOutlined className="text-gray-400" />
                                <span className="text-gray-700">{student.address || 'Chưa cập nhật'}</span>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Thành phố">
                            <span className="text-gray-700">{student.city || 'Chưa cập nhật'}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Quê quán">
                            <span className="text-gray-700">{student.hometown || 'Chưa cập nhật'}</span>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Internship Information */}
                {student.internship && (
                    <Card
                        title={
                            <div className="flex items-center space-x-2">
                                <BankOutlined className="text-blue-600" />
                                <span>Thông tin thực tập</span>
                            </div>
                        }
                        className="shadow-sm border-gray-200"
                        size="small"
                    >
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Công ty thực tập" span={2}>
                                <Space>
                                    <BankOutlined className="text-gray-400" />
                                    <span className="text-gray-700">{student.internship.companyName}</span>
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Vị trí thực tập">
                                <span className="text-gray-700">{student.internship.position}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái thực tập">
                                <Tag color={getInternshipStatusColor(student.internship.status)}>
                                    {getInternshipStatusText(student.internship.status)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày bắt đầu">
                                <Space>
                                    <ClockCircleOutlined className="text-gray-400" />
                                    <span className="text-gray-700">
                                        {student.internship.startDate ? new Date(student.internship.startDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                                    </span>
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày kết thúc">
                                <Space>
                                    <ClockCircleOutlined className="text-gray-400" />
                                    <span className="text-gray-700">
                                        {student.internship.endDate ? new Date(student.internship.endDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                                    </span>
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                )}
            </div>
        </Modal>
    );
};

export default StudentDetailModal;
