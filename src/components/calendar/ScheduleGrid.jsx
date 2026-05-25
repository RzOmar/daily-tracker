import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarCell } from './CalendarCell'
import { dateId, entryKey, formatHour } from '../../lib/date'
import { cn } from '../../lib/utils'

export function ScheduleGrid({ dates, entries, activities, now, onCellOpen, onFillCells }) {
  const [dragging, setDragging] = useState(null)
  const dragMovedRef = useRef(false)
  const activityById = useMemo(() => Object.fromEntries(activities.map((activity) => [activity.id, activity])), [activities])

  function handleDragStart(event, day, hour) {
    if (event.button !== 0) return
    const key = entryKey(dateId(day), hour)
    dragMovedRef.current = false
    setDragging({ source: key, activityId: entries[key]?.activityId || null, keys: new Set([key]) })
  }

  function handleDragEnter(day, hour) {
    if (!dragging) return
    const key = entryKey(dateId(day), hour)
    const nextKeys = new Set(dragging.keys)
    nextKeys.add(key)
    if (key !== dragging.source) dragMovedRef.current = true
    setDragging({ ...dragging, keys: nextKeys })
  }

  function handleDragEnd() {
    if (!dragging) return
    if (dragging.activityId && dragging.keys.size > 1) {
      onFillCells(Array.from(dragging.keys), dragging.activityId)
    }
    setDragging(null)
    window.setTimeout(() => {
      dragMovedRef.current = false
    }, 0)
  }

  function handleCellOpen(day, hour) {
    if (dragMovedRef.current) return
    onCellOpen(day, hour)
  }

  useEffect(() => {
    const stop = () => setDragging(null)
    window.addEventListener('mouseup', stop)
    return () => window.removeEventListener('mouseup', stop)
  }, [])

  return (
    <div className="sheet-scroll h-full overflow-auto rounded-xl border border-white/10 bg-slate-950/80" style={{ '--day-columns': dates.length }}>
      <div className="calendar-grid min-w-full">
        <div className="sticky left-0 top-0 z-30 grid h-12 place-items-center border-b border-r border-slate-700 bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-400">Time</div>
        {dates.map((day) => {
          const isToday = dateId(day) === dateId(now)
          return (
            <div key={dateId(day)} className={cn('sticky top-0 z-20 border-b border-r border-slate-700 bg-slate-900/95 px-3 py-2 backdrop-blur', isToday && 'bg-sky-950')}>
              <div className={cn('text-sm font-extrabold', isToday ? 'text-sky-200' : 'text-slate-100')}>{day.toLocaleDateString(undefined, { weekday: 'short' })}</div>
              <div className="text-xs text-slate-400">{day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
            </div>
          )
        })}
        {Array.from({ length: 24 }, (_, hour) => (
          <Fragment key={hour}>
            <div className={cn('sticky left-0 z-10 grid min-h-[54px] place-items-center border-b border-r border-slate-700 bg-slate-900/95 text-xs font-bold text-slate-400 backdrop-blur', hour === now.getHours() && 'text-sky-200')}>
              {formatHour(hour)}
            </div>
            {dates.map((day) => {
              const key = entryKey(dateId(day), hour)
              const entry = entries[key]
              const activity = entry ? activityById[entry.activityId] : null
              const selected = dragging?.keys.has(key)

              return (
                <div key={key} className={cn(selected && 'bg-sky-400/10')}>
                  <CalendarCell
                    day={day}
                    hour={hour}
                    activity={activity}
                    isNow={dateId(day) === dateId(now) && hour === now.getHours()}
                    onOpen={handleCellOpen}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragEnd={handleDragEnd}
                  />
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
