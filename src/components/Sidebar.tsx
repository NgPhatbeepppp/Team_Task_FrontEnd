// src/components/Sidebar.tsx 
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyProjects, Project } from '../services/projectService';
import { ConfirmationModal } from './ConfirmationModal';
import {
  HomeIcon, UserGroupIcon, FolderIcon, DocumentTextIcon, CalendarIcon,
  ChatBubbleLeftIcon, Cog6ToothIcon, UserIcon, ArrowLeftOnRectangleIcon,
  BellIcon, ChevronRightIcon, FolderOpenIcon
} from '@heroicons/react/24/outline';

// --- Types & Constants ---
type MenuItem = {
  label: string;
  icon: React.ElementType;
  path: string;
  isProjectMenu?: boolean;
};

const menuItems: MenuItem[] = [
    { label: 'Trang chủ', icon: HomeIcon, path: '/' },
    { label: 'Quản lý nhóm', icon: UserGroupIcon, path: '/teams' },
    { label: 'Quản lý dự án', icon: FolderIcon, path: '/projects', isProjectMenu: true },
    { label: 'Nhiệm vụ', icon: DocumentTextIcon, path: '/tasks' },
    { label: 'Lời mời & Thông báo', icon: BellIcon, path: '/notifications' },
    { label: 'Lịch', icon: CalendarIcon, path: '/calendar' },
    { label: 'Cuộc trò chuyện', icon: ChatBubbleLeftIcon, path: '/chat' },
    { label: 'Cài đặt nâng cao', icon: Cog6ToothIcon, path: '/settings' },
    { label: 'Tài khoản cá nhân', icon: UserIcon, path: '/profile' },
];

// --- Component chính ---
export default function Sidebar({ activeItem }: { activeItem: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getMyProjects()
      .then(projects => setMyProjects(projects))
      .catch(err => console.error("Không thể tải danh sách dự án cho sidebar:", err));
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/project')) {
      setIsProjectsExpanded(true);
    }
  }, [location.pathname]);
  
  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  const projectsToShow = myProjects.slice(0, 3);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors md:hidden"
        aria-label="Toggle Menu"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-40 flex flex-col md:translate-x-0"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">MANAGEMENT</h2>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <ul>
                {menuItems.map(({ label, icon: Icon, path, isProjectMenu }) => (
                  <li key={label}>
                    {isProjectMenu ? (
                      <div>
                        <div
                          onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                          className={`flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            (activeItem === label || isProjectsExpanded)
                              ? 'bg-indigo-50 text-indigo-700 font-semibold'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6 shrink-0" />
                            <span>{label}</span>
                          </div>
                          <ChevronRightIcon className={`w-4 h-4 transition-transform ${isProjectsExpanded ? 'rotate-90' : ''}`} />
                        </div>
                        <AnimatePresence>
                          {isProjectsExpanded && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-6 mt-1 space-y-1 overflow-hidden"
                            >
                              {projectsToShow.map(project => (
                                <li key={project.id}>
                                  <Link to={`/project/${project.id}`} className={`flex items-center gap-3 p-2 rounded-md text-sm transition-colors ${
                                      location.pathname === `/project/${project.id}` ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                                  >
                                    <FolderOpenIcon className="w-5 h-5 shrink-0" />
                                    <span className="truncate">{project.name}</span>
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link to="/projects" className="flex items-center gap-3 p-2 rounded-md text-sm text-indigo-600 hover:bg-indigo-50 font-medium">
                                  Xem tất cả dự án...
                                </Link>
                              </li>
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link to={path} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          label === activeItem
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-6 h-6 shrink-0" />
                        <span>{label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* VỊ TRÍ ĐÚNG CỦA NÚT ĐĂNG XUẤT */}
            <div className="p-4 mt-auto border-t border-gray-100">
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6 shrink-0" />
                <span className="font-semibold">Đăng xuất</span>
              </button>
            </div>
            
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Modal xác nhận có thể đặt ở đây hoặc bên ngoài motion.aside đều được */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Xác nhận Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?"
        confirmText="Đăng xuất"
        confirmButtonVariant="danger"
      />
    </>
  );
}