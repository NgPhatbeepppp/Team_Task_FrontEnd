// src/components/ProjectCard.tsx 
import React, { useMemo } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Project } from '../types'; // Import kiểu dữ liệu Project
import { UserPlus, Users } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpenInviteModal: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenInviteModal }) => {
  const navigate = useNavigate();

  // TÍNH TOÁN TỔNG SỐ THÀNH VIÊN DUY NHẤT
  // Sử dụng useMemo để chỉ tính toán lại khi project thay đổi
  const totalUniqueMembers = useMemo(() => {
    const memberIds = new Set<number>();

    // 1. Thêm các thành viên riêng lẻ
    project.members?.forEach(pm => memberIds.add(pm.user.id));

    // 2. Thêm các thành viên từ các nhóm
    project.teams?.forEach(pt => {
      pt.team.teamMembers.forEach(tm => memberIds.add(tm.userId));
    });

    return memberIds.size;
  }, [project]);

  // Hàm xử lý khi click vào card
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/project/${project.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-5 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer"
      onClick={handleCardClick} 
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-xl text-gray-900">{project.name}</h3>
      </div>

      <p className="text-sm text-gray-600 flex-grow mb-4 line-clamp-3">
        {project.description || 'Dự án này chưa có mô tả.'}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <Users size={16} className="mr-2" />
          {/* ✅ HIỂN THỊ SỐ LƯỢNG MỚI */}
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