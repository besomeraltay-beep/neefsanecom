import React, { useEffect } from 'react';
import { CheckCircle2, X, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl bg-[#111827] text-white border border-gray-800 text-xs">
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-orange-400 shrink-0" />
        )}
        <div className="font-medium pr-2">{message}</div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
