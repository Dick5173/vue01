import Axios from 'axios'

export const getTenantSelfList = (params) => {
  return Axios.get(`/admin/product/tenant/self`, {
    params: params
  })
}
