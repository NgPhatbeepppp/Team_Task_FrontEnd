// src/pages/ProjectWorkspacePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { getTasksByProjectId, createTask } from '../services/taskService';
import { getProjectById } from '../services/projectService';
import { getProjectStatuses } from '../services/projectStatusService';
import { TaskItem, Project } from '../types';
import { ProjectStatus } from '../services/projectStatusService';
import { Loader2 } from 'lucide-react';
import { ProjectHeader } from '../components/ProjectHeader';
import { ViewSwitcher } from '../components/ViewSwitcher';
import { TaskListView } from '../components/TaskListView';
import { KanbanBoardView } from '../components/KanbanBoardView';

const ProjectWorkspacePage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [statuses, setStatuses] = useState<ProjectStatus[]>([]);
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
      const [projectDetails, fetchedTasks, fetchedStatuses] = await Promise.all([
        getProjectById(Number(projectId)),
        getTasksByProjectId(Number(projectId)),
        getProjectStatuses(Number(projectId))
      ]);
      setProject(projectDetails);
      setTasks(fetchedTasks);
      setStatuses(fetchedStatuses);
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

  // ✨ CẬP NHẬT HÀM NÀY ✨
  const handleCreateTask = async (taskData: Partial<Omit<TaskItem, 'taskAssignees'>> & { assignedUserIds?: number[] }) => {
    try {
      // Không cần thêm projectId ở đây nữa, vì modal đã làm việc đó
      await createTask(taskData);
      fetchProjectData();
    } catch (error) {
      // Ném lỗi để modal có thể xử lý (ví dụ: không tự đóng)
      throw error;
    }
  };

  const renderContent = () => {
    if (loading && !project) {
      return (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    
    switch(activeView) {
      case 'list':
        return <TaskListView tasks={tasks} />;
      case 'board':
        return <KanbanBoardView project={project} initialTasks={tasks} onTasksChange={fetchProjectData} />;
      case 'calendar':
        return <div className="text-center p-10">Chế độ xem Lịch sẽ được phát triển sau.</div>;
      default:
        return <TaskListView tasks={tasks} />;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeItem="Quản lý dự án" />
      <main className="flex-grow p-6 sm:p-8 flex flex-col md:ml-64">
        <div className="max-w-full mx-auto w-full flex flex-col flex-grow">
          <ProjectHeader 
            project={project} 
            onOpenCreateTaskModal={() => setIsModalOpen(true)}
          />
          <ViewSwitcher 
            activeView={activeView}
            onViewChange={setActiveView}
          />
          <div className="flex-grow">
            {renderContent()}
          </div>
        </div>
      </main>
      
      {projectId && (
        <CreateTaskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
          projectId={Number(projectId)}
          statuses={statuses}
        />
      )}
    </div>
  );
};

export default ProjectWorkspacePage;
