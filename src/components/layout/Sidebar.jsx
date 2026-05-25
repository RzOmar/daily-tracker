import { AnalyticsPanel } from '../panels/AnalyticsPanel'
import { BeastModePanel } from '../panels/BeastModePanel'

export function Sidebar({ analytics, beast, setBeast, currentDate }) {
  return (
    <aside className="hidden w-80 shrink-0 space-y-4 overflow-y-auto border-r border-white/10 p-4 xl:block">
      <AnalyticsPanel analytics={analytics} />
      <BeastModePanel beast={beast} setBeast={setBeast} currentDate={currentDate} analytics={analytics} />
    </aside>
  )
}
