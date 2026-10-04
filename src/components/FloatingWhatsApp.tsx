import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { MessageSquare, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { openDirectWhatsApp, settings, currentView } = useApp();
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide on admin view so it doesn't obstruct admin tables
  if (currentView === 'admin') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 select-none">
      {/* Speech bubble / Tooltip */}
      {showTooltip && (
        <div className="relative hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel bg-slate-900/95 border border-emerald-500/30 shadow-2xl text-xs font-medium text-white animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Need help? Chat with us on WhatsApp!</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => openDirectWhatsApp()}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white flex items-center justify-center shadow-2xl whatsapp-glow transition-all duration-300 relative group cursor-pointer"
        aria-label="Chat on WhatsApp"
        title={`Chat on WhatsApp (${settings.whatsappNumber})`}
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow">
          1
        </span>
        <MessageSquare className="w-7 h-7 fill-white group-hover:scale-110 transition-transform duration-200" />
      </button>
    </div>
  );
};
