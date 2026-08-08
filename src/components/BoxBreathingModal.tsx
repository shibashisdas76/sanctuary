import React, { useState, useEffect } from 'react';
import { sqliteService } from '../services/sqliteService';
import { Wind, X, Play, Pause, CheckCircle2 } from 'lucide-react';

interface BoxBreathingModalProps {
  onClose: () => void;
}

type Phase = 'Inhale' | 'Hold' | 'Exhale' | 'Hold After Exhale';

export const BoxBreathingModal: React.FC<BoxBreathingModalProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<Phase>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
        setCountdown((prev) => {
          if (prev > 1) return prev - 1;

          // Transition to next phase
          setPhase((current) => {
            if (current === 'Inhale') return 'Hold';
            if (current === 'Hold') return 'Exhale';
            if (current === 'Exhale') return 'Hold After Exhale';
            // Completed cycle
            setCompletedCycles((c) => c + 1);
            return 'Inhale';
          });

          return 4; // Reset 4s timer
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  const handleFinish = () => {
    if (totalSeconds > 5) {
      sqliteService.insertExerciseLog('Box Breathing', totalSeconds);
    }
    onClose();
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'Inhale':
        return 'Inhale slowly through your nose...';
      case 'Hold':
        return 'Hold your breath gently...';
      case 'Exhale':
        return 'Exhale slowly through your mouth...';
      case 'Hold After Exhale':
        return 'Rest your lungs before next breath...';
    }
  };

  const getCircleScaleClass = () => {
    switch (phase) {
      case 'Inhale':
        return 'scale-125 bg-blue-600 text-white';
      case 'Hold':
        return 'scale-125 bg-blue-500 text-white';
      case 'Exhale':
        return 'scale-75 bg-indigo-100 text-indigo-700';
      case 'Hold After Exhale':
        return 'scale-75 bg-indigo-50 text-indigo-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-xl p-6 md:p-7 shadow-2xl border border-slate-200 space-y-5 text-center relative">
        <button
          onClick={handleFinish}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 pt-1">
          <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider inline-block">
            1 Minute Reset
          </span>
          <h3 className="text-xl font-bold text-slate-900">Box Breathing</h3>
          <p className="text-xs text-slate-500">Equal-ratio breathing to restore central nervous balance.</p>
        </div>

        {/* Breathing Circle Container */}
        <div className="py-6 flex flex-col items-center justify-center relative min-h-[200px]">
          <div
            className={`w-32 h-32 rounded-full transition-all duration-1000 ease-in-out flex items-center justify-center shadow-md ${getCircleScaleClass()}`}
          >
            <span className="text-3xl font-bold">{countdown}</span>
          </div>

          <p className="mt-6 text-sm font-bold text-slate-800 animate-pulse">
            {getPhaseInstruction()}
          </p>
          <span className="text-[11px] font-mono text-slate-400 mt-1">Cycles Completed: {completedCycles}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-2 hover:bg-slate-200 transition-colors"
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isActive ? 'Pause' : 'Resume'}
          </button>

          <button
            onClick={handleFinish}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Finish & Save
          </button>
        </div>
      </div>
    </div>
  );
};
