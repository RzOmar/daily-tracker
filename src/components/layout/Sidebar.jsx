import { BarChart3, CalendarRange, DatabaseBackup, Flame } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Sidebar({
  page,
  setPage,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) {
  const mainItems = [
    { id: 'tracker', label: 'Tracker', icon: CalendarRange },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'beast', label: 'Beast Mode', icon: Flame },
    { id: 'backup', label: 'Backup', icon: DatabaseBackup },
  ]

  return (
    <aside
  className={cn(
    'fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-white/10 bg-[#0b0d10] px-3 py-4 transition-transform duration-200 lg:static lg:translate-x-0',
    
    mobileSidebarOpen
      ? 'translate-x-0'
      : '-translate-x-full'
  )}
>
      <div className="mb-8 px-2 max-md:mb-3">
        <div className="text-sm font-semibold tracking-tight text-slate-100">⚡Sufi-OS</div>
        <div className="mt-1 text-xs text-slate-500">Daily rhythm tracker</div>
      </div>
      <nav className="space-y-1 max-md:flex max-md:gap-1 max-md:space-y-0">
        {mainItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={cn(
              'flex h-9 w-full items-center gap-3 rounded-md px-2.5 text-sm text-slate-400 transition hover:bg-white/[0.055] hover:text-slate-100 max-md:justify-center',
              page === id && 'bg-white/[0.075] text-slate-100',
            )}
            onClick={() => {
              setPage(id)
              setMobileSidebarOpen(false)
            }}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
