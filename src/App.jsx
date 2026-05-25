import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ActivityModal } from './components/ActivityModal'
import { DayView } from './components/calendar/DayView'
import { MonthView } from './components/calendar/MonthView'
import { WeekView } from './components/calendar/WeekView'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { AnalyticsPanel } from './components/panels/AnalyticsPanel'
import { BeastModePanel } from './components/panels/BeastModePanel'
import { Button } from './components/ui/button'
import { DEFAULT_ACTIVITIES, STORAGE } from './lib/constants'
import { addDays, addMonths, dateId, entryKey, formatHour } from './lib/date'
import { computeAnalytics } from './lib/analytics'
import { readStorage, writeStorage } from './lib/storage'

export default function App() {
  const [now, setNow] = useState(new Date())
  const [view, setView] = useState('day')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activities, setActivities] = useState(() => readStorage(STORAGE.activities, DEFAULT_ACTIVITIES))
  const [entries, setEntries] = useState(() => readStorage(STORAGE.entries, {}))
  const [beast, setBeast] = useState(() => readStorage(STORAGE.beast, {}))
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => writeStorage(STORAGE.activities, activities), [activities])
  useEffect(() => writeStorage(STORAGE.entries, entries), [entries])
  useEffect(() => writeStorage(STORAGE.beast, beast), [beast])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.target.matches('input, select, textarea')) return
      if (event.key === '1') setView('day')
      if (event.key === '2') setView('week')
      if (event.key === '3') setView('month')
      if (event.key.toLowerCase() === 'n') {
        setSelectedCell(null)
        setModalOpen(true)
      }
      if (event.key.toLowerCase() === 't') setCurrentDate(new Date())
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const analytics = useMemo(() => computeAnalytics(entries, activities, currentDate), [entries, activities, currentDate])

  function openCell(day, hour) {
    setSelectedCell({ day, hour })
    setModalOpen(true)
  }

  function assignActivity(activityId) {
    if (!selectedCell) return
    const key = entryKey(dateId(selectedCell.day), selectedCell.hour)
    setEntries((current) => ({ ...current, [key]: { activityId, updatedAt: new Date().toISOString() } }))
  }

  function clearSelectedCell() {
    if (!selectedCell) return
    const key = entryKey(dateId(selectedCell.day), selectedCell.hour)
    setEntries((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function fillCells(keys, activityId) {
    setEntries((current) => {
      const next = { ...current }
      keys.forEach((key) => {
        next[key] = { activityId, updatedAt: new Date().toISOString() }
      })
      return next
    })
  }

  function saveActivity(activity) {
    setActivities((current) => [...current, activity])
  }

  const sharedGridProps = {
    currentDate,
    entries,
    activities,
    now,
    onCellOpen: openCell,
    onFillCells: fillCells,
  }

  return (
    <div className="app-frame flex h-screen min-h-screen flex-col text-slate-100">
      <Header
        view={view}
        setView={setView}
        setCurrentDate={setCurrentDate}
        openActivityModal={() => {
          setSelectedCell(null)
          setModalOpen(true)
        }}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar analytics={analytics} beast={beast} setBeast={setBeast} currentDate={currentDate} />
        <main className="flex min-w-0 flex-1 flex-col gap-4 p-4">
          <div className="grid grid-cols-1 gap-4 xl:hidden">
            <AnalyticsPanel analytics={analytics} />
            <BeastModePanel beast={beast} setBeast={setBeast} currentDate={currentDate} analytics={analytics} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">
                {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-sm text-slate-400">
                Current hour: {formatHour(now.getHours())}. Shortcuts: 1 Day, 2 Week, 3 Month, N New, T Today.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setCurrentDate(view === 'month' ? addMonths(currentDate, -1) : addDays(currentDate, view === 'day' ? -1 : -7))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="secondary" onClick={() => setCurrentDate(view === 'month' ? addMonths(currentDate, 1) : addDays(currentDate, view === 'day' ? 1 : 7))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <section className="min-h-0 flex-1">
            {view === 'day' && <DayView {...sharedGridProps} />}
            {view === 'week' && <WeekView {...sharedGridProps} />}
            {view === 'month' && (
              <MonthView
                currentDate={currentDate}
                entries={entries}
                activities={activities}
                analytics={analytics}
                now={now}
                setCurrentDate={(day) => {
                  setCurrentDate(day)
                  setView('day')
                }}
              />
            )}
          </section>
        </main>
      </div>
      <ActivityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        activities={activities}
        onSave={saveActivity}
        selectedCell={selectedCell}
        onAssign={assignActivity}
        onClear={clearSelectedCell}
      />
    </div>
  )
}
