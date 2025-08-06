import axiosClient from './axiosClient';

const reportService = {
  // Get all reports with pagination and filtering
  getReports: async (params = {}) => {
    const response = await axiosClient.get('/reports', { params });
    return response.data;
  },

  // Get report by ID
  getReportById: async (id) => {
    const response = await axiosClient.get(`/reports/${id}`);
    return response.data;
  },

  // Create new report
  createReport: async (reportData) => {
    const response = await axiosClient.post('/reports', reportData);
    return response.data;
  },

  // Update report
  updateReport: async (id, reportData) => {
    const response = await axiosClient.put(`/reports/${id}`, reportData);
    return response.data;
  },

  // Delete report
  deleteReport: async (id) => {
    const response = await axiosClient.delete(`/reports/${id}`);
    return response.data;
  },

  // Approve report
  approveReport: async (id) => {
    const response = await axiosClient.put(`/reports/${id}/approve`);
    return response.data;
  },

  // Reject report
  rejectReport: async (id, reason) => {
    const response = await axiosClient.put(`/reports/${id}/reject`, { reason });
    return response.data;
  },

  // Get reports by internship
  getReportsByInternship: async (internshipId) => {
    const response = await axiosClient.get(`/reports/internship/${internshipId}`);
    return response.data;
  },

  // Get reports by student
  getReportsByStudent: async (studentId) => {
    const response = await axiosClient.get(`/reports/student/${studentId}`);
    return response.data;
  },

  // Get reports by teacher with pagination and filtering
  getReportsByTeacher: async (teacherId, params = {}) => {
    const response = await axiosClient.get(`/reports/teacher/${teacherId}`, { params });
    // Handle both paginated and non-paginated responses
    if (response.data.content) {
      // Paginated response
      return {
        data: response.data.content || [],
        total: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.number || 0,
        size: response.data.size || params.size || 10
      };
    } else if (Array.isArray(response.data)) {
      // Simple array response
      return {
        data: response.data,
        total: response.data.length,
        totalPages: 1,
        currentPage: 0,
        size: response.data.length
      };
    } else {
      // Single object response (edge case)
      return {
        data: [response.data],
        total: 1,
        totalPages: 1,
        currentPage: 0,
        size: 1
      };
    }
  },

  // Get reports by mentor
  getReportsByMentor: async (mentorId) => {
    const response = await axiosClient.get(`/reports/mentor/${mentorId}`);
    return response.data;
  },

  // Get reports by batch
  getReportsByBatch: async (batchId) => {
    const response = await axiosClient.get(`/reports/batch/${batchId}`);
    return response.data;
  },

  // Get reports by approval status
  getReportsByApprovalStatus: async (status) => {
    const response = await axiosClient.get(`/reports/approval-status/${status}`);
    return response.data;
  },

  // Get reports by date range
  getReportsByDateRange: async (startDate, endDate) => {
    const response = await axiosClient.get('/reports/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get reports by status
  getReportsByStatus: async (status) => {
    const response = await axiosClient.get(`/reports/status/${status}`);
    return response.data;
  },

  // Get reports by type
  getReportsByType: async (type) => {
    const response = await axiosClient.get(`/reports/type/${type}`);
    return response.data;
  },

  // Update report status with feedback and grade
  updateReportStatus: async (id, statusData) => {
    const response = await axiosClient.put(`/reports/${id}/status`, statusData);
    return response.data;
  },

  // Get report statistics for student
  getReportStatistics: async (studentId) => {
    const response = await axiosClient.get(`/reports/student/${studentId}/statistics`);
    return response.data;
  },

  // Get next week number for student
  getNextWeekNumber: async (studentId) => {
    const response = await axiosClient.get(`/reports/student/${studentId}/next-week`);
    return response.data;
  },

  // Check if student can submit weekly report for specific week
  canSubmitWeeklyReport: async (studentId, weekNumber) => {
    const response = await axiosClient.get(`/reports/student/${studentId}/can-submit-week/${weekNumber}`);
    return response.data;
  },

  // Get latest report by type
  getLatestReportByType: async (studentId, type) => {
    const response = await axiosClient.get(`/reports/student/${studentId}/latest/${type}`);
    return response.data;
  },

  // Submit report for review
  submitReport: async (id) => {
    const response = await axiosClient.put(`/reports/${id}/submit`);
    return response.data;
  },

  // Download file attachment
  downloadFile: async (fileName) => {
    const response = await axiosClient.get(`/files/download/${encodeURIComponent(fileName)}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // View file attachment
  viewFile: async (fileName) => {
    const response = await axiosClient.get(`/files/view/${encodeURIComponent(fileName)}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Upload files
  uploadFiles: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await axiosClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default reportService; 