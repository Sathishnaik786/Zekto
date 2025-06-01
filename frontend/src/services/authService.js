import axios from 'axios';
import { API_BASE_URLS, API_ENDPOINTS } from '../utils/apiConfig';

const authApi = axios.create({
  baseURL: API_BASE_URLS.AUTH,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  loginWithOTP: async (phoneNumber, otp) => {
    try {
      const response = await authApi.post(API_ENDPOINTS.AUTH.LOGIN, { phoneNumber, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  requestOTP: async (phoneNumber) => {
    try {
      const response = await authApi.post(API_ENDPOINTS.AUTH.REGISTER, { phoneNumber });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyOTP: async (phoneNumber, otp) => {
    try {
      const response = await authApi.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { phoneNumber, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await authApi.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await authApi.patch(API_ENDPOINTS.AUTH.PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 