import React from 'react';
import { Card, Button, Tag, Space } from 'antd';
import { BuildingOffice2Icon, MapPinIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const InternshipList = ({ internships, canApply, onApply }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {internships.map((i) => (
                <Card key={i.id} className="hover:shadow" bordered>
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-lg font-semibold text-gray-900">{i.title}</div>
                            <div className="mt-1 flex items-center gap-3 text-gray-600 text-sm">
                                <span className="flex items-center gap-1"><BuildingOffice2Icon className="h-4 w-4" />{i.company}</span>
                                <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4" />{i.location}</span>
                                <span className="flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4" />{i.duration}</span>
                            </div>
                            <div className="mt-2 text-gray-700 text-sm line-clamp-3">{i.description}</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {i.requirements?.slice(0, 6).map((req, idx) => (
                                    <Tag key={idx} color="blue">{req}</Tag>
                                ))}
                            </div>
                        </div>
                        <Space>
                            {i.applied && <Tag color="green">Đã ứng tuyển</Tag>}
                            {!i.isOpen && <Tag color="default">Không mở</Tag>}
                            {i.hasStudent && <Tag color="purple">Đã có sinh viên</Tag>}
                            {canApply && i.isOpen && !i.applied && (
                                <Button type="primary" onClick={() => onApply(i)}>Ứng tuyển</Button>
                            )}
                        </Space>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default InternshipList;


