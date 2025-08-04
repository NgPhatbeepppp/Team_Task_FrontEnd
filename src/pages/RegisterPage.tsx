// src/pages/TeamPage.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TeamCard from '../components/TeamCard';
import { InviteMemberModal } from '../components/InviteMemberModal';
import { SelectMemberModal } from '../components/SelectMemberModal';
import { CreateTeamModal } from '../components/CreateTeamModal';
import { ConfirmationModal } from '../components/ConfirmationModal'; // Import ConfirmationModal
import {
  getMyTeams,
  createTeam,
  deleteTeam,
  leaveTeam,
  grantLeaderRole,
  inviteUserToTeam,
  Team,
} from '../services/teamService';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const TeamPage = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // States for modals
    const [isGrantLeaderModalOpen, setIsGrantLeaderModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTeamForModal, setSelectedTeamForModal] = useState<Team | null>(null);

    // States for confirmation modal
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '', confirmText: 'Xác nhận' });
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);


    const { user } = useAuth();
    const { addToast } = useToast();
    const currentUserId = user?.id;

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const userTeams = await getMyTeams();
            setTeams(userTeams);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách nhóm. Vui lòng thử lại.');
            console.error("Lỗi khi fetch teams:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUserId) {
            fetchTeams();
        } else {
            setLoading(false);
        }
    }, [currentUserId]);

    const handleOpenGrantLeaderModal = (team: Team) => {
        setSelectedTeamForModal(team);
        setIsGrantLeaderModalOpen(true);
    };
    const handleCloseGrantLeaderModal = () => {
        setIsGrantLeaderModalOpen(false);
        setSelectedTeamForModal(null);
    };

    const handleOpenInviteModal = (team: Team) => {
        setSelectedTeamForModal(team);
        setIsInviteModalOpen(true);
    };
    const handleCloseInviteModal = () => {
        setIsInviteModalOpen(false);
        setSelectedTeamForModal(null);
    };
    
    // --- CẬP NHẬT LOGIC XÁC NHẬN ---
    const handleGrantLeaderSelect = (targetUserId: number) => {
        const team = selectedTeamForModal;
        const member = team?.teamMembers.find(m => m.userId === targetUserId);
        if (!team || !member) return;

        setConfirmModalContent({
            title: 'Xác nhận trao quyền',
            message: `Bạn có chắc muốn trao quyền trưởng nhóm cho "${member.user.username}"? Hành động này không thể hoàn tác.`,
            confirmText: 'Trao quyền'
        });
        
        setConfirmAction(() => async () => {
            try {
                await grantLeaderRole(team.id, targetUserId);
                addToast({ message: 'Trao quyền thành công!', type: 'success' });
                fetchTeams(); // Tải lại danh sách nhóm để cập nhật vai trò
            } catch (err) {
                addToast({ message: 'Trao quyền thất bại.', type: 'error' });
            } finally {
                handleCloseGrantLeaderModal();
            }
        });

        setIsGrantLeaderModalOpen(false); // Đóng modal chọn người
        setIsConfirmModalOpen(true); // Mở modal xác nhận
    };

    const handleInviteMember = async (targetUserId: number) => {
        if (!selectedTeamForModal) return;
        try {
            await inviteUserToTeam(selectedTeamForModal.id, targetUserId);
            addToast({ message: 'Đã gửi lời mời thành công!', type: 'success' });
        } catch (err) {
            addToast({ message: 'Gửi lời mời thất bại. Người dùng có thể đã ở trong nhóm hoặc đã có lời mời đang chờ.', type: 'error' });
        }
    };
    
    const handleCreateTeam = async (teamData: { name: string; description: string | null }) => {
        try {
            await createTeam(teamData);
            addToast({ message: 'Tạo nhóm thành công!', type: 'success' });
            fetchTeams();
        } catch (err) {
            addToast({ message: 'Tạo nhóm thất bại.', type: 'error' });
            throw err;
        }
    };

    const handleNavigateToDetails = (teamId: number) => {
        console.log(`Điều hướng đến trang chi tiết của nhóm ID: ${teamId}`);
    };

    const handleDeleteTeam = (teamId: number, teamName: string) => {
        setConfirmModalContent({
            title: 'Xác nhận xóa nhóm',
            message: `Bạn có chắc chắn muốn xóa nhóm "${teamName}" không? Mọi dữ liệu liên quan sẽ bị mất vĩnh viễn.`,
            confirmText: 'Xóa nhóm'
        });

        setConfirmAction(() => async () => {
             try {
                await deleteTeam(teamId);
                addToast({ message: 'Xóa nhóm thành công!', type: 'success' });
                setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
            } catch (err) {
                addToast({ message: 'Xóa nhóm thất bại.', type: 'error' });
            }
        });
        
        setIsConfirmModalOpen(true);
    };

    const handleLeaveTeam = (teamId: number) => {
        setConfirmModalContent({
            title: 'Xác nhận rời nhóm',
            message: 'Bạn có chắc chắn muốn rời khỏi nhóm này?',
            confirmText: 'Rời nhóm'
        });
        
        setConfirmAction(() => async () => {
             try {
                if (currentUserId) {
                    await leaveTeam(teamId, currentUserId);
                    addToast({ message: 'Rời nhóm thành công!', type: 'success' });
                    setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
                }
            } catch (err) {
                addToast({ message: 'Rời nhóm thất bại.', type: 'error' });
            }
        });

       setIsConfirmModalOpen(true);
    };
    
    const renderContent = () => {
        if (loading) return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
        );
        if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
        if (!user) return <div className="text-center py-10">Vui lòng đăng nhập để xem các nhóm.</div>;
        if (teams.length === 0) return (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700">Không tìm thấy nhóm nào</h3>
                <p className="mt-2 text-gray-500">Bạn chưa tham gia nhóm nào. Hãy tạo một nhóm mới để bắt đầu!</p>
            </div>
        );

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {teams.map(team => {
                    const currentUserMembership = team.teamMembers.find(m => m.userId === currentUserId);
                    const currentUserRole = currentUserMembership?.roleInTeam || 'Member';

                    return (
                        <TeamCard
                            key={team.id}
                            team={team}
                            currentUserRole={currentUserRole}
                            onNavigateToDetails={handleNavigateToDetails}
                            onDeleteTeam={() => handleDeleteTeam(team.id, team.name)}
                            onLeaveTeam={() => handleLeaveTeam(team.id)}
                            onOpenGrantLeaderModal={handleOpenGrantLeaderModal}
                            onOpenInviteModal={handleOpenInviteModal}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar activeItem="Quản lý nhóm" />
            <main className="flex-grow p-6 sm:p-8 md:ml-64">
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                         <div>
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Nhóm Của Tôi</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Tất cả các nhóm bạn đang tham gia.</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform hover:scale-105"
                        >
                            + Tạo Nhóm Mới
                        </button>
                    </header>
                    {renderContent()}
                </div>
            </main>

            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateTeam}
            />

            {selectedTeamForModal && currentUserId && (
                <>
                    <SelectMemberModal
                        isOpen={isGrantLeaderModalOpen}
                        onClose={handleCloseGrantLeaderModal}
                        members={selectedTeamForModal.teamMembers}
                        onSelectMember={handleGrantLeaderSelect}
                        teamName={selectedTeamForModal.name}
                        currentUserId={currentUserId}
                    />
                    <InviteMemberModal
                        isOpen={isInviteModalOpen}
                        onClose={handleCloseInviteModal}
                        onInvite={handleInviteMember}
                        teamId={selectedTeamForModal.id}
                        teamName={selectedTeamForModal.name}
                    />
                </>
            )}
            
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => {
                    confirmAction?.();
                    setIsConfirmModalOpen(false);
                }}
                title={confirmModalContent.title}
                message={confirmModalContent.message}
                confirmText={confirmModalContent.confirmText}
                confirmButtonVariant="danger"
            />
        </div>
    );
};

export default TeamPage;