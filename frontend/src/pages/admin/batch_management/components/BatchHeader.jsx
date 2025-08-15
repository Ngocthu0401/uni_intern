import React from 'react';
import { Button, Card } from 'antd';
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';

const BatchHeader = ({ onCreateBatch }) => {
    return (
        <Card className="shadow-sm border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <CalendarOutlined className="text-2xl text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Đợt thực tập</h1>
                        <p className="text-gray-600 mt-1">Quản lý các đợt thực tập theo học kỳ và năm học</p>
                    </div>
                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onCreateBatch}
                    size="large"
                    className="bg-purple-600 hover:bg-purple-700 border-purple-600 rounded-lg shadow-sm"
                >
                    Tạo Đợt thực tập
                </Button>
            </div>
        </Card>
    );
};

export default BatchHeader;
