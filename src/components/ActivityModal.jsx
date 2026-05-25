import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import { CATEGORY_COLORS, CATEGORY_SCORES } from '../lib/constants'
import { formatHour } from '../lib/date'

function createId(name) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`
}

export function ActivityModal({ open, onClose, activities, onSave, selectedCell, onAssign, onClear }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#38bdf8')
  const [category, setCategory] = useState('Productive')

  useEffect(() => {
    if (open) {
      setName('')
      setColor('#38bdf8')
      setCategory('Productive')
    }
  }, [open])

  function saveActivity(event) {
    event.preventDefault()
    if (!name.trim()) return
    const activity = { id: createId(name), name: name.trim(), color, category }
    onSave(activity)
    if (selectedCell) onAssign(activity.id)
    onClose()
  }

  return (
    <Dialog open={open} title={selectedCell ? 'Edit Time Block' : 'Create Activity'} onClose={onClose}>
      {selectedCell && (
        <div className="mb-5">
          <p className="mb-3 text-sm text-slate-400">
            Choose an activity for {selectedCell.day.toLocaleDateString()} at {formatHour(selectedCell.hour)}.
          </p>
          <div className="grid max-h-56 gap-2 overflow-auto pr-1">
            {activities.map((activity) => (
              <button
                key={activity.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-left transition hover:border-sky-300/50 hover:bg-slate-800"
                onClick={() => {
                  onAssign(activity.id)
                  onClose()
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full" style={{ background: activity.color }} />
                  <span className="font-semibold">{activity.name}</span>
                </span>
                <Badge className={CATEGORY_COLORS[activity.category]}>{activity.category}</Badge>
              </button>
            ))}
          </div>
          <Button variant="danger" className="mt-3 w-full" onClick={() => { onClear(); onClose() }}>Clear Cell</Button>
        </div>
      )}
      <form className="space-y-4 border-t border-white/10 pt-5" onSubmit={saveActivity}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">Activity name</label>
          <input className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100 outline-none transition focus:border-sky-300" value={name} onChange={(event) => setName(event.target.value)} placeholder="Design sprint" />
        </div>
        <div className="grid grid-cols-[1fr_88px] gap-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Productivity category</label>
            <select className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100 outline-none transition focus:border-sky-300" value={category} onChange={(event) => setCategory(event.target.value)}>
              {Object.keys(CATEGORY_SCORES).map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Color</label>
            <input className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 p-1" type="color" value={color} onChange={(event) => setColor(event.target.value)} />
          </div>
        </div>
        <Button className="w-full" type="submit">
          <Plus className="h-4 w-4" />
          Save New Activity
        </Button>
      </form>
    </Dialog>
  )
}
