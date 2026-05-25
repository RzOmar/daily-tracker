export const ACTIVITY_CATEGORIES = {
  very_productive: {
    label: 'Very Productive',
    color: '#3B82F6',
    score: 3,
  },
  productive: {
    label: 'Productive',
    color: '#22C55E',
    score: 2,
  },
  neutral: {
    label: 'Neutral',
    color: '#A1A1AA',
    score: 0,
  },
  distracting: {
    label: 'Distracting',
    color: '#F59E0B',
    score: -2,
  },
  very_distracting: {
    label: 'Very Distracting',
    color: '#EF4444',
    score: -3,
  },
}

export const ACTIVITY_CATEGORY_IDS = Object.keys(ACTIVITY_CATEGORIES)

const LEGACY_CATEGORY_MAP = {
  'Very Productive': 'very_productive',
  Productive: 'productive',
  Neutral: 'neutral',
  Personal: 'productive',
  Distracting: 'distracting',
  'Very Distracting': 'very_distracting',
}

export function normalizeCategory(category) {
  return ACTIVITY_CATEGORIES[category] ? category : LEGACY_CATEGORY_MAP[category] || 'neutral'
}

export function getActivityCategory(activity) {
  return ACTIVITY_CATEGORIES[normalizeCategory(activity?.category)]
}

export function getActivityColor(activity) {
  return getActivityCategory(activity).color
}

export function getActivityScore(activity) {
  return getActivityCategory(activity).score
}

export function getContrastText(hexColor) {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.62 ? '#111318' : '#ffffff'
}
