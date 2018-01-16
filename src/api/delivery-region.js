import Axios from 'axios'

export const getList = () => {
  return Axios.get(`/admin/delivery/region/`)
}
export const getItem = (id) => {
  return Axios.get(`/admin/delivery/region/${id}`)
}
export const createItem = (formData) => {
  return Axios.post(`/admin/delivery/region/`, formData)
}
export const editIem = (formData) => {
  return Axios.post(`/admin/delivery/region/${formData.id}`, formData)
}
export const deleteItem = (id) => {
  return Axios.delete(`/admin/delivery/region/${id}`)
}
