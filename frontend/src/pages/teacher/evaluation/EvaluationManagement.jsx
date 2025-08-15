import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button, Typography, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { EvaluationHeader, EvaluationFilters, EvaluationTable, EvaluationModal } from './components';
import {
    evaluationService,
    studentService,
    teacherService,
    internshipService
} from '../../../services';
import { Student, Internship, PaginationOptions } from '../../../models';

const EvaluationManagement = () => {
    const { user } = useAuth();

    // Data state
    const [evaluations, setEvaluations] = useState([]);
    const [students, setStudents] = useState([]);
    const [internships, setInternships] = useState([]);
    const [stats, setStats] = useState({
        totalEvaluations: 0,
        pendingEvaluations: 0,
        completedEvaluations: 0,
        averageScore: 0
    });

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);

    // Filters & pagination
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [semesterFilter, setSemesterFilter] = useState('ALL');
    const [pagination, setPagination] = useState(new PaginationOptions({ size: 10 }));
    const [totalEvaluations, setTotalEvaluations] = useState(0);

    const calculateTotalScore = (scores) => {
        const {
            discipline = 0, knowledge = 0, compliance = 0, communication = 0,
            protection = 0, initiative = 0, jobRequirements = 0, learning = 0,
            creativity = 0
        } = scores || {};
        const total = (
            discipline + knowledge + compliance + communication +
            protection + initiative + jobRequirements + learning +
            creativity
        );
        return total;
    };

    const loadEvaluationData = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            setError('');

            // Resolve teacherId
            let teacherId;
            try {
                const teacherResponse = await teacherService.getTeacherByUserId(user.id);
                teacherId = teacherResponse.id;
            } catch (err) {
                setError('Không tìm thấy thông tin giảng viên. Vui lòng liên hệ quản trị viên.');
                return;
            }

            // Evaluations
            const evaluationsResponse = await evaluationService.getEvaluationsByTeacher(teacherId, {
                keyword: searchKeyword,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                semester: semesterFilter !== 'ALL' ? semesterFilter : undefined,
                page: pagination.page,
                size: pagination.size
            });
            setEvaluations(
                evaluationsResponse.data.map(e => ({
                    ...e,
                    totalScore: e.overallScore || 0,
                    student: e.internship?.student,
                    company: e.internship?.company
                }))
            );
            setTotalEvaluations(evaluationsResponse.total);

            // Students
            const studentsResponse = await studentService.getStudentsByTeacher(teacherId);
            setStudents(studentsResponse.data.map(s => new Student(s)));

            // Internships
            const internshipsResponse = await internshipService.getInternshipsByTeacher(teacherId);
            setInternships(internshipsResponse.map(i => new Internship(i)));

            // Stats
            const statsResponse = await evaluationService.getEvaluationStats(teacherId);
            setStats(statsResponse.data);
        } catch (err) {
            setError('Không thể tải dữ liệu đánh giá. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [user?.id, searchKeyword, statusFilter, semesterFilter, pagination.page, pagination.size]);

    useEffect(() => {
        loadEvaluationData();
    }, [loadEvaluationData]);

    const openModal = (mode, evaluation = null) => {
        setModalMode(mode);
        setSelectedEvaluation(evaluation);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEvaluation(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Typography.Title level={3} className="!mb-0">Quản lý Đánh giá</Typography.Title>
                    <Typography.Text type="secondary">Tạo và quản lý đánh giá cho sinh viên thực tập</Typography.Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('create')}>
                    Tạo đánh giá mới
                </Button>
            </div>

            {error && <Alert type="error" message={error} showIcon />}

            <EvaluationHeader stats={stats} />

            <EvaluationFilters
                keyword={searchKeyword}
                onKeywordChange={setSearchKeyword}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                semester={semesterFilter}
                onSemesterChange={setSemesterFilter}
                onReset={() => { setSearchKeyword(''); setStatusFilter('ALL'); setSemesterFilter('ALL'); }}
            />

            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-3">
                    <Typography.Title level={5} className="!mb-0">Danh sách Đánh giá ({totalEvaluations})</Typography.Title>
                </div>
                <EvaluationTable
                    data={evaluations}
                    loading={loading}
                    pagination={{
                        current: pagination.page + 1,
                        pageSize: pagination.size,
                        total: totalEvaluations,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50, 100]
                    }}
                    onChange={(pager) => {
                        setPagination(new PaginationOptions({
                            page: (pager.current || 1) - 1,
                            size: pager.pageSize || 10,
                            sort: pagination.sort
                        }));
                    }}
                    onView={(record) => openModal('view', record)}
                    onEdit={(record) => openModal('edit', record)}
                />
            </div>

            <EvaluationModal
                open={showModal}
                mode={modalMode}
                onCancel={closeModal}
                onSubmit={async (values) => {
                    try {
                        const teacherResponse = await teacherService.getTeacherByUserId(user.id);
                        const teacherId = teacherResponse.id;
                        const payload = {
                            ...values,
                            teacherId,
                            totalScore: calculateTotalScore(values)
                        };
                        if (modalMode === 'create') {
                            await evaluationService.createEvaluation(payload);
                        } else if (modalMode === 'edit' && selectedEvaluation) {
                            await evaluationService.updateEvaluation(selectedEvaluation.id, payload);
                        }
                        setShowModal(false);
                        setSelectedEvaluation(null);
                        loadEvaluationData();
                    } catch (err) {
                        setError(err.message || 'Có lỗi xảy ra khi lưu đánh giá.');
                    }
                }}
                students={students}
                internships={internships}
                initialValues={modalMode === 'create' ? {
                    studentId: '',
                    internshipId: '',
                    semester: '',
                    academicYear: '',
                    discipline: 0,
                    knowledge: 0,
                    compliance: 0,
                    communication: 0,
                    protection: 0,
                    initiative: 0,
                    jobRequirements: 0,
                    learning: 0,
                    creativity: 0,
                    comments: ''
                } : (selectedEvaluation ? {
                    studentId: selectedEvaluation.internship?.student?.id || '',
                    internshipId: selectedEvaluation.internship?.id || '',
                    semester: '',
                    academicYear: '',
                    discipline: selectedEvaluation.discipline || 0,
                    knowledge: selectedEvaluation.knowledge || 0,
                    compliance: selectedEvaluation.compliance || 0,
                    communication: selectedEvaluation.communication || 0,
                    protection: selectedEvaluation.protection || 0,
                    initiative: selectedEvaluation.initiative || 0,
                    jobRequirements: selectedEvaluation.jobRequirements || 0,
                    learning: selectedEvaluation.learning || 0,
                    creativity: selectedEvaluation.creativity || 0,
                    comments: selectedEvaluation.comments || ''
                } : {})}
                loading={loading}
            />
        </div>
    );
};

export default EvaluationManagement;


