import Axios from 'axios/index'

export const getList = (params) => {
  return Axios.get('/admin/minprog_application', {
    params: params
  })
}
