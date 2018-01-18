import Axios from 'axios'

export const getTagGroup = () => {
  return Axios.get(`/admin/tag_group`)
}
export const createTagGroup = (formData) => {
  return Axios.post(`/admin/tag_group`, formData)
}
export const editTagGroup = (formData) => {
  return Axios.post(`/admin/tag_group/${formData.id}`, formData)
}
export const createTag = (formData) => {
  return Axios.post(`/admin/tag/`, formData)
}
export const editTag = (formData) => {
  return Axios.post(`/admin/tag/${formData.id}`, formData)
}
export const deleteTagGroup = (row) => {
  return Axios.delete(`/admin/tag_group/${row.id}`)
}
export const deleteTag = (row) => {
  return Axios.delete(`/admin/tag/${row.id}`)
}
