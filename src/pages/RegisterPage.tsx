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
    <div style={{
      backgroundImage: 'url(/background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'fixed',
      inset: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ position: 'relative', width: '90%', maxWidth: '1100px' }}>
        {/* Floating heading */}
        <h1 style={{
          position: 'absolute',
          top: '-40px',
          right: '-80px',
          transform: 'translateX(-50%)',
          fontSize: '70px',
          fontWeight: 'bold',
          color: '#000000',
          textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
          margin: 0,
          padding: 0,
          zIndex: 2 // ✅ THÊM DÒNG NÀY
        }}>
          Đăng Ký
        </h1>


        {/* Form chính */}
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(2px)',
          padding: '60px 40px 40px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.8)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            <div>
              <label style={labelStyle}>Họ và tên</label>
              <input
                name="fullName"
                placeholder="Nhập vào đây"
                onChange={handleChange}
                value={form.fullName}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Nhập vào đây"
                onChange={handleChange}
                value={form.email}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Số điện thoại</label>
              <input
                name="phoneNumber"
                placeholder="Nhập vào đây"
                onChange={handleChange}
                value={form.phoneNumber}
                required
                style={inputStyle}
              />

              <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '20px' }}>
                Đã có tài khoản?{' '}
                <span style={{
                  fontStyle: 'italic',
                  textDecoration: 'underline',
                  color: '#AB7C56',
                  cursor: 'pointer'
                }}>
                  Đăng nhập
                </span>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Tên đăng nhập</label>
              <input
                name="username"
                placeholder="Nhập vào đây"
                onChange={handleChange}
                value={form.username}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Mật khẩu</label>
              <input
                name="password"
                type="password"
                placeholder="Nhập vào đây"
                onChange={handleChange}
                value={form.password}
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Giới tính</label>
              <select
                name="gender"
                onChange={handleChange}
                value={form.gender}
                required
                style={{
                  ...inputStyle,
                  borderRadius: '12px',
                  appearance: 'none',
                }}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>

              <button type="submit" style={{
                width: '100%',
                marginTop: '20px',
                padding: '14px',
                borderRadius: '999px',
                backgroundColor: '#B77B4F',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px',
                border: 'none',
                cursor: 'pointer'
              }}>
                ĐĂNG KÝ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '20px 16px',
  borderRadius: '20px',
  border: '1px solid #ccc',
  margin: '8px 0 18px',
  fontSize: '18px',
  boxSizing: 'border-box'
};

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
};
