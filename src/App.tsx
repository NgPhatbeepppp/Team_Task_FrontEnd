import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import TeamPage from './pages/TeamPage'; 
import NotificationsPage from './pages/NotificationsPage';

// Component trung gian để xử lý logic Route được bảo vệ
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Nếu đang trong quá trình xác thực, có thể hiển thị loading
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Component chứa các Routes của ứng dụng
function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Các route công khai */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/teams" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/teams" /> : <RegisterPage />} />

      {/* Route được bảo vệ cho trang Teams */}
      <Route 
        path="/teams" 
        element={
          <ProtectedRoute>
            <TeamPage />
          </ProtectedRoute>
        } 
      />
      {/* Route được bảo vệ cho trang Lời mời & Thông báo */}
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } 
      />
      {/* Route được bảo vệ cho trang Profile */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        } 
      />

      {/* Route mặc định: Điều hướng đến /teams nếu đã đăng nhập, ngược lại về /login */}
      <Route 
        path="/"
        element={<Navigate to={isAuthenticated ? "/teams" : "/login"} />}
      />
    </Routes>
  );
}

// Component App chính
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
