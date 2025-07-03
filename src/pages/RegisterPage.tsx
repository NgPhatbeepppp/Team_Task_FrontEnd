import React, { useState } from 'react';
import { register } from '../services/authService';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    gender: 'Nam',
    fullName: '',
    phoneNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await register(form);
      localStorage.setItem('token', token);
      alert('Đăng ký thành công');
    } catch (err: any) {
      alert('Đăng ký thất bại: ' + err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng ký</h2>
      <input name="username" onChange={handleChange} placeholder="Username" required />
      <input name="email" onChange={handleChange} type="email" placeholder="Email" required />
      <input name="password" onChange={handleChange} type="password" placeholder="Password" required />
      <select name="gender" onChange={handleChange} required>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
      </select>
      <input name="fullName" onChange={handleChange} placeholder="Họ tên (tuỳ chọn)" />
      <input name="phoneNumber" onChange={handleChange} placeholder="Số điện thoại (tuỳ chọn)" />
      <button type="submit">Đăng ký</button>
    </form>
  );
}
