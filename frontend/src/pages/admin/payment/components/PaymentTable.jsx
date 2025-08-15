import React from 'react';
import { Card, Table, Space, Typography, Button } from 'antd';
import {
    BookOutlined,
    BankOutlined,
    UserOutlined,
    TeamOutlined,
    DollarOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { formatCurrency } from '../utils/formatters';
import './PaymentTable.css';

const { Text } = Typography;

/**
 * PaymentTable component
 * @param {Object} props
 * @param {string|null} props.selectedBatch - Currently selected batch ID
 * @param {Array} props.paymentData - Payment data grouped by company
 * @param {number} props.totalAmount - Total payment amount
 * @param {Function} props.onViewStudents - Function to handle viewing students
 */
const PaymentTable = ({ selectedBatch, paymentData, totalAmount, onViewStudents }) => {
    const columns = [
        {
            title: 'Đơn vị thực tập',
            dataIndex: 'companyName',
            key: 'companyName',
            render: (text) => (
                <div className="flex items-center">
                    <BankOutlined className="text-blue-500 mr-2" />
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: 'Giảng viên hướng dẫn',
            dataIndex: 'teacher',
            key: 'teacher',
            render: (teacher) => (
                <div className="flex items-center">
                    <UserOutlined className="text-green-500 mr-2" />
                    <span>{teacher?.user?.fullName || 'Chưa phân công'}</span>
                </div>
            ),
        },
        {
            title: 'Mentor',
            dataIndex: 'mentor',
            key: 'mentor',
            render: (mentor) => (
                <div className="flex items-center">
                    <UserOutlined className="text-purple-500 mr-2" />
                    <span>{mentor?.user?.fullName || 'Chưa phân công'}</span>
                </div>
            ),
        },
        {
            title: 'Số lượng sinh viên',
            dataIndex: 'students',
            key: 'studentCount',
            render: (students, record) => (
                <div className="flex items-center">
                    <TeamOutlined className="text-orange-500 mr-2" />
                    <span className="font-medium">{students.length}</span>
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => onViewStudents(record)}
                        className="ml-2"
                    >
                        Xem chi tiết
                    </Button>
                </div>
            ),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => (
                <div className="flex items-center">
                    <DollarOutlined className="text-green-500 mr-2" />
                    <span className="font-bold text-green-600">{formatCurrency(amount)}</span>
                </div>
            ),
        },
    ];

    if (!selectedBatch) {
        return (
            <Card>
                <div className="text-center py-8">
                    <BookOutlined className="text-4xl text-gray-400 mb-4" />
                    <Text type="secondary">Vui lòng chọn đợt thực tập để xem danh sách thanh toán</Text>
                </div>
            </Card>
        );
    }

    return (
        <Card
            title={
                <div className="flex items-center">
                    <BookOutlined className="mr-2" />
                    Danh sách thanh toán theo đơn vị thực tập
                </div>
            }
            extra={
                <Space>
                    <Text strong>Tổng tiền: {formatCurrency(totalAmount)}</Text>
                </Space>
            }
        >
            {paymentData.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={paymentData}
                    rowKey="companyId"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} đơn vị`,
                    }}
                    className="custom-table"
                />
            ) : (
                <div className="text-center py-8">
                    <BookOutlined className="text-4xl text-gray-400 mb-4" />
                    <Text type="secondary">Chưa có dữ liệu thực tập cho đợt này</Text>
                </div>
            )}
        </Card>
    );
};

export default PaymentTable;
