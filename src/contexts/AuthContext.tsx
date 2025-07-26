import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User, getUserProfile } from '../services/userService';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (jwt: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserOnLoad = async () => {
      if (token) {
        try {
          // Interceptor sẽ tự động gắn token cho request này
          const profile = await getUserProfile();
          setUser(profile);
        } catch (error) {
          console.error("Token không hợp lệ, đang đăng xuất...", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    fetchUserOnLoad();
  }, []); // Chỉ chạy một lần lúc tải

  const login = async (jwt: string) => {
    localStorage.setItem('token', jwt);
    setToken(jwt); // Cập nhật token trong state
    // Sau khi setToken, useEffect sẽ không chạy lại, nên ta cần fetch user thủ công
    try {
        const profile = await getUserProfile();
        setUser(profile);
    } catch (error) {
        console.error("Không thể lấy thông tin người dùng sau khi đăng nhập.", error);
        logout(); // Nếu lỗi, đăng xuất để đảm bảo an toàn
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Không cần xóa header thủ công nữa, vì interceptor sẽ không tìm thấy token
  };

  const authContextValue = { token, user, isAuthenticated: !!user, isLoading, login, logout };
  
  if (isLoading) {
      return <div>Đang tải ứng dụng...</div>;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};