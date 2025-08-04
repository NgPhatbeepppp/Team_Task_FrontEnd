import React, { useState, useEffect, useCallback } from 'react';
import { SearchedUser, searchUsersForInvitation } from '../services/teamService';
import { debounce } from 'lodash'; // Cần cài đặt: npm install lodash @types/lodash

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (targetUserId: number) => void;
  teamId: number;
  teamName: string;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  teamId,
  teamName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sử dụng useCallback và debounce để tối ưu hóa việc gọi API
  // Chỉ gọi API sau khi người dùng ngừng gõ 500ms
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        // Gọi API tìm kiếm mới, truyền vào teamId và query
        const users = await searchUsersForInvitation(teamId, query);
        // Lọc bỏ những người đã là thành viên (backend đã hỗ trợ nhưng lọc lại cho chắc chắn)
        setResults(users.filter(user => user.statusInTeam !== 'Member'));
      } catch (error) {
        console.error("Lỗi khi tìm kiếm người dùng:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [teamId] // Dependency là teamId để đảm bảo hàm được tạo lại nếu team thay đổi
  );

  // Gọi hàm debouncedSearch mỗi khi searchTerm thay đổi
  useEffect(() => {
    debouncedSearch(searchTerm);
    // Hủy bỏ debounce khi component unmount để tránh memory leak
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);
  
  // Reset trạng thái nội bộ của modal mỗi khi nó được mở
  useEffect(() => {
    if (isOpen) {
        setSearchTerm('');
        setResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Mời thành viên vào "{teamName}"</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        <input
          type="text"
          placeholder="Nhập username hoặc email để tìm kiếm..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <ul className="list-none p-0 flex-grow min-h-[10rem] max-h-80 overflow-y-auto">
          {isLoading && <p className="text-center text-gray-500 py-4">Đang tìm kiếm...</p>}
          
          {!isLoading && results.length > 0 && (
            results.map(user => (
              <li key={user.id} className="flex items-center justify-between p-3 rounded-md">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-4">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">{user.username}</span>
                </div>
                
                {user.statusInTeam === 'Pending' ? (
                  <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full">
                    Đang chờ
                  </span>
                ) : (
                  <button
                    onClick={() => onInvite(user.id)}
                    className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition"
                  >
                    Mời
                  </button>
                )}
              </li>
            ))
          )}

          {!isLoading && results.length === 0 && searchTerm.length > 1 && (
            <p className="text-center text-gray-500 py-4">Không tìm thấy người dùng nào.</p>
          )}
        </ul>
      </div>
    </div>
  );
};