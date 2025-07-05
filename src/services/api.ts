// src/services/api.ts
import axios from 'axios';

// Cấu hình mặc định
const api = axios.create({
  baseURL: 'http://localhost:5250/api', // Thay đổi baseURL nếu cần
  timeout: 10000, // 10s timeout
});

// Interceptor: Gắn token vào tất cả request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Lỗi khi cấu hình request
    console.error('Request config error:', error);
    return Promise.reject(error);
  }
);

// Interceptor: Xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized: Token không hợp lệ hoặc đã hết hạn.');
      // Có thể redirect về trang login tại đây nếu muốn:
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
