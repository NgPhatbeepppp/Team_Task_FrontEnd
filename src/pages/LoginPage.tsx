// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { login as loginService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [form, setForm] = useState({ username: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemember(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await loginService(form);
      login(token);       
      navigate('/profile'); 
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra.';
      alert('Đăng nhập thất bại: ' + errorMessage);
    }
  };

  return (
    <div style={{
      backgroundImage: 'url(https://images.pexels.com/photos/998646/pexels-photo-998646.jpeg)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(255,255,255,0.6)',
        padding: '30px',
        borderRadius: '18px',
        width: '340px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(4px)'
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '50px', marginBottom: '20px' }}>Đăng Nhập</h2>

        {/* Username */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            value={form.username}
            required
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              borderRadius: '999px',
              border: '1px solid #ccc',
              fontSize: '1em',
              boxSizing: 'border-box'
            }}
          />
          <span style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.2em',
            pointerEvents: 'none'
          }}>
            👤
          </span>
        </div>

        {/* Password */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              borderRadius: '999px',
              border: '1px solid #ccc',
              fontSize: '1em',
              boxSizing: 'border-box'
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.2em',
              cursor: 'pointer'
            }}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        {/* Checkbox + link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.95em' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={handleRememberChange}
              style={{ marginRight: '6px' }}
            />
            Nhớ mật khẩu
          </label>
          <a href="#" style={{ fontSize: '0.95em', color: '#333' }}>
            Quên mật khẩu ?
          </a>
        </div>

        {/* Login button */}
        <button type="submit" style={{
          width: '100%',
          padding: '12px',
          borderRadius: '999px',
          backgroundColor: '#B77B4F',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1em',
          border: 'none',
          cursor: 'pointer'
        }}>
          Đăng nhập
        </button>

        {/* Register link */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.95em' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ fontWeight: 'bold', color: '#000', textDecoration: 'none' }}>
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  );
}