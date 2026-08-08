import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children, isMobileFrame }) => {
  if (!isMobileFrame) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-2 flex items-center justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[412px] h-[860px] bg-[#f7fafb] rounded-[48px] shadow-2xl border-[12px] border-slate-800 relative flex flex-col overflow-hidden ring-1 ring-slate-700">
        {/* Top Notch / Status Bar */}
        <div className="w-full h-8 bg-[#f7fafb]/90 backdrop-blur-md flex justify-between items-center px-6 pt-1 text-slate-800 text-[11px] font-medium z-50 select-none border-b border-slate-200/40">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-800 rounded-full absolute left-1/2 -translate-x-1/2 top-1" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        {/* Flutter App Viewport */}
        <div className="flex-grow overflow-y-auto relative scrollbar-none pb-12">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
