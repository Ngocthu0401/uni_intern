import React from 'react';
import { Card, Avatar, Tag, Button, Space } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';

const statusColor = (status) => {
    switch (status) {
        case 'ACTIVE':
            return 'green';
        case 'INACTIVE':
            return 'default';
        case 'GRADUATED':
            return 'blue';
        case 'SUSPENDED':
            return 'red';
        default:
            return 'default';
    }
};

const ProfileHeaderAnt = ({ name, studentCode, role = 'STUDENT', status, avatarUrl, onEdit }) => {
    return (
        <Card className="mb-6" bordered>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar size={72} src={avatarUrl} icon={<UserOutlined />} />
                    <div>
                        {name && <div className="text-2xl font-semibold text-gray-900">{name}</div>}
                        <div className="mt-1 flex items-center gap-2">
                            {studentCode && <Tag color="geekblue">{studentCode}</Tag>}
                            {role && <Tag color="gold">{role}</Tag>}
                            {status && <Tag color={statusColor(status)}>{status}</Tag>}
                        </div>
                    </div>
                </div>
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
                        Chỉnh sửa
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default ProfileHeaderAnt;


