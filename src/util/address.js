import ChinaAddressV1Data from './address.json'

export const allProvince = (() => {
  return ChinaAddressV1Data.filter((item) => {
    return !item.p
  }).map((item) => {
    return item.n
  })
})()

export const reverseProvince = (currentProvinceList) => {
  let result = []
  for (let item of allProvince) {
    if (currentProvinceList.indexOf(item) < 0) {
      result.push(item)
    }
  }
  return result
}
