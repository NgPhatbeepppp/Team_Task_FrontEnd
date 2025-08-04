// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { login as loginService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, User } from 'lucide-react'; // Thêm icons cho đẹp hơn
import { useToast } from '../hooks/useToast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

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
      addToast({ message: `Đăng nhập thất bại: ${errorMessage}`, type: 'error' });
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center font-sans bg-cover bg-center"
      style={{ backgroundImage: 'url(https://images.pexels.com/photos/998646/pexels-photo-998646.jpeg)' }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 space-y-6 bg-white/60 rounded-2xl shadow-lg backdrop-blur-sm"
      >
        <h2 className="text-4xl font-bold text-center text-gray-800">Đăng Nhập</h2>

        {/* Username */}
        <div className="relative">
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            onChange={handleChange}
            value={form.username}
            required
            className="w-full px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <User className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Mật khẩu"
            onChange={handleChange}
            value={form.password}
            required
            className="w-full px-4 py-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-gray-400 right-4 top-1/2 -translate-y-1/2 hover:text-gray-600"
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Checkbox + link */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={handleRememberChange}
              className="w-4 h-4 mr-2 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            Nhớ mật khẩu
          </label>
          <Link to="/reset-password" className="font-medium text-indigo-600 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Login button */}
        <button
          type="submit"
          className="w-full py-3 font-bold text-white bg-[#B77B4F] rounded-full hover:bg-[#a56c3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B77B4F] transition-colors"
        >
          Đăng nhập
        </button>

        {/* Register link */}
        <div className="text-sm text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-gray-800 hover:underline">
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  );
}