import Vue from 'vue'
import Axios from 'axios'
import { UPDATE_ME } from 'src/store/types'

export const getMe = (config) => {
  return Axios.get('/admin/uc', {
    ignoreError: true
  }).then(res => {
    Vue.$store.commit(UPDATE_ME, res.data)
    return res
  })
}

export const updatePassword = ({old_password, new_password}) => {
  const params = {
    old_password,
    new_password
  }
  return Axios.post('/admin/uc/password', params)
}
