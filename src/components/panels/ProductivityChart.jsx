import { CATEGORY_SCORES } from '../../lib/constants'
import { cn } from '../../lib/utils'

export function ProductivityChart({ distribution }) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0) || 1
  const colors = {
    'Very Productive': 'bg-emerald-400',
    Productive: 'bg-sky-400',
    Neutral: 'bg-slate-400',
    Personal: 'bg-blue-400',
    Distracting: 'bg-amber-400',
    'Very Distracting': 'bg-rose-400',
  }

  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
        {Object.keys(CATEGORY_SCORES).map((category) => (
          <div
            key={category}
            className={cn('h-full', colors[category])}
            style={{ width: `${((distribution[category] || 0) / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1">
        {Object.keys(CATEGORY_SCORES).map((category) => (
          <div key={category} className="rounded-md border border-white/10 bg-white/[0.035] px-2 py-1.5 text-center">
            <div className={cn('mx-auto mb-1 h-1.5 w-5 rounded-full', colors[category])} />
            <div className="text-[11px] text-slate-400">{distribution[category] || 0}h</div>
          </div>
        ))}
      </div>
    </div>
  )
}
