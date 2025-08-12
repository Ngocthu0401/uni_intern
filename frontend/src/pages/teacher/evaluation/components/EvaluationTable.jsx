import React from 'react';
import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';

const getScoreBadgeColor = (score) => {
    if (score >= 85) return 'green';
    if (score >= 70) return 'blue';
    if (score >= 60) return 'gold';
    return 'red';
};

const EvaluationTable = ({
    data = [],
    loading = false,
    pagination,
    onChange,
    onView,
    onEdit,
}) => {
    const columns = [
        {
            title: 'Sinh viên',
            dataIndex: ['internship', 'student', 'user', 'fullName'],
            key: 'studentName',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Mã SV',
            dataIndex: ['internship', 'student', 'studentCode'],
            key: 'studentCode',
            width: 120,
        },
        {
            title: 'Công ty',
            dataIndex: ['internship', 'company', 'companyName'],
            key: 'company',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Loại',
            dataIndex: 'isFinalEvaluation',
            key: 'type',
            width: 110,
            render: (isFinal) => <Tag color="blue">{isFinal ? 'Cuối kỳ' : 'Giữa kỳ'}</Tag>,
        },
        {
            title: 'Điểm',
            dataIndex: 'overallScore',
            key: 'score',
            width: 110,
            render: (score, record) => {
                const value = score || record.totalScore || 0;
                return <Tag color={getScoreBadgeColor(value)}>{value}/100</Tag>;
            },
            sorter: (a, b) => (a.overallScore || a.totalScore || 0) - (b.overallScore || b.totalScore || 0),
        },
        {
            title: 'Ngày đánh giá',
            dataIndex: 'evaluationDate',
            key: 'date',
            width: 160,
            render: (date, record) => {
                const d = date || record.createdAt;
                return d ? new Date(d).toLocaleDateString('vi-VN') : 'Chưa có ngày';
            },
        },
        {
            title: 'Hành động',
            key: 'actions',
            fixed: 'right',
            width: 140,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button icon={<EyeOutlined />} onClick={() => onView(record)} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
            scroll={{ x: 900 }}
        />
    );
};

export default EvaluationTable;


