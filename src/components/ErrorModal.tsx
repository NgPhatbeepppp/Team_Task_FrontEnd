// src/components/ErrorModal.tsx
import React from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">❌ Thất bại</h2>
        <p className="text-gray-800 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};
