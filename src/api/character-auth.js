import Axios from 'axios'
import * as AuthService from 'src/service/character-auth/index'
import { UPDATE_ROLES } from 'src/store/types'
import Vue from 'vue'
import * as R from 'ramda'

export const getTenantRoleList = () => {
  return Axios.get(`/admin/sys_role`)
}
export const deleteTenantRole = (id) => {
  return Axios.delete(`/admin/sys_role/s/${id}`)
}
export const getTenantRoleItem = (id) => {
  return Axios.get(`/admin/sys_role/s/${id}`)
}
export const getAuthGroup = () => {
  return Axios.get(`/admin/auth_group`, {
    params: {
      tp: 1
    }
  }).then(res => {
    const items = []
    R.forEach((parent) => {
      if (parent.children && parent.children.length > 0) {
        R.forEach(child => {
          R.forEach(auth => {
            auth.parent_name = child.name
            items.push(auth)
          })(child.auths || [])
        })(parent.children || [])
      } else {
        R.forEach(auth => {
          auth.parent_name = parent.name
          items.push(auth)
        })(parent.auths || [])
      }
    })(res.data.data || [])
    Vue.$store.commit(UPDATE_ROLES, items || [])
    return res
  })
}
export const editTenantRole = (formData) => {
  const params = AuthService.convertFormToParam(formData)
  return Axios.post(`/admin/sys_role/s/${formData.id}`, params)
}
export const createTenantRole = (formData) => {
  const params = AuthService.convertFormToParam(formData)
  return Axios.post(`/admin/sys_role`, params)
}
