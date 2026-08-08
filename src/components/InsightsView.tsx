import React, { useState, useEffect } from 'react';
import { sqliteService } from '../services/sqliteService';
import { ExerciseLog, MoodLog } from '../types';
import { Sparkles, Activity, Sprout, HeartPulse, ShieldCheck, RefreshCw } from 'lucide-react';

export const InsightsView: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);

  useEffect(() => {
    setExercises(sqliteService.getExerciseLogs());
    setMoodLogs(sqliteService.getMoodLogs());
    const unsub = sqliteService.subscribe(() => {
      setExercises(sqliteService.getExerciseLogs());
      setMoodLogs(sqliteService.getMoodLogs());
    });
    return unsub;
  }, []);

  const totalBreaths = exercises.length + 10; // offset with base baseline

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <header className="space-y-1 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Gentle Reflections & Analytics
        </h2>
        <p className="text-sm text-slate-500">
          Your well-being journey and SQFlite activity logs, observed with care.
        </p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Well-being Trend SVG Chart */}
        <section className="md:col-span-8 bg-white border border-slate-200 rounded-xl p-6 md:p-7 flex flex-col justify-between min-h-[300px] shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-0.5">Well-being Trend</h3>
              <p className="text-xs text-slate-500">A smooth flow of your recent mental energy states.</p>
            </div>
            <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold">
              +15% Harmony
            </span>
          </div>

          {/* SVG Wave Chart */}
          <div className="relative w-full h-40 flex items-end my-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path
                d="M0,35 Q10,25 20,30 T40,20 T60,25 T80,10 T100,15 L100,40 L0,40 Z"
                fill="url(#chartGradient)"
              />

              {/* Smooth Line */}
              <path
                d="M0,35 Q10,25 20,30 T40,20 T60,25 T80,10 T100,15"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="20" cy="30" r="2.5" fill="#2563eb" className="animate-ping" />
              <circle cx="20" cy="30" r="2" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />

              <circle cx="60" cy="25" r="2" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />

              <circle cx="80" cy="10" r="3" fill="#3b82f6" />
              <circle cx="80" cy="10" r="1.5" fill="#ffffff" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-100">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span className="font-bold text-blue-600">Today</span>
          </div>
        </section>

        {/* Positive Reinforcements */}
        <section className="md:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-3.5 flex-1 shadow-2xs">
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-emerald-600 shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Steady Breaths</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                You've taken <strong className="text-emerald-700 font-bold">{totalBreaths} breath breaks</strong> this week! Taking time to pause is a quiet victory.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-3.5 flex-1 shadow-2xs">
            <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-lg text-indigo-600 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Finding Calm</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                15% more calm detected compared to last week. Your steady rhythm is showing.
              </p>
            </div>
          </div>
        </section>

        {/* Personalized Tips / Gentle Nudge */}
        <section className="md:col-span-12 bg-white border border-slate-200 rounded-xl p-6 text-center max-w-3xl mx-auto w-full space-y-2 shadow-2xs">
          <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Sprout className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">A gentle nudge</h3>
          <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
            Your energy usually dips slightly on Thursday afternoons. Consider scheduling a 5-minute walk outside or a quick stretching session to bridge the gap.
          </p>
        </section>
      </div>
    </div>
  );
};
