import Vue from 'vue'
import Axios from 'axios'
import { UPDATE_ME } from 'src/store/types'

export const login = (params) => {
  return Axios.post('/admin/pub/login', params)
    .then(res => {
      Vue.$store.commit(UPDATE_ME, res.data)
      return res
    })
}

export const logout = () => {
  return Axios.get('/admin/pub/logout')
    .then(res => {
      Vue.$store.commit(UPDATE_ME, null)
      return res
    })
}
