// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api'; // Import instance axios đã cấu hình

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (jwt: string) => void;
  logout: () => void;
}

// Tạo Context với giá trị mặc định
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // useEffect sẽ chạy một lần khi component được mount
  // để kiểm tra và thiết lập token cho axios nếu có sẵn
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const login = (jwt: string) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
    // Cập nhật header cho mọi request sau khi đăng nhập
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    // Xóa header Authorization
    delete api.defaults.headers.common['Authorization'];
  };

  const authContextValue = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};