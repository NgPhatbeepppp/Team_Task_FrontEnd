// src/services/projectService.ts

import api from './api';
import { User, Team } from '../types'; // Import các kiểu dữ liệu chung

// --- INTERFACES ---

// Cấu trúc dữ liệu cho một Project (dựa trên tài liệu CSDL)
export interface Project {
  id: number;
  name: string;
  description: string;
  createdByUserId: number;
  // Các thông tin này có thể cần để hiển thị trên card
  projectMembers?: { user: User }[]; 
  projectTeams?: { team: Team }[];
}

// Cấu trúc cho kết quả tìm kiếm (User hoặc Team)
export type SearchResult = 
  | { type: 'User'; data: User }
  | { type: 'Team'; data: Team };


// --- API FUNCTIONS ---

/**
 * Lấy danh sách các dự án mà người dùng hiện tại tham gia.
 * Backend: GET /api/project/mine
 */
export const getMyProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/project/mine');
  return response.data;
};

/**
 * Tạo một dự án mới.
 * Backend: POST /api/project
 */
export const createProject = async (projectData: { name: string; description: string }): Promise<Project> => {
    const response = await api.post<Project>('/project', projectData);
    return response.data;
};

/**
 * Tìm kiếm cả Users và Teams để mời vào một dự án.
 * Backend: GET /api/project/{projectId}/search-invitable
 * @param projectId ID của dự án đang mời.
 * @param query Chuỗi tìm kiếm.
 */
export const searchUsersAndTeamsForInvitation = async (projectId: number, query: string): Promise<SearchResult[]> => {
    if (query.trim().length < 2) return [];
    const response = await api.get<SearchResult[]>(`/project/${projectId}/search-invitable`, {
        params: { query }
    });
    return response.data;
};

/**
 * Gửi lời mời một User vào dự án.
 * Backend: POST /api/project/{projectId}/invitations/user
 * @param projectId ID của dự án.
 * @param targetUserId ID của người dùng được mời.
 */
export const inviteUserToProject = async (projectId: number, targetUserId: number): Promise<void> => {
    await api.post(`/project/${projectId}/invitations/user`, { targetUserId });
};

/**
 * Gửi lời mời một Team vào dự án.
 * Backend: POST /api/project/{projectId}/invitations/team
 * @param projectId ID của dự án.
 * @param targetTeamId ID của nhóm được mời.
 */
export const inviteTeamToProject = async (projectId: number, targetTeamId: number): Promise<void> => {
    await api.post(`/project/${projectId}/invitations/team`, { targetTeamId });
};