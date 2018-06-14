import Axios from 'axios'
import qs from 'qs'

export const getList = (params) => {
  return Axios.get('/admin/tenant', {
    params: params
  })
}
export const getListAll = () => {
  return Axios.get(`/admin/tenant/all/name`)
}
export const getDetail = (id) => {
  return Axios.get(`/admin/tenant/s/${id}`)
}
export const getBasic = (id) => {
  return Axios.get(`/admin/tenant/s/${id}/basic`)
}
export const disableTenant = (id) => {
  return Axios.post(`/admin/tenant/s/${id}/disable`)
}
export const enableTenant = (id) => {
  return Axios.post(`/admin/tenant/s/${id}/enable`)
}
export const refundAuthAgree = (id) => {
  return Axios.post(`/admin/tenant/s/${id}/refund/auth/agree`)
}
export const getTenantProductList = (id, params) => {
  return Axios.get(`/admin/tenant/s/${id}/product`, {
    params: params
  })
}
export const getTenantProductDetail = (tid, pid) => {
  return Axios.get(`/admin/tenant/s/${tid}/product/ps/${pid}`)
}
export const bindChildTenant = (tid, formData) => {
  return Axios.post(`/admin/tenant/s/${tid}/mch/bind`, formData)
}
export const changeProductAuth = (tid, formData) => {
  return Axios.post(`/admin/tenant/s/${tid}/product/auth`, qs.stringify(formData))
}

export const bindErpShopId = (tid, formData) => {
  return Axios.post(`/admin/tenant/s/${tid}/erp/bind`, formData)
}

export const bindQiyu = (tid, formData) => {
  return Axios.post(`/admin/tenant/s/${tid}/qiyu/bind`, formData)
}

export const hidePowerInfo = (tid) => {
  return Axios.post(`/admin/tenant/s/${tid}/info/hide`)
}

export const showPowerInfo = (tid) => {
  return Axios.post(`/admin/tenant/s/${tid}/info/show`)
}

export const updateTenantLevel = (tid, formData) => {
  return Axios.post(`/admin/tenant/s/${tid}/level`, qs.stringify(formData))
}

export const getTenantLevelList = (params) => {
  return Axios.get(`/admin/tenant_level`)
}
export const postDilvery = (tid, formData) => {
  return Axios.post(`/admin/tenant/s/${tid}/delivery/mode`, qs.stringify(formData))
}

export const settleBill = (billId) => {
  return Axios.post(`/admin/bill/s/${billId}/settle`)
}
export const postMartix = (tid) => {
  return Axios.post(`/admin/tenant/s/${tid}/tp/matrix`)
}
export const postNonMartix = (tid) => {
  return Axios.post(`/admin/tenant/s/${tid}/tp/non_matrix`)
}
export const postRefresh = (tid) => {
  return Axios.post(`/admin/tenant/s/${tid}/info/refresh`)
}
export const postWithdrawOperate = (tid, operate) => {
  return Axios.post(`/admin/tenant/s/${tid}/withdraw/${operate}`)
}
export const postWithHidden = (tid) => {
  return Axios.post(`/admin/tenant/s/${tid}/hide`)
}
export const postWithDisplay = (tid) => {
  return Axios.post(`/admin/tenant/s/${tid}/display`)
}
