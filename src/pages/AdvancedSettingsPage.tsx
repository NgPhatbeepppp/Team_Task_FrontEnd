// src/pages/AdvancedSettingsPage.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { ShieldCheck, Palette, Bell, ChevronRight } from 'lucide-react';

// --- Các component con cho từng mục cài đặt ---

const SecuritySettings = () => {
  // Logic cho thay đổi mật khẩu và xác thực tài khoản sẽ ở đây
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bảo mật tài khoản</h3>
      <div className="space-y-4">
        {/* Mục thay đổi mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <button className="mt-1 text-indigo-600 hover:underline">Thay đổi mật khẩu của bạn</button>
        </div>
        {/* Mục xác thực tài khoản */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Xác thực tài khoản</label>
          <p className="text-sm text-gray-500 mt-1">
            Tài khoản của bạn chưa được xác thực.
            <button className="ml-2 text-indigo-600 hover:underline">Gửi lại email xác thực</button>
          </p>
        </div>
      </div>
    </div>
  );
};

const AppearanceSettings = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);


  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Giao diện và Trải nghiệm</h3>
       <div>
          <label className="block text-sm font-medium text-gray-700">Chế độ</label>
          <div className="mt-2 flex items-center space-x-4">
            <button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-md text-sm ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Sáng</button>
            <button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-md text-sm ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Tối</button>
          </div>
        </div>
    </div>
  );
};

const NotificationSettings = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông báo</h3>
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
      <p className="text-sm text-yellow-800">
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
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Cài đặt nâng cao</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý tài khoản, giao diện và các thiết lập khác.</p>
          </header>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Menu Cài đặt */}
            <aside className="w-full md:w-1/4">
              <nav className="space-y-2">
                {menu.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex justify-between items-center text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === item.key
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </nav>
            </aside>

            {/* Nội dung Cài đặt */}
            <div className="w-full md:w-3/4 bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
              {renderSection()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdvancedSettingsPage;