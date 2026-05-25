export function dateId(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDate(id) {
  const [year, month, day] = id.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(date, count) {
  const next = new Date(date)
  next.setDate(next.getDate() + count)
  return next
}

export function addMonths(date, count) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + count)
  return next
}

export function startOfWeek(date) {
  const next = new Date(date)
  next.setDate(next.getDate() - next.getDay())
  return next
}

export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

export function monthDates(year, monthIndex) {
  return Array.from({ length: daysInMonth(year, monthIndex) }, (_, index) => new Date(year, monthIndex, index + 1))
}

export function formatHour(hour) {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const value = hour % 12 || 12
  return `${value} ${suffix}`
}

export function entryKey(dayId, hour) {
  return `${dayId}-${String(hour).padStart(2, '0')}`
}
