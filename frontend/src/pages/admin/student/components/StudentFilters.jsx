import { useState } from 'react';
import { Card, Row, Col, Input, Select, Button, Space, Tag, Typography, Form, DatePicker, InputNumber, Divider } from 'antd';
import { SearchOutlined, ClearOutlined, FilterOutlined, UserOutlined, BookOutlined, CalendarOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const StudentFilters = ({ searchCriteria, onSearchChange, onFilterChange, onClearFilters, loading = false }) => {
    const [form] = Form.useForm();
    const [expanded, setExpanded] = useState(false);

    const handleFormChange = (changedValues) => {
        // Handle search keyword
        if (changedValues.keyword !== undefined) {
            onSearchChange(changedValues.keyword);
        }

        // Handle other filters
        Object.keys(changedValues).forEach(key => {
            if (key !== 'keyword') {
                onFilterChange(key, changedValues[key]);
            }
        });
    };

    const handleClear = () => {
        form.resetFields();
        onClearFilters();
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (searchCriteria.keyword) count++;
        if (searchCriteria.className) count++;
        if (searchCriteria.major) count++;
        if (searchCriteria.academicYear) count++;
        if (searchCriteria.minGpa) count++;
        if (searchCriteria.maxGpa) count++;
        return count;
    };

    const activeFiltersCount = getActiveFiltersCount();

    const renderActiveFilters = () => {
        const filters = [];

        if (searchCriteria.keyword) {
            filters.push(
                <Tag
                    key="keyword"
                    closable
                    color="blue"
                    onClose={() => {
                        form.setFieldValue('keyword', '');
                        onSearchChange('');
                    }}
                >
                    <SearchOutlined className="mr-1" />
                    "{searchCriteria.keyword}"
                </Tag>
            );
        }

        if (searchCriteria.className) {
            filters.push(
                <Tag
                    key="className"
                    closable
                    color="green"
                    onClose={() => {
                        form.setFieldValue('className', '');
                        onFilterChange('className', '');
                    }}
                >
                    <UserOutlined className="mr-1" />
                    Lớp: {searchCriteria.className}
                </Tag>
            );
        }

        if (searchCriteria.major) {
            filters.push(
                <Tag
                    key="major"
                    closable
                    color="purple"
                    onClose={() => {
                        form.setFieldValue('major', '');
                        onFilterChange('major', '');
                    }}
                >
                    <BookOutlined className="mr-1" />
                    Ngành: {searchCriteria.major}
                </Tag>
            );
        }

        if (searchCriteria.academicYear) {
            filters.push(
                <Tag
                    key="academicYear"
                    closable
                    color="orange"
                    onClose={() => {
                        form.setFieldValue('academicYear', '');
                        onFilterChange('academicYear', '');
                    }}
                >
                    <CalendarOutlined className="mr-1" />
                    Năm học: {searchCriteria.academicYear}
                </Tag>
            );
        }

        if (searchCriteria.minGpa || searchCriteria.maxGpa) {
            const gpaText = searchCriteria.minGpa && searchCriteria.maxGpa
                ? `${searchCriteria.minGpa} - ${searchCriteria.maxGpa}`
                : searchCriteria.minGpa
                    ? `≥ ${searchCriteria.minGpa}`
                    : `≤ ${searchCriteria.maxGpa}`;

            filters.push(
                <Tag
                    key="gpa"
                    closable
                    color="gold"
                    onClose={() => {
                        form.setFieldsValue({ minGpa: undefined, maxGpa: undefined });
                        onFilterChange('minGpa', undefined);
                        onFilterChange('maxGpa', undefined);
                    }}
                >
                    <TrophyOutlined className="mr-1" />
                    GPA: {gpaText}
                </Tag>
            );
        }

        return filters;
    };

    return (
        <Card className="shadow-lg fade-in">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FilterOutlined className="text-blue-500" />
                        <Title level={4} className="m-0">
                            Tìm kiếm & Lọc
                        </Title>
                        {activeFiltersCount > 0 && (
                            <Tag color="blue" className="rounded-full">
                                {activeFiltersCount} bộ lọc
                            </Tag>
                        )}
                    </div>
                    <Space>
                        <Button
                            color="primary" variant="solid"
                            onClick={() => setExpanded(!expanded)}
                        // className="text-blue-600"
                        >
                            {expanded ? 'Thu gọn' : 'Mở rộng'}
                        </Button>
                        {activeFiltersCount > 0 && (
                            <Button
                                type="text"
                                danger
                                icon={<ClearOutlined />}
                                onClick={handleClear}
                                loading={loading}
                            >
                                Xóa bộ lọc
                            </Button>
                        )}
                    </Space>
                </div>

                {/* Search Form */}
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleFormChange}
                    initialValues={searchCriteria}
                >
                    {/* Quick Search */}
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item name="keyword" className="mb-0">
                                <Input
                                    placeholder="Tìm kiếm theo tên, mã sinh viên, email..."
                                    prefix={<SearchOutlined className="text-gray-400" />}
                                    size="large"
                                    allowClear
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Advanced Filters */}
                    {expanded && (
                        <>
                            <Divider orientation="left" orientationMargin="0">
                                <Text type="secondary">Bộ lọc nâng cao</Text>
                            </Divider>

                            <Row gutter={[16, 16]}>
                                {/* Class Filter */}
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item label="Lớp" name="className">
                                        <Select
                                            placeholder="Tất cả lớp"
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            className="w-full"
                                        >
                                            <Option value="CNTT-K19">CNTT-K19</Option>
                                            <Option value="CNTT-K20">CNTT-K20</Option>
                                            <Option value="CNTT-K21">CNTT-K21</Option>
                                            <Option value="CNTT-K22">CNTT-K22</Option>
                                            <Option value="KTHD-K19">KTHD-K19</Option>
                                            <Option value="KTHD-K20">KTHD-K20</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                {/* Major Filter */}
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item label="Ngành học" name="major">
                                        <Select
                                            placeholder="Tất cả ngành"
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            className="w-full"
                                        >
                                            <Option value="Công nghệ Thông tin">Công nghệ Thông tin</Option>
                                            <Option value="Kỹ thuật Phần mềm">Kỹ thuật Phần mềm</Option>
                                            <Option value="Khoa học Máy tính">Khoa học Máy tính</Option>
                                            <Option value="Hệ thống Thông tin">Hệ thống Thông tin</Option>
                                            <Option value="An toàn Thông tin">An toàn Thông tin</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                {/* Academic Year Filter */}
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item label="Năm học" name="academicYear">
                                        <Select
                                            placeholder="Tất cả năm học"
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            className="w-full"
                                        >
                                            <Option value="2021-2022">2021-2022</Option>
                                            <Option value="2022-2023">2022-2023</Option>
                                            <Option value="2023-2024">2023-2024</Option>
                                            <Option value="2024-2025">2024-2025</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                {/* GPA Range Filter */}
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item label="Khoảng GPA">
                                        <Input.Group compact>
                                            <Form.Item name="minGpa" noStyle>
                                                <InputNumber
                                                    placeholder="Từ"
                                                    min={0}
                                                    max={4}
                                                    step={0.1}
                                                    precision={1}
                                                    className="w-1/2"
                                                />
                                            </Form.Item>
                                            <Form.Item name="maxGpa" noStyle>
                                                <InputNumber
                                                    placeholder="Đến"
                                                    min={0}
                                                    max={4}
                                                    step={0.1}
                                                    precision={1}
                                                    className="w-1/2"
                                                />
                                            </Form.Item>
                                        </Input.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}
                </Form>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                    <>
                        <Divider orientation="left" orientationMargin="0">
                            <Text type="secondary">Bộ lọc đang áp dụng</Text>
                        </Divider>
                        <div className="flex flex-wrap gap-2">
                            {renderActiveFilters()}
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};

export default StudentFilters;