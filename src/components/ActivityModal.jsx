import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import { ACTIVITY_CATEGORY_OPTIONS } from '../lib/constants'
import { formatHour } from '../lib/date'
import { cn } from '../lib/utils'

function createId(name) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`
}

export function ActivityModal({ open, mode, onClose, activities, onSave, selectedCell, onAssign, onClear }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Very Productive')
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(mode === 'create')

  function saveActivity(event) {
    event.preventDefault()
    if (!name.trim()) return
    const categoryOption = ACTIVITY_CATEGORY_OPTIONS.find((option) => option.value === category) || ACTIVITY_CATEGORY_OPTIONS[0]
    const activity = { id: createId(name), name: name.trim(), color: categoryOption.color, category: categoryOption.value }
    onSave(activity)
    if (selectedCell) onAssign(activity.id)
    onClose()
  }

  const selectingCell = mode === 'select' && selectedCell
  const normalizedQuery = query.trim().toLowerCase()
  const filteredActivities = normalizedQuery
    ? activities.filter((activity) => activity.name.toLowerCase().includes(normalizedQuery))
    : activities

  function selectFirst(event) {
    if (event.key !== 'Enter' || creating) return
    const firstActivity = filteredActivities[0]
    if (!firstActivity) return
    event.preventDefault()
    onAssign(firstActivity.id)
    onClose()
  }

  function beginCreate(prefill = '') {
    setName(prefill)
    setCreating(true)
  }

  return (
    <Dialog open={open} title={creating ? 'Add Activity' : 'Choose Activity'} onClose={onClose}>
      {selectingCell && !creating ? (
        <div>
          <p className="mb-3 text-sm text-slate-500">
            Choose an activity for {selectedCell.day.toLocaleDateString()} at {formatHour(selectedCell.hour)}.
          </p>
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
          <div className="sheet-scroll grid max-h-64 gap-1.5 overflow-auto pr-1">
            {filteredActivities.map((activity) => (
              <button
                key={activity.id}
                className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-2.5 text-left transition duration-150 hover:border-white/20 hover:bg-white/[0.07] focus:border-white/30 focus:outline-none"
                onClick={() => {
                  onAssign(activity.id)
                  onClose()
                }}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: activity.color }} />
                <span className="text-sm font-medium text-slate-100">{activity.name}</span>
              </button>
            ))}
            <button
              className="flex items-center gap-3 rounded-md border border-dashed border-white/15 bg-transparent p-2.5 text-left text-sm text-slate-300 transition hover:border-white/30 hover:bg-white/[0.045] focus:border-white/30 focus:outline-none"
              onClick={() => beginCreate(query.trim())}
            >
              <Plus className="h-4 w-4" />
              Add New Activity
            </button>
          </div>
          <Button variant="danger" className="mt-3 w-full" onClick={() => { onClear(); onClose() }}>Clear Cell</Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={saveActivity}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Name</label>
            <input className="h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-white/25" value={name} onChange={(event) => setName(event.target.value)} placeholder="Deep work" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Productivity category</label>
            <div className="grid gap-2">
              {ACTIVITY_CATEGORY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2 text-left text-sm transition hover:bg-white/[0.055]',
                    category === option.value && 'border-white/25 bg-white/[0.075]',
                  )}
                  onClick={() => setCategory(option.value)}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: option.color }} />
                    <span className="text-slate-200">{option.label}</span>
                  </span>
                  <span className="text-xs text-slate-500">{option.detail}</span>
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full" type="submit">
            <Plus className="h-4 w-4" />
            Save Activity
          </Button>
        </form>
      )}
    </Dialog>
  )
}
