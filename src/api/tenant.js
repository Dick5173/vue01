import Axios from 'axios'

export const getList = (params) => {
  return Axios.get('/admin/tenant', {
    params: params
  })
}
