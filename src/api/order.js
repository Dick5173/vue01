import Axios from 'axios'
import { date } from '../filter/datetime'

export const orderList = (tid, params) => {
  let myParams = {}
  if (parseInt(params.start_time) > 0) {
    myParams.start_time = date(parseInt(params.start_time))
  } else {
    myParams.start_time = ''
  }
  if (parseInt(params.end_time) > 0) {
    myParams.end_time = date(parseInt(params.end_time))
  } else {
    myParams.end_time = ''
  }
  myParams.status = params.status
  myParams.prod = params.prod
  myParams.user = params.user
  myParams.buyer = params.buyer
  myParams.dev_no = params.dev_no
  myParams.page = params.page
  myParams.limit = params.limit
  return Axios.get(`/admin/order`, {params: myParams})
}

export const orderDetail = (tid, oid) => {
  return Axios.get(`/admin/order/s/${oid}`)
}

export const orderItems = (tid, oid) => {
  return Axios.get(`/admin/oi/s/${oid}`)
}

export const getExpress = (tid, oid) => {
  return Axios.get(`/admin/order/s/${oid}/express`)
}

export const getOiExpress = (tid, oid) => {
  return Axios.get(`/admin/order/s/${oid}/express`)
}
