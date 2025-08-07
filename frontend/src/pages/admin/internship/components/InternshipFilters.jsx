import React from 'react';
import { Row, Col, Input, Select, Button, Space, Collapse, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined, ReloadOutlined } from '@ant-design/icons';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const InternshipFilters = ({ filters, onFilterChange }) => {
    const statusOptions = [
        { value: 'PENDING', label: 'Chờ phê duyệt' },
        { value: 'APPROVED', label: 'Đã phê duyệt' },
        { value: 'REJECTED', label: 'Bị từ chối' },
        { value: 'ASSIGNED', label: 'Đã phân công' },
        { value: 'IN_PROGRESS', label: 'Đang thực tập' },
        { value: 'COMPLETED', label: 'Hoàn thành' },
        { value: 'CANCELLED', label: 'Hủy bỏ' }
    ];

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        onFilterChange(newFilters);
    };

    const handleApplyFilters = () => {
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            keyword: '',
            status: '',
            type: '',
            companyName: '',
            batchId: '',
            dateRange: null
        };
        onFilterChange(clearedFilters);
    };

    const handleSearch = (value) => {
        const newFilters = { ...filters, keyword: value };
        onFilterChange(newFilters);
    };

    return (
        <div>
            {/* Basic Filters */}
            <Row gutter={16} align="middle">
                <Col xs={24} md={8}>
                    <Search
                        placeholder="Tìm kiếm theo tiêu đề, công ty, sinh viên..."
                        value={filters.keyword}
                        onChange={(e) => handleFilterChange('keyword', e.target.value)}
                        onSearch={handleSearch}
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="middle"
                    />
                </Col>

                <Col xs={24} md={4}>
                    <Select
                        placeholder="Trạng thái"
                        value={filters.status || undefined}
                        onChange={(value) => handleFilterChange('status', value)}
                        allowClear
                        style={{ width: '100%' }}
                        size="middle"
                    >
                        {statusOptions.map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} md={4}>
                    <Input
                        placeholder="Tên công ty"
                        value={filters.companyName}
                        onChange={(e) => handleFilterChange('companyName', e.target.value)}
                        allowClear
                        size="middle"
                    />
                </Col>

                <Col xs={24} md={4}>
                    <Space>
                        <Button
                            type="primary"
                            icon={<FilterOutlined />}
                            onClick={handleApplyFilters}
                            size="middle"
                        >
                            Lọc
                        </Button>
                        <Button
                            icon={<ClearOutlined />}
                            onClick={handleClearFilters}
                            size="middle"
                        >
                            Xóa
                        </Button>
                    </Space>
                </Col>
            </Row>


        </div>
    );
};

export default InternshipFilters;
