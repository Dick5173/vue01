import Axios from 'axios'

export const getOssToken = () => {
  return Axios.get(`/admin/aliyun/oss/token`)
}
