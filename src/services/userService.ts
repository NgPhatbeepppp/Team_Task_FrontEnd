// src/services/userService.ts

import api from './api';

// Định nghĩa kiểu dữ liệu cho User và UserProfile
export interface UserProfile {
    userId: number;
    fullName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    jobTitle: string | null;
    gender: string | null;
    phoneNumber: string | null;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    fullName: string | null;
    avatarUrl: string | null;
    jobTitle: string | null;
}
export interface SearchedUser extends User {
    statusInTeam: 'Member' | 'Pending' | 'NotInvited';
}

/**
 * Lấy thông tin hồ sơ của người dùng đang đăng nhập.
 * Backend endpoint: GET /api/userprofile/me
 * @returns Promise<User>
 */
export const getUserProfile = async (): Promise<User> => {
    const response = await api.get<User>('/userprofile/me');
    return response.data;
};

/**
 * Lấy danh sách tất cả người dùng
 * @returns Promise<User[]>
 */
export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
};
export const searchUsers = async (query: string): Promise<User[]> => {
    if (query.trim().length < 2) {
        return []; // Không gửi request nếu query quá ngắn
    }
    const response = await api.get<User[]>(`/users/search`, {
        params: { query }
    });
    return response.data;
};
/**
 * Cập nhật thông tin hồ sơ người dùng.
 * Backend endpoint: PUT /api/userprofile/me
 */

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    await api.put('/userprofile/me', profileData);
};