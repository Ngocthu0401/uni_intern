import React from 'react';
import { Modal, Descriptions, Badge } from 'antd';

const StudentDetailModal = ({ visible, student, onClose }) => {
    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            className="!max-w-5xl !bg-gradient-to-r !from-blue-50 !to-purple-50"
            width={1000}
        >
            {student && (
                <div className="p-6">
                    <h3 className="!text-2xl !font-bold !text-gray-900 !mb-6">Chi tiết sinh viên</h3>
                    <Descriptions
                        bordered
                        column={2}
                        size="middle"
                        title="Thông tin cá nhân"
                        extra={<Badge status="processing" text="Đang thực tập" />}
                    >
                        <Descriptions.Item label="Họ và tên">{student.user?.fullName || student.fullName || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Mã sinh viên">{student.studentCode || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Email">{student.user?.email || student.email || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{student.user?.phoneNumber || student.phoneNumber || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Chuyên ngành">{student.major}</Descriptions.Item>
                        <Descriptions.Item label="Năm học">{student.academicYear || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="GPA">{student.gpa || 'N/A'}</Descriptions.Item>
                    </Descriptions>

                    <h4 className="!text-xl !font-semibold !text-gray-900 !mt-8 !mb-4">Thông tin thực tập</h4>
                    {student.internships && student.internships.length > 0 ? (
                        student.internships.map((internship, index) => (
                            <Descriptions
                                key={internship.id}
                                bordered
                                column={2}
                                size="middle"
                                title={index === 0 ? 'Thực tập hiện tại' : `Thực tập #${index + 1}`}
                                className="mb-6"
                            >
                                <Descriptions.Item label="Công ty">{internship.company?.companyName || 'Chưa có'}</Descriptions.Item>
                                <Descriptions.Item label="Mentor">{internship.mentor?.user?.fullName || 'Chưa có'}</Descriptions.Item>
                                <Descriptions.Item label="Vị trí">{internship.jobTitle || 'Chưa có'}</Descriptions.Item>
                                <Descriptions.Item label="Mã thực tập">{internship.internshipCode}</Descriptions.Item>
                                <Descriptions.Item label="Thời gian">
                                    {internship.startDate && internship.endDate
                                        ? `${internship.startDate} - ${internship.endDate}`
                                        : 'Chưa có'}
                                </Descriptions.Item>
                                {internship.salary && (
                                    <Descriptions.Item label="Lương">{internship.salary.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
                                )}
                                {internship.workingHoursPerWeek && (
                                    <Descriptions.Item label="Giờ làm/tuần">{internship.workingHoursPerWeek} giờ</Descriptions.Item>
                                )}
                                {internship.teacher && (
                                    <Descriptions.Item label="Giảng viên hướng dẫn">{internship.teacher.user?.fullName} - {internship.teacher.department}</Descriptions.Item>
                                )}
                                {internship.status !== 'IN_PROGRESS' && (
                                    <Descriptions.Item label="Điểm giảng viên">{internship.teacherScore || 'Chưa có'}</Descriptions.Item>
                                )}
                            </Descriptions>
                        ))
                    ) : (
                        <p className="!text-gray-500 !text-sm">Chưa có thông tin thực tập</p>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default StudentDetailModal;
