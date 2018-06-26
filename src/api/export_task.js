import axios from 'axios'

export const getList = (tp, params) => {
  return axios.get(`/admin/export_task/tp/${tp}`, {
    params: params
  })
}
