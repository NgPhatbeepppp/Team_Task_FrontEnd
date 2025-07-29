// src/pages/ProjectDetailPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { getTasksByProjectId, createTask } from '../services/taskService';
import { getProjectById } from '../services/projectService';
import { TaskItem } from '../types';
import { List, Plus, Loader2 } from 'lucide-react';

const ProjectDetailPage = () => {
  // Lấy projectId từ URL, ví dụ: /projects/123
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projectName, setProjectName] = useState('Đang tải...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjectData = useCallback(async () => {
    if (!projectId) {
      setError('Không tìm thấy ID dự án.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Gọi song song cả 2 API để tăng tốc
      const [projectDetails, fetchedTasks] = await Promise.all([
        getProjectById(Number(projectId)),
        getTasksByProjectId(Number(projectId))
      ]);
      setProjectName(projectDetails.name);
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu dự án.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // Hàm xử lý việc tạo task
  const handleCreateTask = async (taskData: Partial<TaskItem>) => {
    if (!projectId) return;

    try {
      await createTask({ 
        ...taskData, 
        projectId: Number(projectId) // Gắn projectId vào dữ liệu task
      });
      // Sau khi tạo thành công, tải lại danh sách công việc
      fetchProjectData();
    } catch (error) {
      // Lỗi đã được xử lý trong modal, re-throw để modal biết
      throw error;
    }
  };

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

    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <List className="mr-2" size={20}/>
            Danh sách công việc
          </h2>
        </div>
        <ul>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <li key={task.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
                <span className="font-medium text-gray-800">{task.title}</span>
                <span className="text-sm text-gray-500">
                  {task.assignedTo ? task.assignedTo.username : 'Chưa giao'}
                </span>
                {/* Thêm các thông tin khác như deadline, priority sau */}
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 p-6">Dự án này chưa có công việc nào.</p>
          )}
        </ul>
      </div>
    );
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem="Quản lý dự án" />
      <main className="flex-grow p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <p className="text-sm text-gray-500">Dự án</p>
              <h1 className="text-4xl font-bold text-gray-800">{projectName}</h1>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform hover:scale-105"
            >
              <Plus size={20} className="mr-2"/>
              Tạo Công việc mới
            </button>
          </header>
          {renderContent()}
        </div>
      </main>
      
      <CreateTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default ProjectDetailPage;