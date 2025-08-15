import React from 'react';
import { Modal, Row, Col, Typography, Table, Avatar, Tag } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * StudentDetailModal component
 * @param {Object} props
 * @param {boolean} props.visible - Modal visibility state
 * @param {Object|null} props.internship - Internship data with students
 * @param {Function} props.onClose - Function to close modal
 */
const StudentDetailModal = ({ visible, internship, onClose }) => {
    const studentColumns = [
        {
            title: 'Sinh viên',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <div className="flex items-center">
                    <Avatar size="small" className="mr-2">
                        {user?.fullName?.charAt(0) || 'S'}
                    </Avatar>
                    <div>
                        <div className="font-medium">{user?.fullName}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Mã sinh viên',
            dataIndex: 'studentCode',
            key: 'studentCode',
            render: (code) => (
                <Tag color="blue">{code}</Tag>
            ),
        },
        {
            title: 'Lớp',
            dataIndex: 'className',
            key: 'className',
            render: (className) => (
                <span>{className || 'Chưa cập nhật'}</span>
            ),
        },
    ];

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <TeamOutlined className="mr-2" />
                    Danh sách sinh viên - {internship?.companyName}
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {internship && (
                <div>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Đơn vị thực tập:</Text>
                                <div>{internship.companyName}</div>
                            </Col>
                            <Col span={12}>
                                <Text strong>Giảng viên hướng dẫn:</Text>
                                <div>{internship.teacher?.user?.fullName || 'Chưa phân công'}</div>
                            </Col>
                        </Row>
                        <Row gutter={16} className="mt-2">
                            <Col span={12}>
                                <Text strong>Mentor:</Text>
                                <div>{internship.mentor?.user?.fullName || 'Chưa phân công'}</div>
                            </Col>
                            <Col span={12}>
                                <Text strong>Tổng sinh viên:</Text>
                                <div className="font-bold text-blue-600">{internship.students?.length || 0}</div>
                            </Col>
                        </Row>
                    </div>

                    <Table
                        columns={studentColumns}
                        dataSource={internship.students || []}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </div>
            )}
        </Modal>
    );
};

export default StudentDetailModal;
