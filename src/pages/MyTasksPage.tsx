// src/pages/MyTasksPage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getMyTasks } from '../services/taskService';
import { MyTaskItem } from '../types';
import { Loader2, Flag, Calendar, Folder } from 'lucide-react';

// --- Component con để hiển thị значок ưu tiên ---
const PriorityBadge: React.FC<{ priority: 'Low' | 'Medium' | 'High' }> = ({ priority }) => {
  const config = {
    High: { color: '#ef4444', label: 'Cao' },
    Medium: { color: '#f59e0b', label: 'Trung bình' },
    Low: { color: '#84cc16', label: 'Thấp' },
  };
  const { color, label } = config[priority];

  return (
    <div className="flex items-center gap-2">
      <Flag size={16} color={color} />
      <span style={{ color }}>{label}</span>
    </div>
  );
};

// --- Component chính của trang ---
const MyTasksPage = () => {
  const [tasks, setTasks] = useState<MyTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const myTasks = await getMyTasks();
        setTasks(myTasks);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách nhiệm vụ. Vui lòng thử lại.');
        console.error("Lỗi khi tải nhiệm vụ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (tasks.length === 0) {
      return <div className="text-center py-10 text-gray-500">Bạn không có nhiệm vụ nào được giao.</div>;
    }

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Tên nhiệm vụ</th>
              <th scope="col" className="px-6 py-3">Dự án</th>
              <th scope="col" className="px-6 py-3">Hạn chót</th>
              <th scope="col" className="px-6 py-3">Độ ưu tiên</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {task.title}
                </td>
                <td className="px-6 py-4">
                  <Link 
                    to={`/project/${task.project.id}`} 
                    className="flex items-center text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    <Folder size={16} className="mr-2 shrink-0" />
                    <span className="truncate">{task.project.name}</span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {task.deadline ? (
                    <div className="flex items-center">
                       <Calendar size={16} className="mr-2 text-gray-400 shrink-0" />
                       {new Date(task.deadline).toLocaleDateString('vi-VN')}
                    </div>
                  ) : (
                    <span className="text-gray-400">Không có</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <PriorityBadge priority={task.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem="Nhiệm vụ" />
      <main className="flex-grow p-6 sm:p-8 flex flex-col md:ml-64">
        <div className="max-w-7xl mx-auto w-full">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Nhiệm vụ của tôi</h1>
            <p className="text-gray-600 mt-1">Tất cả công việc được giao cho bạn trên mọi dự án.</p>
          </header>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default MyTasksPage;