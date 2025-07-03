import React, { useState } from 'react';
import { login } from '../services/authService';

interface LoginPageProps {
  onLogin: (jwt: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login(form);
      onLogin(token); // sử dụng hàm cha truyền vào
    } catch (err: any) {
      alert('Đăng nhập thất bại: ' + err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng nhập</h2>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
