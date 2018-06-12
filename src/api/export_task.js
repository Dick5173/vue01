import axios from 'axios'

export const getList = (tid, params) => {
  return axios.get(`/admin/export_task`, {
    params: params
  })
}
