import axios from 'axios';

const API_BASE = 'https://localhost:5250/api/auth';

export const register = async (data: any) => {
  const response = await axios.post(`${API_BASE}/register`, data);
  return response.data.token;
};

export const login = async (data: any) => {
  const response = await axios.post(`${API_BASE}/login`, data);
  return response.data.token;
};
