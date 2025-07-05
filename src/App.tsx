// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  // Thay vì dùng state, chúng ta sẽ đọc trực tiếp từ localStorage
  // để quyết định có nên cho vào trang profile hay không.
  const token = localStorage.getItem('token');

  const handleLogin = (jwt: string) => {
    localStorage.setItem('token', jwt);
    // Thay vì set state, chúng ta sẽ điều hướng hoặc reload trang
    window.location.href = "/profile"; // Đơn giản nhất là reload để private route kiểm tra lại
  };

  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;