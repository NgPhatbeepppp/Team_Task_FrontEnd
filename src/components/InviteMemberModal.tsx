import React, { useState, useMemo } from 'react';
import { TeamMember } from '../services/teamService';
import { User } from '../services/userService';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  allUsers: User[];
  currentMembers: TeamMember[];
  onInvite: (targetUserId: number) => void;
  teamName: string;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  allUsers,
  currentMembers,
  onInvite,
  teamName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sử dụng useMemo để tối ưu hóa việc lọc danh sách
  const invitableUsers = useMemo(() => {
    const memberIds = new Set(currentMembers.map(m => m.userId));
    return allUsers.filter(user => !memberIds.has(user.id) && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allUsers, currentMembers, searchTerm]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Mời thành viên vào nhóm "{teamName}"
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        <input
          type="text"
          placeholder="Tìm kiếm theo tên người dùng..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <ul className="list-none p-0 flex-grow max-h-80 overflow-y-auto">
          {invitableUsers.length > 0 ? (
            invitableUsers.map(user => (
              <li
                key={user.id}
                className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-4">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-700">{user.username}</span>
                </div>
                <button
                  onClick={() => onInvite(user.id)}
                  className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition"
                >
                  Mời
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Không tìm thấy người dùng hoặc tất cả đã ở trong nhóm.</p>
          )}
        </ul>
      </div>
    </div>
  );
};
