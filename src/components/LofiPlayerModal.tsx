import React, { useState, useEffect } from 'react';
import { sqliteService } from '../services/sqliteService';
import { Headphones, Play, Pause, Volume2, X, CloudRain, Flame, Music } from 'lucide-react';

interface LofiPlayerModalProps {
  onClose: () => void;
}

export const LofiPlayerModal: React.FC<LofiPlayerModalProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(70);
  const [soundMode, setSoundMode] = useState<'rain' | 'ambient' | 'chords'>('rain');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Web Audio Synthesizer for relaxing ambient soundscape
  useEffect(() => {
    let ctx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;

    if (isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        ctx = new AudioCtx();
        setAudioContext(ctx);

        oscillator = ctx.createOscillator();
        gainNode = ctx.createGain();

        // Relaxing ambient frequency
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(soundMode === 'rain' ? 174 : soundMode === 'chords' ? 285 : 432, ctx.currentTime);

        gainNode.gain.setValueAtTime((volume / 100) * 0.15, ctx.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
      } catch (err) {
        // Fallback for web audio
      }
    }

    return () => {
      if (oscillator) oscillator.stop();
      if (ctx && ctx.state !== 'closed') ctx.close();
    };
  }, [isPlaying, soundMode, volume]);

  const handleFinish = () => {
    sqliteService.insertExerciseLog('Lo-fi Session', 300);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#f7fafb] w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80 space-y-6 text-center relative">
        <button
          onClick={handleFinish}
          className="absolute top-4 right-4 p-2 text-[#5e5e5b] hover:bg-[#e0e3e4] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 pt-2">
          <span className="px-3 py-1 bg-[#dfdcff] text-[#61607d] text-xs font-semibold rounded-full uppercase tracking-wider inline-block">
            Soundscapes
          </span>
          <h3 className="text-2xl font-bold text-[#181c1d]">Lo-fi Study Beats</h3>
          <p className="text-xs text-[#424842]">Gentle rhythms & ambient sounds for cognitive focus.</p>
        </div>

        {/* Animated Soundwave Visualizer */}
        <div className="p-8 rounded-2xl bg-[#5d5c79]/10 border border-[#dfdcff] flex items-center justify-center gap-1.5 h-32">
          {[40, 70, 30, 90, 50, 80, 45, 95, 60, 30, 75].map((height, i) => (
            <div
              key={i}
              style={{
                height: isPlaying ? `${height}%` : '15%',
                animationDelay: `${i * 0.1}s`,
              }}
              className="w-2 bg-[#5d5c79] rounded-full transition-all duration-300 animate-pulse"
            />
          ))}
        </div>

        {/* Ambient Mode Selection */}
        <div className="flex justify-center gap-2">
          {[
            { id: 'rain', label: 'Gentle Rain', icon: CloudRain },
            { id: 'ambient', label: 'Cozy Fire', icon: Flame },
            { id: 'chords', label: 'Calm Chords', icon: Music },
          ].map((mode) => {
            const Icon = mode.icon;
            const active = soundMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSoundMode(mode.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                  active
                    ? 'bg-[#5d5c79] text-white font-semibold'
                    : 'bg-[#f1f4f5] text-[#424842] hover:bg-[#e0e3e4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3 px-4">
          <Volume2 className="w-4 h-4 text-[#5e5e5b]" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-[#5d5c79]"
          />
          <span className="text-xs text-[#5e5e5b] font-mono">{volume}%</span>
        </div>

        {/* Controls */}
        <div className="pt-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-full py-3 rounded-full bg-[#5d5c79] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#454460] transition-colors shadow-2xs"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Soundscape' : 'Play Soundscape'}
          </button>
        </div>
      </div>
    </div>
  );
};
