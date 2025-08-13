// src/components/MemberManagement.tsx
import React, { useState } from 'react'; 
import { Project } from '../types';
import { removeUserFromProject, removeTeamFromProject } from '../services/projectService';
import { UserX, Users, User, Trash2, UserPlus } from 'lucide-react'; // ✅ THÊM MỚI: import icon UserPlus
import { InviteToProjectModal } from './InviteToProjectModal'; // ✅ THÊM MỚI: import Modal
import { useToast } from '../hooks/useToast';

interface MemberManagementProps {
  project: Project;
  onMemberRemoved: () => void; 
}

export const MemberManagement: React.FC<MemberManagementProps> = ({ project, onMemberRemoved }) => {
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { addToast } = useToast();

  const handleRemoveUser = async (userId: number, username: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${username}" khỏi dự án này không?`)) {
      try {
        await removeUserFromProject(project.id, userId);
        addToast({ message: `Đã xóa ${username} thành công.`, type: 'success' });
        onMemberRemoved();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Xóa thành viên thất bại.';
        addToast({ message: errorMessage, type: 'error' });
      }
    }
  };

  const handleRemoveTeam = async (teamId: number, teamName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhóm "${teamName}" khỏi dự án này không?`)) {
      try {
        await removeTeamFromProject(project.id, teamId);
        addToast({ message: `Đã xóa nhóm "${teamName}" thành công.`, type: 'success' });
        onMemberRemoved();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Xóa nhóm thất bại.';
        addToast({ message: errorMessage, type: 'error' });
      }
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
       
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Quản lý Thành viên</h2>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors"
          >
            <UserPlus size={16} className="mr-2" />
            Mời thành viên
          </button>
        </div>
        
        {/* Danh sách thành viên */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center"><User size={20} className="mr-2"/>Thành viên cá nhân</h3>
          <ul className="space-y-3">
            {project.members && project.members.length > 0 ? project.members.map(({ user }) => (
              <li key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="font-medium">{user.username}</span>
                {project.createdByUserId !== user.id ? (
                  <button
                    onClick={() => handleRemoveUser(user.id, user.username)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                    title="Xóa thành viên"
                  >
                    <UserX size={18} />
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 font-semibold px-2 py-1 bg-gray-200 rounded-full">Người tạo</span>
                )}
              </li>
            )) : <p className="text-sm text-gray-500 pl-4">Chưa có thành viên nào được thêm trực tiếp.</p>}
          </ul>
        </div>

        {/* Danh sách nhóm */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center"><Users size={20} className="mr-2"/>Các nhóm tham gia</h3>
          <ul className="space-y-3">
            {project.teams && project.teams.length > 0 ? project.teams.map(({ team }) => (
              <li key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="font-medium">{team.name}</span>
                <button
                  onClick={() => handleRemoveTeam(team.id, team.name)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                  title="Xóa nhóm khỏi dự án"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            )) : <p className="text-sm text-gray-500 pl-4">Chưa có nhóm nào tham gia dự án này.</p>}
          </ul>
        </div>
      </div>

    
      <InviteToProjectModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        project={project}
      />
    </>
  );
};