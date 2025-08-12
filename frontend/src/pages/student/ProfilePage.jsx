import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { studentService, apiHelpers } from '../../services';
import { useAuth } from '../../context/AuthContext';
import ProfileHeaderAnt from './profile/ProfileHeaderAnt';
import ProfileInfoCards from './profile/ProfileInfoCards';
import EditProfileModal from './profile/EditProfileModal';
import { message } from 'antd';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user?.id) {
      loadStudentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // user table fields
        name: response.user?.fullName || undefined,
        email: response.user?.email || undefined,
        phoneNumber: response.user?.phoneNumber || undefined,
        // student table fields
        studentCode: response.studentCode || undefined,
        className: response.className || undefined,
        major: response.major || undefined,
        academicYear: response.academicYear || undefined,
        gpa: typeof response.gpa === 'number' ? response.gpa : undefined,
        status: response.status || undefined,
      };
      setStudentData(processedData);
    } catch (err) {
      console.error('Error loading student data:', err);
      setError(apiHelpers.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => setIsEditOpen(true);
  const handleCloseEdit = () => setIsEditOpen(false);

  const handleSubmitEdit = async (values) => {
    if (!studentData?.id) return;
    try {
      // Only send fields supported by BE Student entity
      const payload = {
        studentCode: studentData.studentCode, // keep existing code
        className: values.className || '',
        major: values.major || '',
        academicYear: values.academicYear || '',
        gpa: typeof values.gpa === 'number' ? values.gpa : null,
      };
      await studentService.updateStudent(studentData.id, payload);
      message.success('Cập nhật thông tin thành công');
      setStudentData(prev => ({
        ...prev,
        className: payload.className,
        major: payload.major,
        academicYear: payload.academicYear,
        gpa: payload.gpa,
      }));
      setIsEditOpen(false);
    } catch (err) {
      console.error('Error updating student data:', err);
      message.error(apiHelpers.formatErrorMessage(err));
    }
  };

  if (authLoading || loading) {
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
          <button onClick={loadStudentData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Thử lại</button>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeaderAnt
          name={studentData.name}
          studentCode={studentData.studentCode}
          status={studentData.status}
          onEdit={handleOpenEdit}
        />
        <ProfileInfoCards data={studentData} />
      </div>

      <EditProfileModal
        open={isEditOpen}
        onCancel={handleCloseEdit}
        onSubmit={handleSubmitEdit}
        initialValues={studentData}
      />
    </div>
  );
};

export default ProfilePage;