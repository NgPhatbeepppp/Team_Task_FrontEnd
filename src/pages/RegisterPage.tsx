// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { register as registerService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, UserCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';

// Mảng tùy chọn giới tính để dễ dàng lặp qua
const genderOptions = ['Nam', 'Nữ', 'Khác'];

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      addToast({ message: 'Mật khẩu xác nhận không khớp.', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    try {
      await registerService({
        username: form.username,
        email: form.email,
        password: form.password,
        gender: form.gender,
        fullName: form.fullName || null,
        phoneNumber: form.phoneNumber || null,
      });
      addToast({ message: 'Đăng ký thành công! Vui lòng đăng nhập.', type: 'success' });
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra.';
      addToast({ message: `Đăng ký thất bại: ${errorMessage}`, type: 'error' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center font-sans bg-cover bg-center p-4"
      style={{ backgroundImage: 'url(https://images.pexels.com/photos/998646/pexels-photo-998646.jpeg)' }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-8 space-y-6 bg-white/70 rounded-2xl shadow-lg backdrop-blur-sm"
      >
        <h2 className="text-4xl font-bold text-center text-gray-800">Tạo tài khoản</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Cột 1 */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Tên đăng nhập *</label>
              <User className="absolute w-5 h-5 text-gray-400 left-3 top-9" />
              <input
                type="text" name="username"
                onChange={handleChange} value={form.username} required
                className="w-full mt-1 px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Cột 2 */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Email *</label>
              <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-9" />
              <input
                type="email" name="email"
                onChange={handleChange} value={form.email} required
                className="w-full mt-1 px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Cột 1 */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Họ và tên</label>
              <UserCircle className="absolute w-5 h-5 text-gray-400 left-3 top-9" />
              <input
                type="text" name="fullName"
                onChange={handleChange} value={form.fullName}
                className="w-full mt-1 px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Cột 2 */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
              <Phone className="absolute w-5 h-5 text-gray-400 left-3 top-9" />
              <input
                type="tel" name="phoneNumber"
                onChange={handleChange} value={form.phoneNumber}
                className="w-full mt-1 px-4 py-3 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Cột 1 */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Mật khẩu *</label>
              <input
                type={showPassword ? 'text' : 'password'} name="password"
                onChange={handleChange} value={form.password} required
                className="w-full mt-1 px-4 py-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute text-gray-400 right-4 top-9 hover:text-gray-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Cột 2 */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu *</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                onChange={handleChange} value={form.confirmPassword} required
                className="w-full mt-1 px-4 py-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute text-gray-400 right-4 top-9 hover:text-gray-600">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* --- KHU VỰC CHỌN GIỚI TÍNH ĐÃ THIẾT KẾ LẠI --- */}
            <fieldset className="md:col-span-2">
              <legend className="block text-sm font-medium text-gray-700 mb-2">Giới tính *</legend>
              <div className="flex items-center gap-x-6">
                {genderOptions.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`gender-${option}`}
                      name="gender"
                      type="radio"
                      value={option}
                      checked={form.gender === option}
                      onChange={handleChange}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label htmlFor={`gender-${option}`} className="ml-2 block text-sm text-gray-900">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 mt-4 font-bold text-white bg-[#B77B4F] rounded-full hover:bg-[#a56c3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B77B4F] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
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