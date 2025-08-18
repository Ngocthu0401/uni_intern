import axiosClient from './axiosClient';
import { PaginationOptions } from '../models/SearchCriteria';

const batchService = {
  // Get all batches with pagination and filtering
  getBatches: async (params = {}) => {
    const response = await axiosClient.get('/batches', { params });
    return response.data;
  },

  // Search batches with criteria and pagination
  searchBatches: async (searchCriteria = {}, pagination = new PaginationOptions()) => {
    // Use PaginationOptions class for safe pagination handling
    const paginationOptions = pagination instanceof PaginationOptions ?
      pagination : new PaginationOptions(pagination);

    const apiParams = paginationOptions.toApiParams();

    try {
      // If we have a keyword, use search endpoint
      if (searchCriteria.keyword && searchCriteria.keyword.trim()) {
        const searchParams = {
          ...apiParams,
          keyword: searchCriteria.keyword.trim()
        };

        const response = await axiosClient.get('/batches/search', { params: searchParams });
        return {
          data: response.data.content || response.data,
          total: response.data.totalElements || response.data.length || 0,
          totalPages: response.data.totalPages || 1,
          currentPage: (response.data.number || 0) + 1, // Convert back to 1-based
          size: response.data.size || apiParams.size,
          hasNext: !response.data.last,
          hasPrevious: response.data.first === false
        };
      } else {
        // Use regular get all endpoint with pagination
        const response = await axiosClient.get('/batches', { params: apiParams });
        return {
          data: response.data.content || response.data,
          total: response.data.totalElements || response.data.length || 0,
          totalPages: response.data.totalPages || 1,
          currentPage: (response.data.number || 0) + 1, // Convert back to 1-based
          size: response.data.size || apiParams.size,
          hasNext: !response.data.last,
          hasPrevious: response.data.first === false
        };
      }
    } catch (error) {
      console.error('Error searching batches:', error);
      // Return empty result on error
      return {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        size: paginationOptions.size,
        hasNext: false,
        hasPrevious: false,
        error: error.message || 'Lỗi khi tìm kiếm đợt thực tập'
      };
    }
  },

  // Get batch by ID
  getBatchById: async (id) => {
    const response = await axiosClient.get(`/batches/${id}`);
    return response.data;
  },

  // Create new batch
  createBatch: async (batchData) => {
    // Use toApiPayload method if available, otherwise manual mapping
    const payload = batchData.toApiPayload ? batchData.toApiPayload() : {
      name: batchData.name || batchData.batchName,
      batchCode: batchData.batchCode || `BATCH_${Date.now()}`,
      description: batchData.description || '',
      academicYear: batchData.academicYear,
      semester: batchData.semester,
      registrationStartDate: batchData.registrationStartDate,
      registrationEndDate: batchData.registrationEndDate,
      startDate: batchData.startDate || batchData.internshipStartDate,
      endDate: batchData.endDate || batchData.internshipEndDate,
      maxStudents: batchData.maxStudents || 100,
      companyId: batchData.companyId || null,
      isActive: true
    };

    const response = await axiosClient.post('/batches', payload);
    return response.data;
  },

  // Update batch
  updateBatch: async (id, batchData) => {
    // Use toApiPayload method if available, otherwise manual mapping
    const payload = batchData.toApiPayload ? batchData.toApiPayload() : {
      id: id,
      batchName: batchData.name || batchData.batchName,
      batchCode: batchData.batchCode,
      description: batchData.description || '',
      academicYear: batchData.academicYear,
      semester: batchData.semester,
      registrationStartDate: batchData.registrationStartDate,
      registrationEndDate: batchData.registrationEndDate,
      startDate: batchData.startDate || batchData.internshipStartDate,
      endDate: batchData.endDate || batchData.internshipEndDate,
      maxStudents: batchData.maxStudents || 100,
      companyId: batchData.companyId || null,
      isActive: batchData.isActive !== undefined ? batchData.isActive : true
    };

    const response = await axiosClient.put(`/batches/${id}`, payload);
    return response.data;
  },

  // Delete batch
  deleteBatch: async (id) => {
    const response = await axiosClient.delete(`/batches/${id}`);
    return response.data;
  },

  // Get active batches
  getActiveBatches: async () => {
    const response = await axiosClient.get('/batches/active');
    return response.data;
  },

  // Get registration active batches
  getRegistrationActiveBatches: async () => {
    const response = await axiosClient.get('/batches/registration-active');
    return response.data;
  },

  // Get ongoing batches
  getOngoingBatches: async () => {
    const response = await axiosClient.get('/batches/ongoing');
    return response.data;
  },

  // Get batches by semester
  getBatchesBySemester: async (semester) => {
    const response = await axiosClient.get('/batches/semester', {
      params: { semester }
    });
    return response.data;
  },

  // Get batch statistics
  getBatchStatistics: async () => {
    const response = await axiosClient.get('/batches/statistics/count');
    return response.data;
  },

  // Get active batch count
  getActiveBatchCount: async () => {
    const response = await axiosClient.get('/batches/statistics/active-count');
    return response.data;
  },

  // Export batches
  exportBatches: async (searchCriteria = {}) => {
    const params = searchCriteria.toSearchParams ?
      searchCriteria.toSearchParams() : searchCriteria;

    const response = await axiosClient.get('/batches/export', {
      params: params,
      responseType: 'blob'
    });
    return response.data;
  }
};

export default batchService; 