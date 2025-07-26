import api from './api';
import { User } from './userService';

// --- INTERFACES ---

export interface TeamMember {
    userId: number;
    user: User;
    roleInTeam: 'TeamLeader' | 'Member';
}

export interface Team {
    id: number;
    name: string;
    description: string;
    createdByUserId: number;
    teamMembers: TeamMember[];
}

export interface SearchedUser extends User {
    statusInTeam: 'Member' | 'Pending' | 'NotInvited';
}

// --- API FUNCTIONS ---

export const getMyTeams = async (): Promise<Team[]> => {
    const response = await api.get<Team[]>('/team/mine');
    return response.data;
};

export const createTeam = async (teamData: { name: string; description: string }): Promise<Team> => {
    const response = await api.post<Team>('/team', teamData);
    return response.data;
};

export const deleteTeam = async (id: number): Promise<void> => {
    await api.delete(`/team/${id}`);
};

export const inviteUserToTeam = async (teamId: number, targetUserId: number): Promise<void> => {
    await api.post(`/team/${teamId}/invitations`, { targetUserId });
};

export const grantLeaderRole = async (teamId: number, targetUserId: number): Promise<void> => {
    await api.post(`/team/${teamId}/grant-leader/${targetUserId}`);
};

export const removeMember = async (teamId: number, targetUserId: number): Promise<void> => {
    await api.delete(`/team/${teamId}/members/${targetUserId}`);
};

export const leaveTeam = async (teamId: number, userId: number): Promise<void> => {
    return removeMember(teamId, userId);
};

/**
 * Tìm kiếm người dùng để mời vào một team cụ thể.
 * Backend: GET /api/team/{teamId}/invitations/search-users?query=...
 */
export const searchUsersForInvitation = async (teamId: number, query: string): Promise<SearchedUser[]> => {
    if (query.trim().length < 2) {
        return [];
    }
    // ✨ Đảm bảo URL này là chính xác: /team/{id}/invitations/search-users
    const response = await api.get<SearchedUser[]>(`/team/${teamId}/invitations/search-users`, {
        params: { query }
    });
    return response.data;
};
