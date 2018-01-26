import Axios from 'axios'

export const getList = (params) => {
  return Axios.get('/admin/tenant', {
    params: params
  })
}
export const getListAll = () => {
  return Axios.get(`/admin/tenant/all`)
}
