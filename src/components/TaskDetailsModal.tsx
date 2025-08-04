// src/components/TaskDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import { TaskItem, User } from '../types';
import { ProjectStatus } from '../services/projectStatusService';
import { UserSearchInput } from './UserSearchInput';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  statuses: ProjectStatus[];
  onUpdate: (taskId: number, taskData: Partial<TaskItem> & { assignedUserIds?: number[] }) => Promise<void>;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, task, statuses, onUpdate }) => {
  const [editedTask, setEditedTask] = useState<Partial<TaskItem>>({});
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        // Dòng này rất quan trọng: nó định dạng ngày cho thẻ <input type="date">
        // Hoặc trả về chuỗi rỗng nếu không có deadline
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
        statusId: task.statusId,
      });
      setSelectedUsers(task.taskAssignees?.map(a => a.user) || []);
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    const assignedUserIds = selectedUsers.map(u => u.id);

    // Chuẩn bị dữ liệu gửi đi
    const finalTaskData = { ...editedTask };
    // Nếu deadline là chuỗi rỗng, backend sẽ hiểu là null nhờ có JsonConverter
    
    await onUpdate(task.id, { ...finalTaskData, assignedUserIds });
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Chi tiết công việc</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={editedTask.title || ''}
            onChange={handleChange}
            className="w-full text-xl font-semibold border-b-2 pb-2 focus:outline-none focus:border-indigo-500"
          />
          <textarea
            name="description"
            value={editedTask.description || ''}
            onChange={handleChange}
            rows={5}
            className="w-full p-2 border rounded-md"
            placeholder="Mô tả chi tiết..."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* --- CỘT 1: TRẠNG THÁI --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <select name="statusId" value={editedTask.statusId || ''} onChange={handleChange} className="w-full p-2 border rounded-md">
                {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {/* --- CỘT 2: ĐỘ ƯU TIÊN --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Độ ưu tiên</label>
              <select name="priority" value={editedTask.priority || 'Medium'} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="Low">Thấp</option>
                <option value="Medium">Trung bình</option>
                <option value="High">Cao</option>
              </select>
            </div>
            {/* ===== MỤC MỚI ĐƯỢC THÊM VÀO ===== */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={editedTask.deadline || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
          </div>
          <UserSearchInput
            projectId={task.projectId}
            selectedUsers={selectedUsers}
            onSelectedUsersChange={setSelectedUsers}
          />
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
};