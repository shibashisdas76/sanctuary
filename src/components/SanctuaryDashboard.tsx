import React, { useState, useEffect } from 'react';
import { sqliteService } from '../services/sqliteService';
import { MoodType } from '../types';
import { Wind, Trees, Sparkles, ChevronRight, RefreshCw, Zap } from 'lucide-react';

interface SanctuaryDashboardProps {
  onOpenBoxBreathing: () => void;
  onOpenGrounding: () => void;
  onNavigateTab: (tab: any) => void;
}

export const SanctuaryDashboard: React.FC<SanctuaryDashboardProps> = ({
  onOpenBoxBreathing,
  onOpenGrounding,
  onNavigateTab,
}) => {
  const [mentalEnergy, setMentalEnergy] = useState<number>(70);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>('Foggy');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Calculate dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleMoodSelect = (mood: MoodType, emoji: string) => {
    setSelectedMood(mood);
    sqliteService.insertMoodLog(mood, emoji, 7, `Checked in as ${mood} from Sanctuary dashboard`);
    setFeedbackMessage(`Logged "${mood}" to SQLite database`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleEnergyChange = (delta: number) => {
    const newVal = Math.min(100, Math.max(0, mentalEnergy + delta));
    setMentalEnergy(newVal);
  };

  const getEnergyStatusText = (val: number) => {
    if (val > 80) return 'Restored';
    if (val > 60) return 'Balanced';
    if (val > 35) return 'Moderate';
    return 'Drained';
  };

  // SVG dash calculation for ring
  const strokeDashoffset = 283 - (283 * mentalEnergy) / 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Greeting Section */}
      <section className="text-center md:text-left space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#181c1d] tracking-tight">
          {getGreeting()}, Alex.
        </h1>
        <p className="text-base md:text-lg text-[#424842]">Take a deep breath.</p>
      </section>

      {/* Main Grid: Mental Energy + Mood & Quick Relief */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Mental Energy Battery */}
        <section className="md:col-span-5 glass-card rounded-xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden border border-slate-200">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 z-10 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-600" /> Mental Energy
          </h2>

          <div className="relative w-48 h-48 flex items-center justify-center z-10">
            <div className="absolute inset-0 battery-glow rounded-full" />
            <svg className="w-full h-full transform -rotate-90 z-10" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#2563eb"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-900">{mentalEnergy}%</span>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-0.5">
                {getEnergyStatusText(mentalEnergy)}
              </span>
            </div>
          </div>

          {/* Quick energy adjustment buttons */}
          <div className="mt-6 flex items-center gap-3 z-10">
            <button
              onClick={() => handleEnergyChange(-10)}
              className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors border border-slate-200"
            >
              -10%
            </button>
            <span className="text-xs font-medium text-slate-500">Adjust Energy</span>
            <button
              onClick={() => handleEnergyChange(10)}
              className="px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 transition-colors border border-blue-200"
            >
              +10%
            </button>
          </div>
        </section>

        {/* Right Stack: Mood Selector & Quick Relief */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Mood Selector */}
          <section className="glass-card rounded-xl p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">How are you feeling right now?</h2>
              {feedbackMessage && (
                <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md animate-fade-in font-mono">
                  {feedbackMessage}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                { mood: 'Calm' as MoodType, emoji: '😌' },
                { mood: 'Energized' as MoodType, emoji: '🔋' },
                { mood: 'Foggy' as MoodType, emoji: '😶‍🌫️' },
                { mood: 'Heavy' as MoodType, emoji: '🌧️' },
              ].map((item) => {
                const isSelected = selectedMood === item.mood;
                return (
                  <button
                    key={item.mood}
                    onClick={() => handleMoodSelect(item.mood, item.emoji)}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.mood}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Quick Relief Exercises */}
          <section className="glass-card rounded-xl p-6 border border-slate-200">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Quick Relief Modules</h2>
              <button
                onClick={() => onNavigateTab('library')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-0.5"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Box Breathing */}
              <div
                onClick={onOpenBoxBreathing}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform flex-shrink-0">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Box Breathing</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">1 min • Dynamic Reset</p>
                </div>
              </div>

              {/* 5-4-3-2-1 Grounding */}
              <div
                onClick={onOpenGrounding}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer group flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform flex-shrink-0">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">5-4-3-2-1 Grounding</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">2 min • Focus Engine</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
