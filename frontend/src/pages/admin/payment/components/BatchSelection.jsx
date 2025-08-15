import React from 'react';
import { Card, Row, Col, Select, Typography } from 'antd';

const { Text } = Typography;
const { Option } = Select;

/**
 * BatchSelection component
 * @param {Object} props
 * @param {Array} props.batches - List of available batches
 * @param {string|null} props.selectedBatch - Currently selected batch ID
 * @param {number} props.unitPrice - Unit price per student
 * @param {Function} props.onBatchChange - Function to handle batch selection change
 * @param {Function} props.onUnitPriceChange - Function to handle unit price change
 * @param {boolean} [props.loading=false] - Loading state
 */
const BatchSelection = ({
    batches,
    selectedBatch,
    unitPrice,
    onBatchChange,
    onUnitPriceChange,
    loading = false
}) => {
    return (
        <Card className="mb-6">
            <Row gutter={16} align="middle">
                <Col span={8}>
                    <Text strong>Chọn đợt thực tập:</Text>
                </Col>
                <Col span={8}>
                    <Select
                        placeholder="Chọn đợt thực tập"
                        value={selectedBatch}
                        onChange={onBatchChange}
                        style={{ width: '100%' }}
                        loading={loading}
                    >
                        {batches.map((batch) => (
                            <Option key={batch.id} value={batch.id}>
                                {batch.batchName} - {batch.academicYear} (Học kỳ {batch.semester})
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={8}>
                    <div className="flex items-center">
                        <Text strong className="mr-2">Đơn giá:</Text>
                        <Select
                            value={unitPrice}
                            onChange={onUnitPriceChange}
                            style={{ width: 120 }}
                        >
                            <Option value={300000}>300,000 VNĐ</Option>
                            <Option value={400000}>400,000 VNĐ</Option>
                            <Option value={500000}>500,000 VNĐ</Option>
                            <Option value={600000}>600,000 VNĐ</Option>
                            <Option value={700000}>700,000 VNĐ</Option>
                        </Select>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default BatchSelection;
