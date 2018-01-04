import * as R from 'ramda'

export const convertVoToForm = R.curry((vo) => {
  return R.pipe(
    R.clone,
    (obj) => {
      return obj
    }
  )
})

// id: 0,
//   head: [],
//   cover: {
//   tp: 2,
//     url: '',
//     width: 0,
//     height: 0
// },
// name: '',
//   sell_point: '',
//   skus: [],
//   st_price: '',
//   supply_price: '',
//   category_id: '',
//   content: []
