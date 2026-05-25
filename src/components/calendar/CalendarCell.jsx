import { formatHour } from '../../lib/date'
import { cn } from '../../lib/utils'

export function CalendarCell({ day, hour, activity, inBeast, isNow, onOpen, onDragStart, onDragEnter, onDragEnd }) {
  return (
    <button
      className={cn(
        'group relative min-h-[52px] w-full border-b border-r border-white/[0.075] bg-[#0d0f13] p-2 text-left transition duration-150 hover:z-10 hover:bg-white/[0.045]',
        inBeast && 'bg-white/[0.018] shadow-[inset_2px_0_0_rgba(255,255,255,0.18)]',
        activity && 'cell-fill',
        isNow && 'ring-1 ring-inset ring-white/50',
      )}
      style={activity ? { '--activity-color': activity.color } : undefined}
      title={`${day.toLocaleDateString()} at ${formatHour(hour)}${activity ? ` - ${activity.name}` : ''}`}
      onMouseDown={(event) => onDragStart(event, day, hour)}
      onMouseEnter={() => onDragEnter(day, hour)}
      onMouseUp={onDragEnd}
      onClick={() => onOpen(day, hour)}
    >
      {activity ? (
        <div className="pointer-events-none flex h-full items-start gap-2">
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-white/80" />
          <span className="line-clamp-2 text-xs font-medium leading-snug text-white/95">{activity.name}</span>
        </div>
      ) : (
        <span className="pointer-events-none text-[11px] text-slate-600 opacity-0 transition group-hover:opacity-100">Select</span>
      )}
    </button>
  )
}
