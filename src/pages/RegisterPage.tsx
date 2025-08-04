// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { register as registerService } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, CheckCircle } from 'lucide-react'; // <-- 1. Thêm icon CheckCircle

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    gender: 'Nam',
    fullName: '',
    phoneNumber: ''
  });
  
  // --- 2. Thêm các state mới để quản lý trạng thái ---
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const token = await registerService(form);
      login(token);

      // --- 3. Thay thế alert() bằng việc cập nhật state ---
      setSuccessMessage('Đăng ký thành công! Đang chuyển hướng bạn đến trang cá nhân...');
      setTimeout(() => {
        navigate('/profile');
      }, 3000); // Chuyển hướng sau 3 giây

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra.';
      setError(errorMessage); // Hiển thị lỗi trên giao diện
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center font-sans bg-cover bg-center"
      style={{ backgroundImage: 'url(/background.png)' }}
    >
      <div className="relative w-11/12 max-w-4xl">
        <h1 className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 md:right-0 md:top-auto md:translate-x-0 md:-translate-y-full text-5xl md:text-6xl font-bold text-black text-shadow-lg z-10 p-4">
          Đăng Ký
        </h1>

        <div className="relative z-0 p-8 md:p-12 pt-16 md:pt-12 bg-white/40 rounded-2xl shadow-2xl backdrop-blur-sm min-h-[550px]">
          {/* --- 4. Hiển thị có điều kiện: form hoặc thông báo thành công --- */}
          {successMessage ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">Thành công!</h3>
              <p className="mt-2 text-gray-700">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 gap-y-4">
                {/* Cột trái */}
                <div>
                  <label className="block text-xl font-bold text-gray-800">Họ và tên</label>
                  <input
                    name="fullName"
                    placeholder="Nhập vào đây"
                    onChange={handleChange}
                    value={form.fullName}
                    required
                    className="w-full px-4 py-3 mt-2 mb-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />

                  <label className="block text-xl font-bold text-gray-800">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Nhập vào đây"
                    onChange={handleChange}
                    value={form.email}
                    required
                    className="w-full px-4 py-3 mt-2 mb-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />

                  <label className="block text-xl font-bold text-gray-800">Số điện thoại</label>
                  <input
                    name="phoneNumber"
                    placeholder="Nhập vào đây"
                    onChange={handleChange}
                    value={form.phoneNumber}
                    required
                    className="w-full px-4 py-3 mt-2 mb-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />

                  <div className="mt-8 text-center">
                    <span className="text-gray-700">Đã có tài khoản?{' '}</span>
                    <Link to="/login" className="italic font-medium text-[#AB7C56] underline hover:text-amber-800">
                      Đăng nhập
                    </Link>
                  </div>
                </div>

                {/* Cột phải */}
                <div>
                  <label className="block text-xl font-bold text-gray-800">Tên đăng nhập</label>
                  <input
                    name="username"
                    placeholder="Nhập vào đây"
                    onChange={handleChange}
                    value={form.username}
                    required
                    className="w-full px-4 py-3 mt-2 mb-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />

                  <label className="block text-xl font-bold text-gray-800">Mật khẩu</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập vào đây"
                      onChange={handleChange}
                      value={form.password}
                      required
                      className="w-full px-4 py-3 pr-10 mt-2 mb-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute text-gray-400 right-4 top-1/2 -translate-y-1/2 transform hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <label className="block text-xl font-bold text-gray-800">Giới tính</label>
                  <div className="flex items-center mt-4 mb-6 space-x-6">
                    {['Nam', 'Nữ', 'Khác'].map((option) => (
                      <label key={option} className="flex items-center space-x-2 text-base text-gray-800 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={form.gender === option}
                          onChange={handleChange}
                          className="w-5 h-5 cursor-pointer text-amber-700 focus:ring-amber-700"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>

                  {error && (
                    <p className="text-sm text-center text-red-600 mb-4">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 mt-8 font-bold text-white bg-[#B77B4F] rounded-full hover:bg-[#a56c3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B77B4F] transition-colors disabled:bg-gray-400"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}