import { CalendarDays, Crosshair, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export function Header({ view, setView, setCurrentDate, openActivityModal }) {
  const views = [
    ['day', 'Day'],
    ['week', 'Week'],
    ['month', 'Month'],
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/72 px-5 py-4 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-300/20">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">ChronoFlow</p>
            <h1 className="text-2xl font-extrabold tracking-tight">Productivity Dashboard</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-slate-700 bg-slate-900/70 p-1">
            {views.map(([id, label]) => (
              <button
                key={id}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-semibold transition',
                  view === id ? 'bg-sky-500 text-white shadow-glow' : 'text-slate-400 hover:bg-white/10 hover:text-white',
                )}
                onClick={() => setView(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <Button variant="secondary" onClick={() => setCurrentDate(new Date())}>
            <Crosshair className="h-4 w-4" />
            Today
          </Button>
          <Button onClick={openActivityModal}>
            <Plus className="h-4 w-4" />
            New Activity
          </Button>
        </div>
      </div>
    </header>
  )
}
