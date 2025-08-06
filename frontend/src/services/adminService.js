import axiosClient from './axiosClient';

export const adminService = {
  // Dashboard APIs
  getDashboardStats: () => axiosClient.get('/admin/dashboard'),
  getDashboardCharts: () => axiosClient.get('/admin/dashboard/charts'),
  getRecentActivities: (limit = 10) => axiosClient.get(`/admin/dashboard/recent-activities?limit=${limit}`),
  getSystemInfo: () => axiosClient.get('/admin/system-info'),
  getReportsSummary: () => axiosClient.get('/admin/reports/summary'),

  // Search APIs
  searchStudents: (params) => axiosClient.get('/students/advanced-search', { params }),
  searchCompanies: (params) => axiosClient.get('/companies/advanced-search', { params }),
  searchTeachers: (params) => axiosClient.get('/teachers/advanced-search', { params }),
  searchMentors: (params) => axiosClient.get('/mentors/advanced-search', { params }),

  // Export APIs
  exportStudents: (params) => axiosClient.get('/students/export', { params }),
  exportCompanies: (params) => axiosClient.get('/companies/export', { params }),
  exportTeachers: (params) => axiosClient.get('/teachers/export', { params }),
  exportMentors: (params) => axiosClient.get('/mentors/export', { params }),

  // Statistics APIs
  getStudentStatistics: () => axiosClient.get('/students/statistics/by-status'),
  getCompanyStatistics: () => axiosClient.get('/companies/statistics'),
  getInternshipStatistics: () => axiosClient.get('/internships/statistics'),
};

export default adminService; 