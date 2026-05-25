import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarCell } from './CalendarCell'
import { dateId, entryKey, formatHour } from '../../lib/date'
import { isBeastDay } from '../../lib/beast'
import { cn } from '../../lib/utils'

export function ScheduleGrid({ dates, entries, activities, now, beast, onCellOpen, onFillCells }) {
  const [dragging, setDragging] = useState(null)
  const dragMovedRef = useRef(false)
  const activityById = useMemo(() => Object.fromEntries(activities.map((activity) => [activity.id, activity])), [activities])
  const dateIds = useMemo(() => dates.map((day) => dateId(day)), [dates])
  const selectedKeys = useMemo(() => {
    if (!dragging) return new Set()
    const sourceDayIndex = dateIds.indexOf(dragging.sourceDayId)
    const targetDayIndex = dateIds.indexOf(dragging.targetDayId)
    if (sourceDayIndex < 0 || targetDayIndex < 0) return new Set([dragging.source])

    const dayStart = Math.min(sourceDayIndex, targetDayIndex)
    const dayEnd = Math.max(sourceDayIndex, targetDayIndex)
    const hourStart = Math.min(dragging.sourceHour, dragging.targetHour)
    const hourEnd = Math.max(dragging.sourceHour, dragging.targetHour)
    const keys = new Set()

    for (let dayIndex = dayStart; dayIndex <= dayEnd; dayIndex += 1) {
      for (let hour = hourStart; hour <= hourEnd; hour += 1) {
        keys.add(entryKey(dateIds[dayIndex], hour))
      }
    }

    return keys
  }, [dateIds, dragging])

  function handleDragStart(event, day, hour) {
    if (event.button !== 0) return
    const dayId = dateId(day)
    const key = entryKey(dayId, hour)
    dragMovedRef.current = false
    setDragging({
      source: key,
      sourceDayId: dayId,
      targetDayId: dayId,
      sourceHour: hour,
      targetHour: hour,
      activityId: entries[key]?.activityId || null,
    })
  }

  function handleDragEnter(day, hour) {
    if (!dragging) return
    const dayId = dateId(day)
    const key = entryKey(dayId, hour)
    if (key !== dragging.source) dragMovedRef.current = true
    setDragging({ ...dragging, targetDayId: dayId, targetHour: hour })
  }

  function handleDragEnd() {
    if (!dragging) return
    if (dragging.activityId && selectedKeys.size > 1) {
      onFillCells(Array.from(selectedKeys), dragging.activityId)
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
    <div className="sheet-scroll h-full overflow-auto rounded-lg border border-white/10 bg-[#0d0f13]" style={{ '--day-columns': dates.length }}>
      <div className="calendar-grid min-w-full">
        <div className="sticky left-0 top-0 z-30 grid h-11 place-items-center border-b border-r border-white/10 bg-[#15171c] text-xs font-medium text-slate-500">Time</div>
        {dates.map((day) => {
          const isToday = dateId(day) === dateId(now)
          const inBeast = isBeastDay(beast, day)
          return (
            <div key={dateId(day)} className={cn('sticky top-0 z-20 border-b border-r border-white/10 bg-[#15171c]/95 px-3 py-2 backdrop-blur', isToday && 'bg-slate-800', inBeast && 'shadow-[inset_0_-2px_0_rgba(255,255,255,0.35)]')}>
              <div className={cn('text-sm font-semibold', isToday ? 'text-white' : 'text-slate-200')}>{day.toLocaleDateString(undefined, { weekday: dates.length > 10 ? 'narrow' : 'short' })}</div>
              <div className="text-xs text-slate-500">{day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
            </div>
          )
        })}
        {Array.from({ length: 24 }, (_, hour) => (
          <Fragment key={hour}>
            <div className={cn('sticky left-0 z-10 grid min-h-[52px] place-items-center border-b border-r border-white/10 bg-[#15171c]/95 text-xs font-medium text-slate-500 backdrop-blur', hour === now.getHours() && 'text-slate-200')}>
              {formatHour(hour)}
            </div>
            {dates.map((day) => {
              const key = entryKey(dateId(day), hour)
              const entry = entries[key]
              const activity = entry ? activityById[entry.activityId] : null
              const selected = selectedKeys.has(key)

              return (
                <div key={key} className={cn(selected && 'bg-white/[0.06] ring-1 ring-inset ring-slate-300/30')}>
                  <CalendarCell
                    day={day}
                    hour={hour}
                    activity={activity}
                    inBeast={isBeastDay(beast, day)}
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
