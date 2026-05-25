import { useState } from 'react'
import { CalendarCheck, Flame, Rocket, Trophy } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { beastDuration, beastElapsed, beastProgress, beastRange } from '../../lib/beast'
import { CATEGORY_SCORES } from '../../lib/constants'
import { addDays, dateId } from '../../lib/date'
import { cn } from '../../lib/utils'
import { StatCard } from './AnalyticsPanel'

const CHALLENGES = [7, 30, 100]

export function BeastModePanel({ beast, setBeast, beastGoals = { 7: '', 30: '', 100: '' }, setBeastGoals, currentDate, analytics, entries = {}, activities = [], compact = false }) {
  const [startDate, setStartDate] = useState(dateId(currentDate))
  const [duration, setDuration] = useState(30)
  const [title, setTitle] = useState(beast?.title || `${duration} Days Challenge`)
  const active = Boolean(beast?.startDate)
  const range = beastRange(beast)
  const totalDays = beastDuration(beast)
  const elapsed = beastElapsed(beast)
  const progress = beastProgress(beast)
  const activityById = Object.fromEntries(activities.map((activity) => [activity.id, activity]))
  const completedDays = active ? challengeCompletedDays(beast, entries, activityById) : 0
  const consistency = active ? Math.round((completedDays / Math.max(1, Math.min(elapsed, totalDays))) * 100) : 0

  function startChallenge() {
    setBeast({
      startDate,
      duration,
      title: title.trim() || `${duration} Days Challenge`,
      notes: beastGoals[duration] || '',
      createdAt: new Date().toISOString(),
    })
  }

  function updateBeast(patch) {
    setBeast({ ...beast, ...patch, updatedAt: new Date().toISOString() })
  }

  function updateGoal(days, value) {
    setBeastGoals?.({ ...beastGoals, [days]: value })
    if (active && totalDays === days) updateBeast({ notes: value })
  }

  function selectDuration(days) {
    setDuration(days)
    setTitle((current) => CHALLENGES.some((item) => current === `${item} Days Challenge`) ? `${days} Days Challenge` : current)
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Beast Mode</h2>
          <p className="mt-1 text-sm text-slate-500">A focused challenge for consistent execution.</p>
        </div>
        <Badge className="border-white/10 bg-white/[0.04] text-slate-300">
          <Flame className="mr-1 h-3 w-3" />
          {active ? `${totalDays} Days` : 'Focus'}
        </Badge>
      </div>
      {active ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-black/15 p-3">
            <input
              className="mb-2 w-full bg-transparent text-base font-semibold text-slate-100 outline-none"
              value={beast.title || `${totalDays} Day Focus`}
              onChange={(event) => updateBeast({ title: event.target.value })}
            />
            {!compact && (
              <textarea
                className="min-h-16 w-full resize-none bg-transparent text-sm text-slate-500 outline-none"
                value={beast.notes || beastGoals[totalDays] || ''}
                onChange={(event) => updateGoal(totalDays, event.target.value)}
                placeholder="Notes, goals, reminders"
              />
            )}
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">Challenge progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-white/70 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={CalendarCheck} label="Day" value={`${elapsed}/${totalDays}`} tone="text-slate-100" />
            <StatCard icon={Trophy} label="Consistency" value={`${consistency}%`} tone="text-emerald-300" />
            <StatCard icon={Flame} label="Streak" value={`${analytics.streak}d`} tone="text-orange-300" />
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: totalDays }, (_, index) => {
              const day = addDays(range.start, index)
              const id = dateId(day)
              const complete = dayHasPositiveScore(id, entries, activityById)
              const past = index < elapsed

              return (
                <span
                  key={id}
                  className={cn(
                    'h-2 rounded-full bg-white/[0.08]',
                    past && 'bg-white/[0.22]',
                    complete && 'bg-emerald-300/70',
                  )}
                  title={`${day.toLocaleDateString()}${complete ? ' complete' : ''}`}
                />
              )
            })}
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-slate-400">
            {range.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} to{' '}
            {range.end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          <Button variant="danger" className="w-full" onClick={() => setBeast({})}>End Challenge</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {CHALLENGES.map((days) => (
              <button
                key={days}
                className={cn(
                  'rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.065] hover:text-slate-100',
                  duration === days && 'border-white/25 bg-white/[0.09] text-slate-100',
                )}
                onClick={() => selectDuration(days)}
              >
                {days} Days Challenge
              </button>
            ))}
          </div>
          <input
            className="h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm text-slate-100 outline-none focus:border-white/25"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={`${duration} Days Challenge`}
          />
          {!compact && <BeastGoals goals={beastGoals} onChange={updateGoal} />}
          <input
            type="date"
            className="h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm text-slate-100"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
          <Button className="w-full" onClick={startChallenge}>
            <Rocket className="h-4 w-4" />
            Begin Challenge
          </Button>
        </div>
      )}
    </Card>
  )
}

function BeastGoals({ goals, onChange }) {
  return (
    <div className="grid gap-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Beast Goals</h3>
        <p className="mt-1 text-xs text-slate-500">Separate notes are saved locally for each challenge length.</p>
      </div>
      {CHALLENGES.map((days) => (
        <label key={days} className="block">
          <span className="mb-1.5 block text-xs text-slate-500">{days} days</span>
          <textarea
            className="min-h-16 w-full resize-none rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-white/25"
            value={goals[days] || ''}
            onChange={(event) => onChange(days, event.target.value)}
            placeholder={days === 7 ? 'No wasted mornings' : days === 30 ? 'Deep work every day' : 'Build an identity'}
          />
        </label>
      ))}
    </div>
  )
}

function challengeCompletedDays(beast, entries, activityById) {
  const range = beastRange(beast)
  if (!range) return 0
  let count = 0

  for (let index = 0; index < range.duration; index += 1) {
    const id = dateId(addDays(range.start, index))
    if (dayHasPositiveScore(id, entries, activityById)) count += 1
  }

  return count
}

function dayHasPositiveScore(dayId, entries, activityById) {
  return Object.entries(entries).some(([key, entry]) => {
    if (!key.startsWith(dayId)) return false
    const activity = activityById[entry.activityId]
    return activity && (CATEGORY_SCORES[activity.category] || 0) > 0
  })
}
