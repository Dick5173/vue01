import Axios from 'axios'
import Qs from 'qs'

export const login = (params) => {
  return Axios.post('/a/pub/login', Qs.stringify(params))
    .then(res => {
      return res
    })
}

export const logout = () => {
  return Axios.get('/a/pub/logout')
    .then(res => {
      return res
    })
}
