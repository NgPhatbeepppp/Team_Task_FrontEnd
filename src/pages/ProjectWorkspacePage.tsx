import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { getTasksByProjectId, createTask } from '../services/taskService';
import { getProjectById } from '../services/projectService';
import { TaskItem, Project } from '../types'; // ✨ THÊM Project
import { Loader2 } from 'lucide-react';

// ✨ IMPORT CÁC COMPONENT MỚI
import { ProjectHeader } from '../components/ProjectHeader';
import { ViewSwitcher } from '../components/ViewSwitcher';
import { TaskListView } from '../components/TaskListView';

const ProjectWorkspacePage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null); // ✨ LƯU CẢ DỰ ÁN
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'board' | 'calendar'>('list');

  const fetchProjectData = useCallback(async () => {
    if (!projectId) {
      setError('Không tìm thấy ID dự án.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [projectDetails, fetchedTasks] = await Promise.all([
        getProjectById(Number(projectId)),
        getTasksByProjectId(Number(projectId))
      ]);
      setProject(projectDetails); // ✨ LƯU
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

  const handleCreateTask = async (taskData: Partial<TaskItem>) => {
    if (!projectId) return;

    try {
      await createTask({ 
        ...taskData, 
        projectId: Number(projectId)
      });
      fetchProjectData();
    } catch (error) {
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
    
    // ✨ HIỂN THỊ VIEW TƯƠNG ỨNG
    switch(activeView) {
      case 'list':
        return <TaskListView tasks={tasks} />;
      case 'board':
        return <div className="text-center p-10">Chế độ xem Bảng (Kanban) sẽ được phát triển sau.</div>
      case 'calendar':
        return <div className="text-center p-10">Chế độ xem Lịch sẽ được phát triển sau.</div>
      default:
        return <TaskListView tasks={tasks} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar activeItem="Quản lý dự án" />
      <main className="p-6 sm:p-8 ml-[260px]"> {/* ✨ FIX TRÁNH CHE BỞI SIDEBAR */}
        <div className="max-w-7xl mx-auto">
          {/* ✨ SỬ DỤNG CÁC COMPONENT MỚI */}
          <ProjectHeader 
            project={project} 
            onOpenCreateTaskModal={() => setIsModalOpen(true)}
          />
          <ViewSwitcher 
            activeView={activeView}
            onViewChange={setActiveView}
          />
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

export default ProjectWorkspacePage;