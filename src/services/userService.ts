// src/services/userService.ts

import api from './api';

// Định nghĩa kiểu dữ liệu cho User
export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
}

/**
 * Lấy danh sách tất cả người dùng
 * @returns Promise<User[]>
 */
export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
};