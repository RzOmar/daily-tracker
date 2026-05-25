import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import { formatHour } from '../lib/date'
import { getActivityColor } from '../lib/activityCategories'

export function ActivityModal({ open, onClose, activities, selectedCell, onAssign, onClear }) {
  const [query, setQuery] = useState('')
  const activeActivities = useMemo(
    () => activities
      .filter((activity) => !activity.archived)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)),
    [activities],
  )
  const filteredActivities = query.trim()
    ? activeActivities.filter((activity) => activity.name.toLowerCase().includes(query.trim().toLowerCase()))
    : activeActivities

  function assign(activityId) {
    onAssign(activityId)
    onClose()
  }

  function selectFirst(event) {
    if (event.key !== 'Enter') return
    const first = filteredActivities[0]
    if (!first) return
    event.preventDefault()
    assign(first.id)
  }

  return (
    <Dialog open={open} title="Choose Activity" onClose={onClose}>
      <div>
        {selectedCell && (
          <p className="mb-3 text-sm text-slate-500">
            {selectedCell.day.toLocaleDateString()} at {formatHour(selectedCell.hour)}
          </p>
        )}
        <label className="mb-3 flex h-10 items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 text-slate-500 focus-within:border-white/25">
          <Search className="h-4 w-4" />
          <input
            autoFocus
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={selectFirst}
            placeholder="Search activities"
          />
        </label>
        <div className="sheet-scroll grid max-h-72 gap-1.5 overflow-auto pr-1">
          {filteredActivities.map((activity) => (
            <button
              key={activity.id}
              className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-2.5 text-left transition duration-150 hover:border-white/20 hover:bg-white/[0.07] focus:border-white/30 focus:outline-none"
              onClick={() => assign(activity.id)}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: getActivityColor(activity) }} />
              <span className="text-sm font-medium text-slate-100">{activity.name}</span>
            </button>
          ))}
          {!filteredActivities.length && (
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-500">
              No matching activities.
            </div>
          )}
        </div>
        <Button variant="danger" className="mt-3 w-full" onClick={() => { onClear(); onClose() }}>Clear Cell</Button>
      </div>
    </Dialog>
  )
}
