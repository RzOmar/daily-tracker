import { formatHour } from '../../lib/date'
import { getActivityColor, getContrastText } from '../../lib/activityCategories'
import { cn } from '../../lib/utils'

export function CalendarCell({
  day,
  hour,
  activity,
  inBeast,
  isNow,
  onOpen,
  onDragStart,
  onDragEnter,
  onDragEnd,
}) {
  const activityColor = activity
    ? getActivityColor(activity)
    : null

  const textColor = activityColor
    ? getContrastText(activityColor)
    : undefined

  return (
    <button
      className={cn(
        'group relative min-h-[36px] w-full select-none border-b border-white/[0.04] bg-transparent px-2 py-1 text-left transition duration-100 hover:z-10 hover:bg-white/[0.025]',
        
        inBeast &&
          'bg-white/[0.015]',

        activity &&
          'cell-fill',

        isNow &&
          'ring-1 ring-inset ring-white/20',
      )}
      style={
        activity
          ? {
              '--activity-color': activityColor,
              backgroundColor: `${activityColor}CC`,
              color: textColor,
            }
          : undefined
      }
      title={`${day.toLocaleDateString()} at ${formatHour(hour)}${
        activity ? ` - ${activity.name}` : ''
      }`}
      onMouseDown={(event) =>
        onDragStart(event, day, hour)
      }
      onMouseEnter={() =>
        onDragEnter(day, hour)
      }
      onMouseUp={onDragEnd}
      onClick={() => onOpen(day, hour)}
    >
      {activity ? (
        <div className="pointer-events-none flex h-full items-center gap-1.5 overflow-hidden">

          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />

          <span
            className="truncate text-[11px] font-medium"
            style={{ color: textColor }}
          >
            {activity.name}
          </span>

        </div>
      ) : (
        <span className="pointer-events-none text-[10px] text-slate-700 opacity-0 transition group-hover:opacity-100">
          Select
        </span>
      )}
    </button>
  )
}