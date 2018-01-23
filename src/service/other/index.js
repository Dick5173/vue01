export const getTenantNameId = (arr) => {
  let resArr = arr.map((i) => {
    let merge = []
    merge.push(i.id)
    merge.push(i.nick_name)
    let str = merge.join('--')
    let data = {
      id: String(i.id),
      principal_name_id: str
    }
    return data
  })
  return resArr
}
