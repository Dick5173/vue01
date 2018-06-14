'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  REFUND_SPAN:  '1000 * 60 * 30', // 30分钟
  RELEASE_ENV: '"beta"'
})
