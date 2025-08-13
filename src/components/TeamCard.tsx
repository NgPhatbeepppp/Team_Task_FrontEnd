// src/components/TeamCard.tsx
import React, { useState } from 'react';
import { Team } from '../services/teamService';
import { UserPlus, Key, MoreVertical, Trash2, Crown, LogOut } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  currentUserRole: 'TeamLeader' | 'Member';
  onNavigateToDetails: (teamId: number) => void;
  onDeleteTeam: (teamId: number) => void;
  onLeaveTeam: (teamId: number) => void;
  onOpenGrantLeaderModal: (team: Team) => void;
  onOpenInviteModal: (team: Team) => void; 
}

const MemberAvatar: React.FC<{ member: Team['teamMembers'][0] }> = ({ member }) => {
  const isLeader = member.roleInTeam === 'TeamLeader';
  const initial = member.user?.username?.charAt(0).toUpperCase() || '?';

  return (
    <div className="relative group">
        <div 
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-800 -ml-3 transition-transform transform group-hover:scale-110" 
            title={member.user?.username}
        >
        {initial}
        {isLeader && <span className="absolute -top-1 -right-1 text-base" title="Trưởng nhóm">👑</span>}
        </div>
    </div>
  );
};

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  currentUserRole,
  onNavigateToDetails,
  onDeleteTeam,  onLeaveTeam,
  onOpenGrantLeaderModal,
  onOpenInviteModal,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, ul')) return;
    onNavigateToDetails(team.id);
  };

  const membersToShow = team.teamMembers.slice(0, 5);
  const extraMembersCount = team.teamMembers.length > 5 ? team.teamMembers.length - 5 : 0;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-2xl text-gray-900 dark:text-white">{team.name}</h3>
        <div className="relative">
            <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(p => !p); }}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <MoreVertical size={20} />
            </button>
            {menuOpen && (
                <ul
                  onMouseLeave={() => setMenuOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 py-1"
                >
                    {currentUserRole === 'TeamLeader' ? (
                        <>
                            <li onClick={(e) => { e.stopPropagation(); onOpenGrantLeaderModal(team); setMenuOpen(false); }}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                                <Crown size={16} className="mr-3"/>Trao quyền
                            </li>
                            <li onClick={(e) => { e.stopPropagation(); onDeleteTeam(team.id); setMenuOpen(false); }}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 cursor-pointer">
                                <Trash2 size={16} className="mr-3"/>Xóa Nhóm
                            </li>
                        </>
                    ) : (
                        <li onClick={(e) => { e.stopPropagation(); onLeaveTeam(team.id); setMenuOpen(false); }}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 cursor-pointer">
                            <LogOut size={16} className="mr-3"/>Rời Nhóm
                        </li>
                    )}
                </ul>
            )}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-4 line-clamp-2 min-h-[40px]">{team.description || 'Không có mô tả'}</p>
      
      <div className="mb-6">
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">MÃ MỜI</span>
        <div className="flex items-center mt-1">
            <Key size={14} className="text-gray-400 mr-2" />
            <span className="text-sm font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {team.keyCode}
            </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          {membersToShow.map(member => (
            <MemberAvatar key={member.userId} member={member} />
          ))}
          {extraMembersCount > 0 && (
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300 border-2 border-white dark:border-gray-800 -ml-3">
              +{extraMembersCount}
            </div>
          )}
        </div>
        {currentUserRole === 'TeamLeader' && (
            <button
                onClick={(e) => { e.stopPropagation(); onOpenInviteModal(team); }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
                title="Mời thành viên"
            >
                <UserPlus size={16} className="mr-2" />
                Mời
            </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;