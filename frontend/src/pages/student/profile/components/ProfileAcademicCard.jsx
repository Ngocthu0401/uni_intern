import React from 'react';

const ProfileAcademicCard = ({ student }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin học tập</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {typeof student.gpa === 'number' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                        <p className="text-gray-900">{student.gpa}</p>
                    </div>
                )}
                {student.className && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                        <p className="text-gray-900">{student.className}</p>
                    </div>
                )}
                {student.academicYear && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Năm học</label>
                        <p className="text-gray-900">{student.academicYear}</p>
                    </div>
                )}
                {student.major && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
                        <p className="text-gray-900">{student.major}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileAcademicCard;


