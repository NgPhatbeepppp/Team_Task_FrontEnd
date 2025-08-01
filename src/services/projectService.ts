// src/services/projectService.ts

import api from './api';
import { User, Team } from '../types'; // Import các kiểu dữ liệu chung

// --- INTERFACES ---

export interface Project {
  id: number;
  keyCode: string; 
  name: string;
  description: string;
  createdByUserId: number;
  members?: { user: User }[]; 
  teams?: { team: Team }[];
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
export const createProject = async (projectData: { name: string; description: string | null }): Promise<Project> => {
    const response = await api.post<Project>('/project', projectData);
    return response.data;
};


/**
 * Chỉ tìm kiếm người dùng.
 * Backend: GET /api/users/search
 */
const searchUsers = async (query: string): Promise<User[]> => {
    const response = await api.get<User[]>('/users/search', {
        params: { query }
    });
    return response.data;
};

/**
 * HÀM MỚI: Lấy danh sách tất cả các team và lọc ở phía client.
 * Backend: GET /api/team
 * Ghi chú: Backend hiện chưa có API search team, nên chúng ta sẽ lấy tất cả và lọc.
 */
const searchTeams = async (query: string): Promise<Team[]> => {
    const response = await api.get<Team[]>('/team');
    const lowerCaseQuery = query.toLowerCase();
    // Lọc kết quả ngay tại frontend
    return response.data.filter(team => 
        team.name.toLowerCase().includes(lowerCaseQuery)
    );
};

/**
 * Lấy thông tin chi tiết một dự án.
 * Backend: GET /api/project/{id}
 */
export const getProjectById = async (projectId: number): Promise<Project> => {
    const response = await api.get<Project>(`/project/${projectId}`);
    return response.data;
};
/**
 * Tìm kiếm cả Users và Teams để mời vào một dự án.
 * Hàm này sẽ gọi 2 API riêng biệt và gộp kết quả.
 * @param projectId ID của dự án đang mời (hiện tại chưa dùng nhưng giữ lại cho logic sau này).
 * @param query Chuỗi tìm kiếm.
 */
export const searchUsersAndTeamsForInvitation = async (projectId: number, query: string): Promise<SearchResult[]> => {
    if (query.trim().length < 2) return [];

    // Gọi đồng thời cả hai API tìm kiếm
    const [users, teams] = await Promise.all([
        searchUsers(query),
        searchTeams(query)
    ]);

    // Chuyển đổi kết quả sang định dạng SearchResult
    const userResults: SearchResult[] = users.map(user => ({ type: 'User', data: user }));
    const teamResults: SearchResult[] = teams.map(team => ({ type: 'Team', data: team }));

    // Gộp và trả về kết quả
    return [...userResults, ...teamResults];
};

/**
 * SỬA LỖI PAYLOAD: Gửi lời mời một User vào dự án.
 * Backend: POST /api/projects/{projectId}/invitations/user
 * @param projectId ID của dự án.
 * @param identifier Username hoặc Email của người dùng được mời.
 */
export const inviteUserToProject = async (projectId: number, identifier: string): Promise<void> => {
    // Backend yêu cầu một object chứa 'identifier' là string
    await api.post(`/projects/${projectId}/invitations/user`, { identifier });
};

/**
 * Gửi lời mời một Team vào dự án bằng KeyCode.
 * Backend: POST /api/projects/{projectId}/invitations/team
 * @param projectId ID của dự án.
 * @param teamKeyCode KeyCode của nhóm được mời.
 */
export const inviteTeamToProject = async (projectId: number, teamKeyCode: string): Promise<void> => {
    // Gửi đi một object chứa thuộc tính "teamKeyCode" theo yêu cầu mới
    await api.post(`/projects/${projectId}/invitations/team`, { teamKeyCode });
};
/**
 * Xóa một thành viên khỏi dự án.
 * Backend: DELETE /api/project/{projectId}/members/{targetUserId}
 */
export const removeUserFromProject = async (projectId: number, targetUserId: number): Promise<void> => {
    await api.delete(`/project/${projectId}/members/${targetUserId}`);
};

/**
 * MỚI: Xóa một team khỏi dự án.
 * Backend: DELETE /api/project/{projectId}/teams/{teamId}
 */
export const removeTeamFromProject = async (projectId: number, teamId: number): Promise<void> => {
    await api.delete(`/project/${projectId}/teams/${teamId}`);
};