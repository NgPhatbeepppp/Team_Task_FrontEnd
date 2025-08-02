// src/components/UserSearchInput.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { searchProjectMembers } from '../services/projectService';
import { debounce } from 'lodash';
import { X } from 'lucide-react';

interface UserSearchInputProps {
  projectId: number;
  selectedUsers: User[];
  onSelectedUsersChange: (users: User[]) => void;
}

export const UserSearchInput: React.FC<UserSearchInputProps> = ({ projectId, selectedUsers, onSelectedUsersChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const users = await searchProjectMembers(projectId, query);
        // Lọc ra những người chưa được chọn
        const selectedIds = new Set(selectedUsers.map(u => u.id));
        setSearchResults(users.filter(u => !selectedIds.has(u.id)));
      } catch (error) {
        console.error("Lỗi khi tìm thành viên:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [projectId, selectedUsers]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSelectUser = (user: User) => {
    onSelectedUsersChange([...selectedUsers, user]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveUser = (userId: number) => {
    onSelectedUsersChange(selectedUsers.filter(u => u.id !== userId));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Giao cho</label>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md mb-2 min-h-[40px]">
        {selectedUsers.map(user => (
          <div key={user.id} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded-full flex items-center gap-2">
            <span>{user.username}</span>
            <button type="button" onClick={() => handleRemoveUser(user.id)} className="text-indigo-600 hover:text-indigo-800">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm thành viên..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        { (isLoading || searchResults.length > 0) && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                {isLoading ? (
                    <li className="px-3 py-2 text-gray-500">Đang tìm...</li>
                ) : (
                    searchResults.map(user => (
                        <li key={user.id} onClick={() => handleSelectUser(user)} className="px-3 py-2 hover:bg-indigo-50 cursor-pointer">
                            {user.username}
                        </li>
                    ))
                )}
            </ul>
        )}
      </div>
    </div>
  );
};