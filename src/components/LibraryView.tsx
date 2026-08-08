import React, { useState } from 'react';
import { CachedImage } from './CachedImage';
import { Search, Play, Headphones, Sparkles, HeartHandshake, Eye, Volume2 } from 'lucide-react';

interface LibraryViewProps {
  onOpenBoxBreathing: () => void;
  onOpenGratitudeJar: () => void;
  onOpenLofiPlayer: () => void;
  onOpenDigitalDestress: () => void;
}

const BREATHE_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuABYT051TYG3Po5U6uwUTWpKGxNpE4tJir3POan5xasLoOALCQ8dTvWbhNpwvzCQyGcXz-hJ2oCgGRyRQcCsK9Wmfuw7yaC2pT1AjwKnInpa6dKwNg3tOkQtoPfkjOkIKrhj0py2QPBGp4t1YCQkqnZY5fs0aEG2mPcpqPJ9ta664W88ko6VwvOwVzcvMeifWspkiZMhvWVGhykIsGRpXFvxCDt3Kd5fJjcmb-UPF0etVHsvdHoq2YZ1A';

const LOFI_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCSY8UMXrPsTGn2ruYyHPuiQAt1lxkzrnOrdtcl0mDQ0eD_P4vXkzcJMeQKzZg3mcr7MmN3eD44jLIXv5oPr8ocCDAFQ8yRpnwBpOOKE0b9KpoPq0cZ4TLw8IDvX4e1nadcnjulY96_z--P8uKGNPVIQbQksUAJ_EHT4d9j9eY-mcxlHjgaRYh3MX2Fg6na2dffiA24c2O4tXHDlX0urzWHpJhNENvv94Md1HIW79A6j5KEfHK614KorA';

const JAR_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0yFgsjlCoFdj4Y2Lp3G5vNQlkEBGo4v7awYj4DWmJKaOOrSCVIusECWHC5reTxE0CmZsssTqi_IgjiYaIAUQFqIFmIwHMux_va_rudyMgKstmnaeV_0EyZlxCUC8z7V0Albiil5djDdkxR8uGEQjfdzNcZDW1F9gV2fvtvzfz8XCNlGciD8-l8eaicIRLDG1Bew5I11HnwCuqi229XysVMvEqyRn1o0rflwDjc4KEplbM14iiFVNEAw';

export const LibraryView: React.FC<LibraryViewProps> = ({
  onOpenBoxBreathing,
  onOpenGratitudeJar,
  onOpenLofiPlayer,
  onOpenDigitalDestress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Breathwork', 'Soundscapes', 'Mindfulness'];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <header className="space-y-1 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Refresh Library
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Curated practices, ambient soundscapes, and digital relief tools stored with intelligent caching.
        </p>
      </header>

      {/* Search & Categories */}
      <div className="space-y-3">
        <div className="bg-white rounded-lg border border-slate-200 flex items-center px-4 py-2.5 shadow-2xs">
          <Search className="w-4 h-4 text-slate-400 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for relief techniques, beats, or breathes..."
            className="bg-transparent border-none focus:outline-hidden w-full text-xs font-medium text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* 5-min Breathe (Featured Card) */}
        {(activeCategory === 'All' || activeCategory === 'Breathwork') && (
          <div
            onClick={onOpenBoxBreathing}
            className="bg-white rounded-xl md:col-span-8 p-6 md:p-7 flex flex-col justify-between min-h-[300px] relative overflow-hidden group cursor-pointer border border-slate-200 shadow-2xs hover:border-blue-400 transition-all"
          >
            {/* Cached Background Image */}
            <div className="absolute inset-0 z-0">
              <CachedImage
                src={BREATHE_IMG}
                alt="5-min Breathe"
                className="w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
                showBadge
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>

            <div className="relative z-10 flex justify-between items-start">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                Featured
              </span>
              <button
                className="bg-blue-600 p-2.5 rounded-lg text-white hover:bg-blue-700 transition-all shadow-sm group-hover:scale-105"
                title="Start 5-min Breathe"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>

            <div className="relative z-10 mt-auto pt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">5-min Breathe</h3>
              <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                A guided visual pacing exercise to lower heart rate and center your nervous system.
              </p>
            </div>
          </div>
        )}

        {/* Lo-fi Study Beats */}
        {(activeCategory === 'All' || activeCategory === 'Soundscapes') && (
          <div
            onClick={onOpenLofiPlayer}
            className="bg-white rounded-xl md:col-span-4 p-6 md:p-7 flex flex-col justify-between min-h-[300px] relative overflow-hidden group cursor-pointer border border-slate-200 shadow-2xs hover:border-indigo-400 transition-all"
          >
            <div className="absolute inset-0 z-0">
              <CachedImage
                src={LOFI_IMG}
                alt="Lo-fi Study Beats"
                className="w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
                showBadge
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
            </div>

            <div className="relative z-10 flex justify-end">
              <span className="bg-indigo-50 border border-indigo-200 p-2 rounded-md text-indigo-600 shadow-2xs">
                <Headphones className="w-4 h-4" />
              </span>
            </div>

            <div className="relative z-10 mt-auto pt-6">
              <h3 className="text-base font-bold text-slate-900 mb-1">Lo-fi Study Beats</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                Continuous gentle rhythms for deep cognitive flow without distraction.
              </p>
            </div>
          </div>
        )}

        {/* Gratitude Jar */}
        {(activeCategory === 'All' || activeCategory === 'Mindfulness') && (
          <div
            onClick={onOpenGratitudeJar}
            className="bg-white rounded-xl md:col-span-6 p-5 flex items-center gap-4 group cursor-pointer hover:border-emerald-400 transition-all border border-slate-200 shadow-2xs"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 shadow-2xs">
              <CachedImage
                src={JAR_IMG}
                alt="Gratitude Jar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                showBadge
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">Gratitude Jar</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drop a quick note of something positive today. A small act to reframe your perspective.
              </p>
            </div>
          </div>
        )}

        {/* Digital De-stress */}
        {(activeCategory === 'All' || activeCategory === 'Mindfulness') && (
          <div
            onClick={onOpenDigitalDestress}
            className="bg-white rounded-xl md:col-span-6 p-5 flex items-center gap-4 group cursor-pointer hover:border-blue-400 transition-all border border-slate-200 shadow-2xs"
          >
            <div className="w-16 h-16 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">Digital De-stress</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eye-strain relief exercises and posture resets designed specifically for long screen sessions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
