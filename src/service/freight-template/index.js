import { convertGToKg, convertKgToG } from 'src/util/weight'
import { convertFenToYuan, convertYuanToFen } from 'src/util/money'
import * as R from 'ramda'

export const allUnitTp = {
  piece: {
    value: 1,
    text: '按件数'
  },
  weight: {
    value: 2,
    text: '按重量'
  }
}

export const getDescText = (freight) => {
  let text = ''
  for (const item of freight.items || []) {
    const unitText = freight.unit_tp === 1 ? '件' : 'kg'
    const firstVal = freight.unit_tp === allUnitTp.piece.value ? item.first_unit : convertGToKg(item.first_unit)
    const nextVal = freight.unit_tp === allUnitTp.piece.value ? item.next_unit : convertGToKg(item.next_unit)
    let provinces = ''
    if (!item.province || item.province.length === 0) {
      provinces = '默认'
    } else {
      provinces = item.province.join('、')
    }
    text += `${provinces}  ${firstVal}${unitText}内${convertFenToYuan(item.first_price)}元，每续${nextVal}${unitText}增加${convertFenToYuan(item.next_price)}元;<br/>`
  }
  return text
}

export const showProvince = (freightItem) => {
  if (!freightItem.province || freightItem.province.length === 0) {
    return '请选择省份'
  }
  return (freightItem.province || []).join('、')
}

export const convertFormToParam = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      return R.mapObjIndexed((val, key) => {
        if (key === 'items') {
          return R.map(ruleItem => {
            ruleItem.first_price = convertYuanToFen(ruleItem.first_price)
            ruleItem.next_price = convertYuanToFen(ruleItem.next_price)
            if (form.unit_tp === allUnitTp.piece.value) {
              ruleItem.first_unit = parseInt(ruleItem.first_unit)
              ruleItem.next_unit = parseInt(ruleItem.next_unit)
            } else if (form.unit_tp === allUnitTp.weight.value) {
              ruleItem.first_unit = convertKgToG(ruleItem.first_unit)
              ruleItem.next_unit = convertKgToG(ruleItem.next_unit)
            }
            return ruleItem
          })(val || [])
        }
        return val
      })(obj)
    }
  )(form)
})

export const convertModelToForm = R.curry((model) => {
  return R.pipe(
    R.clone,
    (obj) => {
      return R.mapObjIndexed((val, key) => {
        if (key === 'items') {
          return R.map(ruleItem => {
            ruleItem.first_price = `${convertFenToYuan(ruleItem.first_price)}`
            ruleItem.next_price = `${convertFenToYuan(ruleItem.next_price)}`
            if (model.unit_tp === allUnitTp.piece.value) {
              ruleItem.first_unit = `${ruleItem.first_unit}`
              ruleItem.next_unit = `${ruleItem.next_unit}`
            } else if (model.unit_tp === allUnitTp.weight.value) {
              ruleItem.first_unit = `${convertGToKg(ruleItem.first_unit)}`
              ruleItem.next_unit = `${convertGToKg(ruleItem.next_unit)}`
            }
            return ruleItem
          })(val || [])
        }
        return val
      })(obj)
    }
  )(model)
})
