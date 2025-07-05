import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
  const handleLogin = (token: string) => {
    // ví dụ: lưu token hoặc chuyển trang
    localStorage.setItem('token', token);
    console.log('Đăng nhập thành công, token:', token);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
