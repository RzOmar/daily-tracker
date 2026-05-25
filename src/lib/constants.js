export const STORAGE = {
  activities: 'chronoflow.activities.v1',
  entries: 'chronoflow.entries.v1',
  beast: 'chronoflow.beast.v1',
  beastGoals: 'chronoflow.beastGoals.v1',
}

export const CATEGORY_SCORES = {
  very_productive: 3,
  productive: 2,
  neutral: 0,
  distracting: -2,
  very_distracting: -3,
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

export const DEFAULT_ACTIVITIES = [
  { id: 'deep-work', name: 'Deep Work', category: 'very_productive', archived: false, order: 0 },
  { id: 'video-editing', name: 'Video Editing', category: 'productive', archived: false, order: 1 },
  { id: 'lecturing', name: 'Lecturing', category: 'productive', archived: false, order: 2 },
  { id: 'research', name: 'Research', category: 'very_productive', archived: false, order: 3 },
  { id: 'reading', name: 'Reading', category: 'productive', archived: false, order: 4 },
  { id: 'exercise', name: 'Exercise', category: 'very_productive', archived: false, order: 5 },
  { id: 'family', name: 'Family', category: 'neutral', archived: false, order: 6 },
  { id: 'social-media', name: 'Social Media', category: 'distracting', archived: false, order: 7 },
  { id: 'entertainment', name: 'Entertainment', category: 'distracting', archived: false, order: 8 },
  { id: 'travel', name: 'Travel', category: 'neutral', archived: false, order: 9 },
  { id: 'meetings', name: 'Meetings', category: 'neutral', archived: false, order: 10 },
]
