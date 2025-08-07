import React, { useState } from 'react';
import {
    Row,
    Col,
    Input,
    Select,
    Button,
    Space,
    Collapse,
    DatePicker
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
    ReloadOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const InternshipFilters = ({ filters, onFilterChange }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const statusOptions = [
        { value: 'PENDING', label: 'Chờ phê duyệt' },
        { value: 'APPROVED', label: 'Đã phê duyệt' },
        { value: 'REJECTED', label: 'Bị từ chối' },
        { value: 'ASSIGNED', label: 'Đã phân công' },
        { value: 'IN_PROGRESS', label: 'Đang thực tập' },
        { value: 'COMPLETED', label: 'Hoàn thành' },
        { value: 'CANCELLED', label: 'Hủy bỏ' }
    ];

    const typeOptions = [
        { value: 'FULL_TIME', label: 'Toàn thời gian' },
        { value: 'PART_TIME', label: 'Bán thời gian' },
        { value: 'REMOTE', label: 'Từ xa' },
        { value: 'HYBRID', label: 'Kết hợp' }
    ];

    const handleFilterChange = (field, value) => {
        const newFilters = { ...localFilters, [field]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleApplyFilters = () => {
        onFilterChange(localFilters);
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
        setLocalFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const handleSearch = (value) => {
        const newFilters = { ...localFilters, keyword: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div>
            {/* Basic Filters */}
            <Row gutter={16} align="middle">
                <Col xs={24} md={8}>
                    <Search
                        placeholder="Tìm kiếm theo tiêu đề, công ty, sinh viên..."
                        value={localFilters.keyword}
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
                        value={localFilters.status}
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
                    <Select
                        placeholder="Loại thực tập"
                        value={localFilters.type}
                        onChange={(value) => handleFilterChange('type', value)}
                        allowClear
                        style={{ width: '100%' }}
                        size="middle"
                    >
                        {typeOptions.map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} md={4}>
                    <Input
                        placeholder="Tên công ty"
                        value={localFilters.companyName}
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
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            size="middle"
                        >
                            {showAdvanced ? 'Thu gọn' : 'Mở rộng'}
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <Row gutter={16}>
                        <Col xs={24} md={6}>
                            <div className="mb-2 text-sm font-medium text-gray-700">
                                Đợt thực tập
                            </div>
                            <Input
                                placeholder="ID đợt thực tập"
                                value={localFilters.batchId}
                                onChange={(e) => handleFilterChange('batchId', e.target.value)}
                                allowClear
                                size="middle"
                            />
                        </Col>

                        <Col xs={24} md={6}>
                            <div className="mb-2 text-sm font-medium text-gray-700">
                                Khoảng thời gian
                            </div>
                            <RangePicker
                                value={localFilters.dateRange}
                                onChange={(dates) => handleFilterChange('dateRange', dates)}
                                format="DD/MM/YYYY"
                                placeholder={['Từ ngày', 'Đến ngày']}
                                style={{ width: '100%' }}
                                size="middle"
                            />
                        </Col>

                        <Col xs={24} md={6}>
                            <div className="mb-2 text-sm font-medium text-gray-700">
                                Mức lương tối thiểu
                            </div>
                            <Input
                                placeholder="VND/tháng"
                                value={localFilters.minSalary}
                                onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                                type="number"
                                size="middle"
                            />
                        </Col>

                        <Col xs={24} md={6}>
                            <div className="mb-2 text-sm font-medium text-gray-700">
                                Mức lương tối đa
                            </div>
                            <Input
                                placeholder="VND/tháng"
                                value={localFilters.maxSalary}
                                onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                                type="number"
                                size="middle"
                            />
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default InternshipFilters;
