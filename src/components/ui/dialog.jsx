import { X } from 'lucide-react'
import { Button } from './button'

import { cn } from '../../lib/utils'

export function Dialog({ open, title, children, onClose, size = 'md' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        className={cn(
          'animate-pop w-full rounded-lg border border-white/10 bg-[#111318] p-4 shadow-2xl',
          size === 'lg' ? 'max-w-3xl' : 'max-w-sm',
        )}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
