import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TeamCard from '../components/TeamCard';
import { InviteMemberModal } from '../components/InviteMemberModal';
import { SelectMemberModal } from '../components/SelectMemberModal';
import { CreateTeamModal } from '../components/CreateTeamModal'; // ✨ 1. IMPORT MODAL TẠO NHÓM
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

const TeamPage = () => {
    // --- STATES ---
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isGrantLeaderModalOpen, setIsGrantLeaderModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // ✨ 2. THÊM STATE CHO MODAL TẠO NHÓM
    const [selectedTeamForModal, setSelectedTeamForModal] = useState<Team | null>(null);

    const { user } = useAuth();
    const currentUserId = user?.id;

    // --- DATA FETCHING ---
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

    // --- MODAL HANDLERS ---
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

    // --- ACTION HANDLERS ---

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
    
    // ✨ 3. CẬP NHẬT HÀM ĐỂ NHẬN DỮ LIỆU TỪ MODAL
    const handleCreateTeam = async (teamData: { name: string; description: string | null }) => {
        try {
            await createTeam(teamData);
            fetchTeams();
        } catch (err) {
            alert('Tạo nhóm thất bại.');
            throw err; // Ném lỗi để modal không tự đóng
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
    
    // --- RENDER LOGIC ---
    const renderContent = () => {
        if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
        if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
        if (!user) return <div className="text-center py-10">Vui lòng đăng nhập để xem các nhóm.</div>;
        if (teams.length === 0) return <div className="text-center py-10">Bạn chưa tham gia nhóm nào. Hãy tạo một nhóm mới!</div>;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar activeItem="Quản lý nhóm" />
            <main className="flex-grow p-6 sm:p-8 md:ml-64">
                <div className="max-w-7xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Nhóm Của Tôi</h1>
                        <button
                            // ✨ 4. THAY ĐỔI onClick ĐỂ MỞ MODAL
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
                        >
                            + Tạo Nhóm Mới
                        </button>
                    </header>
                    {renderContent()}
                </div>
            </main>

            {/* ✨ 5. RENDER CÁC MODAL */}
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