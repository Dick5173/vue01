import Vue from 'vue'
import Axios from 'axios'
import { UPDATE_ME } from 'src/store/types'
import * as CharacterAuthApi from './character-auth'

export const getMe = (config) => {
  return Axios.get('/admin/uc', {
    ignoreError: true
  }).then(async (res) => {
    Vue.$store.commit(UPDATE_ME, res.data)
    await CharacterAuthApi.getAuthGroup()
    return res
  })
}

export const updatePassword = ({old_passwd, new_passwd}) => {
  const params = {
    old_passwd,
    new_passwd
  }
  return Axios.post('/admin/uc/passwd', params)
}
