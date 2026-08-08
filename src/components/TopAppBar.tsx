import React from 'react';
import { CachedImage } from './CachedImage';
import { Settings, Wifi, WifiOff, SignalLow, Wrench, Smartphone, Monitor } from 'lucide-react';
import { NetworkSpeed } from '../types';

interface TopAppBarProps {
  networkSpeed: NetworkSpeed;
  onOpenSettings: () => void;
  onOpenDevTools: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  profileAvatarUrl: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  networkSpeed,
  onOpenSettings,
  onOpenDevTools,
  isMobileFrame,
  onToggleMobileFrame,
  profileAvatarUrl,
}) => {
  return (
    <header className="sticky top-0 w-full z-40 flex justify-between items-center px-4 md:px-8 py-3 backdrop-blur-md bg-slate-900 text-white shadow-sm border-b border-slate-800 transition-all">
      {/* Profile Avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-md overflow-hidden border border-slate-700 shadow-xs hover:border-blue-500 transition-all flex-shrink-0"
          title="User Profile & Settings"
        >
          <CachedImage
            src={profileAvatarUrl}
            alt="Alex Profile"
            className="w-full h-full object-cover"
          />
        </button>

        {/* Network Status Pill */}
        <div
          onClick={onOpenDevTools}
          className={`cursor-pointer px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
            networkSpeed === 'fast4g'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : networkSpeed === 'slow3g'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 animate-pulse'
          }`}
          title="Click to open DevTools & Network Inspector"
        >
          {networkSpeed === 'fast4g' && <Wifi className="w-3.5 h-3.5" />}
          {networkSpeed === 'slow3g' && <SignalLow className="w-3.5 h-3.5" />}
          {networkSpeed === 'offline' && <WifiOff className="w-3.5 h-3.5" />}
          <span className="capitalize text-[11px] font-mono tracking-tight">
            {networkSpeed === 'fast4g' ? 'Online' : networkSpeed === 'slow3g' ? 'Poor 3G' : 'Offline'}
          </span>
        </div>
      </div>

      {/* App Center Title */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
          S
        </div>
        <h1 className="text-base md:text-lg font-bold tracking-tight text-white uppercase text-center">
          The Sanctuary
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1">
        {/* Toggle Mobile Frame / Web Screen view */}
        <button
          onClick={onToggleMobileFrame}
          className="p-2 rounded-md hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
          title={isMobileFrame ? 'Switch to Responsive Web View' : 'Switch to Mobile Frame Preview'}
        >
          {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
        </button>

        {/* Dev Inspector Toggle */}
        <button
          onClick={onOpenDevTools}
          className="p-2 rounded-md hover:bg-slate-800 transition-colors text-blue-400 hover:text-blue-300 relative"
          title="Open SQFlite & Cache DevTools"
        >
          <Wrench className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-md hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
