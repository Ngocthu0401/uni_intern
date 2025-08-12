import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

const ApplyModal = ({ open, onCancel, onSubmit, internship }) => {
    const handleOk = async () => {
        onSubmit();
    };

    const items = [
        internship?.title && { key: 'title', label: 'Vị trí', children: internship.title },
        internship?.company && { key: 'company', label: 'Công ty', children: internship.company },
        internship?.location && { key: 'location', label: 'Địa điểm', children: internship.location },
        internship?.startDate && { key: 'startDate', label: 'Ngày bắt đầu', children: internship.startDate },
        internship?.endDate && { key: 'endDate', label: 'Ngày kết thúc', children: internship.endDate },
        (typeof internship?.workingHoursPerWeek === 'number') && { key: 'hours', label: 'Giờ/tuần', children: `${internship.workingHoursPerWeek} giờ` },
        (typeof internship?.salary === 'string') && { key: 'salary', label: 'Lương', children: internship.salary },
    ].filter(Boolean);

    return (
        <Modal
            title={`Xác nhận ứng tuyển`}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Xác nhận ứng tuyển"
            cancelText="Hủy"
            destroyOnClose
        >
            <Descriptions column={1} bordered size="small" items={items} />

            {internship?.jobDescription && (
                <div className="mt-4">
                    <div className="font-medium text-gray-900 mb-1">Mô tả công việc</div>
                    <div className="text-gray-700 text-sm whitespace-pre-line">{internship.jobDescription}</div>
                </div>
            )}

            {internship?.requirements && internship.requirements.length > 0 && (
                <div className="mt-4">
                    <div className="font-medium text-gray-900 mb-1">Yêu cầu</div>
                    <div className="flex flex-wrap gap-2">
                        {internship.requirements.map((r, idx) => (
                            <Tag key={idx} color="blue">{r}</Tag>
                        ))}
                    </div>
                </div>
            )}

            {internship?.benefits && internship.benefits.length > 0 && (
                <div className="mt-4">
                    <div className="font-medium text-gray-900 mb-1">Quyền lợi</div>
                    <div className="flex flex-wrap gap-2">
                        {internship.benefits.map((b, idx) => (
                            <Tag key={idx} color="green">{b}</Tag>
                        ))}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ApplyModal;


