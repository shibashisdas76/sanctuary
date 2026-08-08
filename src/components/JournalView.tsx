import React, { useState, useEffect } from 'react';
import { sqliteService } from '../services/sqliteService';
import { JournalEntry, MoodType } from '../types';
import { Plus, Search, Trash2, Smile, Frown, Moon, Sun, Heart, Sparkles, X } from 'lucide-react';

export const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState<MoodType>('Calm');
  const [newStressTag, setNewStressTag] = useState<'Low Stress' | 'Moderate' | 'Rested' | 'High Stress'>('Low Stress');

  const loadEntries = () => {
    setEntries(sqliteService.getJournalEntries());
  };

  useEffect(() => {
    loadEntries();
    const unsubscribe = sqliteService.subscribe(() => {
      loadEntries();
    });
    return unsubscribe;
  }, []);

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    sqliteService.insertJournalEntry({
      title: newTitle,
      content: newContent,
      mood: newMood,
      stressTag: newStressTag,
      timestamp: new Date().toISOString(),
      formattedDate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setNewTitle('');
    setNewContent('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this reflection entry from local database?')) {
      sqliteService.deleteJournalEntry(id);
    }
  };

  // Filtering
  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || e.stressTag === selectedTag || e.mood === selectedTag;
    return matchesSearch && matchesTag;
  });

  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case 'Calm':
      case 'Peaceful':
        return <Smile className="w-5 h-5 text-[#233d29]" />;
      case 'Foggy':
      case 'Energized':
        return <Sun className="w-5 h-5 text-[#61607d]" />;
      case 'Heavy':
      case 'Overwhelmed':
        return <Frown className="w-5 h-5 text-[#93000a]" />;
      default:
        return <Moon className="w-5 h-5 text-[#424842]" />;
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Low Stress':
      case 'Rested':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Moderate':
        return 'bg-slate-100 text-slate-700 border border-slate-200';
      case 'High Stress':
      case 'Overwhelmed':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <header className="space-y-1 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Your Reflections
        </h2>
        <p className="text-sm text-slate-500">
          A safe space to observe your thoughts with local SQFlite persistence.
        </p>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="bg-white rounded-lg border border-slate-200 flex items-center px-3.5 py-2 shadow-2xs flex-grow max-w-md">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search reflections in SQFlite DB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-hidden w-full text-xs text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'Low Stress', 'Moderate', 'Rested'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Entries */}
      <div className="space-y-4 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 before:rounded-full">
        {filteredEntries.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            <p className="text-xs font-medium">No reflections found matching your search.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="relative flex items-start gap-4 group">
              {/* Icon Bubble */}
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 z-10 shadow-2xs">
                {getMoodIcon(entry.mood)}
              </div>

              {/* Content Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 w-full transition-all hover:border-slate-300 shadow-2xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-mono text-slate-400">{entry.formattedDate}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${getTagColor(entry.stressTag)}`}>
                      {entry.stressTag}
                    </span>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded-md opacity-0 group-hover:opacity-100"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">{entry.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{entry.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button for New Entry */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 bg-blue-600 text-white rounded-lg px-4 py-2.5 shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 z-30 text-xs font-bold"
      >
        <Plus className="w-4 h-4" />
        <span>New Reflection</span>
      </button>

      {/* Modal Drawer to Create New Reflection */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-slideUp">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> New Reflection Entry
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Finding Calm After Class"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reflections</label>
                <textarea
                  rows={4}
                  placeholder="Observe your thoughts without judgment..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mood</label>
                  <select
                    value={newMood}
                    onChange={(e) => setNewMood(e.target.value as MoodType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="Calm">Calm</option>
                    <option value="Energized">Energized</option>
                    <option value="Foggy">Foggy</option>
                    <option value="Heavy">Heavy</option>
                    <option value="Peaceful">Peaceful</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stress Level</label>
                  <select
                    value={newStressTag}
                    onChange={(e) => setNewStressTag(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="Low Stress">Low Stress</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Rested">Rested</option>
                    <option value="High Stress">High Stress</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs"
                >
                  Save to SQFlite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
