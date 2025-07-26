import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TeamCard from '../components/TeamCard';
import { InviteMemberModal } from '../components/InviteMemberModal';
import { SelectMemberModal } from '../components/SelectMemberModal';
import {
  getMyTeams,
  createTeam,
  deleteTeam,
  leaveTeam,
  grantLeaderRole,
  inviteUserToTeam, // Cần import hàm này
  Team,
} from '../services/teamService';
import { useAuth } from '../hooks/useAuth';
import { getUsers, User } from '../services/userService';

const TeamPage = () => {
    // --- STATES ---
    const [teams, setTeams] = useState<Team[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // ✨ SỬA LỖI: Tách state cho từng modal để tránh nhầm lẫn
    const [isGrantLeaderModalOpen, setIsGrantLeaderModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedTeamForModal, setSelectedTeamForModal] = useState<Team | null>(null);

    const { user } = useAuth();
    const currentUserId = user?.id;

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchData = async () => {
            if (currentUserId) {
                try {
                    setLoading(true);
                    // ✨ TỐI ƯU: Gọi song song 2 API để tải dữ liệu nhanh hơn
                    const [userTeams, allSystemUsers] = await Promise.all([
                        getMyTeams(),
                        getUsers()
                    ]);
                    setTeams(userTeams);
                    setAllUsers(allSystemUsers);
                    setError(null);
                } catch (err) {
                    setError('Không thể tải dữ liệu. Vui lòng thử lại.');
                    console.error("Lỗi khi fetch dữ liệu:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // Dừng loading nếu không có user
            }
        };
        fetchData();
    }, [currentUserId]);

    // --- MODAL HANDLERS ---

    // Mở/Đóng Modal Trao quyền
    const handleOpenGrantLeaderModal = (team: Team) => {
        setSelectedTeamForModal(team);
        setIsGrantLeaderModalOpen(true);
    };
    const handleCloseGrantLeaderModal = () => {
        setIsGrantLeaderModalOpen(false);
        setSelectedTeamForModal(null);
    };

    // ✨ THÊM MỚI: Mở/Đóng Modal Mời thành viên
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
                // Reload teams after granting leader role
                if (currentUserId) {
                    setLoading(true);
                    try {
                        const userTeams = await getMyTeams();
                        setTeams(userTeams);
                    } catch (err) {
                        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
                    } finally {
                        setLoading(false);
                    }
                }
            } catch (err) {
                alert('Trao quyền thất bại.');
            } finally {
                handleCloseGrantLeaderModal();
            }
        }
    };

    // ✨ THÊM MỚI: Xử lý mời thành viên
    const handleInviteMember = async (targetUserId: number) => {
        if (!selectedTeamForModal) return;
        try {
            await inviteUserToTeam(selectedTeamForModal.id, targetUserId);
            alert('Đã gửi lời mời thành công!');
            // Không cần tải lại trang, chỉ cần đóng modal
            handleCloseInviteModal();
        } catch (err) {
            alert('Gửi lời mời thất bại. Người dùng có thể đã ở trong nhóm hoặc đã được mời.');
        }
    };

    const handleCreateTeam = async () => { /* ... Giữ nguyên ... */ };
    const handleNavigateToDetails = (teamId: number) => { /* ... Giữ nguyên ... */ };
    const handleDeleteTeam = async (teamId: number) => { /* ... Giữ nguyên ... */ };
    const handleLeaveTeam = async (teamId: number) => { /* ... Giữ nguyên ... */ };
    
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
                            onOpenInviteModal={handleOpenInviteModal} // ✨ THÊM PROP NÀY
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar activeItem="Quản lý nhóm" />
            <main className="flex-grow p-6 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Nhóm Của Tôi</h1>
                        <button
                            onClick={handleCreateTeam}
                            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
                        >
                            + Tạo Nhóm Mới
                        </button>
                    </header>
                    {renderContent()}
                </div>
            </main>

            {/* Render cả 2 modal với state riêng */}
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
                        allUsers={allUsers}
                        currentMembers={selectedTeamForModal.teamMembers}
                        onInvite={handleInviteMember}
                        teamName={selectedTeamForModal.name}
                    />
                </>
            )}
        </div>
    );
};

export default TeamPage;
