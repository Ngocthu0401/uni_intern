import React from 'react';
import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';

const getScoreBadgeColor = (score) => {
    if (score >= 8.5) return 'green';
    if (score >= 7) return 'blue';
    if (score >= 6) return 'gold';
    return 'red';
};

const EvaluationTable = ({ data = [], loading = false, pagination, onChange, onView, onEdit, }) => {

    const columns = [
        {
            title: 'Sinh viên',
            dataIndex: ['internship', 'student', 'user', 'fullName'],
            key: 'studentName',
            render: (text) => text || 'N/A',
            width: 150,
        },
        {
            title: 'Mã SV',
            dataIndex: ['internship', 'student', 'studentCode'],
            key: 'studentCode',
            width: 100,
        },
        {
            title: 'Công ty',
            dataIndex: ['internship', 'company', 'companyName'],
            key: 'company',
            render: (text) => text || 'N/A',
            width: 150,
        },
        {
            title: 'Điểm I',
            dataIndex: 'disciplineScore',
            key: 'disciplineScore',
            width: 80,
            render: (score) => {
                const value = score || 0;
                return <Tag color="blue">{value.toFixed(1)}/6.0</Tag>;
            },
            sorter: (a, b) => (a.disciplineScore || 0) - (b.disciplineScore || 0),
        },
        {
            title: 'Điểm II',
            dataIndex: 'professionalScore',
            key: 'professionalScore',
            width: 80,
            render: (score) => {
                const value = score || 0;
                return <Tag color="green">{value.toFixed(1)}/4.0</Tag>;
            },
            sorter: (a, b) => (a.professionalScore || 0) - (b.professionalScore || 0),
        },
        {
            title: 'Tổng điểm',
            dataIndex: 'overallScore',
            key: 'score',
            width: 110,
            render: (score, record) => {
                const value = score || record.totalScore || 0;
                return <Tag color={getScoreBadgeColor(value)}>{value.toFixed(1)}/10</Tag>;
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
            scroll={{ x: 1000 }}
        />
    );
};

export default EvaluationTable;


