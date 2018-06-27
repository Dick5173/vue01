import * as R from 'ramda'

export const convertFormToParam = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      return R.mapObjIndexed((val, key) => {
        if (key === 'auths') {
          return R.filter(item => item.constructor !== String)(val)
        }
        return val
      })(obj)
    }
  )(form)
})
