import React from 'react';
import { Card, Descriptions } from 'antd';

const Section = ({ title, items }) => {
    const filtered = items.filter(i => i.value !== undefined && i.value !== null && i.value !== '');
    if (filtered.length === 0) return null;
    return (
        <Card bordered className="mb-6">
            <Descriptions title={title} column={{ xs: 1, sm: 1, md: 2 }} bordered size="small">
                {filtered.map((item) => (
                    <Descriptions.Item key={item.key} label={item.label} span={item.span || 1}>
                        {item.value}
                    </Descriptions.Item>
                ))}
            </Descriptions>
        </Card>
    );
};

const ProfileInfoCards = ({ data }) => {
    const personalItems = [
        { key: 'fullName', label: 'Họ và tên', value: data.name },
        { key: 'email', label: 'Email', value: data.email },
        { key: 'phoneNumber', label: 'Số điện thoại', value: data.phoneNumber },
    ];

    const studentItems = [
        { key: 'studentCode', label: 'Mã sinh viên', value: data.studentCode },
        { key: 'className', label: 'Lớp', value: data.className },
        { key: 'major', label: 'Chuyên ngành', value: data.major },
        { key: 'academicYear', label: 'Năm học', value: data.academicYear },
        { key: 'gpa', label: 'GPA', value: typeof data.gpa === 'number' ? data.gpa : undefined },
        { key: 'status', label: 'Trạng thái', value: data.status },
    ];

    return (
        <div>
            <Section title="Thông tin cá nhân" items={personalItems} />
            <Section title="Thông tin sinh viên" items={studentItems} />
        </div>
    );
};

export default ProfileInfoCards;


