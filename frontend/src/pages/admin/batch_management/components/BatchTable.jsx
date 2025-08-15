import React from 'react';
import { Table, Tag, Button, Space, Avatar, Progress, Tooltip } from 'antd';
import {
    CalendarOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    ClockCircleOutlined,
    TeamOutlined
} from '@ant-design/icons';

const BatchTable = ({
    batches,
    loading,
    onViewBatch,
    onEditBatch,
    onDeleteBatch
}) => {
    const getStatusColor = (batch) => {
        if (!batch.isActive()) return 'default';
        if (batch.isCompleted()) return 'blue';
        if (batch.isRegistrationOpen()) return 'green';
        return 'orange';
    };

    const getStatusText = (batch) => {
        return batch.getStatusLabel();
    };

    const getRegistrationStatusColor = (batch) => {
        return batch.isRegistrationOpen() ? 'green' : 'red';
    };

    const getRegistrationStatusText = (batch) => {
        return batch.isRegistrationOpen() ? 'Đang mở' : 'Đã đóng';
    };

    const columns = [
        {
            title: 'Đợt thực tập',
            key: 'batch',
            render: (_, record) => (
                <div className="flex items-center space-x-3">
                    <Avatar
                        icon={<CalendarOutlined />}
                        className="bg-purple-500"
                        size="large"
                    />
                    <div>
                        <div className="font-medium text-gray-900">{record.name}</div>
                        <div className="text-sm text-gray-500">{record.description || 'Không có mô tả'}</div>
                    </div>
                </div>
            ),
            width: 250,
        },
        {
            title: 'Học kỳ / Năm học',
            key: 'academic',
            render: (_, record) => (
                <div className="text-center">
                    <div className="font-medium text-gray-900">{record.getSemesterLabel()}</div>
                    <div className="text-sm text-gray-500">{record.academicYear}</div>
                </div>
            ),
            width: 150,
        },
        {
            title: 'Thời gian đăng ký',
            key: 'registration',
            render: (_, record) => (
                <div>
                    <div className="text-sm text-gray-900">
                        {record.getFormattedRegistrationStartDate()}
                    </div>
                    <div className="text-sm text-gray-500">
                        đến {record.getFormattedRegistrationEndDate()}
                    </div>
                    <Tag color={getRegistrationStatusColor(record)} className="mt-1">
                        {getRegistrationStatusText(record)}
                    </Tag>
                </div>
            ),
            width: 180,
        },
        {
            title: 'Thời gian thực tập',
            key: 'internship',
            render: (_, record) => (
                <div>
                    <div className="text-sm text-gray-900">
                        {record.getFormattedInternshipStartDate()}
                    </div>
                    <div className="text-sm text-gray-500">
                        đến {record.getFormattedInternshipEndDate()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        ({record.getDurationInWeeks()} tuần)
                    </div>
                </div>
            ),
            width: 180,
        },
        {
            title: 'Sinh viên',
            key: 'students',
            render: (_, record) => (
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <TeamOutlined className="text-gray-400" />
                        <span className="text-sm text-gray-900">
                            {record.currentStudents}/{record.maxStudents}
                        </span>
                    </div>
                    <Progress
                        percent={record.getEnrollmentProgress()}
                        size="small"
                        showInfo={false}
                        strokeColor="#8b5cf6"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        {record.getEnrollmentProgress()}% đã đăng ký
                    </div>
                </div>
            ),
            width: 150,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                <Tag color={getStatusColor(record)} className="font-medium">
                    {getStatusText(record)}
                </Tag>
            ),
            width: 120,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => onViewBatch(record)}
                            className="text-purple-600 hover:text-purple-800"
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => onEditBatch(record)}
                            className="text-yellow-600 hover:text-yellow-800"
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => onDeleteBatch(record)}
                            className="text-red-600 hover:text-red-800"
                        />
                    </Tooltip>
                </Space>
            ),
            width: 120,
            fixed: 'right',
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Table
                columns={columns}
                dataSource={batches}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{ x: 1200 }}
                className="custom-table"
                rowClassName="hover:bg-gray-50 transition-colors"
                locale={{
                    emptyText: (
                        <div className="py-12 text-center">
                            <CalendarOutlined className="text-4xl text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">Không tìm thấy đợt thực tập nào</p>
                            <p className="text-gray-400 text-sm">Hãy thử thay đổi bộ lọc hoặc tạo đợt thực tập mới</p>
                        </div>
                    )
                }}
            />
        </div>
    );
};

export default BatchTable;
