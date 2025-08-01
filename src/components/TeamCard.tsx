import React, { useState } from 'react';
import { Team } from '../services/teamService';
import { UserPlus, Key } from 'lucide-react';
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
    <div className="relative w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 border-2 border-white -ml-2" title={member.user?.username}>
      {initial}
      {isLeader && <span className="absolute -top-2 -right-2 text-sm" title="Trưởng nhóm">👑</span>}
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

  const membersToShow = team.teamMembers.slice(0, 4);
  const extraMembersCount = team.teamMembers.length > 4 ? team.teamMembers.length - 4 : 0;

  return (
    <div
      className="bg-white rounded-lg shadow-md p-5 flex flex-col h-full cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800">{team.name}</h3>
        <div className="relative">
          {currentUserRole === 'TeamLeader' ? (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(p => !p); }}
                className="text-gray-500 hover:text-gray-800 text-xl p-1"
              >
                ...
              </button>
              {menuOpen && (
                <ul
                  onMouseLeave={() => setMenuOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
                >
                  <li
                    onClick={(e) => { e.stopPropagation(); onOpenGrantLeaderModal(team); setMenuOpen(false); }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Trao quyền Trưởng nhóm
                  </li>
                  <li
                    onClick={(e) => { e.stopPropagation(); onDeleteTeam(team.id); setMenuOpen(false); }}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Xóa Nhóm
                  </li>
                </ul>
              )}
            </>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onLeaveTeam(team.id); }}
              className="px-3 py-1 border border-red-500 text-red-500 text-xs font-semibold rounded-full hover:bg-red-500 hover:text-white transition-colors"
            >
              Rời Nhóm
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 truncate flex-grow mb-4">{team.description || 'Không có mô tả'}</p>
 <div className="mb-4 flex items-center">
        <Key size={14} className="text-gray-400 mr-2" />
        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {team.keyCode}
        </span>
      </div>
      <div className="flex items-center mt-auto">
        <div className="flex">
          {membersToShow.map(member => (
            <MemberAvatar key={member.userId} member={member} />
          ))}
          {extraMembersCount > 0 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border-2 border-white -ml-2">
              +{extraMembersCount}
            </div>
          )}
        </div>
        {currentUserRole === 'TeamLeader' && (
            <button
                onClick={(e) => { e.stopPropagation(); onOpenInviteModal(team); }}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                title="Mời thành viên"
            >
                <UserPlus size={18} className="text-gray-600" />
            </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
