import React, { useState, useEffect } from 'react';
import { PencilIcon, UserIcon, AcademicCapIcon, BriefcaseIcon, HeartIcon, DocumentTextIcon, ExclamationTriangleIcon, EnvelopeIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { studentService, apiHelpers } from '../../services';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [editData, setEditData] = useState({});
  
  const { user, loading: authLoading } = useAuth();

  // Load student data from API
  useEffect(() => {
    if (!authLoading && user?.id) {
      loadStudentData();
    }
  }, [authLoading, user?.id]);

  const loadStudentData = async () => {
    if (!user?.id) {
      setError('Không thể lấy thông tin người dùng');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await studentService.getStudentByUserId(user.id);
      const processedData = {
        id: response.id,
        name: response.user?.fullName || response.fullName || response.name,
        email: response.user?.email || response.email,
        phone: response.user?.phoneNumber || response.phone || '',
        studentId: response.studentCode,
        major: response.major || '',
        year: response.academicYear || response.year || '',
        gpa: response.gpa || 0,
        avatar: response.avatar || null,
        skills: response.skills ? response.skills.split(',').map(s => s.trim()) : [],
        interests: response.interests ? response.interests.split(',').map(i => i.trim()) : [],
        bio: response.bio || ''
      };
      
      setStudentData(processedData);
      setEditData(processedData);

    } catch (err) {
      console.error('Error loading student data:', err);
      setError(apiHelpers.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setEditData({ ...studentData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        // IMPORTANT: Include studentCode to prevent it from becoming null
        studentCode: studentData.studentId,
        // Student fields only - user fields handled separately
        major: editData.major,
        academicYear: editData.year,
        gpa: editData.gpa,
        skills: editData.skills.join(', '),
        interests: editData.interests.join(', '),
        bio: editData.bio
      };

      await studentService.updateStudent(studentData.id, updateData);
      setStudentData({ ...editData });
      setIsEditing(false);
      setEditingSection(null);
      
    } catch (err) {
      console.error('Error updating student data:', err);
      setError(apiHelpers.formatErrorMessage(err));
    }
  };

  const handleCancel = () => {
    setEditData({ ...studentData });
    setIsEditing(false);
    setEditingSection(null);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setEditData(prev => ({ ...prev, [field]: array }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadStudentData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin sinh viên</p>
        </div>
      </div>
    );
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="mx-auto h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="h-16 w-16 text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{studentData.name}</h2>
                <p className="text-gray-600">{studentData.studentId}</p>
                <p className="text-gray-600">{studentData.major}</p>
                <p className="text-gray-600">{studentData.year}</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="h-5 w-5 mr-3" />
                  <span className="text-sm">{studentData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-5 w-5 mr-3" />
                  <span className="text-sm">{studentData.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <AcademicCapIcon className="h-5 w-5 mr-3" />
                  <span className="text-sm">GPA: {studentData.gpa || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{studentData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã sinh viên</label>
                  <p className="text-gray-900">{studentData.studentId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{studentData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{studentData.phone || 'Chưa cập nhật'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.major}
                      onChange={(e) => handleInputChange('major', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{studentData.major || 'Chưa cập nhật'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Năm học</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{studentData.year || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin học tập</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={editData.gpa}
                      onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{studentData.gpa || 'Chưa cập nhật'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu bản thân</label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Viết vài dòng giới thiệu về bản thân..."
                    />
                  ) : (
                    <p className="text-gray-900">{studentData.bio || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng & Sở thích</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.skills.join(', ')}
                      onChange={(e) => handleArrayInputChange('skills', e.target.value)}
                      placeholder="Nhập kỹ năng, cách nhau bởi dấu phẩy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {studentData.skills && studentData.skills.length > 0 ? studentData.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      )) : (
                        <p className="text-gray-500 text-sm">Chưa cập nhật kỹ năng</p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sở thích</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.interests.join(', ')}
                      onChange={(e) => handleArrayInputChange('interests', e.target.value)}
                      placeholder="Nhập sở thích, cách nhau bởi dấu phẩy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {studentData.interests && studentData.interests.length > 0 ? studentData.interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {interest}
                        </span>
                      )) : (
                        <p className="text-gray-500 text-sm">Chưa cập nhật sở thích</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;