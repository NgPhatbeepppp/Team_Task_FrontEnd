// src/services/taskService.ts

import api from './api';
import { TaskItem } from '../types';

/**
 * Lấy tất cả các task thuộc về một dự án.
 * Backend: GET /api/tasks/project/{projectId}
 */
export const getTasksByProjectId = async (projectId: number): Promise<TaskItem[]> => {
    const response = await api.get<TaskItem[]>(`/tasks/project/${projectId}`);
    return response.data;
};

/**
 * Lấy thông tin chi tiết của một công việc.
 * Backend: GET /api/Tasks/{id}
 */
export const getTaskById = async (taskId: number): Promise<TaskItem> => {
    const response = await api.get<TaskItem>(`/Tasks/${taskId}`);
    return response.data;
};

/**
 * Tạo một công việc mới.
 * Backend: POST /api/tasks
 */
export const createTask = async (taskData: Partial<TaskItem>): Promise<TaskItem> => {
    const response = await api.post<TaskItem>('/tasks', taskData);
    return response.data;
};

/**
 * Cập nhật thông tin của một công việc (dùng cho modal chi tiết).
 * Backend: PUT /api/Tasks/{id}
 */
export const updateTask = async (taskId: number, taskData: Partial<TaskItem> & { assignedUserIds?: number[] }): Promise<void> => {
    await api.put(`/Tasks/${taskId}`, taskData);
};

/**
 * MỚI: Cập nhật độ ưu tiên của một công việc.
 * Backend: PUT /api/Tasks/{taskId}/priority
 */
export const updateTaskPriority = async (taskId: number, priority: 'Low' | 'Medium' | 'High'): Promise<void> => {
    await api.put(`/Tasks/${taskId}/priority`, { priority });
};


/**
 * Cập nhật trạng thái cho một công việc.
 * Backend: PUT /api/tasks/{taskId}/status
 */
export const updateTaskStatus = async (taskId: number, newStatusId: number): Promise<void> => {
    await api.put(`/tasks/${taskId}/status`, { newStatusId });
};