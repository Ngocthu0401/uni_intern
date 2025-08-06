import axiosClient from './axiosClient';

const authService = {
  // User registration
  signup: async (userData) => {
    const response = await axiosClient.post('/auth/signup', userData);
    return response.data;
  },

  // User login
  signin: async (credentials) => {
    const response = await axiosClient.post('/auth/signin', credentials);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await axiosClient.post('/auth/reset-password', {
      token,
      password: newPassword
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosClient.get('/users/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await axiosClient.put('/users/me', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwords) => {
    const response = await axiosClient.put('/users/me/password', passwords);
    return response.data;
  }
};

export default authService; 