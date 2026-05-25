import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { ActivityModal } from './components/ActivityModal'
import { DayView } from './components/calendar/DayView'
import { MonthView } from './components/calendar/MonthView'
import { WeekView } from './components/calendar/WeekView'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { ActivityStatsPanel } from './components/panels/ActivityStatsPanel'
import { AnalyticsPanel } from './components/panels/AnalyticsPanel'
import { BeastModePanel } from './components/panels/BeastModePanel'
import { Button } from './components/ui/button'
import { DEFAULT_ACTIVITIES, STORAGE } from './lib/constants'
import { addDays, addMonths, dateId, entryKey, formatHour } from './lib/date'
import { computeAnalytics } from './lib/analytics'
import { readStorage, writeStorage } from './lib/storage'
import { beastDuration, beastElapsed, beastRange } from './lib/beast'

export default function App() {
  const [now, setNow] = useState(new Date())
  const [page, setPage] = useState('tracker')
  const [view, setView] = useState('day')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activities, setActivities] = useState(() => readStorage(STORAGE.activities, DEFAULT_ACTIVITIES))
  const [entries, setEntries] = useState(() => readStorage(STORAGE.entries, {}))
  const [beast, setBeast] = useState(() => readStorage(STORAGE.beast, {}))
  const [beastGoals, setBeastGoals] = useState(() => readStorage(STORAGE.beastGoals, { 7: '', 30: '', 100: '' }))
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('select')
  const [selectedCell, setSelectedCell] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => writeStorage(STORAGE.activities, activities), [activities])
  useEffect(() => writeStorage(STORAGE.entries, entries), [entries])
  useEffect(() => writeStorage(STORAGE.beast, beast), [beast])
  useEffect(() => writeStorage(STORAGE.beastGoals, beastGoals), [beastGoals])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.target.matches('input, select, textarea')) return
      if (event.key === '1') setView('day')
      if (event.key === '2') setView('week')
      if (event.key === '3') setView('month')
      if (event.key.toLowerCase() === 'n') {
        setSelectedCell(null)
        setModalMode('create')
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
    setModalMode('select')
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

  function openCreateActivity() {
    setSelectedCell(null)
    setModalMode('create')
    setModalOpen(true)
  }

  const sharedGridProps = {
    currentDate,
    entries,
    activities,
    now,
    beast,
    setCurrentDate,
    onCellOpen: openCell,
    onFillCells: fillCells,
  }

  return (
    <div className="app-frame flex h-screen min-h-screen text-slate-100 max-md:flex-col">
      <Sidebar page={page} setPage={setPage} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          page={page}
          view={view}
          setView={setView}
          setCurrentDate={setCurrentDate}
        />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 p-5 max-md:p-3">
          {page === 'tracker' ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </h2>
                  <p className="text-sm text-slate-500">Current hour: {formatHour(now.getHours())}</p>
                  {beast?.startDate && <BeastStatus beast={beast} />}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => setCurrentDate(view === 'month' ? addMonths(currentDate, -1) : addDays(currentDate, view === 'day' ? -1 : -7))} aria-label="Previous range">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" onClick={() => setCurrentDate(view === 'month' ? addMonths(currentDate, 1) : addDays(currentDate, view === 'day' ? 1 : 7))} aria-label="Next range">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <section className="min-h-0 flex-1">
                {view === 'day' && <DayView {...sharedGridProps} />}
                {view === 'week' && <WeekView {...sharedGridProps} />}
                {view === 'month' && <MonthView {...sharedGridProps} />}
              </section>
            </>
          ) : page === 'dashboard' ? (
            <section className="sheet-scroll min-h-0 flex-1 overflow-auto">
              <div className="mx-auto grid max-w-6xl gap-4 pb-8">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Dashboard</h2>
                  <p className="text-sm text-slate-500">Analytics, streaks, activity statistics, and Beast Mode progress.</p>
                </div>
                <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
                  <div className="grid gap-4">
                    <AnalyticsPanel analytics={analytics} />
                    <ActivityStatsPanel activities={activities} analytics={analytics} />
                  </div>
                  <BeastModePanel beast={beast} setBeast={setBeast} beastGoals={beastGoals} setBeastGoals={setBeastGoals} currentDate={currentDate} analytics={analytics} entries={entries} activities={activities} compact />
                </div>
              </div>
            </section>
          ) : (
            <section className="sheet-scroll min-h-0 flex-1 overflow-auto">
              <div className="mx-auto max-w-5xl pb-8">
                <BeastModePanel beast={beast} setBeast={setBeast} beastGoals={beastGoals} setBeastGoals={setBeastGoals} currentDate={currentDate} analytics={analytics} entries={entries} activities={activities} />
              </div>
            </section>
          )}
        </main>
      </div>
      <ActivityModal
        key={modalOpen ? `${modalMode}-${selectedCell ? entryKey(dateId(selectedCell.day), selectedCell.hour) : 'new'}` : 'closed'}
        open={modalOpen}
        mode={modalMode}
        onClose={() => setModalOpen(false)}
        activities={activities}
        onSave={saveActivity}
        selectedCell={selectedCell}
        onAssign={assignActivity}
        onClear={clearSelectedCell}
      />
      <Button className="fixed bottom-4 right-4 z-40 hidden shadow-2xl max-md:inline-flex" size="icon" onClick={openCreateActivity} aria-label="Add activity">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  )
}

function BeastStatus({ beast }) {
  const range = beastRange(beast)
  const total = beastDuration(beast)
  const completed = beastElapsed(beast)
  const remaining = Math.max(0, total - completed)

  if (!range) return null

  return (
    <div className="mt-2 inline-flex flex-wrap items-center gap-2 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.08)]">
      <span>{total} Days Challenge</span>
      <span className="text-emerald-200/70">{completed} complete</span>
      <span className="text-emerald-200/70">{remaining} remaining</span>
    </div>
  )
}
