// src/components/Toast.tsx
import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // Tự động tắt sau 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = type === 'success' ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />;
  const bg = type === 'success' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
  const text = type === 'success' ? 'text-green-800' : 'text-red-800';

  return (
    <div className={`fixed top-6 right-6 z-[9999] w-[320px] p-4 border-l-4 rounded-md shadow-md ${bg} ${text} animate-fade-in`}>
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XCircle size={16} />
        </button>
      </div>
    </div>
  );
};
