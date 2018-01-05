import R_ from 'src/util/R_'

export const price = (val, showSymbol = true) => {
  const lessZero = val < 0
  return `${lessZero ? '-' : ''}${showSymbol ? '¥' : ''}${R_.convertFenToYuan(Math.abs(val))}`
}
