import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined, TeamOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import InternshipTable from './components/InternshipTable';
import InternshipFilters from './components/InternshipFilters';
import InternshipModal from './components/InternshipModal';
import { internshipService } from '../../../services';
import { message } from 'antd';

const { Title } = Typography;

const InternshipManagement = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        keyword: '',
        status: '',
        type: '',
        companyName: '',
        batchId: ''
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [statistics, setStatistics] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        inProgress: 0,
        completed: 0
    });

    // Load internships
    const loadInternships = useCallback(async (page = 1, pageSize = 10, currentFilters = null) => {
        try {
            setLoading(true);
            const filtersToUse = currentFilters || filters;

            const params = {
                page: page, // Backend uses 0-based pagination
                size: pageSize,
                ...filtersToUse
            };

            const response = await internshipService.searchInternships(params, { page, size: pageSize });

            setInternships(response.data || []);
            setPagination(prev => ({
                ...prev,
                current: page,
                pageSize,
                total: response.total || 0
            }));
        } catch (error) {
            console.error('Error loading internships:', error);
            message.error('Không thể tải danh sách thực tập');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load statistics
    const loadStatistics = async () => {
        try {
            const stats = await internshipService.getInternshipStatistics();
            setStatistics(stats);
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    };

    // Handle table change (pagination, filters, sorter)
    const handleTableChange = (paginationInfo) => {
        loadInternships(paginationInfo.current, paginationInfo.pageSize);
    };

    // Handle filter change
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, current: 1 }));
        // Call API immediately with new filters
        loadInternships(1, pagination.pageSize, newFilters);
    }, [loadInternships, pagination.pageSize]);

    // Handle reload
    const handleReload = () => {
        loadInternships(pagination.current, pagination.pageSize);
        loadStatistics();
    };

    // Handle modal actions
    const handleModalAction = (mode, internship = null) => {
        setModalMode(mode);
        setSelectedInternship(internship);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedInternship(null);
        setModalMode('create');
    };

    const handleModalSuccess = () => {
        handleModalClose();
        loadInternships(pagination.current, pagination.pageSize);
        loadStatistics();
        message.success('Thao tác thành công');
    };

    // Initial load
    useEffect(() => {
        loadInternships();
        loadStatistics();
    }, []);

    // Debug: log when filters change
    useEffect(() => {
        console.log('Filters changed:', filters);
    }, [filters]);

    return (
        <div className="!p-6">
            <div className="!mb-6">
                <Title level={2} className="!mb-2">
                    Quản lý Thực tập
                </Title>
                <p className="!text-gray-600">
                    Quản lý tất cả các vị trí thực tập và ứng tuyển
                </p>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16} className="!mb-6 space-y-4 !justify-start" >
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng số"
                            value={statistics.total}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Chờ phê duyệt"
                            value={statistics.pending}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Đã phê duyệt"
                            value={statistics.approved}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Đã phân công"
                            value={statistics.assigned}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: 'purple' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Đang thực tập"
                            value={statistics.in_progress}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hoàn thành"
                            value={statistics.completed}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Bị từ chối"
                            value={statistics.rejected || 0}
                            prefix={<CloseCircleOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hủy bỏ"
                            value={statistics.cancelled || 0}
                            prefix={<CloseCircleOutlined />}
                            valueStyle={{ color: 'red' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Action Bar */}
            <Card className="!mb-6">
                <Row justify="!space-between" align="middle">
                    <Col>
                        <Space>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => handleModalAction('create')}
                            >
                                Tạo Vị trí thực tập
                            </Button>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={handleReload}
                                loading={loading}
                            >
                                Làm mới
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Filters */}
            <Card className="!mb-6">
                <InternshipFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </Card>

            {/* Table */}
            <Card>
                <InternshipTable
                    dataSource={internships}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    onAction={handleModalAction}
                />
            </Card>

            {/* Modal */}
            <InternshipModal
                visible={modalVisible}
                mode={modalMode}
                internship={selectedInternship}
                onClose={handleModalClose}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
};

export default InternshipManagement;
