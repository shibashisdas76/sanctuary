import React from 'react';
import { NavTab } from '../types';
import { HeartHandshake, BookOpen, Library, LineChart } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'sanctuary' as NavTab, label: 'Sanctuary', icon: HeartHandshake },
    { id: 'journal' as NavTab, label: 'Journal', icon: BookOpen },
    { id: 'library' as NavTab, label: 'Library', icon: Library },
    { id: 'insights' as NavTab, label: 'Insights', icon: LineChart },
  ];

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md z-40 flex justify-around items-center p-1.5 rounded-xl bg-slate-900/95 text-slate-300 backdrop-blur-xl border border-slate-800 shadow-xl shadow-slate-950/20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] font-medium tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
