import { convertYuanToFen } from 'src/util/money'
import * as R from 'ramda'

export const coverFormToParam = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      return R.mapObjIndexed((val, key) => {
        if (key === 'amount') {
          if (val) {
            return convertYuanToFen(val)
          } else {
            return ''
          }
        }
        return val
      })(obj)
    }
  )(form)
})
