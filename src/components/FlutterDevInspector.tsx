import React, { useState, useEffect } from 'react';
import { cachedNetworkImageService } from '../services/cachedNetworkImageService';
import { sqliteService } from '../services/sqliteService';
import { NetworkSpeed, SQFliteQueryLog } from '../types';
import {
  Wrench,
  X,
  Database,
  Wifi,
  WifiOff,
  SignalLow,
  Zap,
  Trash2,
  RefreshCw,
  Terminal,
  Layers,
  Activity,
  Download,
  Play
} from 'lucide-react';

interface FlutterDevInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  networkSpeed: NetworkSpeed;
  onNetworkSpeedChange: (speed: NetworkSpeed) => void;
}

export const FlutterDevInspector: React.FC<FlutterDevInspectorProps> = ({
  isOpen,
  onClose,
  networkSpeed,
  onNetworkSpeedChange,
}) => {
  const [activeTab, setActiveTab] = useState<'cache' | 'sqflite' | 'widget'>('cache');
  const [cacheStats, setCacheStats] = useState(cachedNetworkImageService.getCacheStats());
  const [queryLogs, setQueryLogs] = useState<SQFliteQueryLog[]>(sqliteService.getQueryLogs());
  const [selectedTable, setSelectedTable] = useState<'journal_entries' | 'mood_logs' | 'gratitude_notes' | 'exercise_history'>('journal_entries');
  const [tableData, setTableData] = useState<any[]>([]);
  const [rawSql, setRawSql] = useState('');
  const [sqlMessage, setSqlMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubCache = cachedNetworkImageService.subscribe(() => {
      setCacheStats(cachedNetworkImageService.getCacheStats());
    });
    const unsubDb = sqliteService.subscribe(() => {
      setQueryLogs(sqliteService.getQueryLogs());
      loadTableData();
    });
    return () => {
      unsubCache();
      unsubDb();
    };
  }, [selectedTable]);

  useEffect(() => {
    loadTableData();
  }, [selectedTable]);

  const loadTableData = () => {
    if (selectedTable === 'journal_entries') setTableData(sqliteService.getJournalEntries());
    if (selectedTable === 'mood_logs') setTableData(sqliteService.getMoodLogs());
    if (selectedTable === 'gratitude_notes') setTableData(sqliteService.getGratitudeNotes());
    if (selectedTable === 'exercise_history') setTableData(sqliteService.getExerciseLogs());
  };

  const handlePrecacheAll = () => {
    cachedNetworkImageService.preCacheImages([
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASfOjjAFtEIf9sEyuE7MRo9jah5Iq-WDIxsO0pYh2SHmF1sScgTFtWD0nkpx6IaowSkXzv4xew_Q82779Uqqz39-f1shaPvHYo_dlIFrTj6YN7ZKle4htoXnfLKcbtdgb7LF5TpoxOGMkfPpf889G9nV5P7lKQh3HiRsMO3yUUvVHjweZ9RIDN7d4l6oULYhhcLwoeYC_8YJ6vRhWW1FFc3N1H9Zem7YY8mFIbLJMifZEE-Db5AwwzMw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABYT051TYG3Po5U6uwUTWpKGxNpE4tJir3POan5xasLoOALCQ8dTvWbhNpwvzCQyGcXz-hJ2oCgGRyRQcCsK9Wmfuw7yaC2pT1AjwKnInpa6dKwNg3tOkQtoPfkjOkIKrhj0py2QPBGp4t1YCQkqnZY5fs0aEG2mPcpqPJ9ta664W88ko6VwvOwVzcvMeifWspkiZMhvWVGhykIsGRpXFvxCDt3Kd5fJjcmb-UPF0etVHsvdHoq2YZ1A',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSY8UMXrPsTGn2ruYyHPuiQAt1lxkzrnOrdtcl0mDQ0eD_P4vXkzcJMeQKzZg3mcr7MmN3eD44jLIXv5oPr8ocCDAFQ8yRpnwBpOOKE0b9KpoPq0cZ4TLw8IDvX4e1nadcnjulY96_z--P8uKGNPVIQbQksUAJ_EHT4d9j9eY-mcxlHjgaRYh3MX2Fg6na2dffiA24c2O4tXHDlX0urzWHpJhNENvv94Md1HIW79A6j5KEfHK614KorA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0yFgsjlCoFdj4Y2Lp3G5vNQlkEBGo4v7awYj4DWmJKaOOrSCVIusECWHC5reTxE0CmZsssTqi_IgjiYaIAUQFqIFmIwHMux_va_rudyMgKstmnaeV_0EyZlxCUC8z7V0Albiil5djDdkxR8uGEQjfdzNcZDW1F9gV2fvtvzfz8XCNlGciD8-l8eaicIRLDG1Bew5I11HnwCuqi229XysVMvEqyRn1o0rflwDjc4KEplbM14iiFVNEAw',
    ]);
  };

  const handleExecuteSql = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawSql.trim()) return;
    const res = sqliteService.executeRawSql(rawSql);
    setSqlMessage(res.message);
    setRawSql('');
    setTimeout(() => setSqlMessage(null), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#191932] text-slate-100 z-50 shadow-2xl flex flex-col border-l border-slate-700 animate-slideLeft">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/80 flex justify-between items-center bg-[#131326]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#4a654e] text-white">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Senior Flutter DevTools</h3>
            <p className="text-[10px] text-slate-400 font-mono">sqflite 2.3.0 • cached_network_image 3.3.1</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700/80 bg-[#15152a] text-xs font-mono">
        <button
          onClick={() => setActiveTab('cache')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'cache'
              ? 'border-emerald-400 text-emerald-400 font-bold bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Image Cache
        </button>

        <button
          onClick={() => setActiveTab('sqflite')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'sqflite'
              ? 'border-sky-400 text-sky-400 font-bold bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" /> SQFlite DB
        </button>

        <button
          onClick={() => setActiveTab('widget')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'widget'
              ? 'border-purple-400 text-purple-400 font-bold bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Widgets & Performance
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-5 text-xs font-mono">
        {/* TAB 1: CACHED NETWORK IMAGE & NETWORK SIMULATOR */}
        {activeTab === 'cache' && (
          <div className="space-y-5">
            {/* Network Throttler */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider block">
                Network Quality Throttle
              </span>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { speed: 'fast4g' as NetworkSpeed, label: 'Fast 4G', icon: Wifi, color: 'emerald' },
                  { speed: 'slow3g' as NetworkSpeed, label: 'Poor 3G', icon: SignalLow, color: 'amber' },
                  { speed: 'offline' as NetworkSpeed, label: 'Offline', icon: WifiOff, color: 'rose' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = networkSpeed === item.speed;
                  return (
                    <button
                      key={item.speed}
                      onClick={() => onNetworkSpeedChange(item.speed)}
                      className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all border ${
                        isActive
                          ? 'bg-slate-700 border-emerald-400 text-white font-bold shadow-xs'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cache Statistics */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider block">
                cached_network_image Cache Stats
              </span>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700">
                  <div className="text-lg font-bold text-emerald-400">{cacheStats.hitRatio}%</div>
                  <div className="text-[10px] text-slate-400">Cache Hit Ratio</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700">
                  <div className="text-lg font-bold text-sky-400">{cacheStats.memoryEntriesCount}</div>
                  <div className="text-[10px] text-slate-400">Memory Cache Entries</div>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-300 pt-1">
                <span>Hits: <strong className="text-emerald-400">{cacheStats.hits}</strong></span>
                <span>Misses: <strong className="text-amber-400">{cacheStats.misses}</strong></span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={handlePrecacheAll}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Pre-cache App Images
                </button>

                <button
                  onClick={() => cachedNetworkImageService.clearCache()}
                  className="py-2 px-3 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  title="Clear Image Cache"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            {/* Cached URLs List */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider block">
                Cached Image Assets
              </span>
              {cacheStats.cachedUrls.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic">No images currently in memory cache.</p>
              ) : (
                <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {cacheStats.cachedUrls.map((url, idx) => (
                    <li key={idx} className="text-[10px] text-slate-300 truncate bg-slate-900/50 p-1.5 rounded-md border border-slate-800">
                      ⚡ {url}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SQFLITE DATABASE CONSOLE */}
        {activeTab === 'sqflite' && (
          <div className="space-y-4">
            {/* Table Selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['journal_entries', 'mood_logs', 'gratitude_notes', 'exercise_history'] as const).map((tbl) => (
                <button
                  key={tbl}
                  onClick={() => setSelectedTable(tbl)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-colors ${
                    selectedTable === tbl
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tbl}
                </button>
              ))}
            </div>

            {/* Table Records Inspector */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 max-h-48 overflow-auto">
              <span className="text-[10px] text-sky-400 font-bold block mb-2">
                SELECT * FROM {selectedTable} ({tableData.length} rows)
              </span>

              {tableData.length === 0 ? (
                <p className="text-[10px] text-slate-500 italic">No rows in table.</p>
              ) : (
                <pre className="text-[10px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(tableData, null, 2)}
                </pre>
              )}
            </div>

            {/* SQL Execution Console */}
            <form onSubmit={handleExecuteSql} className="space-y-2">
              <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                Execute Raw SQL Query
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SELECT * FROM journal_entries WHERE mood='Calm'"
                  value={rawSql}
                  onChange={(e) => setRawSql(e.target.value)}
                  className="flex-grow px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-[11px] text-slate-200 focus:outline-hidden focus:border-sky-400 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-sky-600 text-white font-bold text-[11px] flex items-center gap-1 hover:bg-sky-500"
                >
                  <Play className="w-3 h-3 fill-current" /> Run
                </button>
              </div>
              {sqlMessage && <p className="text-[10px] text-emerald-400">{sqlMessage}</p>}
            </form>

            {/* SQL Query Audit Trail */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                  SQFlite Query Log Stream
                </span>
                <button
                  onClick={() => sqliteService.resetDatabase()}
                  className="text-[10px] text-rose-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset DB
                </button>
              </div>

              <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                {queryLogs.map((log) => (
                  <li
                    key={log.id}
                    className="p-1.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono leading-tight"
                  >
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span className="font-bold text-sky-400">[{log.type}]</span>
                      <span>{log.executionTimeMs}ms • {log.timestamp}</span>
                    </div>
                    <div className="text-slate-200 truncate">{log.sql}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: WIDGET TREE & PERFORMANCE */}
        {activeTab === 'widget' && (
          <div className="space-y-4">
            {/* Performance Stats */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider block">
                Flutter Performance Overlay
              </span>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700">
                  <div className="text-lg font-bold text-emerald-400">60 FPS</div>
                  <div className="text-[10px] text-slate-400">UI Frame Rate</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700">
                  <div className="text-lg font-bold text-purple-400">2.1 ms</div>
                  <div className="text-[10px] text-slate-400">Raster Build Latency</div>
                </div>
              </div>
            </div>

            {/* Widget Tree Hierarchy */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider block">
                Widget Tree Hierarchy
              </span>
              <pre className="text-[10px] text-slate-300 leading-relaxed font-mono">
{`SanctuaryApp
 └── ProviderScope (State Management)
      └── MaterialApp (Theme: Ethereal Sanctuary)
           ├── Scaffold
           │    ├── TopAppBar
           │    │    └── CachedNetworkImage (Avatar)
           │    ├── BottomNavBar
           │    └── IndexedStack
           │         ├── SanctuaryDashboard
           │         │    └── MentalBatteryRing
           │         ├── JournalView
           │         │    └── SQFliteStreamBuilder
           │         ├── LibraryView
           │         │    └── CachedNetworkImage Grid
           │         └── InsightsView
           └── FlutterDevInspector (Inspector Drawer)`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
