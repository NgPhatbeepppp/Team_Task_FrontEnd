// src/components/InviteToProjectModal.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
    searchUsersAndTeamsForInvitation, 
    inviteUserToProject, 
    inviteTeamToProject,
    SearchResult,
    
} from '../services/projectService';
import { debounce } from 'lodash';
import { User, Users, Search, Loader2 } from 'lucide-react';
import { Project } from '../types'; // Import kiểu dữ liệu Project
interface InviteToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const InviteToProjectModal: React.FC<InviteToProjectModalProps> = ({ isOpen, onClose, project }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());

  // Debounce function để tránh gọi API liên tục
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!project || query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchUsersAndTeamsForInvitation(project.id, query);
        setResults(data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [project]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Reset state khi modal được mở
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setResults([]);
      setInvitedIds(new Set());
    }
  }, [isOpen]);

  const handleInvite = async (item: SearchResult) => {
    if (!project) return;

    const id = item.type === 'User' ? `user-${item.data.id}` : `team-${item.data.id}`;
    if (invitedIds.has(id)) return;

    try {
      if (item.type === 'User') {
        // --- THAY ĐỔI DUY NHẤT TẠI ĐÂY ---
        // Gửi `item.data.username` thay vì `item.data.id`
        await inviteUserToProject(project.id, item.data.username); 
      } else {
        // Lời gọi này đã đúng với service mới
        await inviteTeamToProject(project.id, String(item.data.id));
      }
      // Thêm ID vào danh sách đã mời để cập nhật UI
      setInvitedIds(prev => new Set(prev).add(id));
      const displayName = item.type === 'User' ? item.data.username : item.data.name;
      alert(`Đã gửi lời mời tới "${displayName}" thành công!`);
    } catch (err) {
      alert(`Gửi lời mời thất bại. Có thể họ đã ở trong dự án hoặc đã nhận được lời mời.`);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mời vào dự án "{project.name}"</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên người dùng, email, hoặc tên nhóm..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-grow min-h-[12rem] max-h-96 overflow-y-auto pr-2">
          {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>}
          
          {!isLoading && results.map((item) => {
            const id = item.type === 'User' ? `user-${item.data.id}` : `team-${item.data.id}`;
            const name = item.type === 'User' ? item.data.username : item.data.name;
            const isInvited = invitedIds.has(id);
            return (
              <div key={id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-200 rounded-full mr-3">
                    {item.type === 'User' ? <User size={20} className="text-gray-600" /> : <Users size={20} className="text-gray-600" />}
                  </div>
                  <span className="font-medium text-gray-800">{name}</span>
                </div>
                
                <button
                  onClick={() => handleInvite(item)}
                  disabled={isInvited}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${
                    isInvited 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isInvited ? 'Đã mời' : 'Mời'}
                </button>
              </div>
            );
          })}

          {!isLoading && results.length === 0 && searchTerm.length > 1 && (
            <p className="text-center text-gray-500 py-6">Không tìm thấy kết quả phù hợp.</p>
          )}
        </div>
      </div>
    </div>
  );
};
