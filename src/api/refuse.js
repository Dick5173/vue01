import Axios from 'axios'
import qs from 'qs'
import * as Refund from 'src/service/refund/refund'

export const refuseList = (params) => {
  const myParams = Refund.coverSearchFormToParam(params)
  return Axios.get(`/admin/oi/refund`, {params: myParams})
}

export const agree = (id, amount, txt, total, remark, isRefundVoucher) => {
  return Axios.post(`/admin/oi/s/${id}/agree`,
    qs.stringify({txt: txt, amount: amount, total: total, remark: remark, is_refund_voucher: isRefundVoucher}), {
      fullError: true
    })
}

export const reject = (id, txt, remark) => {
  return Axios.post(`/admin/oi/s/${id}/refuse`,
    qs.stringify({txt: txt, remark: remark}))
}

export const reply = (id, txt, remark) => {
  return Axios.post(`/admin/oi/s/${id}/reply`,
    qs.stringify({txt: txt, remark: remark}))
}

export const refuseCount = () => {
  return Axios.get('/admin/oi/refund/count')
}

export const refundToWx = (id) => {
  return Axios.post(`/admin/oi/s/${id}/refund/to/weixin`, null, {
    fullError: true
  })
}
