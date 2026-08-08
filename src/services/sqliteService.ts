import { JournalEntry, MoodLog, ExerciseLog, GratitudeNote, SQFliteQueryLog } from '../types';

const DB_NAME = 'sanctuary_sqflite.db';
const QUERY_LOG_KEY = 'sanctuary_sqflite_query_logs';

class SQFliteService {
  private queryLogs: SQFliteQueryLog[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadLogs();
    this.ensureTablesExist();
  }

  private loadLogs() {
    try {
      const saved = localStorage.getItem(QUERY_LOG_KEY);
      if (saved) {
        this.queryLogs = JSON.parse(saved).slice(-50);
      }
    } catch {
      this.queryLogs = [];
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(QUERY_LOG_KEY, JSON.stringify(this.queryLogs.slice(-50)));
    } catch {
      // ignore
    }
  }

  private logQuery(sql: string, params: any[] = [], type: SQFliteQueryLog['type'], executionTimeMs: number) {
    const entry: SQFliteQueryLog = {
      id: Math.random().toString(36).substring(2, 9),
      sql,
      params,
      executionTimeMs,
      timestamp: new Date().toLocaleTimeString(),
      type,
    };
    this.queryLogs.unshift(entry);
    if (this.queryLogs.length > 50) this.queryLogs.pop();
    this.saveLogs();
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }

  public getQueryLogs(): SQFliteQueryLog[] {
    return [...this.queryLogs];
  }

  public ensureTablesExist() {
    const startTime = performance.now();
    const createTablesSql = `
      CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        mood TEXT NOT NULL,
        stressTag TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        formattedDate TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS mood_logs (
        id TEXT PRIMARY KEY,
        mood TEXT NOT NULL,
        emoji TEXT NOT NULL,
        intensity INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        note TEXT
      );
      CREATE TABLE IF NOT EXISTS exercise_history (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        durationSeconds INTEGER NOT NULL,
        completedAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS gratitude_notes (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        color TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
    `;

    // Seed default data if empty
    if (!localStorage.getItem('sanctuary_journal_entries')) {
      const defaultJournal: JournalEntry[] = [
        {
          id: '1',
          title: 'Finding Quiet',
          content: "Took a short walk after lunch. The air felt crisp, and I finally managed to let go of the morning's anxiety. Feeling more grounded now.",
          mood: 'Calm',
          stressTag: 'Low Stress',
          timestamp: new Date().toISOString(),
          formattedDate: 'Today, 2:30 PM',
        },
        {
          id: '2',
          title: 'Morning Haze',
          content: 'Woke up feeling a bit overwhelmed by the upcoming exams. Need to break down tasks into smaller, manageable pieces.',
          mood: 'Foggy',
          stressTag: 'Moderate',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          formattedDate: 'Yesterday, 9:00 AM',
        },
        {
          id: '3',
          title: 'Peaceful Evening',
          content: 'Read a few chapters before bed. The digital detox helped clear my mind.',
          mood: 'Peaceful',
          stressTag: 'Rested',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          formattedDate: 'Oct 12, 10:45 PM',
        },
      ];
      localStorage.setItem('sanctuary_journal_entries', JSON.stringify(defaultJournal));
    }

    if (!localStorage.getItem('sanctuary_gratitude_notes')) {
      const defaultGratitude: GratitudeNote[] = [
        { id: '1', text: 'Warm cup of chamomile tea', color: '#8ba88e', timestamp: 'Today' },
        { id: '2', text: 'Gentle rain sound outside', color: '#dfdcff', timestamp: 'Yesterday' },
        { id: '3', text: 'A good talk with a friend', color: '#cceace', timestamp: '2 days ago' },
      ];
      localStorage.setItem('sanctuary_gratitude_notes', JSON.stringify(defaultGratitude));
    }

    if (!localStorage.getItem('sanctuary_exercise_history')) {
      const defaultExercises: ExerciseLog[] = [
        { id: '1', type: 'Box Breathing', durationSeconds: 60, completedAt: new Date().toISOString() },
        { id: '2', type: '5-4-3-2-1 Grounding', durationSeconds: 120, completedAt: new Date(Date.now() - 3600000 * 5).toISOString() },
      ];
      localStorage.setItem('sanctuary_exercise_history', JSON.stringify(defaultExercises));
    }

    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery(createTablesSql, [], 'CREATE', elapsed || 1);
  }

  // --- JOURNAL CRUD ---
  public getJournalEntries(): JournalEntry[] {
    const startTime = performance.now();
    const data = localStorage.getItem('sanctuary_journal_entries');
    const entries: JournalEntry[] = data ? JSON.parse(data) : [];
    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery('SELECT * FROM journal_entries ORDER BY timestamp DESC', [], 'SELECT', elapsed || 1);
    return entries;
  }

  public insertJournalEntry(entry: Omit<JournalEntry, 'id'>): JournalEntry {
    const startTime = performance.now();
    const entries = this.getJournalEntries();
    const newEntry: JournalEntry = {
      ...entry,
      id: 'j_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    };
    entries.unshift(newEntry);
    localStorage.setItem('sanctuary_journal_entries', JSON.stringify(entries));
    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery(
      'INSERT INTO journal_entries (id, title, content, mood, stressTag, timestamp, formattedDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newEntry.id, newEntry.title, newEntry.content, newEntry.mood, newEntry.stressTag, newEntry.timestamp, newEntry.formattedDate],
      'INSERT',
      elapsed || 1
    );
    this.notifyListeners();
    return newEntry;
  }

  public deleteJournalEntry(id: string) {
    const startTime = performance.now();
    const entries = this.getJournalEntries().filter((e) => e.id !== id);
    localStorage.setItem('sanctuary_journal_entries', JSON.stringify(entries));
    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery('DELETE FROM journal_entries WHERE id = ?', [id], 'DELETE', elapsed || 1);
    this.notifyListeners();
  }

  // --- MOOD LOGS ---
  public getMoodLogs(): MoodLog[] {
    const startTime = performance.now();
    const data = localStorage.getItem('sanctuary_mood_logs');
    const logs: MoodLog[] = data ? JSON.parse(data) : [];
    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery('SELECT * FROM mood_logs ORDER BY timestamp DESC', [], 'SELECT', elapsed || 1);
    return logs;
  }

  public insertMoodLog(mood: MoodLog['mood'], emoji: string, intensity: number = 7, note?: string): MoodLog {
    const startTime = performance.now();
    const logs = this.getMoodLogs();
    const newLog: MoodLog = {
      id: 'm_' + Date.now(),
      mood,
      emoji,
      intensity,
      timestamp: new Date().toISOString(),
      note,
    };
    logs.unshift(newLog);
    localStorage.setItem('sanctuary_mood_logs', JSON.stringify(logs));
    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery(
      'INSERT INTO mood_logs (id, mood, emoji, intensity, timestamp, note) VALUES (?, ?, ?, ?, ?, ?)',
      [newLog.id, newLog.mood, newLog.emoji, newLog.intensity, newLog.timestamp, newLog.note || ''],
      'INSERT',
      elapsed || 1
    );
    this.notifyListeners();
    return newLog;
  }

  // --- GRATITUDE NOTES ---
  public getGratitudeNotes(): GratitudeNote[] {
    const startTime = performance.now();
    const data = localStorage.getItem('sanctuary_gratitude_notes');
    const notes: GratitudeNote[] = data ? JSON.parse(data) : [];
    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery('SELECT * FROM gratitude_notes ORDER BY id DESC', [], 'SELECT', elapsed || 1);
    return notes;
  }

  public insertGratitudeNote(text: string, color: string = '#8ba88e'): GratitudeNote {
    const startTime = performance.now();
    const notes = this.getGratitudeNotes();
    const newNote: GratitudeNote = {
      id: 'g_' + Date.now(),
      text,
      color,
      timestamp: 'Just now',
    };
    notes.unshift(newNote);
    localStorage.setItem('sanctuary_gratitude_notes', JSON.stringify(notes));
    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery('INSERT INTO gratitude_notes (id, text, color, timestamp) VALUES (?, ?, ?, ?)', [newNote.id, text, color, newNote.timestamp], 'INSERT', elapsed || 1);
    this.notifyListeners();
    return newNote;
  }

  // --- EXERCISE LOGS ---
  public getExerciseLogs(): ExerciseLog[] {
    const startTime = performance.now();
    const data = localStorage.getItem('sanctuary_exercise_history');
    const logs: ExerciseLog[] = data ? JSON.parse(data) : [];
    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery('SELECT * FROM exercise_history ORDER BY completedAt DESC', [], 'SELECT', elapsed || 1);
    return logs;
  }

  public insertExerciseLog(type: ExerciseLog['type'], durationSeconds: number): ExerciseLog {
    const startTime = performance.now();
    const logs = this.getExerciseLogs();
    const newLog: ExerciseLog = {
      id: 'ex_' + Date.now(),
      type,
      durationSeconds,
      completedAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    localStorage.setItem('sanctuary_exercise_history', JSON.stringify(logs));
    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery('INSERT INTO exercise_history (id, type, durationSeconds, completedAt) VALUES (?, ?, ?, ?)', [newLog.id, type, durationSeconds, newLog.completedAt], 'INSERT', elapsed || 1);
    this.notifyListeners();
    return newLog;
  }

  // --- UTILS & DEVTOOLS ---
  public executeRawSql(sql: string): { success: boolean; message: string; rowsAffected?: number } {
    const startTime = performance.now();
    const trimmed = sql.trim().toUpperCase();

    if (trimmed.startsWith('SELECT')) {
      const elapsed = Math.round(performance.now() - startTime);
      this.logQuery(sql, [], 'SELECT', elapsed || 1);
      return { success: true, message: 'Executed SELECT query successfully. Returned simulated records.' };
    }

    if (trimmed.startsWith('DELETE') || trimmed.startsWith('TRUNCATE')) {
      if (trimmed.includes('JOURNAL')) localStorage.removeItem('sanctuary_journal_entries');
      if (trimmed.includes('MOOD')) localStorage.removeItem('sanctuary_mood_logs');
      if (trimmed.includes('GRATITUDE')) localStorage.removeItem('sanctuary_gratitude_notes');
      if (trimmed.includes('EXERCISE')) localStorage.removeItem('sanctuary_exercise_history');
      const elapsed = Math.round(performance.now() - startTime);
      this.logQuery(sql, [], 'DELETE', elapsed || 1);
      this.notifyListeners();
      return { success: true, message: 'Executed DELETE query successfully.', rowsAffected: 1 };
    }

    const elapsed = Math.round(performance.now() - startTime);
    this.logQuery(sql, [], 'TRANSACTION', elapsed || 1);
    return { success: true, message: 'Query executed successfully.' };
  }

  public resetDatabase() {
    localStorage.removeItem('sanctuary_journal_entries');
    localStorage.removeItem('sanctuary_mood_logs');
    localStorage.removeItem('sanctuary_gratitude_notes');
    localStorage.removeItem('sanctuary_exercise_history');
    localStorage.removeItem(QUERY_LOG_KEY);
    this.queryLogs = [];
    this.ensureTablesExist();
    this.notifyListeners();
  }
}

export const sqliteService = new SQFliteService();
