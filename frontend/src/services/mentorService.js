import axiosClient from './axiosClient';

const mentorService = {
  // Get all mentors with pagination and filtering
  getMentors: async (params = {}) => {
    const response = await axiosClient.get('/mentors', { params });
    return response.data;
  },

  // Search mentors with criteria and pagination
  searchMentors: async (searchCriteria = {}, pagination = {}) => {
    // Convert 1-based to 0-based pagination for backend
    const page = Math.max(0, (pagination.page || 1) - 1);
    
    const params = {
      keyword: searchCriteria.keyword || '',
      company: searchCriteria.company || null,
      expertiseLevel: searchCriteria.expertiseLevel || null,
      minYearsOfExperience: searchCriteria.minYearsOfExperience || null,
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

    const response = await axiosClient.get('/mentors/search', { params });
    return {
      data: response.data.content || response.data,
      total: response.data.totalElements || response.data.length || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.number || 0,
      size: response.data.size || params.size || 10
    };
  },

  // Get mentor by ID
  getMentorById: async (id) => {
    const response = await axiosClient.get(`/mentors/${id}`);
    return response.data;
  },

  // Get mentor by user ID
  getMentorByUserId: async (userId) => {
    const response = await axiosClient.get(`/mentors/user/${userId}`);
    return response.data;
  },

  // Create new mentor
  createMentor: async (mentorData) => {
    const response = await axiosClient.post('/mentors', mentorData);
    return response.data;
  },

  // Update mentor
  updateMentor: async (id, mentorData) => {
    const response = await axiosClient.put(`/mentors/${id}`, mentorData);
    return response.data;
  },

  // Delete mentor
  deleteMentor: async (id) => {
    const response = await axiosClient.delete(`/mentors/${id}`);
    return response.data;
  },

  // Search mentors by company
  searchByCompany: async (companyId) => {
    const response = await axiosClient.get('/mentors/search/company', {
      params: { companyId }
    });
    return response.data;
  },

  // Get mentors by expertise
  getMentorsByExpertise: async (expertise) => {
    const response = await axiosClient.get('/mentors/expertise', {
      params: { expertise }
    });
    return response.data;
  },

  // Get mentor statistics
  getMentorStatistics: async () => {
    const response = await axiosClient.get('/mentors/statistics');
    return response.data;
  },

  // Get tracking statistics for mentor dashboard
  getTrackingStats: async (mentorId) => {
    const response = await axiosClient.get(`/mentors/${mentorId}/tracking-stats`);
    return response.data;
  },

  // Export mentors
  exportMentors: async (searchCriteria = {}) => {
    const response = await axiosClient.get('/mentors/export', {
      params: searchCriteria,
      responseType: 'blob'
    });
    return response.data;
  }
};

export default mentorService; 