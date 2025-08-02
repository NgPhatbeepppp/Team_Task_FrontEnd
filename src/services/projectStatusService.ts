// src/services/projectStatusService.ts

import api from './api';

// --- INTERFACES ---

/**
 * Đại diện cho một trạng thái công việc trong dự án.
 */
export interface ProjectStatus {
  id: number;
  name: string;
  color: string;
  order: number;
  projectId: number;
}

/**
 * Dữ liệu cần thiết để tạo một trạng thái mới.
 * projectId sẽ được lấy từ URL, không cần truyền vào body.
 */
export type CreateStatusDto = Pick<ProjectStatus, 'name'> & {
  color?: string;
};

/**
 * Dữ liệu cần thiết để cập nhật một trạng thái.
 */
export type UpdateStatusDto = Pick<ProjectStatus, 'id' | 'name' | 'color'>;


// --- API FUNCTIONS ---

/**
 * Lấy tất cả các trạng thái của một dự án.
 * Backend: GET /api/projects/{projectId}/statuses
 * @param projectId ID của dự án cần lấy trạng thái.
 * @returns Một mảng các đối tượng ProjectStatus.
 */
export const getProjectStatuses = async (projectId: number): Promise<ProjectStatus[]> => {
  const response = await api.get<ProjectStatus[]>(`/projects/${projectId}/statuses`);
  // Sắp xếp lại theo 'order' để đảm bảo thứ tự đúng
  return response.data.sort((a, b) => a.order - b.order);
};

/**
 * Tạo một trạng thái mới cho dự án.
 * Backend: POST /api/projects/{projectId}/statuses
 * @param projectId ID của dự án.
 * @param statusData Dữ liệu của trạng thái mới (tên, màu sắc).
 * @returns Đối tượng ProjectStatus vừa được tạo.
 */
export const createProjectStatus = async (projectId: number, statusData: CreateStatusDto): Promise<ProjectStatus> => {
  const response = await api.post<ProjectStatus>(`/projects/${projectId}/statuses`, statusData);
  return response.data;
};

/**
 * Cập nhật thông tin (tên, màu) của một trạng thái.
 * Backend: PUT /api/statuses/{statusId}
 * @param statusId ID của trạng thái cần cập nhật.
 * @param statusData Dữ liệu mới cho trạng thái.
 */
export const updateProjectStatus = async (statusId: number, statusData: UpdateStatusDto): Promise<void> => {
  await api.put(`/statuses/${statusId}`, statusData);
};

/**
 * Sắp xếp lại thứ tự của các trạng thái trong một dự án.
 * Backend: PUT /api/projects/{projectId}/statuses/reorder
 * @param projectId ID của dự án.
 * @param statusIdsInOrder Một mảng chứa các ID của trạng thái theo thứ tự mới.
 */
export const reorderProjectStatuses = async (projectId: number, statusIdsInOrder: number[]): Promise<void> => {
  await api.put(`/projects/${projectId}/statuses/reorder`, { statusIdsInOrder });
};

/**
 * Xóa một trạng thái khỏi dự án.
 * Backend: DELETE /api/statuses/{statusId}
 * @param statusId ID của trạng thái cần xóa.
 */
export const deleteProjectStatus = async (statusId: number): Promise<void> => {
  await api.delete(`/statuses/${statusId}`);
};