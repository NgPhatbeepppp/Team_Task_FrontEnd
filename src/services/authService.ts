// src/services/authService.ts

import axios from 'axios';

const API_BASE = 'http://localhost:5250/api/auth';

export const register = async (data: any) => {
  const response = await axios.post(`${API_BASE}/register`, data);
  return response.data.token;
};

export const login = async (data: any) => {
  const response = await axios.post(`${API_BASE}/login`, data);
  return response.data.token;
};


/**
 * Gửi yêu cầu đặt lại mật khẩu mới.
 * @param token Token nhận từ email.
 * @param password Mật khẩu mới.
 * @returns Promise chứa thông điệp thành công.
 */
export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
  const response = await axios.post(`${API_BASE}/reset-password`, { token, password });
  return response.data;
};