import { date, datetime, monthtime, minutetime } from './datetime'
import { productSuggestPrice, productPrice } from './product'
import { price } from './common'

export default {}.install = function (Vue, options) {
  let filters = [
    {name: 'date', filter: date},
    {name: 'datetime', filter: datetime},
    {name: 'monthtime', filter: monthtime},
    {name: 'minutetime', filter: minutetime},
    {name: 'price', filter: price},
    {name: 'productSuggestPrice', filter: productSuggestPrice},
    {name: 'productPrice', filter: productPrice}
  ]
  for (let i = 0; i < filters.length; i++) {
    let filer = filters[i]
    Vue.filter(filer.name, filer.filter)
  }
}
