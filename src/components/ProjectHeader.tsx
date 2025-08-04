// ✨ ProjectHeader.tsx
import React from 'react';
import { Project } from '../types';
import { Plus, Settings, UserPlus } from 'lucide-react'; // ✨ THÊM ICON MỚI
import { Link } from 'react-router-dom';

interface ProjectHeaderProps {
  project: Project | null;
  onOpenCreateTaskModal: () => void;
  onOpenInviteModal?: () => void; // ✨ THÊM MỚI
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onOpenCreateTaskModal, onOpenInviteModal }) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <p className="text-sm text-gray-500">Dự án</p>
        <h1 className="text-4xl font-bold text-gray-800">
          {project ? project.name : 'Đang tải...'}
        </h1>
      </div>
      <div className="flex items-center gap-3"> {/* ✨ Bọc các nút vào div */}
        {project && (
          <Link
            to={`/project/${project.id}/settings`}
            className="p-3 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
            title="Cài đặt dự án"
          >
            <Settings size={20} />
          </Link>
        )}
        {/* ✨ Nút mời thành viên */}
        <button 
          onClick={onOpenInviteModal}
          className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg shadow-sm hover:bg-indigo-200 transition"
        >
          <UserPlus size={18} className="mr-2" />
          Mời thành viên
        </button>
        <button 
          onClick={onOpenCreateTaskModal}
          className="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform hover:scale-105"
        >
          <Plus size={20} className="mr-2"/>
          Tạo Công việc mới
        </button>
      </div>
    </header>
  );
};
