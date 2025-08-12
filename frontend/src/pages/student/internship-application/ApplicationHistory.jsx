import React from 'react';
import { Card, Tag } from 'antd';

const statusColor = (status) => {
    switch (status) {
        case 'PENDING':
            return 'gold';
        case 'APPROVED':
        case 'ASSIGNED':
            return 'green';
        case 'IN_PROGRESS':
            return 'blue';
        case 'COMPLETED':
            return 'purple';
        case 'REJECTED':
        case 'CANCELLED':
            return 'red';
        default:
            return 'default';
    }
};

const ApplicationHistory = ({ applications }) => {
    return (
        <Card title="Đơn ứng tuyển của tôi" bordered>
            <div className="space-y-3">
                {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900 text-sm">{app.internshipTitle}</div>
                            <div className="text-gray-600 text-xs">{app.company}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Tag color={statusColor((app.status || '').toUpperCase())}>{app.statusText}</Tag>
                            <div className="text-xs text-gray-500">{app.appliedDate}</div>
                        </div>
                    </div>
                ))}
                {applications.length === 0 && (
                    <div className="text-gray-500 text-sm">Chưa có đơn ứng tuyển</div>
                )}
            </div>
        </Card>
    );
};

export default ApplicationHistory;


