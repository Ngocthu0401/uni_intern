import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
    BankOutlined,
    TeamOutlined,
    DollarOutlined,
    CalculatorOutlined
} from '@ant-design/icons';
import { formatCurrency } from '../utils/formatters';

/**
 * PaymentStatistics component
 * @param {Object} props
 * @param {Array} props.paymentData - Payment data grouped by company
 * @param {number} props.totalAmount - Total payment amount
 * @param {number} props.totalStudents - Total number of students
 */
const PaymentStatistics = ({ paymentData, totalAmount, totalStudents }) => {
    const averageAmount = paymentData.length > 0
        ? Math.round(totalAmount / paymentData.length)
        : 0;

    return (
        <Row gutter={16} className="mb-6">
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Tổng đơn vị thực tập"
                        value={paymentData.length}
                        prefix={<BankOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Tổng sinh viên"
                        value={totalStudents}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Tổng số tiền"
                        value={totalAmount}
                        prefix={<DollarOutlined />}
                        formatter={(value) => formatCurrency(value)}
                        valueStyle={{ color: '#cf1322' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Trung bình/đơn vị"
                        value={averageAmount}
                        prefix={<CalculatorOutlined />}
                        formatter={(value) => formatCurrency(value)}
                        valueStyle={{ color: '#722ed1' }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default PaymentStatistics;
