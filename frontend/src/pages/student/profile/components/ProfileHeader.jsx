import React from 'react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const ProfileHeader = ({ name, onEdit }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
                <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
                    Chỉnh sửa
                </Button>
            </div>
        </div>
    );
};

export default ProfileHeader;


