import { useState, useEffect } from 'react';
import {
    Modal,
    Table,
    Card,
    Typography,
    Space,
    Input,
    Select,
    Button,
    Tag,
    Avatar,
    Tooltip,
    Progress,
    Statistic,
    Row,
    Col,
    Spin,
    Empty,
    message,
    Badge,
    Descriptions
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
    UserOutlined,
    TrophyOutlined,
    StarOutlined,
    BankOutlined,
    CalendarOutlined,
    BookOutlined,
    CloseOutlined,
    DownloadOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import internshipService from '../../../../services/internshipService';
import './StudentScoresModal.css';

const { Title, Text } = Typography;
const { Option } = Select;

const StudentScoresModal = ({ isOpen, onClose }) => {
    // State management
    const [loading, setLoading] = useState(false);
    const [internships, setInternships] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [filters, setFilters] = useState({
        keyword: '',
        status: '',
        sortBy: 'id',
        sortDir: 'desc'
    });
    const [statistics, setStatistics] = useState({
        total: 0,
        hasScores: 0,
        averageScore: 0,
        highScores: 0
    });

    // Load data
    const loadInternships = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const params = {
                keyword: filters.keyword || '',
                page: page - 1,
                size: pageSize,
                sort: `${filters.sortBy},${filters.sortDir}`
            };

            const result = await internshipService.searchInternships({}, params);

            setInternships(result.data || []);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: result.total || 0
            });

            // Calculate statistics
            calculateStatistics(result.data || []);
        } catch (error) {
            console.error('Error loading internships:', error);
            message.error('Không thể tải dữ liệu thực tập');
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const calculateStatistics = (data) => {
        const total = data.length;
        const hasScores = data.filter(item =>
            item.teacherScore || item.mentorScore || item.finalScore
        ).length;

        const scoresSum = data.reduce((sum, item) => {
            return sum + (item.finalScore || 0);
        }, 0);

        const averageScore = hasScores > 0 ? (scoresSum / hasScores) : 0;
        const highScores = data.filter(item => (item.finalScore || 0) >= 8.0).length;

        setStatistics({
            total,
            hasScores,
            averageScore: averageScore.toFixed(1),
            highScores
        });
    };

    // Get status info
    const getStatusInfo = (status) => {
        const statusMap = {
            'PENDING': { color: 'orange', text: 'Chờ duyệt' },
            'APPROVED': { color: 'blue', text: 'Đã duyệt' },
            'IN_PROGRESS': { color: 'cyan', text: 'Đang thực tập' },
            'COMPLETED': { color: 'green', text: 'Hoàn thành' },
            'CANCELLED': { color: 'red', text: 'Đã hủy' },
            'REJECTED': { color: 'volcano', text: 'Bị từ chối' }
        };
        return statusMap[status] || { color: 'default', text: status };
    };

    // Get score color
    const getScoreColor = (score) => {
        if (score >= 9.0) return '#52c41a'; // Excellent - Green
        if (score >= 8.0) return '#1890ff'; // Good - Blue  
        if (score >= 7.0) return '#faad14'; // Average - Orange
        if (score >= 6.0) return '#fa8c16'; // Below Average - Dark Orange
        return '#f5222d'; // Poor - Red
    };

    // Get score level
    const getScoreLevel = (score) => {
        if (score >= 9.0) return 'Xuất sắc';
        if (score >= 8.0) return 'Giỏi';
        if (score >= 7.0) return 'Khá';
        if (score >= 6.0) return 'Trung bình';
        return 'Yếu';
    };

    // Handle table change
    const handleTableChange = (newPagination, filters, sorter) => {
        loadInternships(newPagination.current, newPagination.pageSize);
    };

    // Handle search
    const handleSearch = () => {
        loadInternships(1, pagination.pageSize);
    };

    // Handle clear filters
    const handleClearFilters = () => {
        setFilters({
            keyword: '',
            status: '',
            sortBy: 'id',
            sortDir: 'desc'
        });
    };

    // Clear filters and reload
    const clearAndReload = () => {
        handleClearFilters();
        setTimeout(() => {
            loadInternships(1, pagination.pageSize);
        }, 100);
    };

    // Table columns
    const columns = [
        {
            title: 'Sinh viên',
            key: 'student',
            width: 250,
            render: (_, record) => (
                <div className="flex items-center space-x-3">
                    <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        className="bg-gradient-to-r from-blue-400 to-purple-500 text-white"
                    >
                        {record.student?.user?.fullName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div>
                        <div className="font-semibold text-gray-900">
                            {record.student?.user?.fullName || 'Chưa có thông tin'}
                        </div>
                        <div className="text-sm text-gray-500">
                            <BookOutlined className="mr-1" />
                            {record.student?.studentCode || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                            {record.student?.className || 'N/A'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Thông tin thực tập',
            key: 'internship',
            width: 280,
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                        <BankOutlined className="mr-1 text-blue-500" />
                        {record.company?.companyName || 'Chưa có công ty'}
                    </div>
                    <div className="text-sm text-gray-600">
                        {record.jobTitle || 'Chưa có vị trí'}
                    </div>
                    <div className="text-sm text-gray-500">
                        <CalendarOutlined className="mr-1" />
                        {record.startDate || 'N/A'} - {record.endDate || 'N/A'}
                    </div>
                    <Tag color={getStatusInfo(record.status).color} size="small">
                        {getStatusInfo(record.status).text}
                    </Tag>
                </div>
            )
        },
        {
            title: 'Giáo viên hướng dẫn',
            key: 'teacher',
            width: 200,
            render: (_, record) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {record.teacher?.user?.fullName || 'Chưa phân công'}
                    </div>
                    {record.teacherScore && (
                        <div className="mt-1">
                            <div className="flex items-center space-x-2">
                                <Text strong style={{ color: getScoreColor(record.teacherScore) }}>
                                    {record.teacherScore}
                                </Text>
                                <Tag
                                    color={getScoreColor(record.teacherScore)}
                                    size="small"
                                >
                                    {getScoreLevel(record.teacherScore)}
                                </Tag>
                            </div>
                        </div>
                    )}
                    {!record.teacherScore && (
                        <Text type="secondary" className="text-sm">Chưa chấm điểm</Text>
                    )}
                </div>
            )
        },
        {
            title: 'Mentor',
            key: 'mentor',
            width: 200,
            render: (_, record) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {record.mentor?.fullName || 'Chưa có mentor'}
                    </div>
                    {record.mentorScore && (
                        <div className="mt-1">
                            <div className="flex items-center space-x-2">
                                <Text strong style={{ color: getScoreColor(record.mentorScore) }}>
                                    {record.mentorScore}
                                </Text>
                                <Tag
                                    color={getScoreColor(record.mentorScore)}
                                    size="small"
                                >
                                    {getScoreLevel(record.mentorScore)}
                                </Tag>
                            </div>
                        </div>
                    )}
                    {!record.mentorScore && (
                        <Text type="secondary" className="text-sm">Chưa chấm điểm</Text>
                    )}
                </div>
            )
        },
        {
            title: 'Điểm tổng kết',
            key: 'finalScore',
            width: 150,
            sorter: true,
            render: (_, record) => (
                <div className="text-center">
                    {record.finalScore ? (
                        <div className="space-y-2">
                            <div
                                className="text-2xl font-bold"
                                style={{ color: getScoreColor(record.finalScore) }}
                            >
                                {record.finalScore}
                            </div>
                            <Tag
                                color={getScoreColor(record.finalScore)}
                                className="font-medium"
                            >
                                <TrophyOutlined className="mr-1" />
                                {getScoreLevel(record.finalScore)}
                            </Tag>
                            <Progress
                                percent={(record.finalScore / 10) * 100}
                                size="small"
                                strokeColor={getScoreColor(record.finalScore)}
                                showInfo={false}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <Text type="secondary" className="text-sm">
                                Chưa có điểm
                            </Text>
                        </div>
                    )}
                </div>
            )
        }
    ];

    // Load data when modal opens
    useEffect(() => {
        if (isOpen) {
            loadInternships();
        }
    }, [isOpen]);

    // Load data when filters change
    useEffect(() => {
        if (isOpen) {
            loadInternships(1, pagination.pageSize);
        }
    }, [filters]);

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <TrophyOutlined className="text-yellow-500" />
                    <Title level={4} className="m-0">
                        Bảng điểm thực tập sinh viên
                    </Title>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width="90%"
            style={{ top: 20 }}
            className="student-scores-modal"
            closeIcon={<CloseOutlined />}
        >
            <div className="space-y-4">
                {/* Statistics Cards */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={6}>
                        <Card className="text-center hover:shadow-md transition-shadow">
                            <Statistic
                                title="Tổng thực tập"
                                value={statistics.total}
                                prefix={<UserOutlined className="text-blue-500" />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card className="text-center hover:shadow-md transition-shadow">
                            <Statistic
                                title="Đã có điểm"
                                value={statistics.hasScores}
                                prefix={<TrophyOutlined className="text-green-500" />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card className="text-center hover:shadow-md transition-shadow">
                            <Statistic
                                title="Điểm trung bình"
                                value={statistics.averageScore}
                                precision={1}
                                prefix={<StarOutlined className="text-yellow-500" />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card className="text-center hover:shadow-md transition-shadow">
                            <Statistic
                                title="Điểm cao (≥8.0)"
                                value={statistics.highScores}
                                prefix={<TrophyOutlined className="text-purple-500" />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Filters */}
                <Card size="small" className="bg-gray-50">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={8}>
                            <Input
                                placeholder="Tìm kiếm sinh viên, công ty..."
                                prefix={<SearchOutlined />}
                                value={filters.keyword}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    keyword: e.target.value
                                }))}
                                onPressEnter={handleSearch}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} sm={6}>
                            <Select
                                placeholder="Trạng thái"
                                value={filters.status}
                                onChange={(value) => setFilters(prev => ({
                                    ...prev,
                                    status: value
                                }))}
                                allowClear
                                className="w-full"
                            >
                                <Option value="PENDING">Chờ duyệt</Option>
                                <Option value="APPROVED">Đã duyệt</Option>
                                <Option value="IN_PROGRESS">Đang thực tập</Option>
                                <Option value="COMPLETED">Hoàn thành</Option>
                                <Option value="CANCELLED">Đã hủy</Option>
                                <Option value="REJECTED">Bị từ chối</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={10}>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    onClick={handleSearch}
                                    loading={loading}
                                >
                                    Tìm kiếm
                                </Button>
                                <Button
                                    icon={<ClearOutlined />}
                                    onClick={clearAndReload}
                                >
                                    Xóa bộ lọc
                                </Button>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={() => loadInternships(pagination.current, pagination.pageSize)}
                                    loading={loading}
                                >
                                    Tải lại
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Table */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={internships}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            ...pagination,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} của ${total} mục`,
                            pageSizeOptions: ['5', '10', '20', '50']
                        }}
                        onChange={handleTableChange}
                        size="middle"
                        className="shadow-sm"
                        scroll={{ x: 1200 }}
                        locale={{
                            emptyText: (
                                <Empty
                                    description="Không có dữ liệu thực tập"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )
                        }}
                    />
                </Card>
            </div>
        </Modal>
    );
};

export default StudentScoresModal;