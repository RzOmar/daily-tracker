import { useMemo, useState } from 'react'
import { GripVertical, MoreVertical, Plus } from 'lucide-react'
import { ACTIVITY_CATEGORIES, ACTIVITY_CATEGORY_IDS, getActivityColor, normalizeCategory } from '../../lib/activityCategories'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { cn } from '../../lib/utils'

function createId(name) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`
}

export function ActivityManagerModal({ open, onClose, activities, setActivities, setEntries }) {
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('productive')
  const [editingId, setEditingId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [draggedId, setDraggedId] = useState(null)
  const sortedActivities = useMemo(
    () => [...activities].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)),
    [activities],
  )

  function updateActivity(id, patch) {
    setActivities((current) => current.map((activity) => (
      activity.id === id ? { ...activity, ...patch, category: patch.category ? normalizeCategory(patch.category) : normalizeCategory(activity.category) } : activity
    )))
  }

  function createActivity(event) {
    event.preventDefault()
    if (!newName.trim()) return
    setActivities((current) => [
      ...current,
      {
        id: createId(newName),
        name: newName.trim(),
        category: newCategory,
        archived: false,
        order: current.length,
      },
    ])
    setNewName('')
    setNewCategory('productive')
  }

  function reorder(targetId) {
    if (!draggedId || draggedId === targetId) return
    const next = [...sortedActivities]
    const from = next.findIndex((activity) => activity.id === draggedId)
    const to = next.findIndex((activity) => activity.id === targetId)
    if (from < 0 || to < 0) return
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setActivities(next.map((activity, order) => ({ ...activity, order })))
  }

  function deleteAllRecords(activity) {
    setEntries((current) => {
      const next = { ...current }
      Object.entries(next).forEach(([key, entry]) => {
        if (entry.activityId === activity.id) delete next[key]
      })
      return next
    })
    setActivities((current) => current.filter((item) => item.id !== activity.id))
    setDeleteTarget(null)
  }

  function keepArchivedHistory(activity) {
    updateActivity(activity.id, { archived: true })
    setDeleteTarget(null)
  }

  return (
    <>
      <Dialog open={open} title="Manage Activities" onClose={onClose} size="lg">
        <div className="space-y-4">
          <form className="grid gap-2 rounded-lg border border-white/10 bg-black/15 p-3 md:grid-cols-[1fr_180px_auto]" onSubmit={createActivity}>
            <input
              className="h-10 rounded-md border border-white/10 bg-black/20 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-white/25"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="New activity"
            />
            <CategorySelect value={newCategory} onChange={setNewCategory} />
            <Button type="submit">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </form>
          <div className="sheet-scroll max-h-[58vh] overflow-auto rounded-lg border border-white/10">
            {sortedActivities.map((activity) => (
              <div
                key={activity.id}
                className={cn(
                  'grid grid-cols-[32px_1fr_160px_40px] items-center gap-3 border-b border-white/10 bg-[#111318] px-3 py-2.5 transition last:border-b-0 hover:bg-white/[0.045]',
                  activity.archived && 'opacity-45',
                )}
                draggable
                onDragStart={() => setDraggedId(activity.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => reorder(activity.id)}
                onDragEnd={() => setDraggedId(null)}
              >
                <GripVertical className="h-4 w-4 cursor-grab text-slate-600" />
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: getActivityColor(activity) }} />
                  {editingId === activity.id ? (
                    <input
                      autoFocus
                      className="h-8 min-w-0 flex-1 rounded-md border border-white/10 bg-black/20 px-2 text-sm text-slate-100 outline-none focus:border-white/25"
                      value={activity.name}
                      onChange={(event) => updateActivity(activity.id, { name: event.target.value })}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') setEditingId(null)
                        if (event.key === 'Escape') setEditingId(null)
                      }}
                    />
                  ) : (
                    <button className="truncate text-left text-sm font-medium text-slate-100" onClick={() => setEditingId(activity.id)}>
                      {activity.name}
                    </button>
                  )}
                </div>
                <CategoryBadge activity={activity} />
                <div className="relative">
                  <Button variant="ghost" size="icon" onClick={() => setOpenMenuId(openMenuId === activity.id ? null : activity.id)} aria-label={`Activity menu for ${activity.name}`}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  {openMenuId === activity.id && (
                    <div className="absolute right-0 top-10 z-20 w-48 rounded-lg border border-white/10 bg-[#171a20] p-1 shadow-2xl">
                      <MenuButton onClick={() => { setEditingId(activity.id); setOpenMenuId(null) }}>Rename</MenuButton>
                      <div className="px-2 py-1.5">
                        <CategorySelect value={normalizeCategory(activity.category)} onChange={(category) => updateActivity(activity.id, { category })} />
                      </div>
                      <MenuButton onClick={() => { updateActivity(activity.id, { archived: !activity.archived }); setOpenMenuId(null) }}>
                        {activity.archived ? 'Restore' : 'Archive'}
                      </MenuButton>
                      <MenuButton danger onClick={() => { setDeleteTarget(activity); setOpenMenuId(null) }}>Delete</MenuButton>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
      <Dialog open={Boolean(deleteTarget)} title="Delete Activity" onClose={() => setDeleteTarget(null)}>
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">What should happen to existing tracked records for <span className="text-slate-100">{deleteTarget.name}</span>?</p>
            <div className="grid gap-2">
              <Button variant="secondary" onClick={() => keepArchivedHistory(deleteTarget)}>Keep records as archived history</Button>
              <Button variant="danger" onClick={() => deleteAllRecords(deleteTarget)}>Delete all records</Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  )
}

function CategoryBadge({ activity }) {
  const category = ACTIVITY_CATEGORIES[normalizeCategory(activity.category)]
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-2 py-1 text-xs text-slate-300">
      <span className="h-2 w-2 rounded-full" style={{ background: category.color }} />
      {category.label}
    </span>
  )
}

function CategorySelect({ value, onChange }) {
  return (
    <select
      className="h-10 w-full rounded-md border border-white/10 bg-black/20 px-2 text-sm text-slate-100 outline-none focus:border-white/25"
      value={normalizeCategory(value)}
      onChange={(event) => onChange(event.target.value)}
    >
      {ACTIVITY_CATEGORY_IDS.map((id) => (
        <option key={id} value={id}>{ACTIVITY_CATEGORIES[id].label}</option>
      ))}
    </select>
  )
}

function MenuButton({ children, danger, onClick }) {
  return (
    <button
      className={cn('flex h-8 w-full items-center rounded-md px-2 text-left text-sm text-slate-300 transition hover:bg-white/[0.07]', danger && 'text-rose-200')}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
