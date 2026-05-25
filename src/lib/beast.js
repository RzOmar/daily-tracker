import { addDays, dateId, parseDate } from './date'

export function beastDuration(beast) {
  return Number(beast?.duration || 30)
}

export function beastRange(beast) {
  if (!beast?.startDate) return null
  const duration = beastDuration(beast)
  const start = parseDate(beast.startDate)
  const end = addDays(start, duration - 1)
  return { start, end, duration }
}

export function isBeastDay(beast, day) {
  const range = beastRange(beast)
  if (!range) return false
  const id = dateId(day)
  return id >= dateId(range.start) && id <= dateId(range.end)
}

export function beastElapsed(beast, today = new Date()) {
  const range = beastRange(beast)
  if (!range) return 0
  return Math.min(range.duration, Math.max(0, Math.floor((today - range.start) / 86400000) + 1))
}

export function beastProgress(beast, today = new Date()) {
  const duration = beastDuration(beast)
  return Math.round((beastElapsed(beast, today) / duration) * 100)
}
