import React from 'react';
import { Table, Tag, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const StudentTable = ({ students, loading, pagination, onPageChange, onViewDetails }) => {


    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'green';
            case 'PENDING':
                return 'volcano';
            case 'COMPLETED':
                return 'blue';
            case 'TERMINATED':
                return 'red';
            case 'CANCELLED':
                return 'gray';
            case 'IN_PROGRESS':
                return 'blue';
            case 'ASSIGNED':
                return 'orange';
            default:
                return 'gray';
        }
    };

    const columns = [
        {
            title: 'Sinh viên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                                {record.user?.fullName?.charAt(0)}
                            </span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{record.user?.fullName}</div>
                        <div className="text-sm text-gray-500">{record.studentCode} - {record.className}</div>
                    </div>
                </div>
            )
        },
        {
            title: 'Thông tin liên hệ',
            dataIndex: 'email',
            key: 'email',
            render: (text, record) => (
                <div>
                    <div className="text-sm text-gray-900">{record.user?.email}</div>
                    <div className="text-sm text-gray-500">{record.phoneNumber}</div>
                </div>
            )
        },
        {
            title: 'Học tập',
            dataIndex: 'major',
            key: 'major',
            render: (text, record) => (
                <div>
                    <div className="text-sm text-gray-900">{record.major}</div>
                    <div className="text-sm text-gray-500">{record.academicYear} - GPA: {record.gpa}</div>
                </div>
            )
        },
        {
            title: 'Thực tập',
            dataIndex: 'internships',
            key: 'internships',
            render: (internships) => {
                const currentInternship = internships[0];
                return (
                    <>
                        <div className="text-sm text-gray-900">
                            {currentInternship?.company?.companyName || 'Chưa có'}
                        </div>
                        <div className="text-sm text-gray-500">
                            Mentor: {currentInternship?.mentor?.user?.fullName || 'Chưa có'}
                        </div>
                    </>
                );
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                const currentInternship = record.internships[0];
                const status = currentInternship?.status || text || 'PENDING';
                return (
                    <Tag color={getStatusColor(status)}>{status}</Tag>
                );
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => onViewDetails(record)}
                    className="!bg-gradient-to-r !from-blue-500 !to-purple-500 !border-none"
                >
                    Xem chi tiết
                </Button>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={students}
            loading={loading}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: onPageChange
            }}
            rowKey="id"
            className="bg-white rounded-lg shadow-lg border border-gray-200"
        />
    );
};

export default StudentTable;
