import { useEffect, useMemo, useRef } from 'react'
import { CATEGORY_SCORES } from '../../lib/constants'
import { dateId, monthDates } from '../../lib/date'
import { isBeastDay } from '../../lib/beast'
import { cn } from '../../lib/utils'

export function MonthView({ currentDate, entries, activities, now, beast, setCurrentDate }) {
  const todayRef = useRef(null)
  const dates = monthDates(currentDate.getFullYear(), currentDate.getMonth())
  const activityById = useMemo(() => Object.fromEntries(activities.map((activity) => [activity.id, activity])), [activities])
  const monthStats = useMemo(() => {
    const stats = {}

    Object.entries(entries).forEach(([key, entry]) => {
      const dayId = key.slice(0, 10)
      if (!dayId.startsWith(dateId(currentDate).slice(0, 7))) return
      const activity = activityById[entry.activityId]
      if (!activity) return
      const score = CATEGORY_SCORES[activity.category] || 0
      stats[dayId] = stats[dayId] || { hours: 0, score: 0, colors: [] }
      stats[dayId].hours += 1
      stats[dayId].score += score
      stats[dayId].colors.push(activity.color)
    })

    return stats
  }, [activityById, currentDate, entries])
  const maxHours = Math.max(1, ...Object.values(monthStats).map((stat) => stat.hours))

  useEffect(() => {
    todayRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [currentDate])

  return (
    <div className="sheet-scroll h-full overflow-auto rounded-lg border border-white/10 bg-[#0d0f13] p-4">
      <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 border-b border-white/10 bg-[#0d0f13]/95 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Monthly Heatmap</h2>
            <p className="text-xs text-slate-500">Intensity reveals activity, gaps, streaks, and challenge consistency.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Low</span>
            {[0.16, 0.28, 0.42, 0.58, 0.74].map((opacity) => (
              <span key={opacity} className="h-3 w-3 rounded-sm bg-white" style={{ opacity }} />
            ))}
            <span>High</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(7,minmax(96px,1fr))] gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-xs font-medium text-slate-500">{day}</div>
        ))}
        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }, (_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {dates.map((day) => {
          const id = dateId(day)
          const stat = monthStats[id] || { hours: 0, score: 0, colors: [] }
          const isToday = id === dateId(now)
          const inBeast = isBeastDay(beast, day)
          const alpha = Math.min(0.78, Math.max(0.08, stat.hours / maxHours))
          const color = stat.colors[0] || (stat.score >= 0 ? '#e5e7eb' : '#fda4af')

          return (
            <button
              key={id}
              ref={isToday ? todayRef : undefined}
              className={cn(
                'group min-h-[74px] rounded-md border border-white/10 bg-white/[0.025] p-2 text-left transition duration-150 hover:border-white/25 hover:bg-white/[0.055]',
                isToday && 'ring-1 ring-white/60',
                inBeast && 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]',
              )}
              onClick={() => setCurrentDate(day)}
              title={`${day.toLocaleDateString()} - ${stat.hours} tracked hours`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className={cn('text-sm font-medium', isToday ? 'text-white' : 'text-slate-300')}>{day.getDate()}</span>
                {inBeast && <span className="h-1.5 w-1.5 rounded-full bg-white/70" />}
              </div>
              <div
                className="h-7 rounded-sm border border-white/10 transition group-hover:scale-[1.02]"
                style={{
                  background: stat.hours
                    ? `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, #111318)`
                    : 'rgba(255,255,255,0.025)',
                }}
              />
              <div className="mt-1.5 text-[11px] text-slate-600">{stat.hours ? `${stat.hours}h` : ''}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
