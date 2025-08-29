import { useState } from 'react';
import { Modal, Card, Row, Col, Typography, Tag, Timeline, Descriptions, Avatar, Empty, Collapse, Statistic, Progress, Space, Divider } from 'antd';
import { UserOutlined, BankOutlined, CalendarOutlined, DollarOutlined, TrophyOutlined, FileTextOutlined, TeamOutlined, BookOutlined, ClockCircleOutlined, EnvironmentOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const StudentInternshipsModal = ({ isOpen, onClose, student, internships = [] }) => {
    const [activeKey, setActiveKey] = useState([]);

    if (!student) return null;

    const getStatusColor = (status) => {
        const statusColors = {
            'IN_PROGRESS': 'processing',
            'PENDING': 'warning',
            'APPROVED': 'success',
            'ASSIGNED': 'purple',
            'COMPLETED': 'success',
            'REJECTED': 'error'
        };
        return statusColors[status] || 'default';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            'IN_PROGRESS': 'Đang thực tập',
            'PENDING': 'Chờ phê duyệt',
            'APPROVED': 'Đã phê duyệt',
            'ASSIGNED': 'Đã phân công',
            'COMPLETED': 'Hoàn thành',
            'REJECTED': 'Bị từ chối'
        };
        return statusTexts[status] || status;
    };

    const getTimelineItems = () => {
        return internships.map((internship) => ({
            color: getStatusColor(internship.status),
            children: (
                <div>
                    <div className="font-semibold">
                        {internship.company?.companyName || 'Chưa có công ty'}
                    </div>
                    <div className="text-sm text-gray-500">
                        {internship.startDate ? new Date(internship.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                        {' - '}
                        {internship.endDate ? new Date(internship.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                    <Tag color={getStatusColor(internship.status)} size="small">
                        {getStatusText(internship.status)}
                    </Tag>
                </div>
            )
        }));
    };

    const renderInternshipCard = (internship) => {
        const isActive = internship.status === 'IN_PROGRESS';

        return (
            <Panel
                key={internship.id}
                header={
                    <div className="!flex !items-center !justify-between !w-full !pr-4">
                        <div className="!flex !items-center !space-x-3">
                            <Avatar
                                size={40}
                                style={{
                                    backgroundColor: isActive ? '#52c41a' : '#1890ff',
                                    color: 'white'
                                }}
                                className='!mr-2'
                                icon={<BankOutlined />}
                            />
                            <div>
                                <div className="!font-semibold !text-gray-900">
                                    {internship.jobTitle || 'Chưa có tiêu đề'}
                                </div>
                                <div className="!text-sm !text-gray-500">
                                    {internship.company?.companyName || 'Chưa có công ty'}
                                </div>
                            </div>
                        </div>
                        <div className="!flex !items-center !space-x-2">
                            <Tag color={getStatusColor(internship.status)}>
                                {getStatusText(internship.status)}
                            </Tag>
                            {isActive && (
                                <Tag color="red" icon={<StarOutlined />}>
                                    Đang hoạt động
                                </Tag>
                            )}
                        </div>
                    </div>
                }
                className={isActive ? '!border-green-300 !bg-green-50' : ''}
            >
                <Row gutter={[16, 16]}>
                    {/* Left Column - Company & People */}
                    <Col xs={24} lg={12}>
                        <div className="!space-y-4">
                            {/* Company Information */}
                            <Card
                                title={
                                    <div className="!flex !items-center">
                                        <BankOutlined className="!text-blue-500 !mr-2" />
                                        <span>Thông tin công ty</span>
                                    </div>
                                }
                                size="small"
                                className="!bg-blue-50 !border-blue-200"
                            >
                                <Descriptions
                                    column={1}
                                    size="small"
                                    items={[
                                        {
                                            key: 'companyName',
                                            label: 'Tên công ty',
                                            children: internship.company?.companyName || 'Chưa phân công'
                                        },
                                        {
                                            key: 'address',
                                            label: (
                                                <span>
                                                    <EnvironmentOutlined className="mr-1" />
                                                    Địa chỉ
                                                </span>
                                            ),
                                            children: internship.company?.address || 'Chưa có địa chỉ'
                                        },
                                        {
                                            key: 'industry',
                                            label: 'Ngành nghề',
                                            children: internship.company?.industry ? (
                                                <Tag color="blue">{internship.company.industry}</Tag>
                                            ) : 'N/A'
                                        },
                                        {
                                            key: 'size',
                                            label: 'Quy mô',
                                            children: internship.company?.companySize ? (
                                                <Tag color="purple">{internship.company.companySize}</Tag>
                                            ) : 'N/A'
                                        }
                                    ]}
                                />
                            </Card>

                            {/* Teacher Information */}
                            <Card
                                title={
                                    <div className="!flex !items-center">
                                        <BookOutlined className="!text-green-500 !mr-2" />
                                        <span>Giảng viên hướng dẫn</span>
                                    </div>
                                }
                                size="small"
                                className="!bg-green-50 !border-green-200"
                            >
                                <Descriptions
                                    column={1}
                                    size="small"
                                    items={[
                                        {
                                            key: 'teacherName',
                                            label: 'Họ tên',
                                            children: internship.teacher?.user?.fullName || 'Chưa phân công'
                                        },
                                        {
                                            key: 'department',
                                            label: 'Khoa',
                                            children: internship.teacher?.department || 'N/A'
                                        },
                                        {
                                            key: 'position',
                                            label: 'Chức vụ',
                                            children: internship.teacher?.position ? (
                                                <Tag color="green">{internship.teacher.position}</Tag>
                                            ) : 'N/A'
                                        },
                                        {
                                            key: 'degree',
                                            label: 'Trình độ',
                                            children: internship.teacher?.degree ? (
                                                <Tag color="cyan">{internship.teacher.degree}</Tag>
                                            ) : 'N/A'
                                        }
                                    ]}
                                />
                            </Card>

                            {/* Mentor Information */}
                            <Card
                                title={
                                    <div className="!flex !items-center">
                                        <TeamOutlined className="!text-purple-500 !mr-2" />
                                        <span>Mentor</span>
                                    </div>
                                }
                                size="small"
                                className="!bg-purple-50 !border-purple-200"
                            >
                                <Descriptions
                                    column={1}
                                    size="small"
                                    items={[
                                        {
                                            key: 'mentorName',
                                            label: 'Họ tên',
                                            children: internship.mentor?.user?.fullName || 'Chưa phân công'
                                        },
                                        {
                                            key: 'mentorPosition',
                                            label: 'Vị trí',
                                            children: internship.mentor?.position || 'N/A'
                                        },
                                        {
                                            key: 'expertise',
                                            label: 'Chuyên môn',
                                            children: internship.mentor?.expertiseLevel ? (
                                                <Tag color="purple">{internship.mentor.expertiseLevel}</Tag>
                                            ) : 'N/A'
                                        },
                                        {
                                            key: 'experience',
                                            label: 'Kinh nghiệm',
                                            children: internship.mentor?.yearsOfExperience
                                                ? `${internship.mentor.yearsOfExperience} năm`
                                                : 'N/A'
                                        }
                                    ]}
                                />
                            </Card>
                        </div>
                    </Col>

                    {/* Right Column - Details & Scores */}
                    <Col xs={24} lg={12}>
                        <div className="!space-y-4">
                            {/* Time & Salary */}
                            <Card
                                title={
                                    <div className="!flex !items-center">
                                        <CalendarOutlined className="!text-orange-500 !mr-2" />
                                        <span>Thời gian & Lương</span>
                                    </div>
                                }
                                size="small"
                                className="!bg-orange-50 !border-orange-200"
                            >
                                <div className="!space-y-4">
                                    <Descriptions
                                        column={1}
                                        size="small"
                                        items={[
                                            {
                                                key: 'duration',
                                                label: 'Thời gian thực tập',
                                                children: (
                                                    <div>
                                                        <div className="font-medium">
                                                            {internship.startDate ? new Date(internship.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                                                            {' - '}
                                                            {internship.endDate ? new Date(internship.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                                                        </div>
                                                        <Text type="secondary" className="text-xs">
                                                            {internship.workingHoursPerWeek || 40}h/tuần
                                                        </Text>
                                                    </div>
                                                )
                                            },
                                            {
                                                key: 'salary',
                                                label: (
                                                    <span>
                                                        <DollarOutlined className="mr-1" />
                                                        Mức lương
                                                    </span>
                                                ),
                                                children: internship.salary ? (
                                                    <Statistic
                                                        value={internship.salary}
                                                        suffix="VND/tháng"
                                                        formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
                                                        valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                                                    />
                                                ) : 'Thỏa thuận'
                                            }
                                        ]}
                                    />
                                </div>
                            </Card>

                            {/* Scores */}
                            {(internship.teacherScore || internship.mentorScore || internship.finalScore) && (
                                <Card
                                    title={
                                        <div className="!flex !items-center">
                                            <TrophyOutlined className="!text-yellow-500 !mr-2" />
                                            <span>Điểm đánh giá</span>
                                        </div>
                                    }
                                    size="small"
                                    className="!bg-yellow-50 !border-yellow-200"
                                >
                                    <div className="!space-y-3">
                                        {internship.teacherScore && (
                                            <div>
                                                <div className="!flex !justify-between !items-center !mb-1">
                                                    <Text>Giảng viên:</Text>
                                                    <Text strong className="text-blue-600 text-lg">
                                                        {internship.teacherScore}
                                                    </Text>
                                                </div>
                                                <Progress
                                                    percent={(internship.teacherScore / 10) * 100}
                                                    strokeColor="#1890ff"
                                                    showInfo={false}
                                                    size="small"
                                                />
                                            </div>
                                        )}

                                        {internship.mentorScore && (
                                            <div>
                                                <div className="!flex !justify-between !items-center !mb-1">
                                                    <Text>Mentor:</Text>
                                                    <Text strong className="text-green-600 text-lg">
                                                        {internship.mentorScore}
                                                    </Text>
                                                </div>
                                                <Progress
                                                    percent={(internship.mentorScore / 10) * 100}
                                                    strokeColor="#52c41a"
                                                    showInfo={false}
                                                    size="small"
                                                />
                                            </div>
                                        )}

                                        {internship.finalScore && (
                                            <>
                                                <Divider className="my-2" />
                                                <div>
                                                    <div className="!flex !justify-between !items-center !mb-1">
                                                        <Text strong>Điểm tổng kết:</Text>
                                                        <Text strong className="text-purple-600 text-xl">
                                                            {internship.finalScore}
                                                        </Text>
                                                    </div>
                                                    <Progress
                                                        percent={(internship.finalScore / 10) * 100}
                                                        strokeColor="#722ed1"
                                                        showInfo={false}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Card>
                            )}

                            {/* Job Description */}
                            {internship.jobDescription && (
                                <Card
                                    title={
                                        <div className="!flex !items-center">
                                            <FileTextOutlined className="!text-gray-500 !mr-2" />
                                            <span>Mô tả công việc</span>
                                        </div>
                                    }
                                    size="small"
                                >
                                    <Paragraph className="!text-sm !whitespace-pre-line">
                                        {internship.jobDescription}
                                    </Paragraph>
                                </Card>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* Requirements & Benefits */}
                {(internship.requirements || internship.benefits) && (
                    <>
                        <Divider />
                        <Row gutter={[16, 16]}>
                            {internship.requirements && internship.requirements !== 'Chưa xác định' && (
                                <Col xs={24} lg={12}>
                                    <Card
                                        title="Yêu cầu"
                                        size="small"
                                        className="!bg-red-50 !border-red-200 !h-full"
                                    >
                                        <Paragraph className="!text-sm !whitespace-pre-line">
                                            {internship.requirements}
                                        </Paragraph>
                                    </Card>
                                </Col>
                            )}
                            {internship.benefits && internship.benefits !== 'Chưa xác định' && (
                                <Col xs={24} lg={12}>
                                    <Card
                                        title="Phúc lợi"
                                        size="small"
                                        className="!bg-green-50 !border-green-200 !h-full"
                                    >
                                        <Paragraph className="!text-sm !whitespace-pre-line">
                                            {internship.benefits}
                                        </Paragraph>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </>
                )}

                {/* System Info */}
                <Divider />
                <div className="!flex !justify-between !text-xs !text-gray-400">
                    <span>
                        <ClockCircleOutlined className="mr-1" />
                        Tạo: {internship.createdAt ? new Date(internship.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                    <span>
                        <ClockCircleOutlined className="mr-1" />
                        Cập nhật: {internship.updatedAt ? new Date(internship.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                </div>
            </Panel>
        );
    };

    return (
        <Modal
            title={
                <div className="gradient-header -m-6 mb-4">
                    <div className="!flex !items-center !justify-between">
                        <div className="!flex !items-center !space-x-4">
                            <Avatar
                                size={64}
                                style={{
                                    backgroundColor: '#1890ff',
                                    color: 'white',
                                    border: '3px solid rgba(255,255,255,0.3)'
                                }}
                                icon={<FileTextOutlined />}
                            />
                            <div>
                                <Title level={3} className="!text-white !mb-1">
                                    Thông tin Thực tập
                                </Title>
                                <Text className="!text-blue-100">
                                    {student?.user?.fullName} - {student?.studentCode}
                                </Text>
                            </div>
                        </div>
                        <div className="text-right mr-10">
                            <div className="!text-2xl !font-bold !text-white">
                                {internships.length}
                            </div>
                            <div className="!text-blue-100 !text-sm">Thực tập</div>
                        </div>
                    </div>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={1200}
            footer={null}
            destroyOnHidden
            styles={{ backdropFilter: 'blur(4px)' }}
        >
            <div className="space-y-6">
                {/* Student Summary */}
                <Card className="!bg-gradient-to-br !from-blue-50 !to-indigo-50 !border-blue-200 !mb-3">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12}>
                            <Descriptions
                                column={1}
                                size="small"
                                items={[
                                    {
                                        key: 'name',
                                        label: 'Sinh viên',
                                        children: <Text strong>{student?.user?.fullName || 'N/A'}</Text>
                                    },
                                    {
                                        key: 'code',
                                        label: 'Mã SV',
                                        children: <Text code>{student?.studentCode || 'N/A'}</Text>
                                    },
                                    {
                                        key: 'class',
                                        label: 'Lớp - Ngành',
                                        children: `${student?.className || 'N/A'} - ${student?.major || 'N/A'}`
                                    }
                                ]}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <div className="text-center">
                                <Timeline
                                    mode="left"
                                    size="small"
                                    items={getTimelineItems().slice(0, 3)}
                                />
                                {internships.length > 3 && (
                                    <Text type="secondary" className="!text-xs">
                                        ... và {internships.length - 3} thực tập khác
                                    </Text>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Internships List */}
                <Card
                    title={
                        <div className="!flex !items-center !justify-between">
                            <div className="!flex !items-center">
                                <FileTextOutlined className="!text-blue-500 !mr-2" />
                                <span>Danh sách thực tập ({internships.length})</span>
                            </div>
                        </div>
                    }
                >
                    {internships.length === 0 ? (
                        <Empty
                            description="Sinh viên chưa có thực tập nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <Collapse
                            activeKey={activeKey}
                            onChange={setActiveKey}
                            className="bg-white"
                            size="large"
                            expandIconPosition="end"
                        >
                            {internships.map((internship) => renderInternshipCard(internship))}
                        </Collapse>
                    )}
                </Card>
            </div>
        </Modal>
    );
};

export default StudentInternshipsModal;