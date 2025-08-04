// src/pages/ProjectWorkspacePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { getTasksByProjectId, createTask, getTaskById, updateTask } from '../services/taskService';
import { getProjectById } from '../services/projectService';
import { getProjectStatuses } from '../services/projectStatusService';
import { TaskItem, Project } from '../types';
import { ProjectStatus } from '../services/projectStatusService';
import { Loader2 } from 'lucide-react';
import { ProjectHeader } from '../components/ProjectHeader';
import { ViewSwitcher } from '../components/ViewSwitcher';
import { TaskListView } from '../components/TaskListView';

import { KanbanBoardView } from '../components/KanbanBoardView';
import { TaskDetailsModal } from '../components/TaskDetailsModal';


const ProjectWorkspacePage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [statuses, setStatuses] = useState<ProjectStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);


  const [activeView, setActiveView] = useState<'list' | 'board' | 'calendar'>('list');


  const fetchProjectData = useCallback(async () => {
    if (!projectId) {
      setError('Không tìm thấy ID dự án.');
      setLoading(false);
      return;
    }
    try {
      // Giữ lại trạng thái loading cũ để không bị giật màn hình
      // setLoading(true); 
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

  const handleCreateTask = async (taskData: Partial<Omit<TaskItem, 'taskAssignees'>> & { assignedUserIds?: number[] }) => {
    try {
      await createTask(taskData);
      fetchProjectData();
    } catch (error) {
      throw error;
    }
  };

  const handleOpenTaskDetails = async (task: TaskItem) => {
    try {
        const fullTask = await getTaskById(task.id);
        setSelectedTask(fullTask);
        setIsDetailsModalOpen(true);
    } catch (error) {
        alert("Không thể tải chi tiết công việc.");
    }
  }

  const handleUpdateTask = async (taskId: number, taskData: Partial<TaskItem> & { assignedUserIds?: number[] }) => {
      try {
          await updateTask(taskId, taskData);
          await fetchProjectData(); // Tải lại toàn bộ dữ liệu
      } catch (error) {
          alert('Cập nhật thất bại');
          throw error;
      }
  }

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
        return <TaskListView tasks={tasks} statuses={statuses} onTaskUpdate={fetchProjectData} onTaskSelect={handleOpenTaskDetails} />;
      case 'board':
        return <KanbanBoardView project={project} initialTasks={tasks} onTasksChange={fetchProjectData} />;
      case 'calendar':
        return <div className="text-center p-10">Chế độ xem Lịch sẽ được phát triển sau.</div>;
      default:
        return <TaskListView tasks={tasks} statuses={statuses} onTaskUpdate={fetchProjectData}  onTaskSelect={handleOpenTaskDetails} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar activeItem="Quản lý dự án" />

      <main className="flex-grow p-6 sm:p-8 flex flex-col md:ml-64">
        <div className="max-w-full mx-auto w-full flex flex-col flex-grow">

      <main className="p-6 sm:p-8 ml-[260px]"> {/* ✨ FIX TRÁNH CHE BỞI SIDEBAR */}
        <div className="max-w-7xl mx-auto">
          {/* ✨ SỬ DỤNG CÁC COMPONENT MỚI */}

          <ProjectHeader 
            project={project} 
            onOpenCreateTaskModal={() => setIsCreateModalOpen(true)}
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
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
          projectId={Number(projectId)}
          statuses={statuses}
        />
      )}
      
      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={selectedTask}
        statuses={statuses}
        onUpdate={handleUpdateTask}


      <CreateTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}

      />
    </div>
  );
};

export default ProjectWorkspacePage;
