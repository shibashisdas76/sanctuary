import React, { useState, useEffect } from 'react';
import { sqliteService } from '../services/sqliteService';
import { GratitudeNote } from '../types';
import { Sparkles, Plus, X, HeartHandshake } from 'lucide-react';

interface GratitudeJarModalProps {
  onClose: () => void;
}

export const GratitudeJarModal: React.FC<GratitudeJarModalProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<GratitudeNote[]>([]);
  const [newText, setNewText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#8ba88e');

  useEffect(() => {
    setNotes(sqliteService.getGratitudeNotes());
    const unsub = sqliteService.subscribe(() => {
      setNotes(sqliteService.getGratitudeNotes());
    });
    return unsub;
  }, []);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    sqliteService.insertGratitudeNote(newText, selectedColor);
    setNewText('');
  };

  const colors = [
    { label: 'Sage', hex: '#8ba88e' },
    { label: 'Lavender', hex: '#dfdcff' },
    { label: 'Warm Cream', hex: '#cceace' },
    { label: 'Rose Gold', hex: '#ffdad6' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#f7fafb] w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#5e5e5b] hover:bg-[#e0e3e4] rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pt-2">
          <span className="px-3 py-1 bg-[#8ba88e]/30 text-[#233d29] text-xs font-semibold rounded-full uppercase tracking-wider inline-block">
            Gratitude Jar
          </span>
          <h3 className="text-2xl font-bold text-[#181c1d]">Your Jar of Positivity</h3>
          <p className="text-xs text-[#424842]">Drop a note of appreciation into your offline jar.</p>
        </div>

        {/* Visual Jar Container */}
        <div className="relative w-full h-56 rounded-3xl bg-white/60 border-2 border-slate-200/80 p-4 backdrop-blur-md shadow-inner flex flex-col justify-end overflow-hidden">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full bg-slate-200/80 border border-slate-300" />

          {/* Floating Slips */}
          <div className="flex flex-wrap gap-2 items-end justify-center overflow-y-auto max-h-44 p-2">
            {notes.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Jar is empty. Drop your first gratitude slip below!</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  style={{ backgroundColor: note.color }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#181c1d] shadow-2xs transform hover:scale-105 transition-all max-w-[200px] truncate"
                  title={note.text}
                >
                  🍃 {note.text}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="space-y-3 pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="What made you smile today? (Saved to SQFlite)..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="flex-grow px-3.5 py-2.5 rounded-xl border border-[#c2c8c0] bg-white text-xs text-[#181c1d] focus:outline-hidden focus:border-[#4a654e]"
              required
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#4a654e] text-white text-xs font-semibold hover:bg-[#233d29] transition-colors flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" /> Drop Slip
            </button>
          </div>

          {/* Color choices */}
          <div className="flex items-center gap-2 justify-center">
            <span className="text-[11px] text-[#5e5e5b]">Slip Color:</span>
            {colors.map((c) => (
              <button
                type="button"
                key={c.hex}
                onClick={() => setSelectedColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-5 h-5 rounded-full border ${
                  selectedColor === c.hex ? 'border-black ring-2 ring-black/20 scale-110' : 'border-slate-300'
                }`}
                title={c.label}
              />
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};
