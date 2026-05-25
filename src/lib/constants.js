export const STORAGE = {
  activities: 'chronoflow.activities.v1',
  entries: 'chronoflow.entries.v1',
  beast: 'chronoflow.beast.v1',
  beastGoals: 'chronoflow.beastGoals.v1',
}

export const CATEGORY_SCORES = {
  'Very Productive': 3,
  Productive: 2,
  Neutral: 0,
  Personal: 1,
  Distracting: -2,
  'Very Distracting': -3,
}

export const CATEGORY_COLORS = {
  'Very Productive': 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
  Productive: 'text-sky-300 bg-sky-500/10 border-sky-400/20',
  Neutral: 'text-slate-300 bg-slate-500/10 border-slate-400/20',
  Personal: 'text-blue-300 bg-blue-500/10 border-blue-400/20',
  Distracting: 'text-amber-300 bg-amber-500/10 border-amber-400/20',
  'Very Distracting': 'text-rose-300 bg-rose-500/10 border-rose-400/20',
}

export const ACTIVITY_CATEGORY_OPTIONS = [
  { value: 'Very Productive', label: 'Focus Work', detail: 'Very Productive', color: '#22c55e' },
  { value: 'Productive', label: 'Other Work', detail: 'Productive', color: '#86efac' },
  { value: 'Neutral', label: 'Neutral', detail: 'Neutral', color: '#94a3b8' },
  { value: 'Personal', label: 'Personal', detail: 'Personal', color: '#60a5fa' },
  { value: 'Distracting', label: 'Distracting', detail: 'Distracting', color: '#ef4444' },
]

export const DEFAULT_ACTIVITIES = [
  { id: 'deep-work', name: 'Deep Work', color: '#3b82f6', category: 'Very Productive' },
  { id: 'video-editing', name: 'Video Editing', color: '#ec4899', category: 'Productive' },
  { id: 'lecturing', name: 'Lecturing', color: '#f97316', category: 'Productive' },
  { id: 'research', name: 'Research', color: '#14b8a6', category: 'Very Productive' },
  { id: 'reading', name: 'Reading', color: '#8b5cf6', category: 'Productive' },
  { id: 'exercise', name: 'Exercise', color: '#22c55e', category: 'Very Productive' },
  { id: 'family', name: 'Family', color: '#facc15', category: 'Neutral' },
  { id: 'social-media', name: 'Social Media', color: '#06b6d4', category: 'Distracting' },
  { id: 'entertainment', name: 'Entertainment', color: '#ef4444', category: 'Distracting' },
  { id: 'travel', name: 'Travel', color: '#a3e635', category: 'Neutral' },
  { id: 'meetings', name: 'Meetings', color: '#94a3b8', category: 'Neutral' },
]
