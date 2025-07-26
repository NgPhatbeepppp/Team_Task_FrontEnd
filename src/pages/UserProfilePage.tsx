// src/pages/UserProfilePage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import Sidebar from '../components/Sidebar'; // ✅ GIỮ LẠI: Sử dụng Sidebar component có sẵn của bạn
import api from '../services/api';           // ✅ SỬ DỤNG: api instance toàn cục đã cấu hình
import { useAuth } from '../hooks/useAuth';   // ✅ SỬ DỤNG: hook để quản lý state xác thực

// --- INTERFACE ---
interface UserProfile {
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  jobTitle?: string;
  gender: string;
  phoneNumber?: string;
}

// --- COMPONENT CHÍNH ---
export default function UserProfilePage() {
  const { logout } = useAuth(); // ✅ SỬ DỤNG: Lấy hàm logout từ context
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editField, setEditField] = useState<keyof UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // --- LOGIC ---

  useEffect(() => {
    // ✅ THAY ĐỔI: Không cần lấy token hay tạo axios instance nữa.
    // Interceptor trong file api.ts đã tự động làm việc này.
    api.get('/userprofile/me')
      .then(res => {
        setProfile(res.data);
        setEditedProfile(res.data);
      })
      .catch(err => {
        console.error("Lỗi khi tải hồ sơ:", err);
        if (err.response?.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          logout(); // Tự động đăng xuất người dùng
        } else {
          alert('Không thể tải dữ liệu hồ sơ.');
        }
      });

    // Logic kiểm tra kích thước màn hình
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [logout]); // Thêm logout vào dependency array

  const handleEdit = (field: keyof UserProfile) => setEditField(field);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/userprofile/me', editedProfile);
      setProfile(editedProfile as UserProfile);
      setEditField(null);
    } catch (err) {
      alert('Cập nhật thất bại');
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      handleChange('avatarUrl', imageURL);
    }
  };

  // --- RENDER ---

  const renderField = (label: string, field: keyof UserProfile) => (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      {editField === field ? (
        <input
          value={editedProfile[field] || ''}
          onChange={e => handleChange(field, e.target.value)}
          style={styles.input}
        />
      ) : (
        <div style={styles.inputDisplay}>
          <span>{profile?.[field] || '-'}</span>
          <Pencil size={16} style={styles.pencil} onClick={() => handleEdit(field)} />
        </div>
      )}
    </div>
  );

  if (!profile) return <p>Đang tải...</p>;

  const wrapperStyle = isDesktop
    ? { ...styles.wrapper, ...styles.wrapperDesktop }
    : styles.wrapper;

  return (
    <div style={styles.layout}>
      {/* ✅ SỬ DỤNG: Gọi Sidebar component */}
      <Sidebar activeItem="Tài khoản cá nhân" />
      
      <div style={wrapperStyle}>
        <div style={styles.header}>
          <input style={styles.searchInput} placeholder="Tìm kiếm gì đó ở đây..." />
          <div style={styles.headerRight}>
            <span style={styles.bell}>🔔</span>
            <span style={styles.avatarIcon}>👤</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.left}>
            <div style={{ textAlign: 'center' }}>
              <img
                src={editedProfile.avatarUrl || 'https://via.placeholder.com/180'}
                alt="avatar"
                style={styles.avatar}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  marginTop: 10,
                  padding: '6px 16px',
                  backgroundColor: '#a56c3b',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Chọn ảnh
              </button>
            </div>
          </div>

          <div style={styles.right}>
            <h2 style={styles.title}>
              hi, <b>{profile.fullName || profile.phoneNumber}</b>
            </h2>
            <div style={styles.grid}>
              {renderField('Họ và tên', 'fullName')}
              {renderField('Chức danh', 'jobTitle')}
              {renderField('Giới tính', 'gender')}
              {renderField('Tiểu sử', 'bio')}
              {renderField('Số điện thoại', 'phoneNumber')}
            </div>
            <button style={styles.button} onClick={handleSave} disabled={loading}>
              {loading ? 'Đang lưu...' : 'Cập nhật'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const SIDEBAR_WIDTH = '256px';

const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
    backgroundColor: '#f5f5f5',
  },
  wrapper: {
    flex: 1,
    marginLeft: '0' 
  },
  wrapperDesktop: {
      marginLeft: SIDEBAR_WIDTH
  },
  header: {
    backgroundColor: '#d6cfc9',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    padding: '8px 12px',
    borderRadius: 6,
    border: 'none',
    width: '280px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    fontSize: 20,
  },
  bell: { cursor: 'pointer' },
  avatarIcon: { cursor: 'pointer' },
  card: {
    margin: 40,
    background: 'white',
    borderRadius: 8,
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    padding: 40,
  },
  left: {
    flex: '0 0 240px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
  },
  right: {
    flex: 1,
    paddingLeft: 40,
  },
  title: {
    color: '#5f3c1b',
    fontSize: 22,
    marginBottom: 24,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    padding: 10,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  inputDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #ccc',
    borderRadius: 4,
    padding: '8px 10px',
  },
  pencil: {
    marginLeft: 8,
    cursor: 'pointer',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#a56c3b',
    color: 'white',
    padding: '12px 28px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    float: 'right',
  },
};
