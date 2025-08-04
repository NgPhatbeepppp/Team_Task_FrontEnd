import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const config = {
    success: {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      barColor: 'bg-green-500',
    },
    error: {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      barColor: 'bg-red-500',
    },
  };

  return (
    <div className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden max-w-sm w-full animate-pulse">
      <div className={`w-2 self-stretch ${config[type].barColor}`} />
      <div className="flex items-center p-4">
        {config[type].icon}
        <p className="ml-3 text-sm font-medium text-gray-800">{message}</p>
      </div>
       <button onClick={onClose} className="ml-auto mr-4 text-gray-400 hover:text-gray-600">
          <X size={18} />
       </button>
    </div>
  );
};