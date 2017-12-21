export const syncNewObject = (defaultObj, source) => {
  let target = {...defaultObj}
  Object.keys(target).forEach((key) => {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  })
  return target
}
