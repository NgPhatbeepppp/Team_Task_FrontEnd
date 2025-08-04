// src/pages/UserProfilePage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast'; // Thêm hook useToast

interface UserProfile {
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  jobTitle?: string;
  gender: string;
  phoneNumber?: string;
}

export default function UserProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editField, setEditField] = useState<keyof UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { addToast } = useToast(); // Sử dụng hook useToast
  
  // Xóa useEffect và state isDesktop

  useEffect(() => {
    api.get('/userprofile/me')
      .then(res => {
        setProfile(res.data);
        setEditedProfile(res.data);
      })
      .catch(err => {
        console.error("Lỗi khi tải hồ sơ:", err);
        if (err.response?.status === 401) {
          addToast({ message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', type: 'error' });
          logout();
        } else {
          addToast({ message: 'Không thể tải dữ liệu hồ sơ.', type: 'error' });
        }
      });
  }, [logout, addToast]);

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
      addToast({ message: 'Cập nhật thành công!', type: 'success' });
    } catch (err) {
      addToast({ message: 'Cập nhật thất bại', type: 'error' });
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      handleChange('avatarUrl', imageURL);
      // NOTE: Để thực sự upload ảnh, bạn cần gửi file lên server
      // và nhận lại URL, chứ không chỉ dùng URL.createObjectURL
    }
  };

  const renderField = (label: string, field: keyof UserProfile) => (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-gray-700">{label}</label>
      {editField === field ? (
        <input
          value={editedProfile[field] || ''}
          onChange={e => handleChange(field, e.target.value)}
          onBlur={handleSave} // Tự động lưu khi thoát khỏi ô input
          autoFocus
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <div
          onClick={() => handleEdit(field)}
          className="flex items-center justify-between px-3 py-2 border border-transparent rounded-md cursor-pointer hover:bg-gray-100 group"
        >
          <span>{profile?.[field] || <span className="text-gray-400">Chưa có</span>}</span>
          <Pencil size={16} className="text-gray-400 transition-opacity opacity-0 group-hover:opacity-100" />
        </div>
      )}
    </div>
  );

  if (!profile) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Đang tải hồ sơ...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="Tài khoản cá nhân" />
      
      <main className="flex-1 p-6 md:ml-64">
         <div className="max-w-4xl p-8 mx-auto bg-white rounded-2xl shadow-lg">
            <div className="flex flex-col items-center md:flex-row md:items-start">
              {/* Cột trái: Avatar */}
              <div className="flex-shrink-0 w-48 mb-6 text-center md:mb-0 md:mr-10">
                <img
                    src={editedProfile.avatarUrl || 'https://via.placeholder.com/180'}
                    alt="avatar"
                    className="w-40 h-40 mx-auto rounded-full object-cover shadow-md"
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-[#a56c3b] rounded-lg hover:bg-[#8e5a2e] transition-colors"
                >
                    Đổi ảnh
                </button>
              </div>

              {/* Cột phải: Thông tin */}
              <div className="flex-1 w-full">
                <h2 className="text-3xl font-bold text-[#5f3c1b] mb-6">
                  Chào, <b className='font-extrabold'>{profile.fullName || profile.phoneNumber}</b>
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {renderField('Họ và tên', 'fullName')}
                  {renderField('Chức danh', 'jobTitle')}
                  {renderField('Giới tính', 'gender')}
                  {renderField('Số điện thoại', 'phoneNumber')}
                  <div className="sm:col-span-2">
                    {renderField('Tiểu sử', 'bio')}
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                    <button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="px-6 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                    >
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
              </div>
            </div>
         </div>
      </main>
    </div>
  );
}