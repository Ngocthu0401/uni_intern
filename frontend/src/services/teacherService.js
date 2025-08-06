import axiosClient from './axiosClient';

const teacherService = {
  // Get all teachers with pagination and filtering
  getTeachers: async (params = {}) => {
    const response = await axiosClient.get('/teachers', { params });
    return response.data;
  },

  // Search teachers with criteria and pagination
  searchTeachers: async (searchCriteria = {}, pagination = {}) => {
    // Convert 1-based to 0-based pagination for backend
    const page = Math.max(0, (pagination.page || 1) - 1);
    
    const params = {
      keyword: searchCriteria.keyword || '',
      department: searchCriteria.department || null,
      title: searchCriteria.title || null,
      degree: searchCriteria.degree || null,
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

    const response = await axiosClient.get('/teachers/search', { params });
    return {
      data: response.data.content || response.data,
      total: response.data.totalElements || response.data.length || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.number || 0,
      size: response.data.size || params.size || 10
    };
  },

  // Get teacher by ID
  getTeacherById: async (id) => {
    const response = await axiosClient.get(`/teachers/${id}`);
    return response.data;
  },

  // Get teacher by User ID
  getTeacherByUserId: async (userId) => {
    const response = await axiosClient.get(`/teachers/user/${userId}`);
    return response.data;
  },

  // Create new teacher
  createTeacher: async (teacherData) => {
    const response = await axiosClient.post('/teachers', teacherData);
    return response.data;
  },

  // Update teacher
  updateTeacher: async (id, teacherData) => {
    const response = await axiosClient.put(`/teachers/${id}`, teacherData);
    return response.data;
  },

  // Delete teacher
  deleteTeacher: async (id) => {
    const response = await axiosClient.delete(`/teachers/${id}`);
    return response.data;
  },

  // Search teachers by teacher code
  searchByCode: async (code) => {
    const response = await axiosClient.get('/teachers/search/code', {
      params: { code }
    });
    return response.data;
  },

  // Search teachers by department
  searchByDepartment: async (department) => {
    const response = await axiosClient.get('/teachers/search/department', {
      params: { department }
    });
    return response.data;
  },

  // Get teachers by subject
  getTeachersBySubject: async (subject) => {
    const response = await axiosClient.get('/teachers/subject', {
      params: { subject }
    });
    return response.data;
  },

  // Get teacher statistics
  getTeacherStatistics: async () => {
    const response = await axiosClient.get('/teachers/statistics');
    return response.data;
  },

  // Get specific teacher statistics by user ID
  getTeacherStatisticsByUserId: async (userId) => {
    const response = await axiosClient.get(`/teachers/user/${userId}/statistics`);
    return response.data;
  },

  // Export teachers
  exportTeachers: async (searchCriteria = {}) => {
    const response = await axiosClient.get('/teachers/export', {
      params: searchCriteria,
      responseType: 'blob'
    });
    return response.data;
  }
};

export default teacherService; 