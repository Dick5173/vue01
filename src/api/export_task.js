import axios from 'axios'

export const getList = (params) => {
  return axios.get(`/admin/export_task/tp/${params.tp}`, {
    params: params
  })
}
