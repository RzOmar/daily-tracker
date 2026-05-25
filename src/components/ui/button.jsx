import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300/70 disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-sky-400/50 bg-sky-500 text-white shadow-glow hover:bg-sky-400',
        secondary: 'border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800',
        ghost: 'border-transparent bg-transparent text-slate-300 hover:bg-white/10 hover:text-white',
        danger: 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
