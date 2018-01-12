import Axios from 'axios'

export const getList = () => {
  return Axios.get(`/admin/service_tag`)
}
