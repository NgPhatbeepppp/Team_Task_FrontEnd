// src/App.tsx
import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // ✅ Chỉ import Provider từ context
import { useAuth } from './hooks/useAuth';             // ✅ Import hook từ thư mục hooks
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';

// Component trung gian để xử lý logic Route được bảo vệ
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" /> : <RegisterPage />} />

      {/* Route được bảo vệ */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        } 
      />

      {/* Route mặc định */}
      <Route 
        path="/"
        element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />}
      />
    </Routes>
  );
}

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