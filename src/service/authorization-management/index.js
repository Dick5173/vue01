import * as R from 'ramda'

export const resetAuthGroup = (model) => {
  return R.map(item => {
    const children = R.map(child => {
      return {
        value: child.id,
        label: child.name
      }
    })(item.children || [])
    return {
      value: item.id,
      label: item.name,
      children: (children && children.length > 0) ? children : [{value: item.id, label: item.name}]
    }
  })(model || [])
}

export const filterParentGroup = (model) => {
  return R.filter(item => {
    return !item.auths || item.auths.length === 0
  })(model || [])
}

export const convertAuthGroupFormToParams = R.curry((model) => {
  return R.pipe(
    R.clone,
    (obj) => {
      return R.mapObjIndexed((val, key) => {
        if (key === 'parent_id') {
          if (val) {
            return parseInt(val)
          }
          return 0
        }
        return val
      })(obj)
    }
  )(model)
})
