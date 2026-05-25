import { ScheduleGrid } from './ScheduleGrid'

export function DayView(props) {
  return <ScheduleGrid {...props} dates={[props.currentDate]} />
}
