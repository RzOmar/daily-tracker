import { Crosshair, SlidersHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export function Header({ page, view, setView, setCurrentDate, onManageActivities }) {
  const views = [
    ['day', 'Day View'],
    ['week', 'Week View'],
    ['month', 'Month View'],
  ]

  const title = {
    tracker: 'Tracker',
    dashboard: 'Dashboard',
    beast: 'Beast Mode',
  }[page]

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f1115]/88 px-5 py-3 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {page === 'tracker' && (
            <div className="flex rounded-md border border-white/10 bg-black/20 p-0.5">
              {views.map(([id, label]) => (
                <button
                  key={id}
                  className={cn(
                    'rounded px-3 py-1.5 text-sm transition',
                    view === id ? 'bg-white/[0.11] text-white' : 'text-slate-500 hover:bg-white/[0.06] hover:text-slate-200',
                  )}
                  onClick={() => setView(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <Button variant="secondary" onClick={() => setCurrentDate(new Date())}>
            <Crosshair className="h-4 w-4" />
            Today
          </Button>
          <Button variant="secondary" onClick={onManageActivities}>
            <SlidersHorizontal className="h-4 w-4" />
            Manage Activities
          </Button>
        </div>
      </div>
    </header>
  )
}
