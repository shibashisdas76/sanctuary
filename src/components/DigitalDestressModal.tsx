import React, { useState, useEffect } from 'react';
import { sqliteService } from '../services/sqliteService';
import { Eye, CheckCircle2, X, RotateCcw } from 'lucide-react';

interface DigitalDestressModalProps {
  onClose: () => void;
}

export const DigitalDestressModal: React.FC<DigitalDestressModalProps> = ({ onClose }) => {
  const [seconds, setSeconds] = useState(20);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, seconds]);

  const handleFinish = () => {
    sqliteService.insertExerciseLog('Digital De-stress', 20);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#f7fafb] w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80 space-y-6 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#5e5e5b] hover:bg-[#e0e3e4] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 pt-2">
          <span className="px-3 py-1 bg-[#dfdcff] text-[#61607d] text-xs font-semibold rounded-full uppercase tracking-wider inline-block">
            20-20-20 Rule
          </span>
          <h3 className="text-2xl font-bold text-[#181c1d]">Digital De-stress</h3>
          <p className="text-xs text-[#424842]">Focus on an object 20 feet away for 20 seconds to relax eye muscles.</p>
        </div>

        {/* 20 Second Counter Circle */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-[#5d5c79] flex flex-col items-center justify-center bg-white shadow-md">
            <span className="text-4xl font-bold text-[#181c1d]">{seconds}s</span>
            <span className="text-[10px] text-[#5e5e5b] uppercase tracking-wider">Remaining</span>
          </div>

          <p className="mt-6 text-xs text-[#424842] max-w-xs leading-relaxed">
            {seconds > 0 ? 'Blink gently and look out your window or across the room.' : 'Eye break completed! Roll your shoulders back and relax.'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setSeconds(20)}
            className="px-4 py-2 rounded-full bg-[#f1f4f5] text-[#424842] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#e0e3e4]"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>

          <button
            onClick={handleFinish}
            className="px-5 py-2 rounded-full bg-[#4a654e] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#233d29] transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> Done
          </button>
        </div>
      </div>
    </div>
  );
};
