import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastProps } from '../components/Toast';

type ToastContextType = {
  addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Date.now();
    const onClose = () => {
      setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
    };
    setToasts(currentToasts => [...currentToasts, { ...toast, id, onClose }]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};