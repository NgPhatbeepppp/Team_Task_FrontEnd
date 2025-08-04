import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TeamCard from '../components/TeamCard';
import { InviteMemberModal } from '../components/InviteMemberModal';
import { SelectMemberModal } from '../components/SelectMemberModal';
import { CreateTeamModal } from '../components/CreateTeamModal'; // ✨ 1. IMPORT MODAL TẠO NHÓM
import { LeaveTeamModal } from '../components/LeaveTeamModal'; // ✨ IMPORT MODAL RỜI NHÓM
import { DeleteTeamModal } from '../components/DeleteTeamModal'; // ✨ IMPORT MODAL XÓA NHÓM
import { ConfirmGrantLeaderModal } from '../components/ConfirmGrantLeaderModal'; // ✨ IMPORT MODAL TRAO QUYỀN TRƯỞNG NHÓM
import { SuccessModal } from '../components/SuccessModal'; // ✨ IMPORT MODAL THÀNH CÔNG from '../components/ConfirmGrantLeaderModal'; // ✨ IMPORT MODAL TRAO QUYỀN TRƯỞNG NHÓM
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
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // ✨ STATE MODAL THÀNH CÔNG
    const [successMessage, setSuccessMessage] = useState(''); // ✨ NỘI DUNG MODAL THÀNH CÔNG
    const [isConfirmGrantModalOpen, setIsConfirmGrantModalOpen] = useState(false); // ✨ STATE XÁC NHẬN TRAO QUYỀN
    const [selectedUserToGrant, setSelectedUserToGrant] = useState<number | null>(null); // ✨ LƯU USER MUỐN TRAO QUYỀN
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isGrantLeaderModalOpen, setIsGrantLeaderModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // ✨ 2. THÊM STATE CHO MODAL TẠO NHÓM
    const [selectedTeamForModal, setSelectedTeamForModal] = useState<Team | null>(null);

    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false); // ✨ STATE CHO MODAL RỜI NHÓM
    const [teamToLeave, setTeamToLeave] = useState<Team | null>(null); // ✨ LƯU TEAM ĐỂ RỜI

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // ✨ STATE MODAL XÓA NHÓM
    const [teamToDelete, setTeamToDelete] = useState<Team | null>(null); // ✨ LƯU TEAM ĐỂ XÓA

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

    const handleGrantLeader = (targetUserId: number) => {
        if (!selectedTeamForModal) return;
        setSelectedUserToGrant(targetUserId); // ✨ MỞ MODAL XÁC NHẬN TRAO QUYỀN
        setIsConfirmGrantModalOpen(true);
    };

    const handleInviteMember = async (targetUserId: number) => {
        if (!selectedTeamForModal) return;
        try {
            await inviteUserToTeam(selectedTeamForModal.id, targetUserId);
            setSuccessMessage('Đã gửi lời mời thành công!');
            setIsSuccessModalOpen(true);
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

    const handleDeleteTeam = (teamId: number) => {
        // ✨ 8. MỞ MODAL XÁC NHẬN XÓA THAY CHO window.confirm
        const team = teams.find(t => t.id === teamId);
        if (team) {
            setTeamToDelete(team);
            setIsDeleteModalOpen(true);
        }
    };

    const confirmDeleteTeam = async () => {
        if (!teamToDelete) return;
        try {
            await deleteTeam(teamToDelete.id);
            setTeams(prev => prev.filter(t => t.id !== teamToDelete.id));
        } catch (err) {
            alert('Xóa nhóm thất bại.');
        } finally {
            setIsDeleteModalOpen(false);
            setTeamToDelete(null);
        }
    };

    const handleLeaveTeam = (teamId: number) => {
        // ✨ 6. THAY ĐỔI: Dùng modal confirm thay cho window.confirm
        const team = teams.find(t => t.id === teamId);
        if (team) {
            setTeamToLeave(team);
            setIsLeaveModalOpen(true);
        }
    };

    const confirmLeaveTeam = async () => {
        if (!teamToLeave || !currentUserId) return;
        try {
            await leaveTeam(teamToLeave.id, currentUserId);
            setTeams(prev => prev.filter(t => t.id !== teamToLeave.id));
        } catch (err) {
            alert('Rời nhóm thất bại.');
        } finally {
            setIsLeaveModalOpen(false);
            setTeamToLeave(null);
        }
    };

    const confirmGrantLeader = async () => {
        if (!selectedTeamForModal || selectedUserToGrant === null) return;
        try {
            await grantLeaderRole(selectedTeamForModal.id, selectedUserToGrant);
            setSuccessMessage('Bạn đã trao quyền trưởng nhóm thành công!');
            setIsSuccessModalOpen(true);
            fetchTeams();
        } catch (err) {
            alert('Trao quyền thất bại.');
        } finally {
            setIsConfirmGrantModalOpen(false);
            setSelectedUserToGrant(null);
            handleCloseGrantLeaderModal();
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
            <main className="flex-grow p-6 sm:p-8" style={{ marginLeft: '256px' }}> {/* ✓ FIX đè Sidebar */}
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

            {/* ✨ 7. MODAL XÁC NHẬN RỜI NHÓM */}
            <LeaveTeamModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                onConfirm={confirmLeaveTeam}
                teamName={teamToLeave?.name || ''}
            />

            {/* ✨ 9. MODAL XÁC NHẬN XÓA NHÓM */}
            <DeleteTeamModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteTeam}
                teamName={teamToDelete?.name || ''}
            />

            {/* ✨ 10. MODAL XÁC NHẬN TRAO QUYỀN TRƯỞNG NHÓM */}
            <ConfirmGrantLeaderModal
                isOpen={isConfirmGrantModalOpen}
                onClose={() => setIsConfirmGrantModalOpen(false)}
                onConfirm={confirmGrantLeader}
            />
                    {/* ✨ 11. MODAL HIỂN THỊ TRAO QUYỀN THÀNH CÔNG */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                message={successMessage}
            />
        </div>
    );
};

export default TeamPage;
