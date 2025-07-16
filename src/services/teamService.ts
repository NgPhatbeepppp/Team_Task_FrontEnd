// src/services/teamService.ts

import api from './api';
import { User } from './userService'; // Import User type

// Định nghĩa kiểu dữ liệu cho thành viên trong nhóm
export interface TeamMember {
    userId: number;
    user: User;
    isLeader: boolean;
}

// Cập nhật kiểu dữ liệu cho Team để bao gồm danh sách thành viên
export interface Team {
  id: number;
  teamName: string;
  description: string;
  teamLeaderId: number;
  teamMembers: TeamMember[]; // Thêm danh sách thành viên
}

/**
 * Lấy danh sách tất cả các nhóm (bao gồm thông tin thành viên)
 */
export const getTeams = async (): Promise<Team[]> => {
  const response = await api.get<Team[]>('/team');
  return response.data;
};

/**
 * Tạo một nhóm mới
 */
export const createTeam = async (teamData: { teamName: string, description: string }): Promise<Team> => {
  const response = await api.post<Team>('/team', teamData);
  return response.data;
};

/**
 * Cập nhật thông tin nhóm
 * @param teamId ID của nhóm
 * @param teamData Dữ liệu cần cập nhật
 */
export const updateTeam = async (teamId: number, teamData: { teamName: string, description: string }): Promise<void> => {
    // API yêu cầu gửi cả object Team hoàn chỉnh, nên ta tạo một object giả lập với id
    const payload = { id: teamId, ...teamData };
    await api.put(`/team/${teamId}`, payload);
}

/**
 * Xóa một nhóm theo ID
 */
export const deleteTeam = async (teamId: number): Promise<void> => {
  await api.delete(`/team/${teamId}`);
};

/**
 * Mời một người dùng vào nhóm
 */
export const inviteUserToTeam = async (teamId: number, userId: number): Promise<void> => {
    await api.post(`/teams/${teamId}/invitations`, userId, {
        headers: { 'Content-Type': 'application/json' }
    });
};

/**
 * Xóa thành viên khỏi nhóm
 * @param teamId ID của nhóm
 * @param userId ID của thành viên cần xóa
 */
export const removeMember = async (teamId: number, userId: number): Promise<void> => {
    await api.delete(`/team/${teamId}/members/${userId}`);
};

/**
 * Trao quyền trưởng nhóm
 * @param teamId ID của nhóm
 * @param targetUserId ID của người dùng sẽ trở thành trưởng nhóm mới
 */
export const grantLeader = async (teamId: number, targetUserId: number): Promise<void> => {
    await api.post(`/team/${teamId}/grant-leader`, targetUserId, {
        headers: { 'Content-Type': 'application/json' }
    });
};