// src/components/TaskListView.tsx

import React from 'react';
import { TaskItem, User } from '../types';
import { ProjectStatus } from '../services/projectStatusService';
import { PriorityPicker } from './PriorityPicker';
// ✨ THAY ĐỔI: Import hàm updateTaskPriority mới
import { updateTaskPriority } from '../services/taskService';
import { List } from 'lucide-react';
import { useToast } from '../hooks/useToast';

// Component con để hiển thị avatar người được giao
const AssigneeAvatar: React.FC<{ user: User }> = ({ user }) => {
    const initial = user.username.charAt(0).toUpperCase();
    return (
        <div 
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-white -ml-2 first:ml-0" 
            title={user.username}
        >
            {initial}
        </div>
    );
};

interface TaskListViewProps {
  tasks: TaskItem[];
  statuses: ProjectStatus[];
  onTaskUpdate: () => void;
  onTaskSelect: (task: TaskItem) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks, statuses, onTaskUpdate, onTaskSelect }) => {
    const statusMap = new Map(statuses.map(s => [s.id, s]));
    const { addToast } = useToast();

    const handleUpdatePriority = async (taskId: number, priority: 'Low' | 'Medium' | 'High') => {
        try {
            // ✨ THAY ĐỔI: Gọi hàm updateTaskPriority chuyên dụng
            await updateTaskPriority(taskId, priority);
            addToast({ message: 'Cập nhật độ ưu tiên thành công!', type: 'success' });
            onTaskUpdate();
        } catch (error) {
            addToast({ message: 'Cập nhật độ ưu tiên thất bại.', type: 'error' });
        }
    };

    if (tasks.length === 0) {
      return (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            Dự án này chưa có công việc nào.
        </div>
      )
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                    <List className="mr-2" size={20}/>
                    Danh sách công việc
                </h2>
            </div>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Tên công việc</th>
                        <th scope="col" className="px-6 py-3">Trạng thái</th>
                        <th scope="col" className="px-6 py-3">Người thực hiện</th>
                        <th scope="col" className="px-6 py-3">Độ ưu tiên</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id} className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={() => onTaskSelect(task)}>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {task.title}
                            </td>
                            <td className="px-6 py-4">
                                <span 
                                    className="text-white text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                    style={{ backgroundColor: statusMap.get(task.statusId!)?.color || '#A0A0A0' }}
                                >
                                    {statusMap.get(task.statusId!)?.name || 'Không xác định'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-row-reverse justify-end">
                                    {task.taskAssignees && task.taskAssignees.length > 0
                                      ? task.taskAssignees.map(({ user }) => <AssigneeAvatar key={user.id} user={user} />)
                                      : <span className="text-xs text-gray-400">Chưa giao</span>
                                    }
                                </div>
                            </td>
                            <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                <PriorityPicker task={task} onUpdate={handleUpdatePriority} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};