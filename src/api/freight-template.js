import Axios from 'axios'
import * as FreightService from '../service/freight-template'

export const getList = () => {
  return Axios.get(`/admin/freight_template`)
}
export const getItem = (id) => {
  return Axios.get(`/admin/freight_template/s/${id}`)
}
export const create = (formData) => {
  const params = FreightService.convertFormToParam(formData)
  return Axios.post(`/admin/freight_template`, params)
}
export const update = (id, formData) => {
  const params = FreightService.convertFormToParam(formData)
  return Axios.post(`/admin/freight_template/s/${id}`, params)
}
export const deleteItem = (id) => {
  return Axios.delete(`/admin/freight_template/s/${id}`)
}
