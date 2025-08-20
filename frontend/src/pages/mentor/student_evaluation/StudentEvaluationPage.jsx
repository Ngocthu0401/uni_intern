import React, { useState, useEffect, useCallback } from 'react';
import { Button, Spin, Empty, message, Typography, Space, Alert, Card } from 'antd';
import { PlusOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../../../context/AuthContext';
import { internshipService, evaluationService } from '../../../services';
import mentorService from '../../../services/mentorService';
import { StudentCard, SearchFilters, EvaluationModal, StatisticsCard, StudentDetailModal } from './components';

const { Title, Paragraph } = Typography;

const StudentEvaluationPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [internships, setInternships] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Modal states
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [evaluationModalMode, setEvaluationModalMode] = useState('create');
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [evaluationInitialValues, setEvaluationInitialValues] = useState({});

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');


  const loadStudentsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get mentor information first
      const mentorResponse = await mentorService.getMentorByUserId(user.id);
      const mentorId = mentorResponse.id;

      // Load internships for this mentor
      const internshipsResponse = await internshipService.getInternshipsByMentor(mentorId);
      const internshipsData = internshipsResponse || [];
      setInternships(internshipsData);

      // Load evaluations for this mentor
      const evaluationsResponse = await evaluationService.getEvaluationsByMentor(mentorId);
      const evaluations = evaluationsResponse || [];

      // Transform data to students with evaluation history
      const studentsData = internshipsData.map(internship => {
        const studentEvaluations = evaluations.filter(evaluation =>
          evaluation.internship?.id === internship.id && evaluation.evaluatorType === 'MENTOR'
        );

        // Calculate average score
        const avgScore = studentEvaluations.length > 0
          ? studentEvaluations.reduce((sum, evaluation) => sum + (evaluation.overallScore || 0), 0) / studentEvaluations.length
          : 0;

        return {
          id: internship.student?.id || internship.studentId,
          name: internship.student?.user?.fullName || internship.student?.fullName || 'N/A',
          studentCode: internship.student?.studentCode || 'N/A',
          email: internship.student?.user?.email || 'N/A',
          company: internship.company?.companyName || 'N/A',
          position: internship.jobTitle || 'N/A',
          startDate: internship.startDate,
          endDate: internship.endDate,
          status: internship.status,
          internshipId: internship.id,
          mentorScore: internship.mentorScore,
          mentorComment: internship.mentorComment,
          evaluations: studentEvaluations.map(evaluation => ({
            id: evaluation.id,
            date: evaluation.evaluationDate,
            // New scoring structure
            understandingOrganization: evaluation.understandingOrganization || 0,
            followingRules: evaluation.followingRules || 0,
            workScheduleCompliance: evaluation.workScheduleCompliance || 0,
            communicationAttitude: evaluation.communicationAttitude || 0,
            propertyProtection: evaluation.propertyProtection || 0,
            workEnthusiasm: evaluation.workEnthusiasm || 0,
            jobRequirementsFulfillment: evaluation.jobRequirementsFulfillment || 0,
            learningSpirit: evaluation.learningSpirit || 0,
            initiativeCreativity: evaluation.initiativeCreativity || 0,
            disciplineScore: evaluation.disciplineScore || 0,
            professionalScore: evaluation.professionalScore || 0,
            overallScore: evaluation.overallScore || 0,
            comments: evaluation.comments || '',
            strengths: evaluation.strengths || '',
            weaknesses: evaluation.weaknesses || '',
            recommendations: evaluation.recommendations || '',
            isFinalEvaluation: evaluation.isFinalEvaluation || false
          })).sort((a, b) => new Date(b.date) - new Date(a.date)),
          averageScore: avgScore,
          lastEvaluationDate: studentEvaluations.length > 0
            ? new Date(Math.max(...studentEvaluations.map(e => new Date(e.evaluationDate)))).toLocaleDateString('vi-VN')
            : 'Chưa có đánh giá'
        };
      });

      setStudents(studentsData);
    } catch (err) {
      console.error('Error loading students data:', err);
      setError('Không thể tải dữ liệu sinh viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check if all students have been evaluated
  const checkAllStudentsEvaluated = () => {
    if (students.length === 0) return false;
    return students.every(student => student.evaluations.length > 0);
  };

  const handleCreateEvaluation = async (values) => {
    try {
      setEvaluationLoading(true);

      // Calculate overall score from the form values
      const disciplineFields = [
        'understandingOrganization', 'followingRules', 'workScheduleCompliance',
        'communicationAttitude', 'propertyProtection', 'workEnthusiasm'
      ];
      const professionalFields = [
        'jobRequirementsFulfillment', 'learningSpirit', 'initiativeCreativity'
      ];

      const disciplineScore = disciplineFields.reduce((sum, field) => sum + (values[field] || 0), 0);
      const professionalScore = professionalFields.reduce((sum, field) => sum + (values[field] || 0), 0);
      const totalScore = disciplineScore + professionalScore;

      const evaluationData = {
        internshipId: values.internshipId.toString(),
        teacherId: null, // Mentor evaluation, not teacher
        evaluationDate: new Date().toISOString().split('T')[0], // Current date

        // Part I: Tinh thần kỷ luật, thái độ (6.0 điểm tối đa)
        understandingOrganization: values.understandingOrganization || 0,
        followingRules: values.followingRules || 0,
        workScheduleCompliance: values.workScheduleCompliance || 0,
        communicationAttitude: values.communicationAttitude || 0,
        propertyProtection: values.propertyProtection || 0,
        workEnthusiasm: values.workEnthusiasm || 0,

        // Part II: Khả năng chuyên môn, nghiệp vụ (4.0 điểm tối đa)
        jobRequirementsFulfillment: values.jobRequirementsFulfillment || 0,
        learningSpirit: values.learningSpirit || 0,
        initiativeCreativity: values.initiativeCreativity || 0,

        // Calculated scores
        disciplineScore: disciplineScore,
        professionalScore: professionalScore,
        overallScore: totalScore,

        // Comments and feedback
        strengths: values.comments || '',
        weaknesses: values.comments || '',
        recommendations: values.comments || '',
        comments: values.comments || '',
        isFinalEvaluation: false // Default to false for mentor evaluations
      };

      if (evaluationModalMode === 'edit' && selectedStudent?.evaluations?.length > 0) {
        // Update existing evaluation
        const latestEvaluation = selectedStudent.evaluations[0]; // Get the latest evaluation
        await evaluationService.updateEvaluation(latestEvaluation.id, evaluationData);
        message.success('Cập nhật đánh giá thành công!');
      } else {
        // Create new evaluation
        await evaluationService.createEvaluation(evaluationData);
        message.success('Tạo đánh giá thành công!');
      }

      // Reload data and close modal
      await loadStudentsData();
      setShowEvaluationModal(false);
      setSelectedStudent(null);

    } catch (err) {
      console.error('Error creating/updating evaluation:', err);
      message.error('Không thể tạo/cập nhật đánh giá. Vui lòng thử lại.');
    } finally {
      setEvaluationLoading(false);
    }
  };

  const openEvaluationModal = (student = null) => {
    setSelectedStudent(student);

    // Determine if this is an edit or create operation
    if (student && student.evaluations && student.evaluations.length > 0) {
      setEvaluationModalMode('edit');
      // Load the latest evaluation data as initial values
      const latestEvaluation = student.evaluations[0];

      // Transform evaluation data to match form fields
      const initialValues = {
        studentId: student.id,
        internshipId: student.internshipId,
        understandingOrganization: latestEvaluation.understandingOrganization || 0,
        followingRules: latestEvaluation.followingRules || 0,
        workScheduleCompliance: latestEvaluation.workScheduleCompliance || 0,
        communicationAttitude: latestEvaluation.communicationAttitude || 0,
        propertyProtection: latestEvaluation.propertyProtection || 0,
        workEnthusiasm: latestEvaluation.workEnthusiasm || 0,
        jobRequirementsFulfillment: latestEvaluation.jobRequirementsFulfillment || 0,
        learningSpirit: latestEvaluation.learningSpirit || 0,
        initiativeCreativity: latestEvaluation.initiativeCreativity || 0,
        comments: latestEvaluation.comments || ''
      };

      setEvaluationInitialValues(initialValues);
    } else {
      setEvaluationModalMode('create');
      setEvaluationInitialValues({});
    }

    setShowEvaluationModal(true);
  };

  const openDetailModal = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleEditFromDetail = (student) => {
    setShowDetailModal(false);
    openEvaluationModal(student);
  };


  useEffect(() => {
    if (user?.id) {
      loadStudentsData();
    }
  }, [user, loadStudentsData]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="!min-h-screen !bg-gray-50 !flex !items-center !justify-center">
        <div className="!text-center">
          <Spin size="large" />
          <p className="!mt-4 !text-gray-600">Đang tải dữ liệu sinh viên...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="!min-h-screen !bg-gray-50 !flex !items-center !justify-center">
        <div className="!text-center">
          <ExclamationCircleOutlined className="!text-4xl !text-red-500 !mb-4" />
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" danger onClick={loadStudentsData}>
                Thử lại
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  console.log('students: ', students);

  return (
    <div className="!min-h-screen !bg-gray-50">
      {/* Header */}
      <div className="!bg-white !shadow-sm !border-b">
        <div className="!max-w-7xl !mx-auto !px-4 !sm:px-6 !lg:px-8">
          <Card className="!border-0 !shadow-none">
            <div className="!flex !justify-between !items-center">
              <div>
                <Title level={2} style={{ margin: 0 }}>Đánh Giá Sinh Viên</Title>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                  Quản lý và đánh giá tiến độ học tập của sinh viên thực tập
                </Paragraph>
              </div>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadStudentsData}
                  loading={loading}
                >
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openEvaluationModal()}
                  disabled={checkAllStudentsEvaluated()}
                >
                  Tạo đánh giá mới
                </Button>
              </Space>
            </div>
          </Card>
        </div>
      </div>

      <div className="!max-w-7xl !mx-auto !px-4 !sm:px-6 !lg:px-8 !py-8 !space-y-4">
        {/* Statistics */}
        <StatisticsCard students={students} />

        {/* Alert when all students are evaluated */}
        {checkAllStudentsEvaluated() && students.length > 0 && (
          <Alert
            message="Hoàn thành đánh giá"
            description="Tất cả sinh viên mà bạn hướng dẫn đã được đánh giá. Bạn có thể xem lại hoặc cập nhật đánh giá từ danh sách sinh viên bên dưới."
            type="success"
            showIcon
            closable
          />
        )}

        {/* Search and Filter */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {/* Students List */}
        <div className="!space-y-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onViewDetails={openDetailModal}
                onCreateEvaluation={openEvaluationModal}
              />
            ))
          ) : (
            <Empty
              description="Không tìm thấy sinh viên nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      </div>

      {/* Evaluation Modal */}
      <EvaluationModal
        open={showEvaluationModal}
        mode={evaluationModalMode}
        onCancel={() => {
          setShowEvaluationModal(false);
          setSelectedStudent(null);
          setEvaluationInitialValues({});
        }}
        onSubmit={handleCreateEvaluation}
        students={students}
        internships={internships}
        selectedStudent={selectedStudent}
        initialValues={evaluationInitialValues}
        loading={evaluationLoading}
        allStudentsEvaluated={checkAllStudentsEvaluated()}
      />

      {/* Student Detail Modal */}
      <StudentDetailModal
        open={showDetailModal}
        onCancel={() => {
          setShowDetailModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onEditEvaluation={handleEditFromDetail}
      />
    </div>
  );
};

export default StudentEvaluationPage;