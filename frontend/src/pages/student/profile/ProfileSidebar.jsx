import React from 'react';
import { UserOutlined, MailOutlined, PhoneOutlined, BookOutlined } from '@ant-design/icons';

const ProfileSidebar = ({ student }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
                <div className="mx-auto h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                    <UserOutlined className="text-4xl text-gray-600" />
                </div>
                {student.name && <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>}
                {student.studentCode && <p className="text-gray-600">{student.studentCode}</p>}
                {student.className && <p className="text-gray-600">Lớp: {student.className}</p>}
                {student.major && <p className="text-gray-600">Chuyên ngành: {student.major}</p>}
                {student.academicYear && <p className="text-gray-600">Năm học: {student.academicYear}</p>}
            </div>

            <div className="mt-6 space-y-4 text-gray-600">
                {student.email && (
                    <div className="flex items-center">
                        <MailOutlined className="mr-3" />
                        <span className="text-sm break-all">{student.email}</span>
                    </div>
                )}
                {student.phoneNumber && (
                    <div className="flex items-center">
                        <PhoneOutlined className="mr-3" />
                        <span className="text-sm">{student.phoneNumber}</span>
                    </div>
                )}
                {typeof student.gpa === 'number' && (
                    <div className="flex items-center">
                        <BookOutlined className="mr-3" />
                        <span className="text-sm">GPA: {student.gpa}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSidebar;


