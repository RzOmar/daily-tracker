import { Activity, BarChart3, CalendarRange, Flame, Timer, TrendingUp, ZapOff } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { cn } from '../../lib/utils'
import { ProductivityChart } from './ProductivityChart'

export function StatCard({ icon: Icon, label, value, tone = 'text-slate-100' }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.055]">
      <div className="mb-3 flex items-center justify-between text-slate-500">
        <span className="text-xs font-medium">{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <div className={cn('text-2xl font-semibold tracking-tight', tone)}>{value}</div>
    </div>
  )
}

export function AnalyticsPanel({ analytics }) {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Analytics</h2>
        <Badge className="border-white/10 bg-white/[0.04] text-slate-300">Live</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Activity} label="Today" value={analytics.dailyScore} tone={analytics.dailyScore >= 0 ? 'text-emerald-300' : 'text-rose-300'} />
        <StatCard icon={CalendarRange} label="Week" value={analytics.weeklyScore} />
        <StatCard icon={BarChart3} label="Month" value={analytics.monthlyScore} />
        <StatCard icon={Timer} label="Focused" value={`${analytics.focusedHours}h`} tone="text-sky-300" />
        <StatCard icon={ZapOff} label="Distract" value={`${analytics.distractionHours}h`} tone="text-amber-300" />
        <StatCard icon={Flame} label="Streak" value={`${analytics.streak}d`} tone="text-orange-300" />
        <StatCard icon={TrendingUp} label="Consistency" value={`${analytics.weeklyConsistency}%`} tone="text-emerald-300" />
        <StatCard icon={Timer} label="Total Time" value={`${analytics.totalHours}h`} />
        <StatCard icon={Activity} label="Completions" value={analytics.completionCount} />
        <StatCard icon={BarChart3} label="Avg Day" value={`${analytics.averagePerActiveDay}h`} />
      </div>
      <div className="mt-4 rounded-lg border border-white/10 bg-black/15 p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>Most productive day</span>
          <span className="font-semibold text-slate-200">{analytics.mostProductiveDay || 'No data'}</span>
        </div>
        <ProductivityChart distribution={analytics.distribution} />
      </div>
      <div className="mt-4 rounded-lg border border-white/10 bg-black/15 p-3">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span>Productivity trend</span>
          <span>Last 7 days</span>
        </div>
        <div className="flex h-24 items-end gap-2">
          {analytics.trend.map((day) => {
            const height = Math.max(8, Math.min(92, Math.abs(day.score) * 12 + day.hours * 5))
            const positive = day.score >= 0

            return (
              <div key={day.id} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-16 w-full items-end rounded bg-white/[0.025]">
                  <div
                    className={positive ? 'w-full rounded bg-emerald-300/55' : 'w-full rounded bg-rose-300/55'}
                    style={{ height: `${height}%` }}
                    title={`${day.label}: ${day.score} score, ${day.hours}h`}
                  />
                </div>
                <span className="text-[10px] text-slate-600">{day.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
