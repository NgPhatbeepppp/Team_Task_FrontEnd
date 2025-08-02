// src/components/ViewSwitcher.tsx
import React from 'react';
import { List, LayoutGrid, Calendar } from 'lucide-react';

type ViewMode = 'list' | 'board' | 'calendar';

interface ViewSwitcherProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ activeView, onViewChange }) => {
  const tabs: { id: ViewMode; label: string; icon: React.ElementType }[] = [
    { id: 'list', label: 'Danh sách', icon: List },
    { id: 'board', label: 'Bảng', icon: LayoutGrid },
    { id: 'calendar', label: 'Lịch', icon: Calendar },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map(tab => {
          //  vô hiệu hóa tab 'Lịch'
          const isDisabled = tab.id === 'calendar';

          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              disabled={isDisabled}
              className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <tab.icon size={18}/>
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};