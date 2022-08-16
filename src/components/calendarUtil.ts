export function getDecade(date: Date) {
  const year = date.getFullYear()
  const offset = year % 10
  return year - offset
}
export function isSameDay(date1?: Date, date2?: Date) {
  if (!date1 || !date2) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
function padWithZero(num: number, targetLength: number) {
  return String(num).padStart(targetLength, '0')
}

/**
 * Format date into machine-redable string.
 * @param date value to format
 * @param year include year part
 * @param month include month part
 * @param day include date part
 * @returns
 */
export function machineFormat(
  date: Date,
  year?: boolean,
  month?: boolean,
  day?: boolean
) {
  const parts = []
  if (year) parts.push(date.getFullYear())
  if (month) parts.push(padWithZero(date.getMonth() + 1, 2))
  if (day) parts.push(padWithZero(date.getDate(), 2))
  return parts.join('-')
}
export function getWeekdayName(date: Date, short: boolean) {
  return new Intl.DateTimeFormat('en', {
    weekday: short ? 'short' : 'long'
  }).format(date)
}
export function getMonthName(date: Date, short: boolean) {
  return new Intl.DateTimeFormat('en', {
    month: short ? 'short' : 'long'
  }).format(date)
}

let compId = 0
export function getNextCompId() {
  return compId++
}
