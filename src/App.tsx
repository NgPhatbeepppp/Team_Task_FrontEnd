import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import TeamPage from './pages/TeamPage'; 
import NotificationsPage from './pages/NotificationsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectWorkspacePage from './pages/ProjectWorkspacePage'; 
import ProjectSettingsPage from './pages/ProjectSettingsPage';
import MyTasksPage from './pages/MyTasksPage';
import HomePage from './pages/HomePage'; 

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
      {/* ✅ THAY ĐỔI: Chuyển hướng về trang chủ "/" nếu đã đăng nhập */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
      
      {/* Route được bảo vệ cho trang chủ */}
      <Route 
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      
      {/* Các route được bảo vệ khác */}
      <Route path="/tasks" element={<ProtectedRoute><MyTasksPage /></ProtectedRoute>} />
      <Route path="/teams" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/project/:projectId" element={<ProtectedRoute><ProjectWorkspacePage /></ProtectedRoute>} />
      <Route path="/project/:projectId/settings" element={<ProtectedRoute><ProjectSettingsPage /></ProtectedRoute>} />

      {/* ✅ THAY ĐỔI: Route "catch-all" thông minh hơn */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/" : "/login"} />} 
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
