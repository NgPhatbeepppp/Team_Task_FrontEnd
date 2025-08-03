// src/components/PriorityPicker.tsx
import React, { useState } from 'react';
import { TaskItem } from '../types';
import { Flag } from 'lucide-react';

interface PriorityPickerProps {
  task: TaskItem;
  onUpdate: (taskId: number, priority: 'Low' | 'Medium' | 'High') => void;
}

const priorityConfig = {
  High: { color: '#ef4444', label: 'Cao' },
  Medium: { color: '#f59e0b', label: 'Trung bình' },
  Low: { color: '#84cc16', label: 'Thấp' },
};

export const PriorityPicker: React.FC<PriorityPickerProps> = ({ task, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (priority: 'Low' | 'Medium' | 'High') => {
    onUpdate(task.id, priority);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-200"
      >
        <Flag size={16} color={priorityConfig[task.priority].color} />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-32 bg-white rounded-md shadow-lg border top-full mt-1">
          {Object.entries(priorityConfig).map(([key, { color, label }]) => (
            <div
              key={key}
              onClick={() => handleSelect(key as 'Low' | 'Medium' | 'High')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Flag size={14} color={color} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};