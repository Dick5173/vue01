import Vue from 'vue'

export const nonZeroIntegerValidator = (rule, value, callback) => {
  if (!Vue.R_.isInteger(value)) {
    callback(new Error('请输入正整数'))
    return
  }
  const i = parseInt(value)
  if (i < 0) {
    callback(new Error('不能小于0'))
  }
  callback()
}

export const priceValidator = (rule, value, callback) => {
  if (value && !Vue.R_.isPrice(value)) {
    callback(new Error('请输入正数，最多2位小数'))
    return
  }
  callback()
}
