import * as R from 'ramda'
import R_ from 'src/util/R_'
import * as ResourceService from 'src/service/resource/index'
import { convertKgToG, convertGToKg } from 'src/util/weight'
import { dateFormat } from 'src/util/format'

export const allTp = {
  platform: {
    value: 1,
    text: ''
  },
  self_support: {
    value: 2,
    text: '自营'
  },
  choose_platform: {
    value: 3,
    text: '平台'
  }
}
export const allStatus = {
  all: {
    value: 0,
    text: '全部'
  },
  up: {
    value: 1,
    text: '上架'
  },
  down: {
    value: 2,
    text: '下架'
  },
  stockout: {
    value: 3,
    text: '缺货'
  }
}

export const allSupplyType = {
  supply: {
    value: 2,
    text: '定向供货'
  },
  unlimited: {
    value: 1,
    text: '无限制'
  }
}

export const convertFormToParam = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const priceField = ['st_price']
      const intField = ['stock', 'category_id', 'service_tag_group_id', 'after_service_id', 'delivery_region_id', 'freight_template_id']
      return R.mapObjIndexed((val, key) => {
        if (key === 'head') {
          return R.map((headItem) => {
            return R.assoc('tp', ResourceService.allTp.img.value)(headItem)
          })(val)
        } else if (['page_cover', 'cover'].indexOf(key) >= 0) {
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
            skuItem.weight = skuItem.weight ? convertKgToG(skuItem.weight) : 0
            if (skuItem.image && skuItem.image.url) {
              skuItem.image.tp = ResourceService.allTp.img.value
            } else {
              skuItem.image = null
            }
            return skuItem
          })(val)
        } else if (key === 'tags') {
          return R.map(tagsItem => {
            return tagsItem.id
          })(val || [])
        }
        return val
      })(obj)
    },
    (obj) => {
      obj.prop = {
        status: obj.status,
        category_id: obj.category_id,
        oversea: !!obj.oversea,
        skus: obj.skus,
        tags: obj.tags,
        sys_remark: obj.sys_remark,
        service_tag_group_id: obj.service_tag_group_id,
        after_service_id: obj.after_service_id,
        delivery_region_id: obj.delivery_region_id,
        freight_template_id: obj.freight_template_id,
        supply_scope_tp: obj.supply_scope_tp,
        purchase_price: R_.convertYuanToFen(obj.purchase_price),
        supply_tenants: R.map(item => {
          return item.id
        })(obj.supply_tenants || [])
      }
      return R.pickAll(['id', 'status', 'head', 'cover', 'page_cover', 'name', 'sell_point', 'st_price', 'content', 'prop', 'sys_remark'])(obj)
    }
  )(form)
})

export const convertModelToForm = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const newKey = {
        category_id: ['prop', 'category', 'id'],
        oversea: ['prop', 'ext', 'oversea'],
        skus: ['prop', 'skus'],
        supply_levels: ['prop', 'supply_levels'],
        tags: ['prop', 'tags'],
        sys_remark: ['prop', 'sys_remark'],
        service_tag_group_id: ['prop', 'ext', 'service_tag_group', 'id'],
        after_service_id: ['prop', 'ext', 'after_service', 'id'],
        delivery_region_id: ['prop', 'ext', 'delivery_region', 'id'],
        freight_template_id: ['prop', 'ext', 'freight_template', 'id'],
        supply_scope_tp: ['prop', 'supply_scope_tp'],
        supply_tenants: ['prop', 'supply_tenants'],
        purchase_price: ['prop', 'purchase_price']
      }
      R.forEachObjIndexed((val, key) => {
        obj[key] = R.path(val)(obj)
      }, newKey)
      return obj
    },
    (obj) => {
      const pickContent = R.pickAll(['id', 'tp', 'text', 'url', 'width', 'height'])
      const priceField = ['st_price']
      const intField = ['stock', 'category_id', 'service_tag_group_id', 'after_service_id', 'delivery_region_id', 'freight_template_id']
      return R.mapObjIndexed((val, key) => {
        if (key === 'head') {
          return R.map((headItem) => {
            return pickContent(headItem)
          })(val || [])
        } else if (['page_cover', 'cover'].indexOf(key) >= 0) {
          return pickContent(val || {})
        } else if (priceField.indexOf(key) !== -1) {
          if (val === 0) {
            return ''
          }
          return `${R_.convertFenToYuan(val)}`
        } else if (intField.indexOf(key) !== -1) {
          if (!val) {
            return ''
          }
          return `${val}`
        } else if (key === 'skus') {
          return R.map(skuItem => {
            skuItem.suggest_price = `${R_.convertFenToYuan(skuItem.suggest_price)}`
            skuItem.stock = `${skuItem.stock}`
            skuItem.weight = skuItem.weight ? `${convertGToKg(skuItem.weight)}` : ''
            skuItem.image = pickContent(skuItem.image || {})
            return skuItem
          })(val || [])
        } else if (key === 'content') {
          return R.map(contentItem => {
            return pickContent(contentItem)
          })(val || [])
        } else if (key === 'tags') {
          if (!val) {
            return []
          }
        } else if (key === 'purchase_price') {
          if (val) {
            return `${R_.convertFenToYuan(val)}`
          } else {
            return ''
          }
        } else if (key === 'supply_levels') {
          return R.map(item => {
            item.supply_price = `${R_.convertFenToYuan(item.supply_price)}`
            return item
          })(val || [])
        }
        return val
      })(obj)
    },
    (obj) => {
      obj.prop = {
        status: obj.status,
        category_id: obj.category_id,
        oversea: !!obj.oversea,
        skus: obj.skus,
        sys_remark: obj.sys_remark,
        supply_price: obj.supply_price,
        supply_levels: obj.supply_levels
      }
      return R.pickAll(['id', 'status', 'head', 'cover', 'page_cover', 'name', 'sell_point', 'st_price', 'category_id', 'oversea', 'skus', 'supply_levels', 'content', 'tags', 'service_tag_group_id', 'after_service_id', 'delivery_region_id', 'freight_template_id', 'supply_scope_tp', 'supply_tenants', 'purchase_price', 'sys_remark'])(obj)
    }
  )(form)
})

export const showCover = (product) => {
  if (product.cover) {
    return product.cover.url
  }
  if (product.head && product.head.length > 0 && product.head[0].url) {
    return product.head[0].url
  }
  return ''
}

export const showSuggestPriceInterval = (product) => {
  if (!product) {
    return ''
  }
  if (product.prop.min_suggest_price === product.prop.max_suggest_price) {
    return `${R_.convertFenToYuan(product.prop.min_suggest_price)}`
  }
  return `${R_.convertFenToYuan(product.prop.min_suggest_price)}~${R_.convertFenToYuan(product.prop.max_suggest_price)}`
}
export const showProfit = (product) => {
  if (!product) {
    return ''
  }
  if (product.min_profit === product.max_profit) {
    return `${R_.convertFenToYuan(product.min_profit)}`
  } else {
    return `${R_.convertFenToYuan(product.min_profit)}~${R_.convertFenToYuan(product.max_profit)}`
  }
}
export const showPriceInterval = (product) => {
  if (!product) {
    return ''
  }
  if (product.min_price === product.max_price) {
    return `${R_.convertFenToYuan(product.min_price)}`
  }
  return `${R_.convertFenToYuan(product.min_price)}~${R_.convertFenToYuan(product.max_price)}`
}
export const copyCreate = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const pickContent = R.pickAll(['tp', 'text', 'url', 'width', 'height'])
      return R.mapObjIndexed((val, key) => {
        if (key === 'head') {
          return R.map((headItem) => {
            return pickContent(headItem)
          })(val || [])
        } else if (['page_cover', 'cover'].indexOf(key) >= 0) {
          return pickContent(val || {})
        } else if (key === 'content') {
          return R.map((item) => {
            delete item.id
            return item
          })(val || [])
        } else if (key === 'skus') {
          return R.map((item) => {
            delete item.ct
            delete item.mt
            delete item.id
            if (item.image) {
              delete item.image.id
            }
            return item
          })(val || [])
        } else if (key === 'supply_levels') {
          return R.map((item) => {
            delete item.id
            return item
          })(val || [])
        }
        return val
      })(obj)
    }, (obj) => {
      return obj
    }
  )(form)
})

export const buildSupplyPrice = (tenantLevelList, supplyPriceRawData, convertFenToYuan) => {
  let fnFindSupplyPrice = (tenantLevelId) => {
    return R.find(item => {
      return item.tenant_level_id === tenantLevelId || (item.tenant_level && item.tenant_level.id === tenantLevelId)
    })(supplyPriceRawData || [])
  }

  return R.map((item) => {
    const itemSupplyPrice = fnFindSupplyPrice(item.id)
    return {
      id: itemSupplyPrice ? itemSupplyPrice.id : 0,
      tenant_level: item,
      supply_price: itemSupplyPrice ? `${itemSupplyPrice.supply_price}` : ''
    }
  })(tenantLevelList || [])
}

// todo 优化将两个方法合并
export const buildSupplyPriceWithConvertFenToYuan = (tenantLevelList, supplyPriceRawData) => {
  let fnFindSupplyPrice = (tenantLevelId) => {
    return R.find(item => {
      return item.tenant_level_id === tenantLevelId || (item.tenant_level && item.tenant_level.id === tenantLevelId)
    })(supplyPriceRawData || [])
  }

  return R.map((item) => {
    const itemSupplyPrice = fnFindSupplyPrice(item.id)
    return {
      id: itemSupplyPrice ? itemSupplyPrice.id : 0,
      tenant_level: item,
      supply_price: itemSupplyPrice ? `${R_.convertFenToYuan(itemSupplyPrice.supply_price)}` : ''
    }
  })(tenantLevelList || [])
}

export const supplyPrice = (purchasePrice, skus, levelName) => {
  const newSkus = R.clone(skus)
  const N = 0.0478
  let A = parseFloat(purchasePrice)
  if (A >= 0) {
    let suggestPrice = 0
    for (let i = 0; i < newSkus.length; i++) {
      if (newSkus[i].suggest_price === '') {
        newSkus[i].suggest_price = 0
      }
      suggestPrice += parseFloat(newSkus[i].suggest_price)
    }
    let B = suggestPrice / newSkus.length
    let P = parseFloat(purchasePrice) * N
    if (levelName === '普通店铺') {
      return B === 0 ? 0 : Math.floor((A + P + (B - A - P) * 0.3) * 100) / 100
    } else if (levelName === '中级店铺') {
      return B === 0 ? 0 : Math.floor((A + P + (B - A - P) * 0.20) * 100) / 100
    } else {
      return B === 0 ? 0 : Math.floor((A + P) * 100) / 100
    }
  }
}

export const convertFormToParams = R.curry(form => {
  return R.mapObjIndexed((val, key) => {
    if (key === 'start' || key === 'end') {
      if (val === 0) {
        return ''
      } else {
        return dateFormat(val, 'YYYY-MM-DD')
      }
    } else if (key === 'top') {
      if (val) {
        return 1
      } else {
        return 0
      }
    } else if (key === 'tags') {
      if (val.length !== 0) {
        return val.map((i) => {
          return parseInt(i)
        })
      } else {
        return []
      }
    }
    return val
  })(form)
})
