import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md border font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-white/15 bg-white text-slate-950 hover:bg-slate-200',
        secondary: 'border-white/10 bg-white/[0.045] text-slate-200 hover:bg-white/[0.075]',
        ghost: 'border-transparent bg-transparent text-slate-400 hover:bg-white/[0.06] hover:text-white',
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
