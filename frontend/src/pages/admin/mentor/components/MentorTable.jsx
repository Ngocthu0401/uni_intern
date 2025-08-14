import { UserOutlined, EyeOutlined, EditOutlined, DeleteOutlined, StarFilled, BankOutlined } from '@ant-design/icons';
import { Table, Tag, Space, Avatar } from 'antd';
import { useMemo } from 'react';

const MentorTable = ({ mentors, loading, pagination, total, onPageChange, onView, onEdit, onDelete, expertiseLabelOf }) => {
    const columns = useMemo(() => [
        {
            title: 'Mentor',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div className="min-w-0">
                        <div className="font-medium truncate max-w-[180px]">{user?.fullName || 'Chưa có thông tin'}</div>
                        <div className="text-gray-500 text-xs truncate max-w-[220px]">{user?.email || 'Chưa có email'}</div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Công ty / Chức vụ',
            key: 'company',
            render: (_, record) => (
                <Space>
                    <BankOutlined className="text-gray-400" />
                    <div>
                        <div>{record.company?.companyName || 'Chưa có công ty'}</div>
                        <div className="text-gray-500 text-xs">{record.position || 'Chưa xác định'}</div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Chuyên môn',
            key: 'expertise',
            render: (_, record) => (
                <Space>
                    <StarFilled className="text-yellow-400" />
                    <span>{record.company?.industry || 'Chưa xác định'}</span>
                </Space>
            )
        },
        {
            title: 'Trình độ',
            dataIndex: 'expertiseLevel',
            key: 'expertiseLevel',
            render: (level) => expertiseLabelOf(level) || 'Chưa xác định'
        },
        {
            title: 'Kinh nghiệm',
            key: 'experience',
            render: (_, r) => (
                <div>
                    <div>{r.yearsOfExperience || 0} năm</div>
                    <div className="text-gray-500 text-xs">Phòng: {r.officeLocation || 'Chưa xác định'}</div>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'status',
            render: () => <Tag color="green">Hoạt động</Tag>
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 140,
            render: (_, record) => (
                <Space>
                    <a onClick={() => onView(record)} title="Xem chi tiết"><EyeOutlined /></a>
                    <a onClick={() => onEdit(record)} title="Chỉnh sửa"><EditOutlined /></a>
                    <a onClick={() => onDelete(record)} title="Xóa" className="text-red-600"><DeleteOutlined /></a>
                </Space>
            )
        }
    ], [expertiseLabelOf, onDelete, onEdit, onView]);

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={mentors}
            loading={loading}
            pagination={{
                current: pagination.page,
                pageSize: pagination.size,
                total,
                showSizeChanger: false,
                onChange: onPageChange,
            }}
            scroll={{ x: 900 }}
            className="bg-white rounded-lg shadow"
        />
    );
};

export default MentorTable;


