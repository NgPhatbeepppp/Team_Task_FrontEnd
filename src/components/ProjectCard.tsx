// src/components/ProjectCard.tsx

import React from 'react';
import { Project } from '../services/projectService';
import { UserPlus, Users } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpenInviteModal: (project: Project) => void;
  // Thêm các hàm xử lý khác sau này nếu cần (xoá, sửa,...)
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenInviteModal }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-xl text-gray-900">{project.name}</h3>
        {/* Có thể thêm menu ... ở đây sau này */}
      </div>

      <p className="text-sm text-gray-600 flex-grow mb-4 line-clamp-3">
        {project.description || 'Dự án này chưa có mô tả.'}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <Users size={16} className="mr-2" />
          <span>{project.projectMembers?.length || 0} thành viên</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onOpenInviteModal(project); }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors"
          title="Mời thành viên hoặc nhóm"
        >
          <UserPlus size={16} className="mr-2" />
          Mời
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;