import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  return <section className={cn('glass rounded-xl', className)} {...props} />
}
