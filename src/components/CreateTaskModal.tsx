// src/components/CreateTaskModal.tsx

import React, { useState, useEffect } from 'react';
import { TaskItem, User } from '../types';
import { ProjectStatus } from '../services/projectStatusService';
import { UserSearchInput } from './UserSearchInput';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Omit<TaskItem, 'taskAssignees'>> & { assignedUserIds?: number[] }) => Promise<void>;
  projectId: number;
  statuses: ProjectStatus[];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSubmit, projectId, statuses }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [startDate, setStartDate] = useState(''); // THÊM STATE MỚI
  const [deadline, setDeadline] = useState('');
  const [statusId, setStatusId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && statuses.length > 0 && !statusId) {
      setStatusId(statuses[0].id);
    }
  }, [isOpen, statuses, statusId]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setSelectedUsers([]);
    setStartDate(''); // RESET STATE
    setDeadline('');
    if (statuses.length > 0) {
      setStatusId(statuses[0].id);
    } else {
      setStatusId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const assignedUserIds = selectedUsers.map(u => u.id);
      
      await onSubmit({ 
        title, 
        description, 
        priority, 
        assignedUserIds,
        statusId,
        startDate: startDate || null, // THÊM VÀO PAYLOAD
        deadline: deadline || null,
        projectId: projectId
      });
      
      resetForm();
      onClose();
    } catch (error) {
      alert('Tạo công việc thất bại. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tạo Công việc Mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề công việc *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Thiết kế giao diện trang chủ"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Thêm mô tả chi tiết cho công việc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select 
                  id="status"
                  value={statusId ?? ''}
                  onChange={(e) => setStatusId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                  {statuses.map(status => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên</label>
              <select 
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                  <option value="Low">Thấp</option>
                  <option value="Medium">Trung bình</option>
                  <option value="High">Cao</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Hạn chót (Deadline)</label>
              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <UserSearchInput 
                projectId={projectId}
                selectedUsers={selectedUsers}
                onSelectedUsersChange={setSelectedUsers}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
              {isSubmitting ? 'Đang tạo...' : 'Tạo Công việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};