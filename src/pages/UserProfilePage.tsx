// src/pages/UserProfilePage.tsx
import { useEffect, useState } from 'react';
import api from '../services/api'; 
import { Pencil } from 'lucide-react';

interface UserProfile {
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  jobTitle?: string;
  gender: string;
  phoneNumber?: string;
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/userprofile/me');
        setProfile(res.data);
        setEditedProfile(res.data);
      } catch (err) {
        console.error('Lỗi khi tải hồ sơ người dùng:', err);
        alert('Không thể tải hồ sơ. Vui lòng đăng nhập lại.');
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = (field: string) => setEditField(field);

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
      console.error('Lỗi khi cập nhật hồ sơ:', err);
      alert('Cập nhật thất bại');
    }
    setLoading(false);
  };

  const renderField = (label: string, field: keyof UserProfile) => (
    <div style={{ marginBottom: '1rem' }} key={field}>
      <label style={{ fontWeight: 'bold' }}>{label}:</label>
      {editField === field ? (
        <input
          value={editedProfile[field] || ''}
          onChange={e => handleChange(field, e.target.value)}
        />
      ) : (
        <span style={{ marginLeft: '0.5rem' }}>{profile?.[field] || '-'}</span>
      )}
      <Pencil
        style={{ marginLeft: 8, cursor: 'pointer' }}
        size={16}
        onClick={() => handleEdit(field)}
      />
    </div>
  );

  if (!profile) return <p>Đang tải...</p>;

  return (
    <div style={{ maxWidth: 500, margin: 'auto' }}>
      <h2>Hồ sơ người dùng</h2>
      {renderField('Họ tên', 'fullName')}
      {renderField('Chức danh', 'jobTitle')}
      {renderField('Giới tính', 'gender')}
      {renderField('Tiểu sử', 'bio')}
      {renderField('Số điện thoại', 'phoneNumber')}
      {renderField('Ảnh đại diện (URL)', 'avatarUrl')}

      {editField && (
        <button onClick={handleSave} disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      )}
    </div>
  );
}
