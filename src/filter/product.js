import { showSuggestPriceInterval, showPriceInterval } from 'src/service/product/index'

export const productSuggestPrice = value => {
  return showSuggestPriceInterval(value)
}
export const productPrice = value => {
  return showPriceInterval(value)
}
