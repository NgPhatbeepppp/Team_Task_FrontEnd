// src/pages/AdvancedSettingsPage.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { ShieldCheck, Palette, Bell, ChevronRight } from 'lucide-react';

// --- Các component con cho từng mục cài đặt (ĐÃ CẬP NHẬT GIAO DIỆN) ---

const SecuritySettings = () => {
  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Bảo mật tài khoản</h3>
      <div className="space-y-6">
        {/* Mục thay đổi mật khẩu */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Mật khẩu</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Đổi mật khẩu của bạn để tăng cường bảo mật.</p>
          </div>
          <button className="mt-3 sm:mt-0 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shrink-0">
            Thay đổi mật khẩu
          </button>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Mục xác thực tài khoản */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Xác thực tài khoản</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tài khoản của bạn hiện chưa được xác thực.</p>
          </div>
          <button className="mt-3 sm:mt-0 px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors shrink-0">
            Gửi lại email
          </button>
        </div>
      </div>
    </div>
  );
};

const AppearanceSettings = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Giao diện và Trải nghiệm</h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-medium text-gray-800 dark:text-gray-200">Chế độ hiển thị</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Chọn giao diện sáng hoặc tối cho ứng dụng.</p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <button 
            onClick={() => setTheme('light')} 
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${theme === 'light' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Sáng
          </button>
          <button 
            onClick={() => setTheme('dark')} 
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${theme === 'dark' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            Tối
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings = () => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Thông báo</h3>
    <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        Chức năng cài đặt thông báo đang được xây dựng và sẽ sớm ra mắt.
      </p>
    </div>
  </div>
);


// --- Component Trang chính ---
const AdvancedSettingsPage = () => {
  const [activeSection, setActiveSection] = useState('security');

  const menu = [
    { key: 'security', label: 'Bảo mật', icon: ShieldCheck },
    { key: 'appearance', label: 'Giao diện', icon: Palette },
    { key: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'security':
        return <SecuritySettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar activeItem="Cài đặt nâng cao" />
      <main className="flex-grow p-6 sm:p-8 md:ml-64">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Cài đặt nâng cao</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý tài khoản, giao diện và các thiết lập khác.</p>
          </header>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Menu Cài đặt */}
            <aside className="w-full md:w-1/4">
              <nav className="space-y-2">
                {menu.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex justify-between items-center text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                      activeSection === item.key
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeSection === item.key ? 'translate-x-1' : ''}`} />
                  </button>
                ))}
              </nav>
            </aside>

            {/* Nội dung Cài đặt */}
            <div className="w-full md:w-3/4">
              {renderSection()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdvancedSettingsPage;