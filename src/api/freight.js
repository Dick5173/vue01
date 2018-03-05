import Axios from 'axios'
import * as FreightService from '../service/freight'

export const getList = () => {
  return Axios.get(`/admin/freight`)
}
export const getItem = (id) => {
  return Axios.get(`/admin/freight/s/${id}`)
}
export const create = (formData) => {
  const params = FreightService.convertFormToParam(formData)
  return Axios.post(`/admin/freight`, params)
}
export const update = (id, formData) => {
  const params = FreightService.convertFormToParam(formData)
  return Axios.post(`/admin/freight/s/${id}`, params)
}
export const deleteItem = (id) => {
  return Axios.delete(`/admin/freight/s/${id}`)
}
