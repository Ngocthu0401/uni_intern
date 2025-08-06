import axiosClient from './axiosClient';

const contractService = {
  // Get all contracts with pagination and filtering
  getContracts: async (params = {}) => {
    const response = await axiosClient.get('/contracts', { params });
    return response.data;
  },

  // Get all contracts (alias for admin)
  getAllContracts: async (params = {}) => {
    const response = await axiosClient.get('/contracts', { params });
    // Handle both paginated and non-paginated responses
    if (response.data.content) {
      return {
        content: response.data.content || [],
        data: response.data.content || [],
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 1,
        number: response.data.number || 0,
        size: response.data.size || params.size || 10
      };
    }
    return response.data;
  },

  // Get contract by ID
  getContractById: async (id) => {
    const response = await axiosClient.get(`/contracts/${id}`);
    return response.data;
  },

  // Create new contract
  createContract: async (contractData) => {
    const response = await axiosClient.post('/contracts', contractData);
    return response.data;
  },

  // Update contract
  updateContract: async (id, contractData) => {
    const response = await axiosClient.put(`/contracts/${id}`, contractData);
    return response.data;
  },

  // Delete contract
  deleteContract: async (id) => {
    const response = await axiosClient.delete(`/contracts/${id}`);
    return response.data;
  },

  // Sign contract
  signContract: async (id, signatureData) => {
    const response = await axiosClient.put(`/contracts/${id}/sign`, signatureData);
    return response.data;
  },

  // Activate contract
  activateContract: async (id) => {
    const response = await axiosClient.put(`/contracts/${id}/activate`);
    return response.data;
  },

  // Expire contract
  expireContract: async (id) => {
    const response = await axiosClient.put(`/contracts/${id}/expire`);
    return response.data;
  },

  // Terminate contract
  terminateContract: async (id, reason) => {
    const response = await axiosClient.put(`/contracts/${id}/terminate`, { reason });
    return response.data;
  },

  // Get contracts by internship
  getContractsByInternship: async (internshipId) => {
    const response = await axiosClient.get(`/contracts/internship/${internshipId}`);
    return response.data;
  },

  // Get contracts by status
  getContractsByStatus: async (status) => {
    const response = await axiosClient.get(`/contracts/status/${status}`);
    return response.data;
  },

  // Get contracts by student
  getContractsByStudent: async (studentId) => {
    const response = await axiosClient.get(`/contracts/student/${studentId}`);
    return response.data;
  },

  // Get contracts by company
  getContractsByCompany: async (companyId) => {
    const response = await axiosClient.get(`/contracts/company/${companyId}`);
    return response.data;
  },

  // Teacher-specific methods
  getContractsByTeacher: async (teacherId, params = {}) => {
    const response = await axiosClient.get(`/contracts/teacher/${teacherId}`, { params });
    // Handle both paginated and non-paginated responses
    if (response.data.content) {
      return {
        content: response.data.content || [],
        data: response.data.content || [],
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 1,
        number: response.data.number || 0,
        size: response.data.size || params.size || 10
      };
    }
    return response.data;
  },

  createSupportContract: async (contractData) => {
    const response = await axiosClient.post('/contracts/teacher', contractData);
    return response.data;
  },

  approveContract: async (id, approvedBy) => {
    const response = await axiosClient.put(`/contracts/${id}/approve?approvedBy=${encodeURIComponent(approvedBy)}`);
    return response.data;
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    const response = await axiosClient.put(`/contracts/${id}/payment?paymentStatus=${paymentStatus}`);
    return response.data;
  },

  rejectContract: async (id, rejectedBy) => {
    const response = await axiosClient.put(`/contracts/${id}/reject?rejectedBy=${encodeURIComponent(rejectedBy)}`);
    return response.data;
  },

  updateContractStatus: async (id, status) => {
    const response = await axiosClient.put(`/contracts/${id}/status?status=${status}`);
    return response.data;
  },

  // Get contract templates
  getContractTemplates: async () => {
    const response = await axiosClient.get('/contracts/templates');
    return response.data;
  },

  // Generate contract code
  generateContractCode: async () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `CONTRACT-${timestamp}-${random}`;
  },

  // Search contracts with advanced filters
  searchContracts: async (filters = {}) => {
    const response = await axiosClient.get('/contracts/search', { params: filters });
    return response.data;
  }
};

export default contractService; 