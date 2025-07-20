// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import TeamManagementPage from './pages/TeamManagementPage';

function AppWrapper() {
  // Vì useNavigate chỉ có thể dùng bên trong component con của BrowserRouter,
  // chúng ta tạo một component bao bọc là AppWrapper
  const navigate = useNavigate();

  // Đọc token từ localStorage
  const token = localStorage.getItem('token');

  const handleLogin = (jwt: string) => {
    localStorage.setItem('token', jwt);
    // ✅ SỬA LỖI: Sử dụng navigate để chuyển trang mượt mà, không tải lại trang.
    navigate("/profile");
  };

  return (
      <Routes>
        {/* Route chung cho mọi người */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Route được bảo vệ */}
        <Route 
          path="/profile" 
          element={token ? <UserProfilePage /> : <Navigate to="/login" />} 
        />

        {/* Route mặc định: nếu có token thì vào profile, không thì ra trang login */}
        <Route 
          path="/"
          element={token ? <Navigate to="/profile" /> : <Navigate to="/login" />}
        />

        {/* Thêm các route khác cho các trang bạn đã tạo */}
        <Route 
          path="/teams" 
          element={token ? <TeamManagementPage /> : <Navigate to="/login" />} 
        />
        
        {/* Thêm một catch-all hoặc trang 404 nếu cần */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>
      {/* AppWrapper bây giờ nằm bên trong BrowserRouter */}
      <AppWrapper />
    </BrowserRouter>
  );
}





export default App;