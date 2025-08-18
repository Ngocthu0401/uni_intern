import React from 'react';
import { Button, Typography } from 'antd';
import { DollarOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PaymentHeader = ({ onReload, loading = false }) => {
    return (
        <div className="!mb-8">
            <div className="!flex !justify-between !items-center">
                <div>
                    <Title level={2} className="!mb-2">
                        <DollarOutlined className="!text-blue-500 !mr-3" />
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
                    variant="outlined"
                    color="primary"
                >
                    Tải lại
                </Button>
            </div>
        </div>
    );
};

export default PaymentHeader;
