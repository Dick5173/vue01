export const isNumber = (val) => {
  if (!val) {
    return false
  }
  const result = parseInt(val)
  if (isNaN(result)) {
    return false
  }
  return true
}
