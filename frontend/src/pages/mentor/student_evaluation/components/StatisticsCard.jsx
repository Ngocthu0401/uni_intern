import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import {
    UserOutlined,
    TrophyOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';

const StatisticsCard = ({ students = [] }) => {
    const totalStudents = students.length;
    const completedStudents = students.filter(s => s.status === 'COMPLETED').length;
    const activeStudents = students.filter(s => ['ACTIVE', 'ASSIGNED', 'IN_PROGRESS'].includes(s.status)).length;
    const pendingStudents = students.filter(s => s.status === 'PENDING').length;

    const studentsWithEvaluations = students.filter(s => s.evaluations.length > 0).length;
    const studentsWithMentorScore = students.filter(s => s.mentorScore).length;

    const averageScore = students.length > 0
        ? students.reduce((sum, s) => sum + (s.averageScore || 0), 0) / students.length
        : 0;

    const getScoreColor = (score) => {
        if (score >= 8.5) return '#52c41a';
        if (score >= 7) return '#1890ff';
        if (score >= 5.5) return '#faad14';
        return '#ff4d4f';
    };

    return (
        <Card className="!mb-6">
            <Row gutter={16}>
                <Col xs={12} md={6}>
                    <Statistic
                        title="Tổng sinh viên"
                        value={totalStudents}
                        prefix={<UserOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <Statistic
                        title="Đang thực tập"
                        value={activeStudents}
                        prefix={<ClockCircleOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <Statistic
                        title="Hoàn thành"
                        value={completedStudents}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <Statistic
                        title="Chờ duyệt"
                        value={pendingStudents}
                        prefix={<ClockCircleOutlined />}
                        valueStyle={{ color: '#faad14' }}
                    />
                </Col>
            </Row>

            <Row gutter={16} className="!mt-4">
                <Col xs={12} md={6}>
                    <Statistic
                        title="Điểm TB chung"
                        value={averageScore.toFixed(1)}
                        prefix={<TrophyOutlined />}
                        valueStyle={{ color: getScoreColor(averageScore) }}
                        suffix="/10"
                    />
                </Col>
                <Col xs={12} md={6}>
                    <Statistic
                        title="Có đánh giá"
                        value={studentsWithEvaluations}
                        suffix={`/ ${totalStudents}`}
                        valueStyle={{ color: '#1890ff' }}
                    />
                    <Progress
                        percent={totalStudents > 0 ? (studentsWithEvaluations / totalStudents) * 100 : 0}
                        size="small"
                        showInfo={false}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <Statistic
                        title="Có điểm mentor"
                        value={studentsWithMentorScore}
                        suffix={`/ ${totalStudents}`}
                        valueStyle={{ color: '#52c41a' }}
                    />
                    <Progress
                        percent={totalStudents > 0 ? (studentsWithMentorScore / totalStudents) * 100 : 0}
                        size="small"
                        showInfo={false}
                        strokeColor="#52c41a"
                    />
                </Col>
                <Col xs={12} md={6}>
                    <Statistic
                        title="Tỷ lệ hoàn thành"
                        value={totalStudents > 0 ? ((completedStudents / totalStudents) * 100).toFixed(1) : 0}
                        suffix="%"
                        valueStyle={{ color: '#722ed1' }}
                    />
                    <Progress
                        percent={totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0}
                        size="small"
                        showInfo={false}
                        strokeColor="#722ed1"
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default StatisticsCard;
