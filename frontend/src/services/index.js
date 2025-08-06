// Export all services
export { default as axiosClient } from './axiosClient';
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as studentService } from './studentService';
export { default as teacherService } from './teacherService';
export { default as companyService } from './companyService';
export { default as mentorService } from './mentorService';
export { default as batchService } from './batchService';
export { default as internshipService } from './internshipService';
export { default as reportService } from './reportService';
export { default as evaluationService } from './evaluationService';
export { default as contractService } from './contractService';

// Export utilities
export const API_BASE_URL = 'http://localhost:8080/api';

// Export commonly used API functions
export const apiHelpers = {
  // Format error messages
  formatErrorMessage: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Đã xảy ra lỗi không xác định';
  },

  // Handle API pagination
  buildPaginationParams: (page = 0, size = 10, sort = 'id,desc') => {
    return { page, size, sort };
  },

  // Handle search params
  buildSearchParams: (searchTerm, field = 'name') => {
    return searchTerm ? { [field]: searchTerm } : {};
  },

  // Format date for API
  formatDate: (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  },

  // Parse API response for pagination
  parsePaginatedResponse: (response) => {
    return {
      content: response.content || [],
      totalElements: response.totalElements || 0,
      totalPages: response.totalPages || 0,
      currentPage: response.number || 0,
      size: response.size || 10,
      isEmpty: response.empty || false,
      isFirst: response.first || false,
      isLast: response.last || false
    };
  }
}; 