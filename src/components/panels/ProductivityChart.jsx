import { CATEGORY_SCORES } from '../../lib/constants'
import { cn } from '../../lib/utils'

export function ProductivityChart({ distribution }) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0) || 1
  const colors = {
    'Very Productive': 'bg-emerald-400',
    Productive: 'bg-sky-400',
    Neutral: 'bg-slate-400',
    Distracting: 'bg-amber-400',
    'Very Distracting': 'bg-rose-400',
  }

  return (
    <div className="space-y-2">
      {Object.keys(CATEGORY_SCORES).map((category) => (
        <div key={category}>
          <div className="mb-1 flex justify-between text-[11px] text-slate-400">
            <span>{category}</span>
            <span>{distribution[category] || 0}h</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn('h-full rounded-full', colors[category])}
              style={{ width: `${((distribution[category] || 0) / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
