import * as R from 'ramda'
import R_ from 'src/util/R_'
import * as ResourceService from 'src/service/resource/index'

export const convertFromToParam = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const priceField = ['st_price', 'supply_price']
      const intField = ['stock', 'category_id']
      return R.mapObjIndexed((val, key) => {
        if (key === 'head') {
          return R.map((headItem) => {
            return R.assoc('tp', ResourceService.allTp.img.value)(headItem)
          })(val)
        } else if (key === 'cover') {
          if (val && val.url) {
            val.tp = ResourceService.allTp.img.value
            return val
          } else {
            return null
          }
        } else if (priceField.indexOf(key) !== -1) {
          return R_.convertYuanToFen(val)
        } else if (intField.indexOf(key) !== -1) {
          return parseInt(val)
        } else if (key === 'skus') {
          return R.map(skuItem => {
            skuItem.suggest_price = R_.convertYuanToFen(skuItem.suggest_price)
            skuItem.stock = parseInt(skuItem.stock)
            if (skuItem.image && skuItem.image.url) {
              skuItem.image.tp = ResourceService.allTp.img.value
            } else {
              skuItem.image = null
            }
            return skuItem
          })(val)
        }
        return val
      })(obj)
    },
    (obj) => {
      obj.prop = {
        status: obj.status,
        category_id: obj.category_id,
        oversea: !!obj.oversea,
        supply_price: obj.supply_price,
        skus: obj.skus
      }
      return R.pickAll(['id', 'status', 'head', 'cover', 'name', 'sell_point', 'st_price', 'content', 'prop'])(obj)
    }
  )(form)
})

export const showCover = (product) => {
  if (product.cover && product.cover.url) {
    return product.cover.url
  }
  if (product.head && product.head.length > 0 && product.head[0].url) {
    return product.head[0].url
  }
  return ''
}

export const showSuggestPriceInterval = (product) => {
  if (product.prop.min_suggest_price === product.prop.max_suggest_price) {
    return `${R_.convertFenToYuan(product.prop.min_suggest_price)}`
  }
  return `${R_.convertFenToYuan(product.prop.min_suggest_price)}~${R_.convertFenToYuan(product.prop.max_suggest_price)}`
}
