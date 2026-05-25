import { CATEGORY_COLORS } from '../../lib/constants'
import { formatHour } from '../../lib/date'
import { cn } from '../../lib/utils'

export function CalendarCell({ day, hour, activity, isNow, onOpen, onDragStart, onDragEnter, onDragEnd }) {
  return (
    <button
      className={cn(
        'group relative min-h-[54px] border-b border-r border-slate-800/90 bg-slate-950/70 p-2 text-left transition duration-150 hover:z-10 hover:-translate-y-0.5 hover:border-sky-300/60 hover:bg-slate-900 hover:shadow-lg',
        activity && 'cell-fill',
        isNow && 'ring-2 ring-sky-300/90',
      )}
      style={activity ? { '--activity-color': activity.color } : undefined}
      title={`${day.toLocaleDateString()} at ${formatHour(hour)}${activity ? ` - ${activity.name}` : ''}`}
      onMouseDown={(event) => onDragStart(event, day, hour)}
      onMouseEnter={() => onDragEnter(day, hour)}
      onMouseUp={onDragEnd}
      onClick={() => onOpen(day, hour)}
    >
      {activity ? (
        <div className="pointer-events-none flex h-full flex-col justify-between">
          <span className="line-clamp-2 text-xs font-bold leading-tight text-white drop-shadow">{activity.name}</span>
          <span className={cn('mt-1 w-fit rounded-full border px-1.5 py-0.5 text-[10px]', CATEGORY_COLORS[activity.category])}>
            {activity.category}
          </span>
        </div>
      ) : (
        <span className="pointer-events-none text-[11px] text-slate-700 opacity-0 transition group-hover:opacity-100">Add</span>
      )}
    </button>
  )
}
