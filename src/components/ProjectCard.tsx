// src/components/ProjectCard.tsx 
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { UserPlus, Users, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpenInviteModal: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenInviteModal }) => {
  const navigate = useNavigate();

  const totalUniqueMembers = useMemo(() => {
    const memberIds = new Set<number>();
    project.members?.forEach(pm => memberIds.add(pm.user.id));
    project.teams?.forEach(pt => {
      pt.team.teamMembers.forEach(tm => memberIds.add(tm.userId));
    });
    return memberIds.size;
  }, [project]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/project/${project.id}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-2xl text-gray-900 dark:text-white">{project.name}</h3>
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={20} className="text-gray-600 dark:text-gray-300" />
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-6 line-clamp-3 min-h-[60px]">
        {project.description || 'Dự án này chưa có mô tả.'}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Users size={16} className="mr-2" />
          <span>{totalUniqueMembers} thành viên</span>
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