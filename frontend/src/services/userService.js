import axiosClient from './axiosClient';

const userService = {
  // Create user for teacher/mentor/student
  createUser: async (userData) => {
    const response = await axiosClient.post('/auth/signup', userData);
    return response.data;
  },

  // Get user by username
  getUserByUsername: async (username) => {
    const response = await axiosClient.get(`/users/username/${username}`);
    return response.data;
  },

  // Get user by email
  getUserByEmail: async (email) => {
    const response = await axiosClient.get(`/users/email/${email}`);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosClient.get('/users/me');
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await axiosClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Check if username exists
  checkUsernameExists: async (username) => {
    try {
      await axiosClient.get(`/users/username/${username}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  },

  // Check if email exists
  checkEmailExists: async (email) => {
    try {
      await axiosClient.get(`/users/email/${email}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }
};

export default userService; 