import { CATEGORY_SCORES } from './constants'
import { addDays, dateId, parseDate, startOfWeek } from './date'

export function computeAnalytics(entries, activities, currentDate) {
  const activityById = Object.fromEntries(activities.map((activity) => [activity.id, activity]))
  const todayId = dateId(currentDate)
  const weekStart = startOfWeek(currentDate)
  const weekIds = new Set(Array.from({ length: 7 }, (_, index) => dateId(addDays(weekStart, index))))
  const monthPrefix = todayId.slice(0, 7)
  const distribution = Object.fromEntries(Object.keys(CATEGORY_SCORES).map((category) => [category, 0]))
  const dayScores = {}
  let dailyScore = 0
  let weeklyScore = 0
  let monthlyScore = 0
  let focusedHours = 0
  let distractionHours = 0

  Object.entries(entries).forEach(([key, entry]) => {
    const activity = activityById[entry.activityId]
    if (!activity) return

    const day = key.slice(0, 10)
    const score = CATEGORY_SCORES[activity.category]
    dayScores[day] = (dayScores[day] || 0) + score
    distribution[activity.category] += 1

    if (score > 0) focusedHours += 1
    if (score < 0) distractionHours += 1
    if (day === todayId) dailyScore += score
    if (weekIds.has(day)) weeklyScore += score
    if (day.startsWith(monthPrefix)) monthlyScore += score
  })

  const mostProductiveDay = Object.entries(dayScores).sort((a, b) => b[1] - a[1])[0]?.[0]
  let streak = 0

  for (let day = new Date(currentDate); ; day = addDays(day, -1)) {
    const id = dateId(day)
    if ((dayScores[id] || 0) <= 0) break
    streak += 1
  }

  return {
    dailyScore,
    weeklyScore,
    monthlyScore,
    focusedHours,
    distractionHours,
    distribution,
    streak,
    mostProductiveDay: mostProductiveDay
      ? parseDate(mostProductiveDay).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : '',
  }
}
