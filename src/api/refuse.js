import Axios from 'axios'
import qs from 'qs'
import {date} from '../filter/datetime'

export const refuseList = (tid, params) => {
  let myParams = {}
  if (parseInt(params.start) > 0) {
    myParams.start = date(parseInt(params.start))
  } else {
    myParams.start = ''
  }
  if (parseInt(params.end) > 0) {
    myParams.end = date(parseInt(params.end))
  } else {
    myParams.end = ''
  }
  myParams.prod = params.prod
  myParams.prod_tp = params.prod_tp
  myParams.refund_status = params.refund_status
  myParams.tenant_id = params.tenant_id
  myParams.page = params.page
  myParams.limit = params.limit
  return Axios.get(`/admin/oi/refund`, {params: myParams})
}

export const agree = (tid, id, amount, txt, total, remark) => {
  return Axios.post(`admin/oi/s/${id}/agree`,
    qs.stringify({txt: txt, amount: amount, total: total, remark: remark}))
}

export const reject = (tid, id, txt, remark) => {
  return Axios.post(`admin/oi/s/${id}/refuse`,
    qs.stringify({txt: txt, remark: remark}))
}

export const reply = (tid, id, txt, remark) => {
  return Axios.post(`admin/oi/s/${id}/reply`,
    qs.stringify({txt: txt, remark: remark}))
}

export const refuseCount = () => {
  return Axios.get('admin/oi/refund/count')
}

export const refundToWx = (tid, id) => {
  return false
}
