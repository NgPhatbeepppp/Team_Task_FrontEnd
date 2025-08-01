import React, { useState } from 'react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: { name: string, description: string | null }) => Promise<void>;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Gửi description là null nếu nó rỗng, tương tự như CreateTeamModal
      await onSubmit({ name, description: description.trim() || null });
      // Reset form và đóng modal
      setName('');
      setDescription('');
      onClose();
    } catch (error) {
      alert('Tạo dự án thất bại. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tạo Dự Án Mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">Tên dự án *</label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Dự án Website 2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn về mục tiêu của dự án..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
              {isSubmitting ? 'Đang tạo...' : 'Tạo Dự Án'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};