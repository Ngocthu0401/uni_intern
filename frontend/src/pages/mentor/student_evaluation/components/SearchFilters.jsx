import React from 'react';
import { Input, Select, Row, Col, Card } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Search } = Input;

const SearchFilters = ({
    searchTerm,
    onSearchChange,
    filterStatus,
    onFilterChange
}) => {
    return (
        <Card className="!mb-6">
            <Row gutter={16} align="middle">
                <Col xs={24} md={16}>
                    <Search
                        placeholder="Tìm kiếm sinh viên theo tên hoặc mã số..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        prefix={<SearchOutlined />}
                        size="large"
                        allowClear
                    />
                </Col>
                <Col xs={24} md={8}>
                    <Select
                        placeholder="Lọc theo trạng thái"
                        value={filterStatus}
                        onChange={onFilterChange}
                        size="large"
                        style={{ width: '100%' }}
                        prefix={<FilterOutlined />}
                    >
                        <Select.Option value="all">Tất cả trạng thái</Select.Option>
                        <Select.Option value="ACTIVE">Đang thực tập</Select.Option>
                        <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
                        <Select.Option value="PENDING">Chờ duyệt</Select.Option>
                    </Select>
                </Col>
            </Row>
        </Card>
    );
};

export default SearchFilters;
