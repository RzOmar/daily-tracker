import { useEffect, useMemo, useRef } from 'react'
import { getActivityColor } from '../../lib/activityCategories'
import { dateId, monthDates, entryKey } from '../../lib/date'
import { cn } from '../../lib/utils'

export function MonthView({
    currentDate,
  entries,
  activities,
  now,
  onCellOpen,
  onDragStart,
  onDragEnter,
  onDragEnd,
}) {
  const todayRef = useRef(null)

  const dates = monthDates(
    currentDate.getFullYear(),
    currentDate.getMonth()
  )

  const activityById = useMemo(
    () =>
      Object.fromEntries(
        activities.map((activity) => [
          activity.id,
          activity,
        ])
      ),
    [activities]
  )

  useEffect(() => {
    todayRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: 'smooth',
    })
  }, [currentDate])

  return (
    <div className="h-full overflow-auto rounded-lg border border-white/10 bg-[#0d0f13] select-none">
      

      <div className="inline-block min-w-full align-top">

        <table
          className="border-collapse"
          style={{
            width: 'max-content',
          }}
        >

          {/* HEADER */}
          <thead className="sticky top-0 z-20 bg-[#0d0f13]">
            <tr>

              {/* TIME COLUMN */}
              <th className="sticky left-0 z-30 w-[72px] border-b border-r border-white/10 bg-[#0d0f13] p-2 text-xs text-slate-400">
                Time
              </th>

              {/* DAYS */}
              {dates.map((day) => {
                const isToday =
                  dateId(day) === dateId(now)

                return (
                  <th
                    key={dateId(day)}
                    ref={
                      isToday
                        ? todayRef
                        : undefined
                    }
                    className={cn(
                      'w-[32px] min-w-[32px] max-w-[32px] border-b border-r border-white/10 p-1 text-center text-[10px]',
                      isToday
                        ? 'bg-white/10 text-white'
                        : 'text-slate-500'
                    )}
                  >
                    <div>
                      {day.getDate()}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {Array.from(
              { length: 24 },
              (_, hour) => (
                <tr key={hour}>

                  {/* TIME LABEL */}
                  <td className="sticky left-0 z-10 h-[22px] border-b border-r border-white/10 bg-[#0d0f13] px-2 text-[10px] text-slate-500 whitespace-nowrap">
                    {hour === 0
                      ? '12 AM'
                      : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                      ? '12 PM'
                      : `${hour - 12} PM`}
                  </td>

                  {/* CELLS */}
                  {dates.map((day) => {
                    const key = entryKey(dateId(day), hour)

                    const entry =
                      entries[key]

                    const activity =
                      entry
                        ? activityById[
                            entry.activityId
                          ]
                        : null

                    const color =
                      activity
                        ? getActivityColor(
                            activity
                          )
                        : null

                    return (
                      <td
                        key={key}
                        title={activity ? activity.name : ''}
                        onMouseDown={(event) =>
                          onDragStart(event, day, hour)
                        }
                        onMouseEnter={() =>
                          onDragEnter(day, hour)
                        }
                        onMouseUp={onDragEnd}
                        onClick={() => onCellOpen(day, hour)}
                        className="h-[22px] w-[32px] min-w-[32px] max-w-[32px] cursor-pointer select-none border-b border-r border-white/5 transition hover:brightness-125 hover:ring-1 hover:ring-white/20"
                        style={{
                          background: color
                            ? `color-mix(in srgb, ${color} 82%, #111318)`
                            : 'transparent',
                        }}
                      >
                        {activity && (
                          <div className="h-full w-full" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}