import React, { useState, useEffect, useCallback } from 'react';
import { 
    searchUsersAndTeamsForInvitation, 
    inviteUserToProject, 
    inviteTeamToProject,
    SearchResult,
} from '../services/projectService';
import { getTeamByKeyCode, Team } from '../services/teamService'; // THÊM MỚI
import { debounce } from 'lodash';
import { User, Users, Search, Loader2, Key, XCircle, CheckCircle } from 'lucide-react'; // THÊM MỚI
import { Project } from '../types';
import { useToast } from '../hooks/useToast';

// --- COMPONENT CON CHO TAB TÌM KIẾM ---
const SearchTab: React.FC<{ project: Project }> = ({ project }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const { addToast } = useToast();

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
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

  const handleInvite = async (item: SearchResult) => {
    const id = item.type === 'User' ? `user-${item.data.id}` : `team-${item.data.id}`;
    if (invitedIds.has(id)) return;

    try {
      if (item.type === 'User') {
        await inviteUserToProject(project.id, item.data.username); 
      } else {
        await inviteTeamToProject(project.id, item.data.keyCode);
      }
      setInvitedIds(prev => new Set(prev).add(id));
      const displayName = item.type === 'User' ? item.data.username : item.data.name;
      addToast({ message: `Đã gửi lời mời tới "${displayName}" thành công!`, type: 'success' });
    } catch (err) {
      addToast({ message: `Gửi lời mời thất bại. Có thể họ đã ở trong dự án hoặc đã nhận được lời mời.`, type: 'error' });
    }
  };

  return (
    <>
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
                  isInvited ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
    </>
  );
};

// --- COMPONENT CON CHO TAB MỜI BẰNG MÃ ---
const KeyCodeTab: React.FC<{ project: Project }> = ({ project }) => {
  const [keyCode, setKeyCode] = useState('');
  const [foundTeam, setFoundTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInvited, setIsInvited] = useState(false);
  const { addToast } = useToast();

  const debouncedSearch = useCallback(
    debounce(async (code: string) => {
      if (code.trim().length < 3) { // Giả sử keycode có ít nhất 3 ký tự
        setFoundTeam(null);
        setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      setFoundTeam(null);
      try {
        const team = await getTeamByKeyCode(code);
        setFoundTeam(team);
      } catch (err) {
        setError('Không tìm thấy nhóm với mã này.');
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(keyCode);
    return () => debouncedSearch.cancel();
  }, [keyCode, debouncedSearch]);
  
  const handleInvite = async () => {
    if (!foundTeam) return;
    try {
      await inviteTeamToProject(project.id, foundTeam.keyCode);
      setIsInvited(true);
      addToast({ message: `Đã gửi lời mời tới nhóm "${foundTeam.name}" thành công!`, type: 'success' });
    } catch(err) {
      addToast({ message: `Gửi lời mời thất bại. Có thể nhóm đã ở trong dự án hoặc đã nhận được lời mời.`, type: 'error' });
    }
  };

  return (
    <>
      <div className="relative mb-2">
        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Nhập mã mời của nhóm..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={keyCode}
          onChange={e => setKeyCode(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-sm px-1">{error}</p>}
      
      <div className="flex-grow min-h-[12rem] max-h-96 flex flex-col items-center justify-center">
        {isLoading && <Loader2 className="animate-spin text-indigo-600" size={32} />}
        {foundTeam && !isLoading && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-gray-700 mb-4">
              Bạn có muốn mời nhóm <span className="font-bold text-green-800">"{foundTeam.name}"</span> tham gia dự án này?
            </p>
            <button
              onClick={handleInvite}
              disabled={isInvited}
              className={`flex items-center justify-center w-full px-4 py-2 text-sm font-semibold rounded-md transition ${
                isInvited ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isInvited ? <><CheckCircle size={16} className="mr-2"/> Đã mời</> : `Mời nhóm "${foundTeam.name}"`}
            </button>
          </div>
        )}
      </div>
    </>
  );
};


// --- COMPONENT CHÍNH ---
interface InviteToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const InviteToProjectModal: React.FC<InviteToProjectModalProps> = ({ isOpen, onClose, project }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'keyCode'>('search');

  // Reset state khi modal được mở
  useEffect(() => {
    if (isOpen) {
      setActiveTab('search');
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mời vào dự án "{project.name}"</h2>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'search'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Search size={18}/>
              Tìm kiếm
            </button>
            <button
              onClick={() => setActiveTab('keyCode')}
              className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'keyCode'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Key size={18}/>
              Mời bằng mã
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'search' ? <SearchTab project={project} /> : <KeyCodeTab project={project} />}
      </div>
    </div>
  );
};