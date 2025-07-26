// src/components/Sidebar.tsx (đã có chức năng điều hướng)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // <<< 1. IMPORT COMPONENT <LINK>
import {
  HomeIcon,
  UserGroupIcon,
  FolderIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

type MenuItem = [string, React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & { title?: string; titleId?: string; } & React.RefAttributes<SVGSVGElement>>];

const menuItems: MenuItem[] = [
  ['Trang chủ', HomeIcon],
  ['Quản lý nhóm', UserGroupIcon],
  ['Quản lý dự án', FolderIcon],
  ['Nhiệm vụ', DocumentTextIcon],
  ['Lịch', CalendarIcon],
  ['Cuộc trò chuyện', ChatBubbleLeftIcon],
  ['Cài đặt nâng cao', Cog6ToothIcon],
  ['Tài khoản cá nhân', UserIcon],
];

// <<< 2. TẠO MỘT BẢN ĐỒ (MAP) TỪ TÊN MENU ĐẾN ĐƯỜNG DẪN (ROUTE) >>>
const pathMap: { [key: string]: string } = {
    'Trang chủ': '/',
    'Quản lý nhóm': '/teams',
    'Quản lý dự án': '/projects',
    'Nhiệm vụ': '/tasks',
    'Lịch': '/calendar',
    'Cuộc trò chuyện': '/chat',
    'Cài đặt nâng cao': '/settings',
    'Tài khoản cá nhân': '/profile'
};


interface SidebarProps {
  activeItem: string;
}

export default function Sidebar({ activeItem }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Logic để mở sidebar trên màn hình lớn nếu bạn muốn
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Nút bật/tắt sidebar trên mobile */}
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
            <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map(([label, Icon]) => (
                // <<< 3. BỌC MỖI MỤC MENU BẰNG COMPONENT <LINK> >>>
                <Link to={pathMap[label] || '/'} key={label} style={{ textDecoration: 'none' }}>
                  <li
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      label === activeItem
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-6 h-6 shrink-0" />
                    <span>{label}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Lớp phủ mờ trên mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}