import React from 'react';
import { Row, Col, Input, Select, Button, Space } from 'antd';
import { FunnelPlotOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const EvaluationFilters = ({
    keyword,
    onKeywordChange,
    status,
    onStatusChange,
    semester,
    onSemesterChange,
    onReset,
}) => {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <Row align="middle" justify="space-between" gutter={[12, 12]}>
                <Col flex="auto">
                    <Space wrap>
                        <Input
                            allowClear
                            size="middle"
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm sinh viên, đánh giá..."
                            value={keyword}
                            onChange={(e) => onKeywordChange(e.target.value)}
                            style={{ width: 300 }}
                        />
                        <Button icon={<FunnelPlotOutlined />} onClick={onReset}>
                            Xóa bộ lọc
                        </Button>
                    </Space>
                </Col>
                <Col>
                    <Space wrap>
                        <Select
                            value={status}
                            onChange={onStatusChange}
                            style={{ width: 180 }}
                        >
                            <Option value="ALL">Tất cả trạng thái</Option>
                            <Option value="DRAFT">Bản nháp</Option>
                            <Option value="COMPLETED">Hoàn thành</Option>
                            <Option value="APPROVED">Đã phê duyệt</Option>
                        </Select>
                        <Select
                            value={semester}
                            onChange={onSemesterChange}
                            style={{ width: 160 }}
                        >
                            <Option value="ALL">Tất cả học kỳ</Option>
                            <Option value="1">Học kỳ 1</Option>
                            <Option value="2">Học kỳ 2</Option>
                            <Option value="3">Học kỳ 3</Option>
                        </Select>
                        <Button icon={<ReloadOutlined />} onClick={onReset}>
                            Đặt lại
                        </Button>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default EvaluationFilters;


