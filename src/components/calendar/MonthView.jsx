import { BarChart3, Flame, Timer, ZapOff } from 'lucide-react'
import { Badge } from '../ui/badge'
import { StatCard } from '../panels/AnalyticsPanel'
import { CATEGORY_SCORES } from '../../lib/constants'
import { dateId, monthDates } from '../../lib/date'
import { cn } from '../../lib/utils'

export function MonthView({ currentDate, entries, activities, analytics, now, setCurrentDate }) {
  const dates = monthDates(currentDate.getFullYear(), currentDate.getMonth())
  const firstOffset = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const activityById = Object.fromEntries(activities.map((activity) => [activity.id, activity]))

  function dayStats(day) {
    const id = dateId(day)
    const dayEntries = Object.entries(entries).filter(([key]) => key.startsWith(id))
    const score = dayEntries.reduce((sum, [, entry]) => {
      const activity = activityById[entry.activityId]
      return sum + (activity ? CATEGORY_SCORES[activity.category] : 0)
    }, 0)
    return { score, hours: dayEntries.length }
  }

  return (
    <div className="sheet-scroll h-full overflow-auto rounded-xl border border-white/10 bg-slate-950/80 p-4">
      <div className="mb-4 grid grid-cols-4 gap-3">
        <StatCard icon={BarChart3} label="Month score" value={analytics.monthlyScore} tone="text-emerald-300" />
        <StatCard icon={Timer} label="Focused hours" value={`${analytics.focusedHours}h`} tone="text-sky-300" />
        <StatCard icon={ZapOff} label="Distraction" value={`${analytics.distractionHours}h`} tone="text-rose-300" />
        <StatCard icon={Flame} label="Streak" value={`${analytics.streak}d`} tone="text-orange-300" />
      </div>
      <div className="month-grid gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="sticky top-0 z-10 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">{day}</div>
        ))}
        {Array.from({ length: firstOffset }, (_, index) => <div key={`blank-${index}`} />)}
        {dates.map((day) => {
          const stats = dayStats(day)
          const isToday = dateId(day) === dateId(now)
          const strength = `${Math.min(88, Math.max(8, Math.abs(stats.score) * 7 + stats.hours * 3))}%`
          const color = stats.score >= 0 ? '#22c55e' : '#ef4444'

          return (
            <button
              key={dateId(day)}
              className={cn('heatmap-cell min-h-[118px] rounded-xl border border-white/10 p-3 text-left transition hover:-translate-y-1 hover:border-sky-300/60', isToday && 'ring-2 ring-sky-300')}
              style={{ '--heat-color': color, '--heat-strength': strength }}
              onClick={() => setCurrentDate(day)}
              title={`${day.toLocaleDateString()} score ${stats.score}`}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-bold">{day.getDate()}</span>
                <Badge className={stats.score >= 0 ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200' : 'border-rose-400/20 bg-rose-500/10 text-rose-200'}>{stats.score}</Badge>
              </div>
              <div className="text-xs text-slate-300">{stats.hours} tracked hours</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
