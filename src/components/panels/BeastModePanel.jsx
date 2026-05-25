import { useState } from 'react'
import { CalendarCheck, Flame, Rocket, Trophy } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { dateId, parseDate } from '../../lib/date'
import { StatCard } from './AnalyticsPanel'

export function BeastModePanel({ beast, setBeast, currentDate, analytics }) {
  const [startDate, setStartDate] = useState(dateId(currentDate))
  const active = Boolean(beast?.startDate)
  const start = active ? parseDate(beast.startDate) : null
  const today = new Date()
  const elapsed = active ? Math.min(30, Math.max(0, Math.floor((today - start) / 86400000) + 1)) : 0
  const progress = active ? Math.round((elapsed / 30) * 100) : 0

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold">Beast Mode</h2>
        <Badge className="border-orange-400/20 bg-orange-500/10 text-orange-200">
          <Flame className="mr-1 h-3 w-3" />
          30 Days
        </Badge>
      </div>
      {active ? (
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">Challenge progress</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-emerald-400" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={CalendarCheck} label="Day" value={`${elapsed}/30`} tone="text-orange-300" />
            <StatCard icon={Trophy} label="Score" value={analytics.monthlyScore} tone="text-emerald-300" />
          </div>
          <div className="rounded-xl border border-orange-400/20 bg-orange-500/10 p-3 text-sm text-orange-100">
            <strong>{analytics.streak} day streak.</strong> Keep stacking productive hours.
          </div>
          <Button variant="danger" className="w-full" onClick={() => setBeast({})}>End Challenge</Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">Start a 30-day consistency challenge and track focused hours, scores, and streaks.</p>
          <input
            type="date"
            className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
          <Button className="w-full" onClick={() => setBeast({ startDate })}>
            <Rocket className="h-4 w-4" />
            Begin Beast Mode
          </Button>
        </div>
      )}
    </Card>
  )
}
