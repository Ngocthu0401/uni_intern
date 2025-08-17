import React from 'react';
import { Modal, Descriptions, Tag, Typography, Row, Col, Card, Timeline, Button, Space, Divider } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    TrophyOutlined,
    StarFilled,
    EditOutlined
} from '@ant-design/icons';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';

const { Title, Text } = Typography;

const StudentDetailModal = ({
    open,
    onCancel,
    student = null,
    onEditEvaluation
}) => {
    if (!student) return null;

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
        <Modal
            open={open}
            title={
                <div className="!flex !items-center">
                    <UserOutlined className="!mr-2" />
                    Chi tiết sinh viên
                </div>
            }
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Đóng
                </Button>,
                <Button
                    key="edit"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => onEditEvaluation(student)}
                >
                    Đánh giá sinh viên
                </Button>
            ]}
            width={800}
            destroyOnClose
        >
            <div className="!space-y-6">
                {/* Student Basic Information */}
                <Card title="Thông tin cơ bản" size="small">
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="Họ và tên">
                            <Text strong>{student.name}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã sinh viên">
                            <Text code>{student.studentCode}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {student.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={getStatusColor(student.status)}>
                                {getStatusText(student.status)}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Internship Information */}
                <Card title="Thông tin thực tập" size="small">
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="Công ty">
                            {student.company}
                        </Descriptions.Item>
                        <Descriptions.Item label="Vị trí">
                            {student.position}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian thực tập">
                            {new Date(student.startDate).toLocaleDateString('vi-VN')} - {new Date(student.endDate).toLocaleDateString('vi-VN')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Điểm mentor">
                            {student.mentorScore ? (
                                <div className="!flex !items-center">
                                    <TrophyOutlined className="mr-1" style={{ color: '#52c41a' }} />
                                    <Text strong style={{ color: '#52c41a' }}>
                                        {student.mentorScore}/10
                                    </Text>
                                </div>
                            ) : (
                                <Text type="secondary">Chưa có điểm</Text>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Score Summary */}
                <Card title="Tổng quan điểm số" size="small">
                    <Row gutter={16}>
                        <Col span={8}>
                            <div className="!text-center !p-3 !bg-blue-50 !rounded-lg">
                                <div className="text-2xl font-bold" style={{ color: getScoreColor(student.averageScore) }}>
                                    {student.averageScore > 0 ? student.averageScore.toFixed(1) : 'N/A'}
                                </div>
                                <Text type="secondary">Điểm trung bình</Text>
                                {student.averageScore > 0 && (
                                    <div className="mt-2">
                                        {renderScoreStars(student.averageScore)}
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="!text-center !p-3 !bg-green-50 !rounded-lg">
                                <div className="!text-2xl !font-bold !text-green-600">
                                    {student.evaluations.length}
                                </div>
                                <Text type="secondary">Số lần đánh giá</Text>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="!text-center !p-3 !bg-purple-50 !rounded-lg">
                                <div className="!text-2xl !font-bold !text-purple-600">
                                    {student.evaluations.length > 0 ? student.lastEvaluationDate : 'N/A'}
                                </div>
                                <Text type="secondary">Lần đánh giá cuối</Text>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Latest Evaluation Details */}
                {student.evaluations.length > 0 && (
                    <Card title="Đánh giá gần nhất" size="small">
                        <Row gutter={16}>
                            <Col span={6}>
                                <div className="!text-center !p-2 !bg-blue-50 !rounded">
                                    <Text strong style={{ color: '#1890ff' }}>Kỹ thuật</Text>
                                    <div className="!text-lg !font-bold" style={{ color: getScoreColor(student.evaluations[0].technicalScore) }}>
                                        {student.evaluations[0].technicalScore}/10
                                    </div>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="!text-center !p-2 !bg-green-50 !rounded">
                                    <Text strong style={{ color: '#52c41a' }}>Kỹ năng mềm</Text>
                                    <div className="!text-lg !font-bold" style={{ color: getScoreColor(student.evaluations[0].softSkillScore) }}>
                                        {student.evaluations[0].softSkillScore}/10
                                    </div>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="!text-center !p-2 !bg-purple-50 !rounded">
                                    <Text strong style={{ color: '#722ed1' }}>Thái độ</Text>
                                    <div className="!text-lg !font-bold" style={{ color: getScoreColor(student.evaluations[0].attitudeScore) }}>
                                        {student.evaluations[0].attitudeScore}/10
                                    </div>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="!text-center !p-2 !bg-orange-50 !rounded">
                                    <Text strong style={{ color: '#fa8c16' }}>Giao tiếp</Text>
                                    <div className="!text-lg !font-bold" style={{ color: getScoreColor(student.evaluations[0].communicationScore) }}>
                                        {student.evaluations[0].communicationScore}/10
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {student.evaluations[0].comments && (
                            <div className="!mt-4 !p-3 !bg-gray-50 !rounded">
                                <Text strong>Nhận xét:</Text>
                                <div className="!mt-1">{student.evaluations[0].comments}</div>
                            </div>
                        )}
                    </Card>
                )}

                {/* Evaluation History */}
                {student.evaluations.length > 1 && (
                    <Card title="Lịch sử đánh giá" size="small">
                        <Timeline>
                            {student.evaluations.slice(1).map((evaluation, index) => (
                                <Timeline.Item
                                    key={evaluation.id}
                                    color={evaluation.isFinalEvaluation ? 'gold' : 'blue'}
                                >
                                    <div className="!flex !justify-between !items-center">
                                        <div>
                                            <Text strong>
                                                {new Date(evaluation.date).toLocaleDateString('vi-VN')}
                                            </Text>
                                            {evaluation.isFinalEvaluation && (
                                                <Tag color="gold" size="small" className="ml-2">
                                                    Đánh giá cuối kỳ
                                                </Tag>
                                            )}
                                        </div>
                                        <div className="!text-right">
                                            <div className="!text-lg !font-bold" style={{ color: getScoreColor(evaluation.overallScore) }}>
                                                {evaluation.overallScore.toFixed(1)}/10
                                            </div>
                                            <div className="!text-xs !text-gray-500">
                                                {renderScoreStars(evaluation.overallScore)}
                                            </div>
                                        </div>
                                    </div>
                                    {evaluation.comments && (
                                        <div className="!mt-2 !text-sm !text-gray-600">
                                            {evaluation.comments}
                                        </div>
                                    )}
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </Card>
                )}

                {/* Mentor Comments */}
                {student.mentorComment && (
                    <Card title="Nhận xét của mentor" size="small">
                        <div className="!p-3 !bg-green-50 !rounded">
                            {student.mentorComment}
                        </div>
                    </Card>
                )}
            </div>
        </Modal>
    );
};

export default StudentDetailModal;
