const R = require('ramda')

// 加法
// eslint-disable-next-line
Number.prototype.add = function (arg) {
  let r1, r2, m
  try {
    r1 = this.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (this * m + arg * m) / m
}

// 减法
// eslint-disable-next-line
Number.prototype.sub = function (arg) {
  return this.add(-arg)
}

// 乘法
// eslint-disable-next-line
Number.prototype.mul = function (arg) {
  let m = 0
  let s1 = this.toString()
  let s2 = arg.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

// 除法
// eslint-disable-next-line
Number.prototype.div = function (arg) {
  let t1 = 0
  let t2 = 0
  let r1
  let r2
  try {
    t1 = this.toString().split('.')[1].length
  } catch (e) {}
  try {
    t2 = arg.toString().split('.')[1].length
  } catch (e) {}
  r1 = Number(this.toString().replace('.', ''))
  r2 = Number(arg.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/**
 * 接收一个函数和两个对象，遍历第一个对象的key, 优先进行函数处理，如果没有处理，判断第二个对象有key，则拷贝向第一个对象
 *
 * @func
 * @memberOf R_
 * @category Object
 * @param {Function} fn 要调用的函数，接收三个参数: `key`, `l`, `r`.
 * @param {Object} l 源对象
 * @param {Object} r 要对其附值的对象
 * @return {Object} 已附值的对象
 */
const updateWithObjCustom = R.curry((fn, l, r) => {
  let copyObj = {...l}
  R.forEachObjIndexed((value, key, obj) => {
    if (fn) {
      if (!fn(key, copyObj, r)) {
        if (r.hasOwnProperty(key) && R.not(R.isEmpty(R.prop(key)(r)))) {
          copyObj[key] = R.prop(key)(r)
        }
      }
    } else {
      if (r.hasOwnProperty(key) && R.not(R.isEmpty(R.prop(key)(r)))) {
        copyObj[key] = R.prop(key)(r)
      }
    }
  })(l)
  return copyObj
})

/**
 * 接收两个对象，遍历第一个对象的key, 如果第二个对象有key，则拷贝互第一个对象
 *
 * @func
 * @memberOf R_
 * @category Object
 * @param {Object} l 源对象
 * @param {Object} r 要对其附值的对象
 * @return {Object} 已附值的对象
 */
const updateWithObj = R.curry((l, r) => {
  return updateWithObjCustom(null, l, r)
})

/**
 * 接收两个参数，第一参数，表示转换数字失败时返回的数字，第二个参数表示要转换的数字
 *
 * @func
 * @memberOf R_
 * @category Object
 * @param {int} defaultVal 表示转换数字失败时返回的数字
 * @param {int} val 表示要转换的数字
 * @return {int} 转换的结果
 */
const parseInteger = R.curry((defaultVal, val) => {
  if (R.isNil(val)) {
    return defaultVal
  }
  const reg = /^\s*-?\d+$\s*/
  if (reg.test(val)) {
    return parseInt(val)
  } else {
    return defaultVal
  }
})

/**
 * 接收两个参数，第一参数，表示转换时间失败时返回的数字，第二个参数表示要转换的时间字符串
 *
 * @func
 * @memberOf R_
 * @category Object
 * @param {int} defaultVal 表示转换数字失败时返回的时间tick
 * @param {int} val 表示要转换的时间字符串
 * @return {int} 转换的结果
 */
const parseDateTick = R.curry((defaultVal, val) => {
  const date = new Date(val)
  if (!date) {
    return 0
  }
  return date.getTime()
})

/**
 * 元到分转换
 */
const convertYuanToFen = R.curry((val) => {
  return parseFloat(val).mul(100)
})

/**
 * 分到元转换
 */
const convertFenToYuan = R.curry((val) => {
  return parseFloat(val).div(100)
})

const R_ = {
  updateWithObjCustom,
  updateWithObj,
  parseInteger,
  parseDateTick,
  convertYuanToFen,
  convertFenToYuan
}

export default R_
