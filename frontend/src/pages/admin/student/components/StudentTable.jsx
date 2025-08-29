import { useState } from 'react';
import { Table, Button, Tag, Space, Avatar, Tooltip, Progress, Dropdown, Card, Typography, Badge, Empty } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, UserOutlined, BankOutlined, CalendarOutlined, DollarOutlined, TrophyOutlined, MoreOutlined, EyeTwoTone } from '@ant-design/icons';

const { Text, Title } = Typography;

const StudentTable = ({ students = [], loading = false, studentInternships = {}, pagination, onPageChange, onView, onEdit, onDelete, onViewInternships }) => {
    const [expandedRows, setExpandedRows] = useState([]);

    const getStatusColor = (status) => {
        const statusColors = {
            'IN_PROGRESS': 'processing',
            'PENDING': 'warning',
            'APPROVED': 'success',
            'ASSIGNED': 'purple',
            'COMPLETED': 'success',
            'REJECTED': 'error'
        };
        return statusColors[status] || 'default';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            'IN_PROGRESS': 'Đang thực tập',
            'PENDING': 'Chờ duyệt',
            'APPROVED': 'Đã duyệt',
            'ASSIGNED': 'Đã phân công',
            'COMPLETED': 'Hoàn thành',
            'REJECTED': 'Bị từ chối'
        };
        return statusTexts[status] || status;
    };

    const getGPAColor = (gpa) => {
        if (gpa >= 3.5) return '#52c41a';
        if (gpa >= 3.0) return '#1890ff';
        if (gpa >= 2.5) return '#faad14';
        return '#ff4d4f';
    };

    const getActionItems = (student) => [
        // {
        //     key: 'view',
        //     label: 'Xem chi tiết',
        //     icon: <EyeOutlined />,
        //     onClick: () => onView(student)
        // },
        // {
        //     key: 'internships',
        //     label: 'Thông tin thực tập',
        //     icon: <FileTextOutlined />,
        //     onClick: () => onViewInternships(student)
        // },
        {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <EditOutlined />,
            onClick: () => onEdit(student)
        },
        {
            type: 'divider'
        },
        {
            key: 'delete',
            label: 'Xóa',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => onDelete(student)
        }
    ];

    const columns = [
        {
            title: 'Sinh viên',
            key: 'student',
            width: 220,
            render: (_, student) => (
                <div className="flex items-center space-x-3">
                    <Avatar
                        size={48}
                        style={{
                            backgroundColor: '#1890ff',
                            color: 'white'
                        }}
                        icon={<UserOutlined />}
                    >
                        {student.user?.fullName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div className='ms-2'>
                        <div className="font-semibold text-gray-900">
                            {student.user?.fullName || 'Chưa có thông tin'}
                        </div>
                        <div className="text-sm text-gray-500">
                            {student.studentCode}
                        </div>
                        <div className="text-xs text-gray-400">
                            {student.user?.email}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Thông tin học tập',
            key: 'academic',
            width: 180,
            render: (_, student) => (
                <div>
                    <div className="font-medium text-gray-900 mb-1">
                        {student.className || 'Chưa xác định'}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                        {student.major || 'Chưa xác định'}
                    </div>
                    <div className="text-xs text-gray-500">
                        {student.academicYear || 'Chưa xác định'}
                    </div>
                </div>
            )
        },
        {
            title: 'GPA',
            key: 'gpa',
            width: 120,
            align: 'center',
            render: (_, student) => (
                <div className="text-center">
                    {student.gpa ? (
                        <>
                            <div className="font-bold text-lg mb-1" style={{ color: getGPAColor(student.gpa) }}>
                                {student.gpa.toFixed(2)}
                            </div>
                            <Progress
                                percent={(student.gpa / 4) * 100}
                                showInfo={false}
                                strokeColor={getGPAColor(student.gpa)}
                                size="small"
                            />
                        </>
                    ) : (
                        <Text type="secondary">N/A</Text>
                    )}
                </div>
            )
        },
        {
            title: 'Thực tập',
            key: 'internship',
            width: 250,
            render: (_, student) => {
                const internships = studentInternships[student.id] || [];
                const activeInternship = internships.find(i => i.status === 'IN_PROGRESS') || internships[0];

                if (!activeInternship) {
                    return (
                        <div className="text-left py-2">
                            <Text type="secondary">
                                <BankOutlined className="mr-1" />
                                Chưa có thực tập
                            </Text>
                        </div>
                    );
                }

                return (
                    <Card
                        size="small"
                        styles={{ body: { padding: '8px 12px' } }}
                        className="border-l-4 border-l-blue-500"
                    >
                        <div className="space-y-1">
                            <div className="font-medium text-gray-900 truncate">
                                <BankOutlined className="mr-1 text-blue-500" />
                                {activeInternship.company?.companyName || 'Chưa phân công'}
                            </div>
                            <div className="flex items-center justify-between">
                                <Tag color={getStatusColor(activeInternship.status)} size="small">
                                    {getStatusText(activeInternship.status)}
                                </Tag>
                                {internships.length > 1 && (
                                    <Badge count={internships.length} size="small" />
                                )}
                            </div>
                            {activeInternship.salary && (
                                <div className="text-xs text-green-600">
                                    <DollarOutlined className="mr-1" />
                                    {new Intl.NumberFormat('vi-VN').format(activeInternship.salary)} VND/tháng
                                </div>
                            )}
                        </div>
                    </Card>
                );
            }
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            width: 180,
            render: (_, student) => (
                <div>
                    <div className="text-sm text-gray-900 mb-1">
                        {student.user?.email || 'Chưa có email'}
                    </div>
                    <div className="text-sm text-gray-600">
                        {student.user?.phoneNumber || 'Chưa có SĐT'}
                    </div>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 120,
            align: 'center',
            render: () => (
                <Tag color="success" className="rounded-full">
                    Hoạt động
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (_, student) => (
                <div className="flex justify-center">
                    <Space size="small">
                        <Tooltip title="Xem chi tiết">
                            <Button
                                type="text"
                                size="small"
                                icon={<EyeTwoTone style={{ fontSize: '20px' }} />}
                                onClick={() => onView(student)}
                                className="text-blue-600 hover:bg-blue-50"
                            />
                        </Tooltip>
                        <Tooltip title="Thông tin thực tập">
                            <Button
                                type="text"
                                size="small"
                                icon={<FileTextOutlined style={{ fontSize: '17px', color: 'purple' }} />}
                                onClick={() => onViewInternships(student)}
                                className="text-purple-600 hover:bg-purple-50"
                            />
                        </Tooltip>
                        <Dropdown
                            menu={{
                                items: getActionItems(student)
                            }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <Button
                                type="text"
                                size="small"
                                icon={<MoreOutlined style={{ fontSize: '20px' }} />}
                                className="text-gray-600 hover:bg-gray-50"
                            />
                        </Dropdown>
                    </Space>
                </div>
            )
        }
    ];

    const antPagination = {
        current: pagination?.page || 1,
        pageSize: pagination?.size || 10,
        total: pagination?.total || 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} sinh viên`,
        onChange: (page, pageSize) => {
            onPageChange({ page, size: pageSize });
        },
        onShowSizeChange: (current, size) => {
            onPageChange({ page: 1, size });
        },
        pageSizeOptions: ['10', '20', '50', '100']
    };

    return (
        <Card className="shadow-lg fade-in">
            <Table
                columns={columns}
                dataSource={students}
                rowKey="id"
                loading={loading}
                pagination={antPagination}
                scroll={{ x: 1200 }}
                size="middle"
                expandable={{
                    rowExpandable: (record) => (studentInternships[record.id] || []).length > 0,
                    expandedRowKeys: expandedRows,
                    onExpand: (expanded, record) => {
                        if (expanded) {
                            setExpandedRows([...expandedRows, record.id]);
                        } else {
                            setExpandedRows(expandedRows.filter(id => id !== record.id));
                        }
                    }
                }}
                rowClassName="hover:bg-blue-50 transition-colors duration-200"
                locale={{
                    emptyText: (
                        <Empty
                            description="Không tìm thấy sinh viên nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    )
                }}
            />
        </Card>
    );
};

export default StudentTable;