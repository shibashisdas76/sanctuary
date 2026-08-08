import React from 'react';
import { sqliteService } from '../services/sqliteService';
import { cachedNetworkImageService } from '../services/cachedNetworkImageService';
import { Settings, X, Database, Trash2, Volume2, ShieldCheck, User } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  profileName: string;
  onUpdateProfileName: (name: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  profileName,
  onUpdateProfileName,
}) => {
  const handleClearData = () => {
    if (confirm('Clear all SQLite records and reset app image cache?')) {
      sqliteService.resetDatabase();
      cachedNetworkImageService.clearCache();
      alert('Local storage and cache cleared!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#f7fafb] w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#5e5e5b] hover:bg-[#e0e3e4] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pt-2">
          <div className="p-2.5 rounded-full bg-[#8ba88e]/30 text-[#233d29]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#181c1d]">Settings & Sync</h3>
            <p className="text-xs text-[#424842]">Configure offline storage and app preferences.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* User Profile */}
          <div className="p-4 rounded-2xl bg-white border border-[#c2c8c0]/50 space-y-2">
            <label className="text-xs font-medium text-[#424842] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Your Preferred Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => onUpdateProfileName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c2c8c0] text-sm text-[#181c1d] focus:outline-hidden focus:border-[#4a654e]"
            />
          </div>

          {/* Offline Sync Status */}
          <div className="p-4 rounded-2xl bg-[#cceace] border border-[#8ba88e]/40 flex items-center justify-between text-xs font-medium text-[#07200f]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#233d29]" />
              <span>Offline Database Ready (SQFlite + IndexedDB)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-mono text-[#233d29]">100% Offline</span>
          </div>

          {/* Clear Storage */}
          <div className="p-4 rounded-2xl bg-white border border-[#c2c8c0]/50 space-y-2">
            <span className="text-xs font-semibold text-[#181c1d] block">Database & Image Storage</span>
            <p className="text-xs text-[#5e5e5b] leading-relaxed">
              Reset offline SQLite table records and wipe disk memory image cache.
            </p>
            <button
              onClick={handleClearData}
              className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset SQFlite & Image Cache
            </button>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#4a654e] text-white text-xs font-semibold hover:bg-[#233d29] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
