// src/services/taskService.ts

import api from './api';
import { TaskItem } from '../types';

/**
 * Lấy tất cả các task thuộc về một dự án.
 * Backend: GET /api/tasks/project/{projectId}
 * @param projectId ID của dự án cần lấy task.
 * @returns Promise<TaskItem[]>
 */
export const getTasksByProjectId = async (projectId: number): Promise<TaskItem[]> => {
    const response = await api.get<TaskItem[]>(`/tasks/project/${projectId}`);
    return response.data;
};
/**
 * Tạo một công việc mới.
 * Backend: POST /api/tasks
 * @param taskData Dữ liệu của task mới.
 * @returns Promise<TaskItem>
 */
export const createTask = async (taskData: Partial<TaskItem>): Promise<TaskItem> => {
    const response = await api.post<TaskItem>('/tasks', taskData);
    return response.data;
};

/**
 * Cập nhật trạng thái cho một công việc.
 * Dùng cho chức năng kéo-thả trên bảng Kanban.
 * Backend: PUT /api/tasks/{taskId}/status
 * @param taskId ID của công việc cần cập nhật.
 * @param newStatusId ID của trạng thái mới.
 */
export const updateTaskStatus = async (taskId: number, newStatusId: number): Promise<void> => {
    await api.put(`/tasks/${taskId}/status`, { newStatusId });
};