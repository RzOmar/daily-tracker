import { addDays, startOfWeek } from '../../lib/date'
import { ScheduleGrid } from './ScheduleGrid'

export function WeekView(props) {
  const dates = Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(props.currentDate), index))
  return <ScheduleGrid {...props} dates={dates} />
}
