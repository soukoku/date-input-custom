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
let compId = 0
export function getNextCompId() {
  return compId++
}
