import axiosClient from './axiosClient';

const companyService = {
  // Get all companies with pagination and filtering
  getCompanies: async (params = {}) => {
    const response = await axiosClient.get('/companies', { params });
    return response.data;
  },

  // Search companies with criteria and pagination
  searchCompanies: async (searchCriteria = {}, pagination = {}) => {
    // Convert 1-based to 0-based pagination for backend
    const page = Math.max(0, (pagination.page || 1) - 1);

    const params = {
      keyword: searchCriteria.keyword || '',
      industry: searchCriteria.industry || null,
      location: searchCriteria.location || null,
      isActive: searchCriteria.isActive || null,
      companyType: searchCriteria.companyType || null,
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

    const response = await axiosClient.get('/companies/search', { params });
    return {
      data: response.data.content || response.data,
      total: response.data.totalElements || response.data.length || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.number || 0,
      size: response.data.size || params.size || 10
    };
  },

  // Get company by ID
  getCompanyById: async (id) => {
    const response = await axiosClient.get(`/companies/${id}`);
    return response.data;
  },

  // Create new company
  createCompany: async (companyData) => {
    const response = await axiosClient.post('/companies', companyData);
    return response.data;
  },

  // Update company
  updateCompany: async (id, companyData) => {
    const response = await axiosClient.put(`/companies/${id}`, companyData);
    return response.data;
  },

  // Delete company
  deleteCompany: async (id) => {
    const response = await axiosClient.delete(`/companies/${id}`);
    return response.data;
  },

  // Activate company
  activateCompany: async (id) => {
    const response = await axiosClient.put(`/companies/${id}/activate`);
    return response.data;
  },

  // Deactivate company
  deactivateCompany: async (id) => {
    const response = await axiosClient.put(`/companies/${id}/deactivate`);
    return response.data;
  },

  // Search companies by industry
  searchByIndustry: async (industry) => {
    const response = await axiosClient.get('/companies/search/industry', {
      params: { industry }
    });
    return response.data;
  },

  // Search companies by location
  searchByLocation: async (location) => {
    const response = await axiosClient.get('/companies/search/location', {
      params: { location }
    });
    return response.data;
  },

  // Get companies by type
  getCompaniesByType: async (type) => {
    const response = await axiosClient.get('/companies/type', {
      params: { type }
    });
    return response.data;
  },

  // Get active companies (list)
  getActiveCompanies: async () => {
    const response = await axiosClient.get('/companies/active');
    return response.data;
  },

  // Get company statistics
  getCompanyStatistics: async () => {
    const response = await axiosClient.get('/companies/statistics');
    return response.data;
  },

  // Export companies
  exportCompanies: async (searchCriteria = {}) => {
    const response = await axiosClient.get('/companies/export', {
      params: searchCriteria,
      responseType: 'blob'
    });
    return response.data;
  },

  // Get companies with available positions
  getCompaniesWithPositions: async () => {
    const response = await axiosClient.get('/companies/with-positions');
    return response.data;
  }
};

export default companyService; 