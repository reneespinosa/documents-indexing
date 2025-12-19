'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      bg: 'bg-gradient-to-r from-accent-emerald to-green-600',
      icon: '✓',
      border: 'border-accent-emerald/50',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-red-700',
      icon: '✕',
      border: 'border-red-500/50',
    },
    info: {
      bg: 'bg-gradient-to-r from-accent-indigo to-accent-purple',
      icon: 'ℹ',
      border: 'border-accent-indigo/50',
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      icon: '⚠',
      border: 'border-yellow-500/50',
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={`min-w-[300px] max-w-md transform transition-all duration-300 ${
        isVisible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`${style.bg} ${style.border} border-2 rounded-xl shadow-2xl p-4 flex items-center gap-3 backdrop-blur-sm`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
          {style.icon}
        </div>
        <p className="flex-1 text-white font-medium text-sm">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
          duration={3000}
        />
      ))}
    </div>
  );
}

