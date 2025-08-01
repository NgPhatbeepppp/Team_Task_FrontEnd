import React from 'react';
import { Project } from '../types';
import { removeUserFromProject } from '../services/projectService';
import { UserX, Users, User } from 'lucide-react';

interface MemberManagementProps {
  project: Project;
  onMemberRemoved: () => void; 
}

export const MemberManagement: React.FC<MemberManagementProps> = ({ project, onMemberRemoved }) => {
  
  const handleRemoveUser = async (userId: number, username: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${username}" khỏi dự án này không?`)) {
      try {
        await removeUserFromProject(project.id, userId);
        alert(`Đã xóa ${username} thành công.`);
        onMemberRemoved(); // Gọi lại để làm mới danh sách
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Xóa thành viên thất bại.';
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quản lý Thành viên</h2>
      
      {/* Danh sách thành viên */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center"><User size={20} className="mr-2"/>Thành viên cá nhân</h3>
        <ul className="space-y-3">
          {/* ✨ SỬA LỖI: Đổi "project.projectMembers" thành "project.members" */}
          {project.members?.map(({ user }) => (
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
          ))}
        </ul>
      </div>

      {/* Danh sách nhóm */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center"><Users size={20} className="mr-2"/>Các nhóm tham gia</h3>
        <ul className="space-y-3">
           {/* ✨ SỬA LỖI: Đổi "project.projectTeams" thành "project.teams" */}
           {project.teams && project.teams.length > 0 ? project.teams.map(({ team }) => (
            <li key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="font-medium">{team.name}</span>
              {/* API để xóa team khỏi dự án chưa có */}
            </li>
          )) : <p className="text-sm text-gray-500">Chưa có nhóm nào tham gia dự án này.</p>}
        </ul>
      </div>
    </div>
  );
};