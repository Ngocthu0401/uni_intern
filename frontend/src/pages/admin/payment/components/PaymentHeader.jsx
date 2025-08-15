import React from 'react';
import { Button, Typography } from 'antd';
import { DollarOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * PaymentHeader component
 * @param {Object} props
 * @param {Function} props.onReload - Function to reload data
 * @param {boolean} [props.loading=false] - Loading state
 */
const PaymentHeader = ({ onReload, loading = false }) => {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center">
                <div>
                    <Title level={2} className="!mb-2">
                        <DollarOutlined className="text-blue-500 mr-3" />
                        Quản lý Thanh toán
                    </Title>
                    <Text type="secondary">
                        Quản lý thanh toán hỗ trợ thực tập cho sinh viên theo đợt
                    </Text>
                </div>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={onReload}
                    loading={loading}
                >
                    Tải lại
                </Button>
            </div>
        </div>
    );
};

export default PaymentHeader;
