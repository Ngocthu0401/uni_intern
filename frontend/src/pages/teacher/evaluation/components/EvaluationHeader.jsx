import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { FileTextOutlined, CalendarOutlined, CheckCircleOutlined, LineChartOutlined } from '@ant-design/icons';

const EvaluationHeader = ({ stats = {} }) => {
    const {
        totalEvaluations = 0,
        pendingEvaluations = 0,
        completedEvaluations = 0,
        averageScore = 0
    } = stats || {};

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
                <Card className="rounded-lg">
                    <Statistic
                        title="Tổng đánh giá"
                        value={totalEvaluations}
                        prefix={<FileTextOutlined className="text-blue-600" />}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="rounded-lg">
                    <Statistic
                        title="Chờ đánh giá"
                        value={pendingEvaluations}
                        prefix={<CalendarOutlined className="text-yellow-600" />}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="rounded-lg">
                    <Statistic
                        title="Đã hoàn thành"
                        value={completedEvaluations}
                        prefix={<CheckCircleOutlined className="text-green-600" />}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="rounded-lg">
                    <Statistic
                        title="Điểm TB"
                        value={averageScore}
                        suffix="/100"
                        precision={0}
                        prefix={<LineChartOutlined className="text-purple-600" />}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default EvaluationHeader;


