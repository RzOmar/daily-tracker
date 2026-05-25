import { ACTIVITY_CATEGORY_IDS, getActivityScore, normalizeCategory } from './activityCategories'
import { addDays, dateId, parseDate, startOfWeek } from './date'

export function computeAnalytics(entries, activities, currentDate) {
  const activityById = Object.fromEntries(activities.map((activity) => [activity.id, activity]))
  const todayId = dateId(currentDate)
  const weekStart = startOfWeek(currentDate)
  const weekIds = new Set(Array.from({ length: 7 }, (_, index) => dateId(addDays(weekStart, index))))
  const monthPrefix = todayId.slice(0, 7)
  const distribution = Object.fromEntries(ACTIVITY_CATEGORY_IDS.map((category) => [category, 0]))
  const dayScores = {}
  const dayHours = {}
  const activityStats = Object.fromEntries(activities.map((activity) => [activity.id, {
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  }]))
  let dailyScore = 0
  let weeklyScore = 0
  let monthlyScore = 0
  let focusedHours = 0
  let distractionHours = 0
  let totalHours = 0

  Object.entries(entries).forEach(([key, entry]) => {
    const activity = activityById[entry.activityId]
    if (!activity) return

    const day = key.slice(0, 10)
    const category = normalizeCategory(activity.category)
    const score = getActivityScore(activity)
    totalHours += 1
    dayScores[day] = (dayScores[day] || 0) + score
    dayHours[day] = (dayHours[day] || 0) + 1
    distribution[category] += 1
    activityStats[activity.id] ||= { today: 0, week: 0, month: 0, total: 0 }
    activityStats[activity.id].total += 1
    if (day === todayId) activityStats[activity.id].today += 1
    if (weekIds.has(day)) activityStats[activity.id].week += 1
    if (day.startsWith(monthPrefix)) activityStats[activity.id].month += 1

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

  const trend = Array.from({ length: 7 }, (_, index) => {
    const day = addDays(currentDate, index - 6)
    const id = dateId(day)
    return {
      id,
      label: day.toLocaleDateString(undefined, { weekday: 'short' }),
      score: dayScores[id] || 0,
      hours: dayHours[id] || 0,
    }
  })
  const weeklyConsistency = Math.round((Array.from(weekIds).filter((id) => (dayHours[id] || 0) > 0).length / 7) * 100)
  const activeDays = Object.keys(dayHours).length
  const averagePerActiveDay = activeDays ? Number((totalHours / activeDays).toFixed(1)) : 0

  return {
    dailyScore,
    weeklyScore,
    monthlyScore,
    focusedHours,
    distractionHours,
    totalHours,
    completionCount: totalHours,
    averagePerActiveDay,
    distribution,
    activityStats,
    trend,
    weeklyConsistency,
    streak,
    mostProductiveDay: mostProductiveDay
      ? parseDate(mostProductiveDay).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : '',
  }
}
