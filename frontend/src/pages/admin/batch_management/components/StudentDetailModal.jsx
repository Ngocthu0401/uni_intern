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
    ClockCircleOutlined,
    DollarOutlined,
    FileTextOutlined
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
            case 'IN_PROGRESS':
                return 'blue';
            case 'COMPLETED':
                return 'green';
            case 'PENDING':
                return 'orange';
            case 'ASSIGNED':
                return 'cyan';
            case 'CANCELLED':
                return 'red';
            case 'APPROVED':
                return 'green';
            case 'REJECTED':
                return 'red';
            default:
                return 'default';
        }
    };

    const getInternshipStatusText = (status) => {
        switch (status) {
            case 'IN_PROGRESS':
                return 'Đang thực tập';
            case 'COMPLETED':
                return 'Đã hoàn thành';
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'ASSIGNED':
                return 'Đã phân công';
            case 'CANCELLED':
                return 'Đã hủy';
            case 'APPROVED':
                return 'Đã duyệt';
            case 'REJECTED':
                return 'Từ chối';
            default:
                return 'Không xác định';
        }
    };


    console.log('student', student);

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
            <div className="!space-y-6">
                {/* Student Header */}
                <div className="!flex !items-center !space-x-4 !p-4 !bg-gray-50 !rounded-lg">
                    <Avatar size={64} icon={<UserOutlined />} className="!bg-blue-500" />
                    <div className="flex-1">
                        <h3 className="!text-xl !font-semibold !text-gray-900">{student?.user?.fullName}</h3>
                        <p className="!text-gray-600">{student?.studentCode}</p>
                        <Tag color={getStatusColor(student?.status)} className="!mt-1">
                            {getStatusText(student?.status)}
                        </Tag>
                    </div>
                </div>

                {/* Personal Information */}
                <Card
                    title={
                        <div className="!flex !items-center !space-x-2">
                            <UserOutlined className="!text-purple-600" />
                            <span className="!text-lg !font-semibold">Thông tin cá nhân</span>
                        </div>
                    }
                    className="!shadow-sm !border-gray-200"
                    size="small"
                >
                    <Descriptions column={2} bordered size="small" className="!border-gray-200">
                        <Descriptions.Item label="Họ và tên">
                            <span className="!font-medium !text-gray-900">{student?.user?.fullName}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã sinh viên">
                            <span className="!font-mono !text-gray-700">{student?.studentCode}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            <Space>
                                <MailOutlined className="!text-gray-400" />
                                <span className="!text-gray-700">{student?.user?.email}</span>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            <Space>
                                <PhoneOutlined className="!text-gray-400" />
                                <span className="!text-gray-700">{student?.user?.phoneNumber || 'Chưa cập nhật'}</span>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            <Space>
                                <CalendarOutlined className="!text-gray-400" />
                                <span className="!text-gray-700">
                                    {student?.dateOfBirth ? new Date(student?.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                </span>
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Academic Information */}
                <Card
                    title={
                        <div className="!flex !items-center !space-x-2">
                            <BankOutlined className="!text-green-600" />
                            <span className="!text-lg !font-semibold">Thông tin học tập</span>
                        </div>
                    }
                    className="!shadow-sm !border-gray-200"
                    size="small"
                >
                    <Descriptions column={2} bordered size="small" className="!border-gray-200">
                        <Descriptions.Item label="Lớp">
                            <span className="!text-gray-700">{student?.className}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngành">
                            <span className="!text-gray-700">{student?.major}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="GPA">
                            <Space>
                                <TrophyOutlined className="!text-gray-400" />
                                <span className="!text-gray-700">{student?.gpa || 'Chưa cập nhật'}</span>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Năm học">
                            <span className="!text-gray-700">{student?.academicYear}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={getStatusColor(student?.status)}>
                                {getStatusText(student.status)}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Contact Information */}
                <Card
                    title={
                        <div className="!flex !items-center !space-x-2">
                            <EnvironmentOutlined className="!text-orange-600" />
                            <span className="!text-lg !font-semibold">Thông tin liên hệ</span>
                        </div>
                    }
                    className="!shadow-sm !border-gray-200"
                    size="small"
                >
                    <Descriptions column={2} bordered size="small" className="!border-gray-200">
                        <Descriptions.Item label="Địa chỉ sinh viên" span={2}>
                            <Space>
                                <EnvironmentOutlined className="!text-gray-400" />
                                <span className="!text-gray-700">{student?.address || 'Chưa cập nhật'}</span>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên người thân">
                            <span className="!text-gray-700">{student?.parentName || 'Chưa cập nhật'}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại người thân">
                            <span className="!text-gray-700">{student?.parentPhone || 'Chưa cập nhật'}</span>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Internship Information */}
                {student.internships && (
                    <Card
                        title={
                            <div className="!flex !items-center !space-x-2">
                                <BankOutlined className="!text-blue-600" />
                                <span className="!text-lg !font-semibold">Thông tin thực tập</span>
                            </div>
                        }
                        className="!shadow-sm !border-gray-200"
                        size="small"
                    >
                        {student?.internships?.length > 0 ? (
                            <div className="space-y-4">
                                {student.internships
                                    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                                    .map((internship, index) => (
                                        <div key={internship.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            {/* Header với mã thực tập và trạng thái */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {internship.jobTitle || 'Chưa có tiêu đề'}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 font-mono">
                                                        Mã: {internship.internshipCode}
                                                    </p>
                                                </div>
                                                <Tag color={getInternshipStatusColor(internship.status)} className="text-sm">
                                                    {getInternshipStatusText(internship.status)}
                                                </Tag>
                                            </div>

                                            {/* Thông tin cơ bản */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-2">
                                                        <BankOutlined className="text-gray-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Công ty</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {internship.company?.companyName || 'Chưa xác định'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <UserOutlined className="text-gray-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Giảng viên hướng dẫn</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {internship.teacher?.user?.fullName || 'Chưa xác định'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <UserOutlined className="text-gray-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Mentor</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {internship.mentor?.user?.fullName || 'Chưa xác định'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-2">
                                                        <ClockCircleOutlined className="text-gray-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Thời gian</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {internship.startDate} - {internship.endDate}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <CalendarOutlined className="text-gray-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Đợt thực tập</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {internship.internshipBatch?.batchName || 'Chưa xác định'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <DollarOutlined className="text-gray-400" />
                                                        <div>
                                                            <p className="text-xs text-gray-500">Lương</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {internship.salary ? `${internship.salary.toLocaleString('vi-VN')} VNĐ` : 'Chưa xác định'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mô tả công việc */}
                                            {internship.jobDescription && (
                                                <div className="mb-4">
                                                    <p className="text-xs text-gray-500 mb-1">Mô tả công việc</p>
                                                    <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                                        {internship.jobDescription}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Yêu cầu */}
                                            {internship.requirements && (
                                                <div className="mb-4">
                                                    <p className="text-xs text-gray-500 mb-1">Yêu cầu</p>
                                                    <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                                        {internship.requirements}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Thông tin chi tiết */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Giờ làm việc/tuần</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {internship.workingHoursPerWeek || 'Chưa xác định'} giờ
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Phúc lợi</p>
                                                    <p className="text-sm text-gray-700">
                                                        {internship.benefits || 'Chưa xác định'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Ghi chú</p>
                                                    <p className="text-sm text-gray-700">
                                                        {internship.notes || 'Không có'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Điểm số và đánh giá */}
                                            {(internship.finalScore || internship.teacherScore || internship.mentorScore) && (
                                                <div className="border-t border-gray-200 pt-4">
                                                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Điểm số và đánh giá</h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {internship.finalScore && (
                                                            <div className="text-center">
                                                                <p className="text-xs text-gray-500 mb-1">Điểm tổng kết</p>
                                                                <div className="text-lg font-bold text-blue-600">
                                                                    {internship.finalScore}/10
                                                                </div>
                                                            </div>
                                                        )}
                                                        {internship.teacherScore && (
                                                            <div className="text-center">
                                                                <p className="text-xs text-gray-500 mb-1">Điểm giảng viên</p>
                                                                <div className="text-lg font-bold text-green-600">
                                                                    {internship.teacherScore}/10
                                                                </div>
                                                            </div>
                                                        )}
                                                        {internship.mentorScore && (
                                                            <div className="text-center">
                                                                <p className="text-xs text-gray-500 mb-1">Điểm mentor</p>
                                                                <div className="text-lg font-bold text-purple-600">
                                                                    {internship.mentorScore}/10
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Nhận xét */}
                                            {(internship.teacherComment || internship.mentorComment) && (
                                                <div className="border-t border-gray-200 pt-4">
                                                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Nhận xét</h5>
                                                    <div className="space-y-3">
                                                        {internship.teacherComment && (
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Nhận xét của giảng viên</p>
                                                                <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                                                    {internship.teacherComment}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {internship.mentorComment && (
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Nhận xét của mentor</p>
                                                                <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                                                    {internship.mentorComment}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <FileTextOutlined className="text-2xl mb-2" />
                                <p>Chưa có thông tin thực tập</p>
                            </div>
                        )}

                    </Card>
                )}
            </div>
        </Modal>
    );
};

export default StudentDetailModal;
