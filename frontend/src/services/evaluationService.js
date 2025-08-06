import axiosClient from './axiosClient';

const evaluationService = {
  // Get all evaluations with pagination and filtering
  getEvaluations: async (params = {}) => {
    const response = await axiosClient.get('/evaluations', { params });
    return response.data;
  },

  // Get evaluation by ID
  getEvaluationById: async (id) => {
    const response = await axiosClient.get(`/evaluations/${id}`);
    return response.data;
  },

  // Create new evaluation
  createEvaluation: async (evaluationData) => {
    const response = await axiosClient.post('/evaluations', evaluationData);
    return response.data;
  },

  // Update evaluation
  updateEvaluation: async (id, evaluationData) => {
    const response = await axiosClient.put(`/evaluations/${id}`, evaluationData);
    return response.data;
  },

  // Delete evaluation
  deleteEvaluation: async (id) => {
    const response = await axiosClient.delete(`/evaluations/${id}`);
    return response.data;
  },

  // Get evaluations by internship
  getEvaluationsByInternship: async (internshipId) => {
    const response = await axiosClient.get(`/evaluations/internship/${internshipId}`);
    return response.data;
  },

  // Get evaluations by student
  getEvaluationsByStudent: async (studentId) => {
    const response = await axiosClient.get(`/evaluations/student/${studentId}`);
    return response.data;
  },

  // Get evaluations by teacher with pagination and filtering
  getEvaluationsByTeacher: async (teacherId, params = {}) => {
    const response = await axiosClient.get(`/evaluations/teacher/${teacherId}`, { params });
    return {
      data: response.data.content || response.data,
      total: response.data.totalElements || response.data.length || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.number || 0,
      size: response.data.size || params.size || 10
    };
  },

  // Get evaluations by mentor
  getEvaluationsByMentor: async (mentorId) => {
    const response = await axiosClient.get(`/evaluations/mentor/${mentorId}`);
    return response.data;
  },

  // Get evaluations by batch
  getEvaluationsByBatch: async (batchId) => {
    const response = await axiosClient.get(`/evaluations/batch/${batchId}`);
    return response.data;
  },

  // Get evaluations by score range
  getEvaluationsByScoreRange: async (minScore, maxScore) => {
    const response = await axiosClient.get('/evaluations/score-range', {
      params: { minScore, maxScore }
    });
    return response.data;
  },

  // Get average score by internship - Statistics
  getAverageScoreByInternship: async (internshipId) => {
    const response = await axiosClient.get(`/evaluations/statistics/average-score/internship/${internshipId}`);
    return response.data;
  },

  // Get average score by student - Statistics
  getAverageScoreByStudent: async (studentId) => {
    const response = await axiosClient.get(`/evaluations/statistics/average-score/student/${studentId}`);
    return response.data;
  },

  // Get evaluation statistics summary
  getEvaluationStatistics: async (params = {}) => {
    const response = await axiosClient.get('/evaluations/statistics', { params });
    return response.data;
  },

  // Get evaluation statistics for teacher
  getEvaluationStats: async (teacherId) => {
    const response = await axiosClient.get(`/evaluations/teacher/${teacherId}/statistics`);
    return { data: response.data };
  }
};

export default evaluationService; 