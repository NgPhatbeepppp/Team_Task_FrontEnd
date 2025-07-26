import React from 'react';
import { TeamMember } from '../services/teamService';

interface SelectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  onSelectMember: (targetUserId: number) => void;
  teamName: string;
  currentUserId: number;
}

export const SelectMemberModal: React.FC<SelectMemberModalProps> = ({
  isOpen,
  onClose,
  members,
  onSelectMember,
  teamName,
  currentUserId,
}) => {
  if (!isOpen) {
    return null;
  }

  const eligibleMembers = members.filter(
    member => member.userId !== currentUserId && member.roleInTeam !== 'TeamLeader'
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Trao quyền cho thành viên nhóm "{teamName}"
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        <ul className="list-none p-0 max-h-64 overflow-y-auto">
          {eligibleMembers.length > 0 ? (
            eligibleMembers.map(member => (
              <li
                key={member.userId}
                className="flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSelectMember(member.userId)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-4">
                  {member.user.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">{member.user.username}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Không có thành viên nào phù hợp để trao quyền.</p>
          )}
        </ul>

        <div className="mt-6 text-right">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
                Hủy
            </button>
        </div>
      </div>
    </div>
  );
};
