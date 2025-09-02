import { useState, useEffect, useMemo } from 'react';
import { mentorService } from '../../../services';
import {
    Mentor,
    CreateMentorRequest,
    MentorSearchCriteria,
    PaginationOptions,
    ExpertiseLevel,
} from '../../../models';
import companyService from '../../../services/companyService';
import MentorHeader from './components/MentorHeader';
import MentorFilters from './components/MentorFilters';
import MentorTable from './components/MentorTable';
import MentorModal from './components/MentorModal';

const MentorManagement = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit', 'delete'
    const [showFilters, setShowFilters] = useState(false);

    // Search and filtering
    const [searchCriteria, setSearchCriteria] = useState(() => ({ ...new MentorSearchCriteria(), keyword: '' }));
    const [pagination, setPagination] = useState(() => ({ ...new PaginationOptions(), page: 1, size: 10 }));
    const [totalMentors, setTotalMentors] = useState(0);

    // Form data
    const [formData, setFormData] = useState(new CreateMentorRequest());
    const [formErrors, setFormErrors] = useState({});

    // Companies list for dropdown
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        loadCompanies();
    }, []);

    useEffect(() => {
        loadMentors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchCriteria, pagination]);

    const loadCompanies = async () => {
        try {
            const response = await companyService.getCompanies();
            let companiesData = [];
            if (response && Array.isArray(response)) {
                companiesData = response;
            } else if (response && response.data && Array.isArray(response.data)) {
                companiesData = response.data;
            } else if (response && response.content && Array.isArray(response.content)) {
                companiesData = response.content;
            }
            setCompanies(companiesData);
        } catch (err) {
            console.error('Error loading companies:', err);
            setCompanies([]);
        }
    };

    const loadMentors = async () => {
        try {
            setLoading(true);
            setError('');
            const effectivePagination = {
                page: pagination?.page || 1,
                size: pagination?.size || 10,
            };
            const sanitizeCriteria = (criteria) => {
                const result = {};
                Object.entries(criteria || {}).forEach(([k, v]) => {
                    if (v === undefined || v === null) return;
                    if (typeof v === 'string' && v.trim() === '') return;
                    result[k] = v;
                });
                return result;
            };

            const effectiveCriteria = sanitizeCriteria(searchCriteria);
            const response = await mentorService.searchMentors(effectiveCriteria, effectivePagination);

            const extractListAndTotal = (res) => {
                // 1) Plain array
                if (Array.isArray(res)) return { list: res, total: res.length };

                const pickFromObject = (obj) => {
                    if (!obj || typeof obj !== 'object') return null;
                    // Common keys
                    const candidates = ['content', 'items', 'records', 'rows', 'result', 'results', 'data'];
                    for (const key of candidates) {
                        const val = obj[key];
                        if (Array.isArray(val)) {
                            const total = obj.totalElements ?? obj.total ?? obj.count ?? val.length;
                            return { list: val, total };
                        }
                    }
                    // If none of the common keys match, try the first array value
                    const seen = new Set();
                    const dfs = (node) => {
                        if (!node || typeof node !== 'object' || seen.has(node)) return null;
                        seen.add(node);
                        for (const value of Object.values(node)) {
                            if (Array.isArray(value)) {
                                const total = node.totalElements ?? node.total ?? node.count ?? value.length;
                                return { list: value, total };
                            }
                        }
                        for (const value of Object.values(node)) {
                            const found = dfs(value);
                            if (found) return found;
                        }
                        return null;
                    };
                    const deepFound = dfs(obj);
                    if (deepFound) return deepFound;
                    return null;
                };

                // 2) Axios-like { data: ... }
                if (res && 'data' in res) {
                    if (Array.isArray(res.data)) return { list: res.data, total: res.total ?? res.data.length };
                    const picked = pickFromObject(res.data);
                    if (picked) return picked;
                }

                // 3) Direct object with standard keys
                const picked = pickFromObject(res);
                if (picked) return picked;

                return { list: [], total: 0 };
            };

            // Prefer service contract if present
            const list = Array.isArray(response?.data)
                ? response.data
                : extractListAndTotal(response).list;
            const total = (typeof response?.total === 'number')
                ? response.total
                : extractListAndTotal(response).total;

            setMentors(
                list.map((mentor) => ({
                    id: mentor.id,
                    user: mentor.user,
                    company: mentor.company,
                    position: mentor.position,
                    officeLocation: mentor.officeLocation,
                    yearsOfExperience: mentor.yearsOfExperience,
                    expertise: mentor.expertise,
                    expertiseLevel: mentor.expertiseLevel,
                    bio: mentor.bio,
                    certifications: mentor.certifications,
                    languages: mentor.languages,
                    isActive: mentor.isActive,
                    createdAt: mentor.createdAt,
                    updatedAt: mentor.updatedAt,
                }))
            );
            setTotalMentors(total);
        } catch (err) {
            console.error('Error loading mentors:', err);
            setError('Không thể tải danh sách mentor. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (keyword) => {
        setSearchCriteria((prev) => ({ ...prev, keyword }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (field, value) => {
        setSearchCriteria((prev) => ({ ...prev, [field]: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const clearFilters = () => {
        setSearchCriteria(new MentorSearchCriteria());
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (page, pageSize) => {
        setPagination((prev) => ({ ...prev, page: page || 1, size: pageSize || prev.size || 10 }));
    };

    const openModal = (mode, mentor = null) => {
        setModalMode(mode);
        setSelectedMentor(mentor);

        if (mode === 'create') {
            setFormData(new CreateMentorRequest());
        } else if (mode === 'edit' && mentor) {
            setFormData({
                username: mentor.user?.username || '',
                email: mentor.user?.email || '',
                fullName: mentor.user?.fullName || '',
                phone: mentor.user?.phoneNumber || '',
                company: mentor.company?.id || '',
                position: mentor.position || '',
                department: mentor.department || '',
                yearsOfExperience: mentor.yearsOfExperience || 0,
                specialization: mentor.specialization || '',
                officeLocation: mentor.officeLocation || '',
                expertiseLevel: mentor.expertiseLevel || '',
                maxInterns: mentor.maxInterns || 1,
            });
        }

        setFormErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMentor(null);
        setFormData(new CreateMentorRequest());
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        if (modalMode === 'create') {
            if (!formData.username?.trim()) errors.username = 'Tên đăng nhập không được để trống';
            if (!formData.email?.trim()) errors.email = 'Email không được để trống';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email không hợp lệ';
            if (!formData.fullName?.trim()) errors.fullName = 'Họ và tên không được để trống';
            if (!formData.phone?.trim()) errors.phone = 'Số điện thoại không được để trống';
        }
        if (!formData.company?.toString().trim()) errors.company = 'Công ty không được để trống';
        if (!formData.position?.trim()) errors.position = 'Chức vụ không được để trống';
        if (!formData.expertiseLevel) errors.expertiseLevel = 'Vui lòng chọn trình độ chuyên môn';
        if (Number(formData.yearsOfExperience) < 0) errors.yearsOfExperience = 'Số năm kinh nghiệm không được âm';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (modalMode === 'create') {
                const mentorData = {
                    username: formData.username,
                    email: formData.email,
                    fullName: formData.fullName,
                    phoneNumber: formData.phone,
                    password: formData.email.split('@')[0],
                    role: 'MENTOR',
                    companyId: formData.company ? parseInt(formData.company) : null,
                    position: formData.position,
                    department: 'Chưa xác định',
                    specialization: '',
                    officeLocation: formData.officeLocation || 'Chưa cập nhật',
                    yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
                };
                await mentorService.createMentor(mentorData);
            } else if (modalMode === 'edit') {
                const companyId = formData.company ? parseInt(formData.company) : null;
                const mentorData = {
                    company: companyId ? { id: companyId } : null,
                    position: formData.position,
                    department: formData.department || 'Chưa xác định',
                    yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
                    specialization: '',
                    officeLocation: formData.officeLocation || 'Chưa cập nhật',
                    expertiseLevel: formData.expertiseLevel || 'INTERMEDIATE',
                };
                await mentorService.updateMentor(selectedMentor.id, mentorData);
            }
            closeModal();
            loadMentors();
        } catch (err) {
            console.error('Error saving mentor:', err);
            setFormErrors({ general: err.message || 'Có lỗi xảy ra khi lưu thông tin mentor.' });
        }
    };

    const handleDelete = async () => {
        if (!selectedMentor) return;
        try {
            await mentorService.deleteMentor(selectedMentor.id);
            closeModal();
            loadMentors();
        } catch (err) {
            console.error('Error deleting mentor:', err);
            setFormErrors({ general: err.message || 'Có lỗi xảy ra khi xóa mentor.' });
        }
    };

    const expertiseLevelOptions = useMemo(
        () =>
            Object.values(ExpertiseLevel).map((level) => ({
                value: level,
                label: new Mentor({ expertiseLevel: level }).getExpertiseLevelLabel(),
            })),
        []
    );

    return (
        <div className="space-y-4">
            <MentorHeader onAdd={() => openModal('create')} />

            <MentorFilters
                keyword={searchCriteria.keyword}
                onKeywordChange={handleSearch}
                showAdvanced={showFilters}
                onToggleAdvanced={() => setShowFilters(!showFilters)}
                expertiseOptions={expertiseLevelOptions}
                companies={companies}
                criteria={searchCriteria}
                onCriteriaChange={handleFilterChange}
                onClear={clearFilters}
            />

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            <MentorTable
                mentors={mentors}
                loading={loading}
                pagination={pagination}
                total={totalMentors}
                onPageChange={handlePageChange}
                onView={(m) => openModal('view', m)}
                onEdit={(m) => openModal('edit', m)}
                onDelete={(m) => openModal('delete', m)}
                expertiseLabelOf={(level) => (level ? new Mentor({ expertiseLevel: level }).getExpertiseLevelLabel() : '')}
            />

            <MentorModal
                open={showModal}
                mode={modalMode}
                onCancel={closeModal}
                onOk={modalMode === 'delete' ? handleDelete : handleSubmit}
                loading={false}
                formData={formData}
                setFormData={(data) => setFormData(data)}
                formErrors={formErrors}
                companies={companies}
                expertiseOptions={expertiseLevelOptions}
                selectedMentor={selectedMentor}
            />
        </div>
    );
};

export default MentorManagement;


