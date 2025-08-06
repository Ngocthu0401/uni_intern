import { useState, useEffect } from 'react';
import { 
  BriefcaseIcon, 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  UserIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { internshipService, companyService, studentService, teacherService, mentorService, evaluationService } from '../../services';
import { 
  Internship, 
  CreateInternshipRequest, 
  UpdateInternshipRequest,
  InternshipSearchCriteria,
  PaginationOptions,
  InternshipStatus,
  InternshipType 
} from '../../models';

const InternshipManagement = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit', 'delete', 'approve', 'reject', 'assign'
  const [showFilters, setShowFilters] = useState(false);

  // Search and filtering
  const [searchCriteria, setSearchCriteria] = useState(new InternshipSearchCriteria());
  const [pagination, setPagination] = useState(new PaginationOptions());
  const [totalInternships, setTotalInternships] = useState(0);

  // Form data
  const [formData, setFormData] = useState(new CreateInternshipRequest());
  const [formErrors, setFormErrors] = useState({});

  // Assignment data
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignmentData, setAssignmentData] = useState({
    companyId: '',
    studentId: '',
    mentorId: '',
    teacherId: ''
  });

  useEffect(() => {
    loadInternships();
  }, [searchCriteria, pagination]);

  const loadInternships = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await internshipService.searchInternships(searchCriteria, pagination);
      setInternships(response.data.map(internship => new Internship(internship)));
      setTotalInternships(response.total);
    } catch (err) {
      console.error('Error loading internships:', err);
      setError('Không thể tải danh sách thực tập. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchCriteria(prev => ({ ...prev, keyword }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleFilterChange = (field, value) => {
    setSearchCriteria(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setSearchCriteria(new InternshipSearchCriteria());
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const loadAssignmentData = async () => {
    try {
      const [companyResponse, studentResponse, mentorResponse, teacherResponse] = await Promise.all([
        companyService.getActiveCompanies(),
        studentService.getStudents(),
        mentorService.getMentors(),
        teacherService.getTeachers()
      ]);
      // Handle paginated response structure
      const companiesData = companyResponse.content || companyResponse.data || companyResponse;
      const studentsData = studentResponse.content || studentResponse.data || studentResponse;
      const mentorsData = mentorResponse.content || mentorResponse.data || mentorResponse;
      const teachersData = teacherResponse.content || teacherResponse.data || teacherResponse;
      
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setMentors(Array.isArray(mentorsData) ? mentorsData : []);
      setTeachers(Array.isArray(teachersData) ? teachersData : []);
    } catch (err) {
      console.error('Error loading assignment data:', err);
    }
  };

  const openModal = async (mode, internship = null) => {
    setModalMode(mode);
    
    // For view mode, load full internship details and mentor evaluations
    if (mode === 'view' && internship?.id) {
      try {
        const fullInternship = await internshipService.getInternshipById(internship.id);
        
        // Load mentor evaluations if mentor exists
        let mentorEvaluations = [];
        if (fullInternship.mentor?.id) {
          try {
            const evaluationsResponse = await evaluationService.getEvaluationsByMentor(fullInternship.mentor.id);
            mentorEvaluations = evaluationsResponse.filter(evaluation => evaluation.internship?.id === fullInternship.id);
          } catch (evalErr) {
            console.error('Error loading mentor evaluations:', evalErr);
          }
        }
        
        // Add evaluation data to internship
        const latestEvaluation = mentorEvaluations.length > 0 ? mentorEvaluations[mentorEvaluations.length - 1] : null;
        fullInternship.mentorEvaluationScore = latestEvaluation?.overallScore || latestEvaluation?.score;
        fullInternship.mentorEvaluationComment = latestEvaluation?.comments;
        fullInternship.mentorEvaluations = mentorEvaluations;
        
        console.log('Full internship with evaluations:', fullInternship);
        setSelectedInternship(fullInternship);
      } catch (err) {
        console.error('Error loading internship details:', err);
        setSelectedInternship(internship); // fallback to basic data
      }
    } else {
      setSelectedInternship(internship);
    }
    
    if (mode === 'create') {
      setFormData(new CreateInternshipRequest());
    } else if (mode === 'assign') {
      loadAssignmentData();
      setAssignmentData({
        companyId: internship?.company?.id || '',
        studentId: internship?.student?.id || '',
        mentorId: internship?.mentor?.id || '',
        teacherId: internship?.teacher?.id || ''
      });
    } else if (mode === 'edit' && internship) {
      // Properly map internship data for edit form
      setFormData({
        title: internship.jobTitle || '',                    // jobTitle -> title for form
        startDate: internship.startDate || '',
        endDate: internship.endDate || '',
        salary: internship.salary || 0,
        workingHours: internship.workingHoursPerWeek || 40,  // workingHoursPerWeek -> workingHours for form
        description: internship.jobDescription || '',        // jobDescription -> description for form
        requirements: internship.requirements || '',
        benefits: internship.benefits || '',
        notes: internship.notes || ''
      });
    }
    
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInternship(null);
    setFormData(new CreateInternshipRequest());
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title?.trim()) {
      errors.title = 'Tiêu đề thực tập không được để trống';
    }
    
    if (!formData.description?.trim()) {
      errors.description = 'Mô tả không được để trống';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Ngày bắt đầu không được để trống';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'Ngày kết thúc không được để trống';
    }
    
    if (formData.salary < 0) {
      errors.salary = 'Mức lương không được âm';
    }
    
    // Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start >= end) {
        errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Map frontend form data to backend Internship entity structure
      const internshipData = {
        jobTitle: formData.title,                         // title -> jobTitle
        jobDescription: formData.description,             // description -> jobDescription
        requirements: formData.requirements || 'Chưa xác định',
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'PENDING',                                // Default status
        workingHoursPerWeek: formData.workingHours || 40, // workingHours -> workingHoursPerWeek
        salary: parseFloat(formData.salary) || 0.0,
        benefits: formData.benefits || 'Chưa xác định',
        notes: formData.notes || ''
      };

      // Note: In a real application, you would need to handle:
      // - student assignment (student: { id: studentId })
      // - teacher assignment (teacher: { id: teacherId })
      // - mentor assignment (mentor: { id: mentorId })
      // - company assignment (company: { id: companyId })
      // - batch assignment (internshipBatch: { id: batchId })
      // - internshipCode generation

      if (modalMode === 'create') {
        await internshipService.createInternship(internshipData);
      } else if (modalMode === 'edit') {
        await internshipService.updateInternship(selectedInternship.id, internshipData);
      }
      
      closeModal();
      loadInternships();
    } catch (err) {
      console.error('Error saving internship:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi lưu thông tin thực tập.' });
    }
  };

  const handleStatusChange = async (action) => {
    if (!selectedInternship) return;
    
    try {
      if (action === 'approve') {
        await internshipService.approveInternship(selectedInternship.id);
      } else if (action === 'reject') {
        await internshipService.rejectInternship(selectedInternship.id);
      }
      
      closeModal();
      loadInternships();
    } catch (err) {
      console.error('Error changing internship status:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi thay đổi trạng thái thực tập.' });
    }
  };

  const handleDelete = async () => {
    if (!selectedInternship) return;
    
    try {
      await internshipService.deleteInternship(selectedInternship.id);
      closeModal();
      loadInternships();
    } catch (err) {
      console.error('Error deleting internship:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi xóa thực tập.' });
    }
  };

  const handleAssignment = async () => {
    if (!selectedInternship) return;
    
    try {
      // Clean up assignment data - remove empty fields
      const cleanAssignmentData = {
        companyId: assignmentData.companyId,
        studentId: assignmentData.studentId
      };
      
      // Only include mentorId if it has a value
      if (assignmentData.mentorId && String(assignmentData.mentorId).trim() !== '') {
        cleanAssignmentData.mentorId = assignmentData.mentorId;
      }
      
      // Only include teacherId if it has a value
      if (assignmentData.teacherId && String(assignmentData.teacherId).trim() !== '') {
        cleanAssignmentData.teacherId = assignmentData.teacherId;
      }
      
      await internshipService.assignInternship(selectedInternship.id, cleanAssignmentData);
      closeModal();
      loadInternships();
    } catch (err) {
      console.error('Error assigning internship:', err);
      setFormErrors({ general: err.message || 'Có lỗi xảy ra khi phân công thực tập.' });
    }
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ phê duyệt' },
    { value: 'APPROVED', label: 'Đã phê duyệt' },
    { value: 'REJECTED', label: 'Bị từ chối' },
    { value: 'ASSIGNED', label: 'Đã phân công' },
    { value: 'IN_PROGRESS', label: 'Đang thực tập' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Hủy bỏ' }
  ];

  const typeOptions = [
    { value: 'FULL_TIME', label: 'Toàn thời gian' },
    { value: 'PART_TIME', label: 'Bán thời gian' },
    { value: 'REMOTE', label: 'Từ xa' },
    { value: 'HYBRID', label: 'Kết hợp' }
  ];

  const totalPages = Math.ceil(totalInternships / pagination.size);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Thực tập</h1>
          <p className="text-gray-600">Quản lý tất cả các vị trí thực tập và ứng tuyển</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Tạo Vị trí thực tập
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, công ty, sinh viên..."
                value={searchCriteria.keyword}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Bộ lọc
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={searchCriteria.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Tất cả trạng thái</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại thực tập
                </label>
                <select
                  value={searchCriteria.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Tất cả loại</option>
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Công ty
                </label>
                <input
                  type="text"
                  placeholder="Tên công ty"
                  value={searchCriteria.companyName || ''}
                  onChange={(e) => handleFilterChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đợt thực tập
                </label>
                <input
                  type="text"
                  placeholder="ID đợt thực tập"
                  value={searchCriteria.batchId || ''}
                  onChange={(e) => handleFilterChange('batchId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Internships Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí thực tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công ty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giảng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại / Lương
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : internships.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy thực tập nào
                  </td>
                </tr>
              ) : (
                internships.map((internship) => (
                  <tr key={internship.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {internship.jobTitle || 'Chưa có tiêu đề'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {internship.internshipCode || 'Chưa có mã'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{internship.company?.companyName || 'Chưa có công ty'}</div>
                          <div className="text-sm text-gray-500">{internship.company?.address || 'Chưa có địa chỉ'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {internship.student?.user?.fullName || 'Chưa phân công'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Mã SV: {internship.student?.studentCode || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {internship.teacher?.user?.fullName || 'Chưa phân công'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {internship.teacher?.department || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {internship.startDate || 'Chưa xác định'}
                      </div>
                      <div className="text-sm text-gray-500">
                        đến {internship.endDate || 'Chưa xác định'}
                      </div>
                      <div className="text-sm text-gray-500">
                        (Chưa tính toán)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {internship.salary ? `${new Intl.NumberFormat('vi-VN').format(internship.salary)} VND` : 'Thỏa thuận'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {internship.workingHoursPerWeek || 40}h/tuần
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        internship.status === 'IN_PROGRESS' 
                          ? 'bg-green-100 text-green-800' 
                          : internship.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : internship.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : internship.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : internship.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {internship.status === 'PENDING' ? 'Chờ phê duyệt'
                          : internship.status === 'APPROVED' ? 'Đã phê duyệt'
                          : internship.status === 'REJECTED' ? 'Bị từ chối'
                          : internship.status === 'ASSIGNED' ? 'Đã phân công'
                          : internship.status === 'IN_PROGRESS' ? 'Đang thực tập'
                          : internship.status === 'COMPLETED' ? 'Hoàn thành'
                          : internship.status === 'CANCELLED' ? 'Đã hủy'
                          : 'Chưa xác định'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal('view', internship)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {internship.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => openModal('approve', internship)}
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Phê duyệt"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openModal('reject', internship)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Từ chối"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        {(internship.status === 'APPROVED' || !internship.student) && (
                          <button
                            onClick={() => openModal('assign', internship)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Phân công"
                          >
                            <UserPlusIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => openModal('edit', internship)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('delete', internship)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Xóa"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {((pagination.page - 1) * pagination.size) + 1} - {Math.min(pagination.page * pagination.size, totalInternships)} trong {totalInternships} thực tập
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, pagination.page - 2);
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm border rounded-lg ${
                        page === pagination.page
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === 'view' && 'Chi tiết Thực tập'}
                {modalMode === 'create' && 'Tạo Vị trí thực tập mới'}
                {modalMode === 'edit' && 'Chỉnh sửa Thực tập'}
                {modalMode === 'delete' && 'Xác nhận xóa'}
                {modalMode === 'approve' && 'Phê duyệt Thực tập'}
                {modalMode === 'reject' && 'Từ chối Thực tập'}
                {modalMode === 'assign' && 'Phân công Thực tập'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {formErrors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{formErrors.general}</p>
              </div>
            )}

            {modalMode === 'delete' ? (
              <div>
                <p className="mb-6 text-gray-700">
                  Bạn có chắc chắn muốn xóa thực tập{' '}
                  <span className="font-semibold">{selectedInternship?.title}</span>?
                  Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ) : modalMode === 'approve' || modalMode === 'reject' ? (
              <div>
                <p className="mb-6 text-gray-700">
                  Bạn có chắc chắn muốn {modalMode === 'approve' ? 'phê duyệt' : 'từ chối'} thực tập{' '}
                  <span className="font-semibold">{selectedInternship?.title}</span>?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleStatusChange(modalMode)}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      modalMode === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {modalMode === 'approve' ? 'Phê duyệt' : 'Từ chối'}
                  </button>
                </div>
              </div>
            ) : modalMode === 'view' ? (
              <div className="space-y-6">
                {/* Thông tin cơ bản */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-3">Thông tin cơ bản</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tiêu đề công việc</label>
                      <p className="mt-1 text-sm text-gray-900 font-semibold">{selectedInternship?.jobTitle || 'Chưa có tiêu đề'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mã thực tập</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">{selectedInternship?.internshipCode || 'Chưa có mã'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedInternship?.status === 'IN_PROGRESS' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedInternship?.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedInternship?.status === 'APPROVED'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedInternship?.status === 'ASSIGNED'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedInternship?.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : selectedInternship?.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedInternship?.status === 'PENDING' ? 'Chờ phê duyệt'
                          : selectedInternship?.status === 'APPROVED' ? 'Đã phê duyệt'
                          : selectedInternship?.status === 'REJECTED' ? 'Bị từ chối'
                          : selectedInternship?.status === 'ASSIGNED' ? 'Đã phân công'
                          : selectedInternship?.status === 'IN_PROGRESS' ? 'Đang thực tập'
                          : selectedInternship?.status === 'COMPLETED' ? 'Hoàn thành'
                          : selectedInternship?.status === 'CANCELLED' ? 'Đã hủy'
                          : 'Chưa xác định'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Thời gian làm việc</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInternship?.workingHoursPerWeek || 40} giờ/tuần</p>
                    </div>
                  </div>
                </div>

                {/* Thông tin thời gian và lương */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-3">Thời gian & Lương</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInternship?.startDate || 'Chưa xác định'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInternship?.endDate || 'Chưa xác định'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mức lương</label>
                      <p className="mt-1 text-sm text-gray-900 font-semibold text-green-700">
                        {selectedInternship?.salary ? `${new Intl.NumberFormat('vi-VN').format(selectedInternship.salary)} VND/tháng` : 'Thỏa thuận'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thông tin phân công */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-3">Thông tin phân công</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Công ty</label>
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-5 w-5 text-purple-600 mr-2" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{selectedInternship?.company?.companyName || 'Chưa phân công'}</p>
                            <p className="text-xs text-gray-500">{selectedInternship?.company?.address || 'Chưa có địa chỉ'}</p>
                            <p className="text-xs text-gray-500">Mã: {selectedInternship?.company?.companyCode || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sinh viên</label>
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-purple-600 mr-2" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{selectedInternship?.student?.user?.fullName || 'Chưa phân công'}</p>
                            <p className="text-xs text-gray-500">Mã SV: {selectedInternship?.student?.studentCode || 'N/A'}</p>
                            <p className="text-xs text-gray-500">Email: {selectedInternship?.student?.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giảng viên phụ trách</label>
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-5 w-5 text-purple-600 mr-2" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{selectedInternship?.teacher?.user?.fullName || 'Chưa phân công'}</p>
                            <p className="text-xs text-gray-500">Khoa: {selectedInternship?.teacher?.department || 'N/A'}</p>
                            <p className="text-xs text-gray-500">Email: {selectedInternship?.teacher?.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mentor</label>
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-purple-600 mr-2" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{selectedInternship?.mentor?.user?.fullName || 'Chưa phân công'}</p>
                            <p className="text-xs text-gray-500">Chức vụ: {selectedInternship?.mentor?.position || 'N/A'}</p>
                            <p className="text-xs text-gray-500">Email: {selectedInternship?.mentor?.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mô tả công việc */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Mô tả công việc</h4>
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">
                      {selectedInternship?.jobDescription || 'Chưa có mô tả công việc'}
                    </p>
                  </div>
                </div>

                {/* Yêu cầu */}
                {selectedInternship?.requirements && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-3">Yêu cầu</h4>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">
                        {selectedInternship.requirements}
                      </p>
                    </div>
                  </div>
                )}

                {/* Phúc lợi */}
                {selectedInternship?.benefits && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-3">Phúc lợi</h4>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">
                        {selectedInternship.benefits}
                      </p>
                    </div>
                  </div>
                )}

                {/* Đánh giá */}
                {(selectedInternship?.finalScore || selectedInternship?.teacherScore || selectedInternship?.mentorScore || selectedInternship?.mentorEvaluationScore) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-3">Đánh giá</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg border">
                        <label className="block text-sm font-medium text-gray-700">Điểm giảng viên</label>
                        <p className="mt-1 text-lg font-bold text-blue-600">{selectedInternship?.teacherScore || 'Chưa chấm'}</p>
                        {selectedInternship?.teacherComment && (
                          <p className="mt-1 text-xs text-gray-500 italic">"{selectedInternship.teacherComment}"</p>
                        )}
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <label className="block text-sm font-medium text-gray-700">Điểm mentor</label>
                        <p className="mt-1 text-lg font-bold text-green-600">
                          {selectedInternship?.mentorEvaluationScore || selectedInternship?.mentorScore || 'Chưa chấm'}
                        </p>
                        {(selectedInternship?.mentorEvaluationComment || selectedInternship?.mentorComment) && (
                          <p className="mt-1 text-xs text-gray-500 italic">
                            "{selectedInternship?.mentorEvaluationComment || selectedInternship?.mentorComment}"
                          </p>
                        )}
                        {selectedInternship?.mentorEvaluations?.length > 0 && (
                          <p className="mt-1 text-xs text-gray-400">
                            {selectedInternship.mentorEvaluations.length} đánh giá từ mentor
                          </p>
                        )}
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <label className="block text-sm font-medium text-gray-700">Điểm tổng kết</label>
                        <p className="mt-1 text-lg font-bold text-purple-600">{selectedInternship?.finalScore || 'Chưa tính'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ghi chú */}
                {selectedInternship?.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-3">Ghi chú</h4>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">
                        {selectedInternship.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Thông tin hệ thống */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Thông tin hệ thống</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>
                      <label className="block font-medium">Ngày tạo:</label>
                      <p>{selectedInternship?.createdAt ? new Date(selectedInternship.createdAt).toLocaleString('vi-VN') : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block font-medium">Cập nhật lần cuối:</label>
                      <p>{selectedInternship?.updatedAt ? new Date(selectedInternship.updatedAt).toLocaleString('vi-VN') : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : modalMode === 'assign' ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">Thông tin thực tập hiện tại</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Tiêu đề:</span> {selectedInternship?.jobTitle}
                    </div>
                    <div>
                      <span className="text-blue-700">Mã:</span> {selectedInternship?.internshipCode}
                    </div>
                    <div>
                      <span className="text-blue-700">Công ty hiện tại:</span> {selectedInternship?.company?.companyName || 'Chưa có'}
                    </div>
                    <div>
                      <span className="text-blue-700">Sinh viên hiện tại:</span> {selectedInternship?.student?.user?.fullName || 'Chưa phân công'}
                    </div>
                    <div>
                      <span className="text-blue-700">Giảng viên hiện tại:</span> {selectedInternship?.teacher?.user?.fullName || 'Chưa phân công'}
                    </div>
                    <div>
                      <span className="text-blue-700">Mentor hiện tại:</span> {selectedInternship?.mentor?.user?.fullName || 'Chưa phân công'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn Công ty <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={assignmentData.companyId}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, companyId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Chọn công ty --</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.companyName} ({company.companyCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn Sinh viên <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={assignmentData.studentId}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, studentId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Chọn sinh viên --</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.user?.fullName} - {student.studentCode} 
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn Giảng viên phụ trách
                    </label>
                    <select
                      value={assignmentData.teacherId}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, teacherId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Chọn giảng viên --</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.user?.fullName} - {teacher.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn Mentor
                    </label>
                    <select
                      value={assignmentData.mentorId}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, mentorId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Chọn mentor --</option>
                      {mentors.map(mentor => (
                        <option key={mentor.id} value={mentor.id}>
                          {mentor.user?.fullName} - {mentor.company?.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleAssignment}
                    disabled={!assignmentData.companyId || !assignmentData.studentId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Phân công
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Thực tập sinh Phát triển phần mềm"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                    )}
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.startDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate || ''}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.endDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mức lương (VND/tháng)
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary || 0}
                      onChange={handleFormChange}
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.salary ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.salary && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.salary}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giờ làm việc/tuần
                    </label>
                    <input
                      type="number"
                      name="workingHours"
                      value={formData.workingHours || 40}
                      onChange={handleFormChange}
                      min="1"
                      max="60"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả công việc <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleFormChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Mô tả chi tiết về công việc, trách nhiệm và môi trường làm việc..."
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yêu cầu
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements || ''}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phúc lợi
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits || ''}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Các phúc lợi và quyền lợi cho thực tập sinh..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {modalMode === 'create' ? 'Tạo' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipManagement; 