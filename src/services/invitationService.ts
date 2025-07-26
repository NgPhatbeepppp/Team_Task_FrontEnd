import api from './api';

// 1. Định nghĩa cấu trúc dữ liệu cho lời mời
export interface InvitationDto {
  invitationId: number;
  invitationType: 'Project' | 'Team';
  targetName: string;
  targetId: number;
  inviterName: string;
  sentAt: string;
}

// 2. API lấy danh sách lời mời đang chờ
export const getPendingInvitations = async (): Promise<InvitationDto[]> => {
  const response = await api.get<InvitationDto[]>('/invitations/pending');
  return response.data;
};

// 3. API chấp nhận lời mời (phân loại theo Project hoặc Team)
export const acceptInvitation = async (invitation: InvitationDto): Promise<void> => {
  const { invitationId, invitationType } = invitation;
  if (invitationType === 'Project') {
    await api.post(`/invitations/${invitationId}/accept`);
  } else {
    await api.post(`/team-invitations/${invitationId}/accept`);
  }
};

// 4. API từ chối lời mời (phân loại theo Project hoặc Team)
export const rejectInvitation = async (invitation: InvitationDto): Promise<void> => {
  const { invitationId, invitationType } = invitation;
  if (invitationType === 'Project') {
    await api.post(`/invitations/${invitationId}/reject`);
  } else {
    await api.post(`/team-invitations/${invitationId}/reject`);
  }
};