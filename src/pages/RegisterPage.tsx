// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { register as registerService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, UserCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Nam', // Giá trị mặc định
    fullName: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      addToast({ message: 'Mật khẩu xác nhận không khớp.', type: 'error' });
      return;
    }
    try {
      // Gửi đầy đủ thông tin theo yêu cầu của backend
      await registerService({
        username: form.username,
        email: form.email,
        password: form.password,
        gender: form.gender,
        fullName: form.fullName || null, // Gửi null nếu rỗng
        phoneNumber: form.phoneNumber || null, // Gửi null nếu rỗng
      });
      addToast({ message: 'Đăng ký thành công! Vui lòng đăng nhập.', type: 'success' });
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra.';
      addToast({ message: `Đăng ký thất bại: ${errorMessage}`, type: 'error' });
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center font-sans bg-cover bg-center"
      style={{ backgroundImage: 'url(https://images.pexels.com/photos/998646/pexels-photo-998646.jpeg)' }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 space-y-3 bg-white/70 rounded-2xl shadow-lg backdrop-blur-sm"
      >
        <h2 className="text-4xl font-bold text-center text-gray-800">Đăng Ký</h2>

        {/* Username */}
        <div className="relative">
          <input
            type="text" name="username" placeholder="Tên đăng nhập *"
            onChange={handleChange} value={form.username} required
            className="w-full px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <User className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email" name="email" placeholder="Email *"
            onChange={handleChange} value={form.email} required
            className="w-full px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Mail className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        {/* Full Name */}
        <div className="relative">
          <input
            type="text" name="fullName" placeholder="Họ và tên"
            onChange={handleChange} value={form.fullName}
            className="w-full px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <UserCircle className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        {/* Phone Number */}
        <div className="relative">
          <input
            type="tel" name="phoneNumber" placeholder="Số điện thoại"
            onChange={handleChange} value={form.phoneNumber}
            className="w-full px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Phone className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Gender */}
        <div>
          <select
            name="gender"
            onChange={handleChange}
            value={form.gender}
            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} name="password" placeholder="Mật khẩu *"
            onChange={handleChange} value={form.password} required
            className="w-full px-4 py-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute text-gray-400 right-4 top-1/2 -translate-y-1/2 hover:text-gray-600">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Xác nhận mật khẩu *"
            onChange={handleChange} value={form.confirmPassword} required
            className="w-full px-4 py-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
           <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute text-gray-400 right-4 top-1/2 -translate-y-1/2 hover:text-gray-600">
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 font-bold text-white bg-[#B77B4F] rounded-full hover:bg-[#a56c3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B77B4F] transition-colors"
        >
          Đăng ký
        </button>

        <div className="text-sm text-center text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-gray-800 hover:underline">
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}