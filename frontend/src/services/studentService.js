import axiosClient from './axiosClient';

const studentService = {
  // Get all students with pagination and filtering
  getStudents: async (params = {}) => {
    const response = await axiosClient.get('/students', { params });
    return response.data;
  },

  // Search students with criteria and pagination
  searchStudents: async (searchCriteria = {}, pagination = {}) => {
    // Convert 1-based to 0-based pagination for backend
    const page = Math.max(0, (pagination.page || 1) - 1);

    const params = {
      keyword: searchCriteria.keyword || null,
      className: searchCriteria.className || null,
      major: searchCriteria.major || null,
      academicYear: searchCriteria.academicYear || null,
      minGpa: searchCriteria.minGpa || null,
      maxGpa: searchCriteria.maxGpa || null,
      internshipStatus: searchCriteria.internshipStatus || null,
      page: page,
      size: pagination.size || 10,
      sortBy: pagination.sortBy || 'id',
      sortDir: pagination.sortDir || 'desc'
    };

    // Remove null/undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    const response = await axiosClient.get('/students/advanced-search', { params });
    return {
      data: response.data.content || response.data,
      total: response.data.totalElements || response.data.length || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.number || 0,
      size: response.data.size || params.size || 10
    };
  },

  // Get student by ID
  getStudentById: async (id) => {
    const response = await axiosClient.get(`/students/${id}`);
    return response.data;
  },

  // Get student by user ID
  getStudentByUserId: async (userId) => {
    const response = await axiosClient.get(`/students/user/${userId}`);
    return response.data;
  },

  // Create new student
  createStudent: async (studentData) => {
    const response = await axiosClient.post('/students', studentData);
    return response.data;
  },

  // Update student
  updateStudent: async (id, studentData) => {
    const response = await axiosClient.put(`/students/${id}`, studentData);
    return response.data;
  },

  // Delete student
  deleteStudent: async (id) => {
    const response = await axiosClient.delete(`/students/${id}`);
    return response.data;
  },

  // Search students by student code
  searchByCode: async (studentCode) => {
    const response = await axiosClient.get('/students/search/code', {
      params: { studentCode }
    });
    return response.data;
  },

  // Search students by class
  searchByClass: async (className) => {
    const response = await axiosClient.get('/students/search/class', {
      params: { className }
    });
    return response.data;
  },

  // Get students by major
  getStudentsByMajor: async (major) => {
    const response = await axiosClient.get('/students/major', {
      params: { major }
    });
    return response.data;
  },

  // Get student statistics
  getStudentStatistics: async () => {
    const response = await axiosClient.get('/students/statistics');
    return response.data;
  },

  // Export students
  exportStudents: async (searchCriteria = {}) => {
    const response = await axiosClient.get('/students/export', {
      params: searchCriteria,
      responseType: 'blob'
    });
    return response.data;
  },

  // Get students without internship
  getStudentsWithoutInternship: async () => {
    const response = await axiosClient.get('/students/without-internship');
    return response.data;
  },

  // Get students with internship
  getStudentsWithInternship: async () => {
    const response = await axiosClient.get('/students/with-internship');
    return response.data;
  },

  // Get available students (not currently in active internship)
  getAvailableStudents: async () => {
    const response = await axiosClient.get('/students/available');
    return response.data;
  },

  // Search students by major
  searchByMajor: async (major) => {
    const response = await axiosClient.get('/students/search/major', {
      params: { major }
    });
    return response.data;
  },

  // Get students by batch
  getStudentsByBatch: async (batchId) => {
    const response = await axiosClient.get(`/students/batch/${batchId}`);
    return response.data;
  },

  // Get students by teacher
  getStudentsByTeacher: async (teacherId, params = {}) => {
    const response = await axiosClient.get(`/students/teacher/${teacherId}`, { params });
    return {
      data: response.data.content || response.data,
      total: response.data.totalElements || response.data.length || 0
    };
  }
};

export default studentService; 