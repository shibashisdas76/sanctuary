import React, { useState } from 'react';
import { sqliteService } from '../services/sqliteService';
import { Eye, Hand, Volume2, Flower2, Utensils, X, ChevronRight, Check } from 'lucide-react';

interface GroundingModalProps {
  onClose: () => void;
}

export const GroundingModal: React.FC<GroundingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<string[]>(['', '', '', '', '']);

  const steps = [
    { title: '5 Things You Can SEE', count: 5, icon: Eye, desc: 'Look around your surroundings. Notice 5 objects.' },
    { title: '4 Things You Can TOUCH', count: 4, icon: Hand, desc: 'Feel the texture of your clothes, desk, or floor.' },
    { title: '3 Things You Can HEAR', count: 3, icon: Volume2, desc: 'Listen closely for distant hums, birds, or breeze.' },
    { title: '2 Things You Can SMELL', count: 2, icon: Flower2, desc: 'Notice subtle scents around you or fresh air.' },
    { title: '1 Thing You Can TASTE', count: 1, icon: Utensils, desc: 'Focus on lingering flavor or take a sip of water.' },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      sqliteService.insertExerciseLog('5-4-3-2-1 Grounding', 120);
      onClose();
    }
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
          <span className="px-3 py-1 bg-[#cceace] text-[#07200f] text-xs font-semibold rounded-full uppercase tracking-wider inline-block">
            2 Minute Focus
          </span>
          <h3 className="text-2xl font-bold text-[#181c1d]">5-4-3-2-1 Grounding</h3>
          <p className="text-xs text-[#424842]">Connect your senses to the present moment.</p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex justify-between items-center gap-1.5 px-4">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all ${
                idx === step
                  ? 'bg-[#4a654e]'
                  : idx < step
                  ? 'bg-[#8ba88e]'
                  : 'bg-[#e0e3e4]'
              }`}
            />
          ))}
        </div>

        {/* Sensory Card */}
        <div className="p-6 rounded-2xl bg-white border border-[#c2c8c0]/50 shadow-2xs space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#cceace] flex items-center justify-center text-[#07200f]">
            <Icon className="w-7 h-7" />
          </div>

          <h4 className="text-lg font-bold text-[#181c1d]">{currentStep.title}</h4>
          <p className="text-xs text-[#424842] leading-relaxed">{currentStep.desc}</p>

          <input
            type="text"
            placeholder="Type your observations (optional)..."
            value={inputs[step]}
            onChange={(e) => {
              const updated = [...inputs];
              updated[step] = e.target.value;
              setInputs(updated);
            }}
            className="w-full px-3.5 py-2 rounded-xl border border-[#c2c8c0] text-xs text-[#181c1d] focus:outline-hidden focus:border-[#4a654e]"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#5e5e5b]">Step {step + 1} of 5</span>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-full bg-[#4a654e] text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-[#233d29] transition-colors shadow-2xs"
          >
            {step === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4" /> Complete Exercise
              </>
            ) : (
              <>
                Next Sensory Step <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
