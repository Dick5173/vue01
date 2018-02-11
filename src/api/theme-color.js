import Axios from 'axios'

export const getColorList = () => {
  return Axios.get(`/admin/theme_color`)
}
export const createThemeColor = (formData) => {
  return Axios.post(`/admin/theme_color`, formData)
}
export const editThemeColor = (formData) => {
  return Axios.post(`/admin/theme_color/s/${formData.id}`, formData)
}
export const deleteThemeColor = (id) => {
  return Axios.delete(`/admin/theme_color/s/${id}`)
}
export const sortThemeColor = (colorList) => {
  return Axios.post(`/admin/sort/theme_color`, {val: colorList || []})
}
