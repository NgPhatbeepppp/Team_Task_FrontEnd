<<<<<<< HEAD
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
>>>>>>> 3324a351c179aa835566c445dd5462a902714383
import LoginPage from './pages/LoginPage';

function App() {
  return (
<<<<<<< HEAD
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <LoginPage />
    </div>
=======
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
>>>>>>> 3324a351c179aa835566c445dd5462a902714383
  );
}

export default App;
