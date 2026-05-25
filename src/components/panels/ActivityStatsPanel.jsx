import { Card } from '../ui/card'
import { getActivityColor } from '../../lib/activityCategories'

export function ActivityStatsPanel({ activities, analytics }) {
  const rows = activities
    .map((activity) => ({ activity, stats: analytics.activityStats?.[activity.id] || { today: 0, week: 0, month: 0, total: 0 } }))
    .filter(({ stats }) => stats.total > 0)
    .sort((a, b) => b.stats.month - a.stats.month || b.stats.total - a.stats.total)
  const maxMonth = Math.max(1, ...rows.map(({ stats }) => stats.month))

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h2 className="font-semibold">Activity Statistics</h2>
        <p className="mt-1 text-sm text-slate-500">Duration by activity across useful time windows.</p>
      </div>
      <div className="sheet-scroll overflow-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[1.7fr_repeat(4,0.7fr)] gap-3 border-b border-white/10 pb-2 text-xs text-slate-500">
            <span>Activity</span>
            <span>Today</span>
            <span>Week</span>
            <span>Month</span>
            <span>Total</span>
          </div>
          <div className="divide-y divide-white/10">
            {rows.length ? rows.map(({ activity, stats }) => (
              <div key={activity.id} className="grid grid-cols-[1.7fr_repeat(4,0.7fr)] items-center gap-3 py-3 text-sm">
                <span className="flex min-w-0 items-center gap-2 text-slate-300">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: getActivityColor(activity) }} />
                  <span className="truncate">{activity.name}</span>
                </span>
                <span className="text-slate-400">{stats.today}h</span>
                <span className="text-slate-400">{stats.week}h</span>
                <span>
                  <span className="mb-1 block text-slate-300">{stats.month}h</span>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-white/60" style={{ width: `${(stats.month / maxMonth) * 100}%` }} />
                  </span>
                </span>
                <span className="text-slate-400">{stats.total}h</span>
              </div>
            )) : (
              <div className="py-6 text-sm text-slate-500">No tracked activity yet.</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
