import { ACTIVITY_CATEGORIES, ACTIVITY_CATEGORY_IDS } from '../../lib/activityCategories'

export function ProductivityChart({ distribution }) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0) || 1

  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
        {ACTIVITY_CATEGORY_IDS.map((category) => (
          <div
            key={category}
            className="h-full"
            style={{
              background: ACTIVITY_CATEGORIES[category].color,
              width: `${((distribution[category] || 0) / total) * 100}%`,
            }}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1">
        {ACTIVITY_CATEGORY_IDS.map((category) => (
          <div key={category} className="rounded-md border border-white/10 bg-white/[0.035] px-2 py-1.5 text-center">
            <div
              className="mx-auto mb-1 h-1.5 w-5 rounded-full"
              style={{ background: ACTIVITY_CATEGORIES[category].color }}
            />
            <div className="text-[11px] text-slate-400">{distribution[category] || 0}h</div>
          </div>
        ))}
      </div>
    </div>
  )
}
