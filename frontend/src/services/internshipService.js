import axiosClient from './axiosClient';

const internshipService = {
  // Get all internships with pagination and filtering
  getInternships: async (params = {}) => {
    const response = await axiosClient.get('/internships', { params });
    return response.data;
  },

  // Search internships with criteria and pagination
  searchInternships: async (searchCriteria = {}, pagination = {}) => {
    // Filter out empty values to avoid sending empty parameters
    const cleanSearchCriteria = Object.fromEntries(
      Object.entries(searchCriteria).filter(([key, value]) =>
        value !== null && value !== undefined && value !== ''
      )
    );

    const params = {
      ...cleanSearchCriteria,
      ...pagination
    };

    const response = await axiosClient.get('/internships/search', { params });
    return {
      data: response.data.content || response.data,
      total: response.data.totalElements || response.data.length || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.number || 0,
      size: response.data.size || params.size || 10
    };
  },

  // Get internship by ID
  getInternshipById: async (id) => {
    const response = await axiosClient.get(`/internships/${id}`);
    return response.data;
  },

  // Create new internship
  createInternship: async (internshipData) => {
    const response = await axiosClient.post('/internships', internshipData);
    return response.data;
  },

  // Update internship
  updateInternship: async (id, internshipData) => {
    const response = await axiosClient.put(`/internships/${id}`, internshipData);
    return response.data;
  },

  // Patch internship (partial update)
  patchInternship: async (id, partialData) => {
    const response = await axiosClient.patch(`/internships/${id}`, partialData);
    return response.data;
  },

  // Delete internship
  deleteInternship: async (id) => {
    const response = await axiosClient.delete(`/internships/${id}`);
    return response.data;
  },

  // Approve internship
  approveInternship: async (id) => {
    const response = await axiosClient.put(`/internships/${id}/approve`);
    return response.data;
  },

  // Reject internship
  rejectInternship: async (id) => {
    const response = await axiosClient.put(`/internships/${id}/reject`);
    return response.data;
  },

  // Assign teacher to internship
  assignTeacher: async (id, teacherId) => {
    const response = await axiosClient.put(`/internships/${id}/assign-teacher/${teacherId}`);
    return response.data;
  },

  // Assign mentor to internship
  assignMentor: async (id, mentorId) => {
    const response = await axiosClient.put(`/internships/${id}/assign-mentor/${mentorId}`);
    return response.data;
  },

  // Assign company and student to internship
  assignInternship: async (id, assignmentData) => {
    const response = await axiosClient.put(`/internships/${id}/assign`, assignmentData);
    return response.data;
  },

  // Start internship
  startInternship: async (id) => {
    const response = await axiosClient.put(`/internships/${id}/start`);
    return response.data;
  },

  // Complete internship
  completeInternship: async (id) => {
    const response = await axiosClient.put(`/internships/${id}/complete`);
    return response.data;
  },

  // Get internships by student
  getInternshipsByStudent: async (studentId) => {
    const response = await axiosClient.get(`/internships/student/${studentId}`);
    return response.data;
  },

  // Get internships by teacher
  getInternshipsByTeacher: async (teacherId) => {
    const response = await axiosClient.get(`/internships/teacher/${teacherId}`);
    return response.data;
  },

  // Get internships by mentor
  getInternshipsByMentor: async (mentorId) => {
    const response = await axiosClient.get(`/internships/mentor/${mentorId}`);
    return response.data;
  },

  // Get internships by company
  getInternshipsByCompany: async (companyId) => {
    const response = await axiosClient.get(`/internships/company/${companyId}`);
    return response.data;
  },

  // Get internships by batch
  getInternshipsByBatch: async (batchId) => {
    const response = await axiosClient.get(`/internships/batch/${batchId}`);
    return response.data;
  },

  // Get internships by status
  getInternshipsByStatus: async (status) => {
    const response = await axiosClient.get(`/internships/status/${status}`);
    return response.data;
  },

  // Apply for internship
  applyForInternship: async (internshipId, applicationData) => {
    const response = await axiosClient.post(`/internships/${internshipId}/apply`, applicationData);
    return response.data;
  },

  // Get internship applications
  getInternshipApplications: async (internshipId) => {
    const response = await axiosClient.get(`/internships/${internshipId}/applications`);
    return response.data;
  },

  // Get internship statistics
  getInternshipStatistics: async () => {
    try {
      const response = await axiosClient.get('/internships/statistics');
      return response.data;
    } catch (error) {
      // Return default statistics if API fails
      return {
        total: 0,
        pending: 0,
        approved: 0,
        inProgress: 0,
        completed: 0,
        rejected: 0
      };
    }
  },

  // Export internships
  exportInternships: async (searchCriteria = {}) => {
    const response = await axiosClient.get('/internships/export', {
      params: searchCriteria,
      responseType: 'blob'
    });
    return response.data;
  },

  // Task management methods
  getInternshipTasks: async (internshipId) => {
    const response = await axiosClient.get(`/tasks/internship/${internshipId}`);
    return { data: response.data };
  },

  createTask: async (taskData) => {
    const response = await axiosClient.post('/tasks', taskData);
    return response.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const response = await axiosClient.put(`/tasks/${taskId}/status`, { status });
    return response.data;
  },

  // Progress tracking methods
  getInternshipProgress: async (internshipId) => {
    const response = await axiosClient.get(`/internship-progress/internship/${internshipId}/latest`);
    return { data: response.data };
  },

  updateInternshipProgress: async (internshipId, progressData) => {
    const response = await axiosClient.put(`/internship-progress/internship/${internshipId}`, progressData);
    return response.data;
  }
};

export default internshipService; 