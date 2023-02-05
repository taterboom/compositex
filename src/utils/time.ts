const twoDigit = (num: number) => (num + "").padStart(2, "0")
export function generateTimeStr() {
  const dateObj = new Date()
  return `${dateObj.getFullYear()}${twoDigit(dateObj.getMonth() + 1)}${twoDigit(dateObj.getDate())}`
}
