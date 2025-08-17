import React from 'react';
import { Card, Tag, Button, Space, Avatar, Typography, Row, Col, Progress } from 'antd';
import { UserOutlined, CalendarOutlined, StarFilled, EditOutlined, EyeOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const StudentCard = ({ student, onViewDetails, onCreateEvaluation }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
            case 'ASSIGNED':
            case 'IN_PROGRESS':
                return 'green';
            case 'COMPLETED':
                return 'blue';
            case 'PENDING':
                return 'orange';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'ACTIVE':
            case 'ASSIGNED':
            case 'IN_PROGRESS':
                return 'Đang thực tập';
            case 'COMPLETED':
                return 'Hoàn thành';
            case 'PENDING':
                return 'Chờ duyệt';
            default:
                return status;
        }
    };

    const getScoreColor = (score) => {
        if (score >= 8.5) return '#52c41a';
        if (score >= 7) return '#1890ff';
        if (score >= 5.5) return '#faad14';
        return '#ff4d4f';
    };

    const renderScoreStars = (score) => {
        const stars = [];
        for (let i = 1; i <= 10; i++) {
            stars.push(
                <StarFilled
                    key={i}
                    style={{
                        color: i <= score ? '#faad14' : '#d9d9d9',
                        fontSize: '14px'
                    }}
                />
            );
        }
        return stars;
    };

    return (
        <Card
            className="!mb-4 !shadow-sm !hover:!shadow-md !transition-shadow"
            bodyStyle={{ padding: '20px' }}
        >
            <Row gutter={16} align="middle">
                <Col xs={24} md={8}>
                    <div className="!flex !items-center !space-x-3">
                        <Avatar
                            size={48}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#1890ff' }}
                        />
                        <div>
                            <Title level={5} style={{ margin: 0 }}>{student.name}</Title>
                            <Text type="secondary">{student.studentCode}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: '12px' }}>{student.email}</Text>
                        </div>
                    </div>
                </Col>

                <Col xs={24} md={6}>
                    <div className="space-y-1">
                        <div className="!flex !items-center !text-sm">
                            <Text>{student.company}</Text>
                        </div>
                        <div className="!flex !items-center !text-sm">
                            <CalendarOutlined className="mr-1" />
                            <Text type="secondary">
                                {new Date(student.startDate).toLocaleDateString('vi-VN')} - {new Date(student.endDate).toLocaleDateString('vi-VN')}
                            </Text>
                        </div>
                        <Tag color={getStatusColor(student.status)}>
                            {getStatusText(student.status)}
                        </Tag>
                    </div>
                </Col>

                <Col xs={24} md={4}>
                    <div className="!text-center">
                        <div className="!text-2xl !font-bold" style={{ color: getScoreColor(student.averageScore) }}>
                            {student.averageScore > 0 ? student.averageScore.toFixed(1) : 'N/A'}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Điểm TB</Text>
                        {student.averageScore > 0 && (
                            <div className="!mt-1">
                                {renderScoreStars(student.averageScore)}
                            </div>
                        )}
                    </div>
                </Col>

                <Col xs={24} md={6}>
                    <div className="!space-y-2">
                        {student.mentorScore && (
                            <div className="!text-center !p-2 !bg-green-50 !rounded">
                                <Text strong style={{ color: '#52c41a' }}>
                                    Điểm mentor: {student.mentorScore}/10
                                </Text>
                            </div>
                        )}
                        <div className="!text-center">
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                {student.evaluations.length} đánh giá
                            </Text>
                            {student.evaluations.length > 0 && (
                                <div>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        Lần cuối: {student.lastEvaluationDate}
                                    </Text>
                                </div>
                            )}
                        </div>
                    </div>
                </Col>

                <Col xs={24} md={24}>
                    <div className="!flex !justify-end !space-x-2 !mt-4">
                        <Button
                            type="default"
                            icon={<EyeOutlined />}
                            onClick={() => onViewDetails(student)}
                        >
                            Xem chi tiết
                        </Button>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => onCreateEvaluation(student)}
                        >
                            Đánh giá sinh viên
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Latest Evaluation Scores */}
            {student.evaluations.length > 0 && (
                <div className="!mt-4 !pt-4 !border-t">
                    <Row gutter={16}>
                        <Col xs={12} md={6}>
                            <div className="!text-center !p-2 !bg-blue-50 !rounded">
                                <Text strong style={{ color: '#1890ff' }}>Kỹ thuật</Text>
                                <div className="!text-lg !font-bold" style={{ color: getScoreColor(student.evaluations[0].technicalScore) }}>
                                    {student.evaluations[0].technicalScore}/10
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="!text-center !p-2 !bg-green-50 !rounded">
                                <Text strong style={{ color: '#52c41a' }}>Kỹ năng mềm</Text>
                                <div className="!text-lg !font-bold" style={{ color: getScoreColor(student.evaluations[0].softSkillScore) }}>
                                    {student.evaluations[0].softSkillScore}/10
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="!text-center !p-2 !bg-purple-50 !rounded">
                                <Text strong style={{ color: '#722ed1' }}>Thái độ</Text>
                                <div className="!text-lg !font-bold" style={{ color: getScoreColor(student.evaluations[0].attitudeScore) }}>
                                    {student.evaluations[0].attitudeScore}/10
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="!text-center !p-2 !bg-orange-50 !rounded">
                                <Text strong style={{ color: '#fa8c16' }}>Giao tiếp</Text>
                                <div className="!text-lg !font-bold" style={{ color: getScoreColor(student.evaluations[0].communicationScore) }}>
                                    {student.evaluations[0].communicationScore}/10
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}

            {/* Evaluation History */}
            {student.evaluations.length > 1 && (
                <div className="!mt-4 !pt-4 !border-t">
                    <Text strong>Lịch sử đánh giá:</Text>
                    <div className="!mt-2 !space-y-1">
                        {student.evaluations.slice(1, 4).map(evaluation => (
                            <div key={evaluation.id} className="!flex !justify-between !items-center !p-2 !bg-gray-50 !rounded">
                                <div>
                                    <Text>{new Date(evaluation.date).toLocaleDateString('vi-VN')}</Text>
                                    {evaluation.isFinalEvaluation && (
                                        <Tag color="gold" size="small" className="ml-2">Đánh giá cuối kỳ</Tag>
                                    )}
                                </div>
                                <Text strong style={{ color: getScoreColor(evaluation.overallScore) }}>
                                    {evaluation.overallScore.toFixed(1)}/10
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default StudentCard;
