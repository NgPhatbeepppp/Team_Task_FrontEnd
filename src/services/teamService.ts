// src/services/teamService.ts

import api from './api';
import { User } from './userService';

// Định nghĩa kiểu dữ liệu cho thành viên trong nhóm
// RoleInTeam sẽ có giá trị là 'TeamLeader' hoặc 'Member'
export interface TeamMember {
    userId: number;
    user: User; // Thông tin chi tiết của user
    roleInTeam: 'TeamLeader' | 'Member';
}
// Định nghĩa kiểu dữ liệu cho một Team
export interface Team {
    id: number;
    name: string;
    description: string;
    createdByUserId: number;
    teamMembers: TeamMember[];
}

/**
 * Lấy danh sách các team mà người dùng hiện tại là thành viên.
 * Backend endpoint: GET /api/team/mine
 */
export const getMyTeams = async (): Promise<Team[]> => {
    const response = await api.get<Team[]>('/team/mine');
    return response.data;
};

/**
 * Lấy thông tin chi tiết của một team.
 * Backend endpoint: GET /api/team/{id}
 */
export const getTeamDetails = async (id: number): Promise<Team> => {
    const response = await api.get<Team>(`/team/${id}`);
    return response.data;
};

/**
 * Tạo một team mới.
 * Backend endpoint: POST /api/team
 */
export const createTeam = async (teamData: { name: string; description: string }): Promise<Team> => {
    const response = await api.post<Team>('/team', teamData);
    return response.data;
};

/**
 * Xóa một team.
 * Backend endpoint: DELETE /api/team/{id}
 */
export const deleteTeam = async (id: number): Promise<void> => {
    await api.delete(`/team/${id}`);
};

/**
 * Mời một thành viên mới vào team.
 * Backend endpoint: POST /api/teams/{teamId}/invitations
 */
export const inviteUserToTeam = async (teamId: number, targetUserId: number): Promise<void> => {
    // Backend yêu cầu gửi targetUserId trong body
    await api.post(`/teams/${teamId}/invitations`, { targetUserId });
};

/**
 * Trao quyền trưởng nhóm cho một thành viên khác.
 * Backend endpoint: POST /api/team/{teamId}/grant-leader/{targetUserId}
 */
export const grantLeaderRole = async (teamId: number, targetUserId: number): Promise<void> => {
    await api.post(`/team/${teamId}/grant-leader/${targetUserId}`);
};
/**
 * (Tùy chọn) Rời khỏi một team.
 * Backend endpoint: DELETE /api/team/{teamId}/members/{userId}
 */
export const leaveTeam = async (teamId: number, userId: number): Promise<void> => {
    await api.delete(`/team/${teamId}/members/${userId}`);
};