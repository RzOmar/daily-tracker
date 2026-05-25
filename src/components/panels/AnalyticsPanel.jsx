import { Activity, BarChart3, CalendarRange, Flame, Timer, ZapOff } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { cn } from '../../lib/utils'
import { ProductivityChart } from './ProductivityChart'

export function StatCard({ icon: Icon, label, value, tone = 'text-slate-100' }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.06]">
      <div className="mb-3 flex items-center justify-between text-slate-400">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <div className={cn('text-2xl font-extrabold', tone)}>{value}</div>
    </div>
  )
}

export function AnalyticsPanel({ analytics }) {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold">Analytics</h2>
        <Badge className="border-sky-400/20 bg-sky-500/10 text-sky-200">Live</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Activity} label="Today" value={analytics.dailyScore} tone={analytics.dailyScore >= 0 ? 'text-emerald-300' : 'text-rose-300'} />
        <StatCard icon={CalendarRange} label="Week" value={analytics.weeklyScore} />
        <StatCard icon={BarChart3} label="Month" value={analytics.monthlyScore} />
        <StatCard icon={Timer} label="Focused" value={`${analytics.focusedHours}h`} tone="text-sky-300" />
        <StatCard icon={ZapOff} label="Distract" value={`${analytics.distractionHours}h`} tone="text-amber-300" />
        <StatCard icon={Flame} label="Streak" value={`${analytics.streak}d`} tone="text-orange-300" />
      </div>
      <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/50 p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>Most productive day</span>
          <span className="font-semibold text-slate-200">{analytics.mostProductiveDay || 'No data'}</span>
        </div>
        <ProductivityChart distribution={analytics.distribution} />
      </div>
    </Card>
  )
}
