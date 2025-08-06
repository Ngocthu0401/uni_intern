import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axiosClient from '../services/axiosClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('AuthContext - Parsed user from localStorage:', parsedUser);
          
          // Set user immediately from localStorage for fast UI
          setUser(parsedUser);
          setIsAuthenticated(true);
          setLoading(false);
          
          // Then fetch fresh user data from backend to get complete info
          try {
            const response = await axiosClient.get('/users/me');
            const freshUserData = response.data;
            console.log('AuthContext - Fresh user data from backend:', freshUserData);
            
            // Update with fresh data if different
            if (JSON.stringify(freshUserData) !== JSON.stringify(parsedUser)) {
              setUser(freshUserData);
              localStorage.setItem('user', JSON.stringify(freshUserData));
              console.log('AuthContext - Updated user data with fresh backend data');
            }
          } catch (apiError) {
            console.warn('Failed to fetch fresh user data, using localStorage data:', apiError);
            // Keep using localStorage data if API fails
          }
          
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data immediately
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Empty dependency array is correct here

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/signin', {
        username: email,
        password
      });

      // Destructure the actual response structure from backend
      const { token, type, id, username, email: userEmail, fullName, role } = response.data;
      
      const userData = {
        id,
        username,
        email: userEmail,
        fullName,
        role // Store role as single value, not array
      };

      // Store in localStorage immediately
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state immediately for fast UI response
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false); // Set loading false immediately after success
      
      console.log('AuthContext - Login successful:', userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false); // Set loading false on error too
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/signup', userData);
      return { 
        success: true, 
        message: response.data?.message || 'Đăng ký thành công' 
      };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function (memoized)
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Get current user info (memoized)
  const getCurrentUser = useCallback(async () => {
    try {
      const response = await axiosClient.get('/users/me');
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      logout();
      return null;
    }
  }, [logout]);

  // Check if user has specific role (memoized)
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user?.role]);

  // Check if user has any of the specified roles (memoized)
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user?.role]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getCurrentUser,
    hasRole,
    hasAnyRole
  }), [user, loading, isAuthenticated, logout, getCurrentUser, hasRole, hasAnyRole]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};