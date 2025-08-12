import React from 'react';

const ProfileSkillsCard = ({ student }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng & Sở thích</h3>
            <div className="space-y-4">
                {student.skills && student.skills.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                        <div className="flex flex-wrap gap-2">
                            {student.skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}
                {student.interests && student.interests.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sở thích</label>
                        <div className="flex flex-wrap gap-2">
                            {student.interests.map((interest, idx) => (
                                <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{interest}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSkillsCard;


