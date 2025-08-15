import React from 'react';
import { Input, Select, Card, Button, Space, Collapse } from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
    CalendarOutlined,
    BookOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { BatchStatus, Semester, Batch } from '../../../../models';

const { Search } = Input;
const { Panel } = Collapse;

const BatchSearchFilters = ({
    searchCriteria,
    onSearchChange,
    onFilterChange,
    onClearFilters,
    showFilters,
    onToggleFilters
}) => {
    const statusOptions = Object.values(BatchStatus).map(status => ({
        value: status,
        label: new Batch({ status }).getStatusLabel()
    }));

    const semesterOptions = Object.values(Semester).map(semester => ({
        value: semester,
        label: new Batch({ semester }).getSemesterLabel()
    }));

    const registrationStatusOptions = [
        { value: 'true', label: 'Đang mở đăng ký' },
        { value: 'false', label: 'Đã đóng đăng ký' }
    ];

    const handleSearch = (value) => {
        onSearchChange(value);
    };

    const handleFilterChange = (field, value) => {
        onFilterChange(field, value);
    };

    const handleClearFilters = () => {
        onClearFilters();
    };

    return (
        <Card className="shadow-sm border-gray-200">
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <Search
                            placeholder="Tìm kiếm theo tên, năm học..."
                            value={searchCriteria.keyword}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onSearch={handleSearch}
                            size="large"
                            className="rounded-lg"
                            prefix={<SearchOutlined className="text-gray-400" />}
                        />
                    </div>
                    <Button
                        type={showFilters ? "primary" : "default"}
                        icon={<FilterOutlined />}
                        onClick={onToggleFilters}
                        size="large"
                        className="rounded-lg"
                    >
                        Bộ lọc
                    </Button>
                </div>

                {/* Advanced Filters */}
                <Collapse
                    activeKey={showFilters ? ['filters'] : []}
                    onChange={(keys) => onToggleFilters()}
                    ghost
                    className="bg-gray-50 rounded-lg"
                >
                    <Panel
                        header={
                            <div className="flex items-center space-x-2">
                                <FilterOutlined className="text-purple-600" />
                                <span className="font-medium">Bộ lọc nâng cao</span>
                            </div>
                        }
                        key="filters"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <CheckCircleOutlined className="mr-1 text-gray-400" />
                                    Trạng thái
                                </label>
                                <Select
                                    placeholder="Tất cả trạng thái"
                                    value={searchCriteria.status || undefined}
                                    onChange={(value) => handleFilterChange('status', value)}
                                    options={statusOptions}
                                    allowClear
                                    className="w-full rounded-lg"
                                    size="large"
                                />
                            </div>

                            {/* Semester Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <BookOutlined className="mr-1 text-gray-400" />
                                    Học kỳ
                                </label>
                                <Select
                                    placeholder="Tất cả học kỳ"
                                    value={searchCriteria.semester || undefined}
                                    onChange={(value) => handleFilterChange('semester', value)}
                                    options={semesterOptions}
                                    allowClear
                                    className="w-full rounded-lg"
                                    size="large"
                                />
                            </div>

                            {/* Academic Year Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <CalendarOutlined className="mr-1 text-gray-400" />
                                    Năm học
                                </label>
                                <Input
                                    placeholder="VD: 2023-2024"
                                    value={searchCriteria.academicYear || ''}
                                    onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                                    className="rounded-lg"
                                    size="large"
                                />
                            </div>

                            {/* Registration Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <CheckCircleOutlined className="mr-1 text-gray-400" />
                                    Trạng thái đăng ký
                                </label>
                                <Select
                                    placeholder="Tất cả"
                                    value={searchCriteria.registrationOpen !== null ? searchCriteria.registrationOpen.toString() : undefined}
                                    onChange={(value) => handleFilterChange('registrationOpen', value === 'true' ? true : value === 'false' ? false : null)}
                                    options={registrationStatusOptions}
                                    allowClear
                                    className="w-full rounded-lg"
                                    size="large"
                                />
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleClearFilters}
                                className="rounded-lg"
                            >
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </Card>
    );
};

export default BatchSearchFilters;
