// src/pages/TeamPage.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TeamCard from '../components/TeamCard';
import { InviteMemberModal } from '../components/InviteMemberModal';
import { SelectMemberModal } from '../components/SelectMemberModal';
import { CreateTeamModal } from '../components/CreateTeamModal';
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

const TeamPage = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isGrantLeaderModalOpen, setIsGrantLeaderModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTeamForModal, setSelectedTeamForModal] = useState<Team | null>(null);

    const { user } = useAuth();
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

    const handleGrantLeader = async (targetUserId: number) => {
        if (!selectedTeamForModal) return;
        if (window.confirm(`Bạn có chắc muốn trao quyền trưởng nhóm cho thành viên này?`)) {
            try {
                await grantLeaderRole(selectedTeamForModal.id, targetUserId);
                alert('Trao quyền thành công!');
                fetchTeams();
            } catch (err) {
                alert('Trao quyền thất bại.');
            } finally {
                handleCloseGrantLeaderModal();
            }
        }
    };

    const handleInviteMember = async (targetUserId: number) => {
        if (!selectedTeamForModal) return;
        try {
            await inviteUserToTeam(selectedTeamForModal.id, targetUserId);
            alert('Đã gửi lời mời thành công!');
        } catch (err) {
            alert('Gửi lời mời thất bại. Người dùng có thể đã ở trong nhóm hoặc đã có lời mời đang chờ.');
        }
    };
    
    const handleCreateTeam = async (teamData: { name: string; description: string | null }) => {
        try {
            await createTeam(teamData);
            fetchTeams();
        } catch (err) {
            alert('Tạo nhóm thất bại.');
            throw err;
        }
    };

    const handleNavigateToDetails = (teamId: number) => {
        console.log(`Điều hướng đến trang chi tiết của nhóm ID: ${teamId}`);
    };

    const handleDeleteTeam = async (teamId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhóm này không?')) {
            try {
                await deleteTeam(teamId);
                setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
            } catch (err) {
                alert('Xóa nhóm thất bại.');
            }
        }
    };

    const handleLeaveTeam = async (teamId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn rời khỏi nhóm này?')) {
            try {
                if (currentUserId) {
                    await leaveTeam(teamId, currentUserId);
                    setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
                }
            } catch (err) {
                alert('Rời nhóm thất bại.');
            }
        }
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
            // --- THAY ĐỔI BỐ CỤC LƯỚI ---
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
                            onDeleteTeam={handleDeleteTeam}
                            onLeaveTeam={handleLeaveTeam}
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
                        onSelectMember={handleGrantLeader}
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
        </div>
    );
};

export default TeamPage;