import React from 'react';
import { Table, Button, Space, Tag, Avatar, Tooltip, Dropdown, Divider } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, UserAddOutlined, MoreOutlined, UserOutlined, BookOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const InternshipTable = ({ dataSource, loading, pagination, onChange, onAction }) => {

    // Status tag colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'orange';
            case 'APPROVED':
                return 'blue';
            case 'REJECTED':
                return 'red';
            case 'ASSIGNED':
                return 'purple';
            case 'IN_PROGRESS':
                return 'green';
            case 'COMPLETED':
                return 'cyan';
            case 'CANCELLED':
                return 'default';
            default:
                return 'default';
        }
    };

    // Status text
    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ phê duyệt';
            case 'APPROVED':
                return 'Đã phê duyệt';
            case 'REJECTED':
                return 'Bị từ chối';
            case 'ASSIGNED':
                return 'Đã phân công';
            case 'IN_PROGRESS':
                return 'Đang thực tập';
            case 'COMPLETED':
                return 'Hoàn thành';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return 'Chưa xác định';
        }
    };

    // Format salary
    const formatSalary = (salary) => {
        if (!salary) return 'Thỏa thuận';
        return new Intl.NumberFormat('vi-VN').format(salary) + ' VND';
    };

    // Action menu items
    const getActionMenuItems = (record) => {
        const items = [
            {
                key: 'view',
                label: 'Xem chi tiết',
                icon: <EyeOutlined />,
                onClick: () => onAction('view', record)
            },
            {
                key: 'edit',
                label: 'Chỉnh sửa',
                icon: <EditOutlined />,
                onClick: () => onAction('edit', record)
            }
        ];

        // // Add status-specific actions
        // if (record.status === 'PENDING') {
        //     items.push(
        //         {
        //             key: 'approve',
        //             label: 'Phê duyệt',
        //             icon: <CheckCircleOutlined />,
        //             onClick: () => onAction('approve', record)
        //         },
        //         {
        //             key: 'reject',
        //             label: 'Từ chối',
        //             icon: <CloseCircleOutlined />,
        //             onClick: () => onAction('reject', record)
        //         }
        //     );
        // }

        if (record.status === 'APPROVED' || !record.student) {
            items.push({
                key: 'assign',
                label: 'Phân công',
                icon: <UserAddOutlined />,
                onClick: () => onAction('assign', record)
            });
        }

        items.push({
            key: 'delete',
            label: 'Xóa',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => onAction('delete', record)
        });

        return items;
    };

    const columns = [
        {
            title: 'Vị trí thực tập',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            width: 200,
            render: (text, record) => (
                <div className="!flex !items-center">
                    <Avatar
                        size="small"
                        icon={<BookOutlined />}
                        className="!mr-2 !bg-blue-500"
                    />
                    <div>
                        <div className="!font-medium !text-gray-900">
                            {text || 'Chưa có tiêu đề'}
                        </div>
                        <div className="!text-xs !text-gray-500 !font-mono">
                            {record.internshipCode || 'Chưa có mã'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Công ty',
            dataIndex: 'company',
            key: 'company',
            width: 180,
            render: (company) => (
                <div className="!flex !items-center">
                    <EyeOutlined className="!mr-2 !text-gray-400" />
                    <div>
                        <div className="!text-sm !text-gray-900">
                            {company?.companyName || 'Chưa có công ty'}
                        </div>
                        <div className="!text-xs !text-gray-500">
                            {company?.address || 'Chưa có địa chỉ'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Sinh viên',
            dataIndex: 'student',
            key: 'student',
            width: 180,
            render: (student) => (
                <div className="!flex !items-center">
                    <UserOutlined className="!mr-2 !text-gray-400" />
                    <div>
                        <div className="!text-sm !text-gray-900">
                            {student?.user?.fullName || 'Chưa phân công'}
                        </div>
                        <div className="!text-xs !text-gray-500">
                            Mã SV: {student?.studentCode || 'N/A'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Giảng viên',
            dataIndex: 'teacher',
            key: 'teacher',
            width: 150,
            render: (teacher) => (
                <div className="!flex !items-center">
                    <BookOutlined className="!mr-2 !text-gray-400" />
                    <div>
                        <div className="!text-sm !text-gray-900">
                            {teacher?.user?.fullName || 'Chưa phân công'}
                        </div>
                        <div className="!text-xs !text-gray-500">
                            {teacher?.department || 'N/A'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Thời gian',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 150,
            render: (startDate, record) => (
                <div>
                    <div className="!text-sm !text-gray-900">
                        {startDate ? dayjs(startDate).format('DD/MM/YYYY') : 'Chưa xác định'}
                    </div>
                    <div className="!text-xs !text-gray-500">
                        đến {record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY') : 'Chưa xác định'}
                    </div>
                </div>
            )
        },
        {
            title: 'Lương & Giờ làm',
            dataIndex: 'salary',
            key: 'salary',
            width: 140,
            render: (salary, record) => (
                <div>
                    <div className="!text-sm !text-gray-900 !flex !items-center">
                        <DollarOutlined className="!mr-1 !text-green-500" />
                        {formatSalary(salary)}
                    </div>
                    <div className="!text-xs !text-gray-500">
                        {record.workingHoursPerWeek || 40}h/tuần
                    </div>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 80,
            fixed: 'right',
            render: (_, record) => (
                <Dropdown
                    menu={{ items: getActionMenuItems(record) }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        icon={<MoreOutlined className="!text-lg" />}
                        size="middle"
                    />
                </Dropdown>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `Hiển thị ${range[0]}-${range[1]} trong ${total} thực tập`,
                pageSizeOptions: ['10', '20', '50', '100']
            }}
            onChange={onChange}
            rowKey="id"
            scroll={{ x: 1200 }}
            size="middle"
        />
    );
};

export default InternshipTable;
