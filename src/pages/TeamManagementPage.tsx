// src/pages/TeamManagementPage.tsx (đã cập nhật)

import React, { useState, useEffect, FormEvent } from 'react';
import Sidebar from '../components/Sidebar'; // << Import Sidebar mới
import { Team, getTeams, createTeam, deleteTeam, inviteUserToTeam, updateTeam, removeMember, grantLeader } from '../services/teamService';
import { User, getUsers } from '../services/userService';
import { ShieldCheck, Trash2, UserPlus, Crown, Edit, X } from 'lucide-react';

// --- STYLES ---
// Các style này gần như không đổi, chỉ điều chỉnh layout chung
const styles: { [key: string]: React.CSSProperties } = {
    // Layout chung để chứa cả Sidebar và Content
    pageLayout: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc' // Màu nền xám nhạt
    },
    // Phần nội dung chính, có padding để không bị che bởi Sidebar (trên màn hình lớn)
    mainContent: {
        flexGrow: 1,
        // Chú ý: Cần thêm padding left để không bị Sidebar che khuất trên màn hình lớn
        // giá trị 288px (w-72) tương ứng với chiều rộng của Sidebar trong code mới
        paddingLeft: '288px', // << Rất quan trọng cho layout desktop
        padding: '24px'
    },
    container: { fontFamily: 'sans-serif', maxWidth: '1100px', margin: 'auto' },
    header: { fontSize: '2rem', fontWeight: 700, marginBottom: '24px', color: '#1a202c' },
    form: { marginBottom: '32px', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fdfdfd' },
    inputGroup: { marginBottom: '16px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 600, color: '#4a5568' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e0' },
    button: { padding: '10px 16px', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', fontWeight: 600, transition: 'background-color 0.2s' },
    teamList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', padding: 0 },
    teamCard: { border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', overflow: 'hidden' },
    cardHeader: { padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontSize: '1.25rem', fontWeight: 700, margin: 0 },
    cardActions: { display: 'flex', gap: '8px' },
    cardBody: { padding: '16px' },
    memberList: { listStyle: 'none', padding: 0, marginTop: '16px' },
    memberItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', borderRadius: '4px', marginBottom: '4px' },
    memberInfo: { display: 'flex', alignItems: 'center', gap: '8px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: 'white', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '500px' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
};


// --- COMPONENT CHÍNH ---
export default function TeamManagementPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [teamsData, usersData] = await Promise.all([getTeams(), getUsers()]);
                setTeams(teamsData);
                setAllUsers(usersData);
                setError(null);
            } catch (err) {
                setError('Không thể tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const refreshTeams = async () => {
        try {
            const teamsData = await getTeams();
            setTeams(teamsData);
        } catch (err) { console.error("Lỗi khi làm mới danh sách team:", err); }
    }
    
    const openCreateModal = () => {
        setEditingTeam(null);
        setFormName('');
        setFormDescription('');
        setIsModalOpen(true);
    };

    const openEditModal = (team: Team) => {
        setEditingTeam(team);
        setFormName(team.teamName);
        setFormDescription(team.description);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) return;
        const teamData = { teamName: formName, description: formDescription };
        try {
            if (editingTeam) {
                await updateTeam(editingTeam.id, teamData);
            } else {
                await createTeam(teamData);
            }
            setIsModalOpen(false);
            await refreshTeams();
        } catch (err) {
            alert('Thao tác thất bại.');
        }
    };

    const handleDeleteTeam = async (teamId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn XÓA vĩnh viễn nhóm này?')) {
            try {
                await deleteTeam(teamId);
                setTeams(teams.filter(team => team.id !== teamId));
            } catch (err) { alert('Xóa nhóm thất bại.'); }
        }
    };
    
    const handleInviteUser = async (team: Team) => {
        const teamMemberIds = new Set(team.teamMembers.map(m => m.userId));
        const availableUsers = allUsers.filter(u => !teamMemberIds.has(u.id));
        if (availableUsers.length === 0) {
            alert("Tất cả người dùng đã ở trong nhóm.");
            return;
        }
        const userIdInput = prompt('Chọn ID người dùng để mời:\n\n' + availableUsers.map(u => `${u.id}: ${u.username}`).join('\n'));
        if (userIdInput) {
            const userId = parseInt(userIdInput, 10);
            if (availableUsers.some(u => u.id === userId)) {
                try {
                    await inviteUserToTeam(team.id, userId);
                    alert(`Đã gửi lời mời đến người dùng ID: ${userId}`);
                } catch (err) { alert('Gửi lời mời thất bại.'); }
            } else {
                alert('ID người dùng không hợp lệ hoặc đã ở trong nhóm.');
            }
        }
    };

    const handleRemoveMember = async (teamId: number, userId: number) => {
        if (window.confirm('Xóa thành viên này khỏi nhóm?')) {
            try {
                await removeMember(teamId, userId);
                await refreshTeams();
            } catch (err) { alert('Xóa thành viên thất bại.'); }
        }
    }

    const handleGrantLeader = async (teamId: number, userId: number) => {
        if (window.confirm('Trao quyền trưởng nhóm cho thành viên này?')) {
            try {
                await grantLeader(teamId, userId);
                await refreshTeams();
            } catch (err) { alert('Trao quyền thất bại.'); }
        }
    }

    return (
        <div style={styles.pageLayout}>
            {/* SỬ DỤNG SIDEBAR MỚI VÀ TRUYỀN PROP */}
            <Sidebar activeItem="Quản lý nhóm" />

            {/* PHẦN NỘI DUNG CHÍNH */}
            <main style={styles.mainContent}>
                <div style={styles.container}>
                    {/* Header và nút tạo mới */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={styles.header}>Quản Lý Nhóm</h1>
                        <button onClick={openCreateModal} style={{...styles.button, backgroundColor: '#4f46e5'}}>
                            Tạo Nhóm Mới
                        </button>
                    </div>
                    
                    {/* Render loading, error hoặc danh sách team */}
                    {loading ? <p>Đang tải dữ liệu...</p> : 
                     error ? <p style={{ color: 'red' }}>{error}</p> : (
                        <div style={styles.teamList}>
                            {teams.map((team) => (
                                <div key={team.id} style={styles.teamCard}>
                                    <div style={styles.cardHeader}>
                                        <h2 style={styles.cardTitle}>{team.teamName}</h2>
                                        <div style={styles.cardActions}>
                                            <Edit size={18} cursor="pointer" onClick={() => openEditModal(team)} />
                                            <Trash2 size={18} cursor="pointer" color="#e53e3e" onClick={() => handleDeleteTeam(team.id)} />
                                        </div>
                                    </div>
                                    <div style={styles.cardBody}>
                                        <p style={{ margin: '0 0 16px', color: '#718096' }}>{team.description || 'Không có mô tả.'}</p>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <strong>Thành viên ({team.teamMembers.length})</strong>
                                            <button onClick={() => handleInviteUser(team)} style={{...styles.button, padding: '4px 8px', fontSize: '0.8rem', backgroundColor: '#38a169'}}>
                                                <UserPlus size={14}/>
                                            </button>
                                        </div>
                                        <ul style={styles.memberList}>
                                            {team.teamMembers.map(member => (
                                                <li key={member.userId} style={styles.memberItem}>
                                                    <div style={styles.memberInfo}>
                                                        <span>{member.user.username}</span>
                                                        {member.isLeader && (
                                                            <span title="Trưởng nhóm">
                                                                <Crown size={16} color="#d69e2e" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    {!member.isLeader && (
                                                        <div style={{ display: 'flex', gap: '12px' }}>
                                                            <span title="Trao quyền trưởng nhóm">
                                                                <ShieldCheck size={16} color="#38a169" cursor="pointer" onClick={() => handleGrantLeader(team.id, member.userId)} />
                                                            </span>
                                                            <span title="Xóa thành viên">
                                                                <Trash2 size={16} color="#c53030" cursor="pointer" onClick={() => handleRemoveMember(team.id, member.userId)} />
                                                            </span>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Modal */}
                    {isModalOpen && (
                        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                                <div style={styles.modalHeader}>
                                    <h2 style={{margin: 0}}>{editingTeam ? 'Chỉnh Sửa Nhóm' : 'Tạo Nhóm Mới'}</h2>
                                    <X cursor="pointer" onClick={() => setIsModalOpen(false)} />
                                </div>
                                <form onSubmit={handleFormSubmit}>
                                    {/* Form fields... */}
                                    <div style={styles.inputGroup}>
                                        <label htmlFor="teamName" style={styles.label}>Tên Nhóm:</label>
                                        <input id="teamName" type="text" value={formName} onChange={(e) => setFormName(e.target.value)} style={styles.input} required/>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label htmlFor="teamDescription" style={styles.label}>Mô Tả:</label>
                                        <input id="teamDescription" type="text" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} style={styles.input}/>
                                    </div>
                                    <button type="submit" style={{...styles.button, backgroundColor: '#4f46e5', width: '100%', marginTop: '8px'}}>
                                        {editingTeam ? 'Lưu Thay Đổi' : 'Tạo Nhóm'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}