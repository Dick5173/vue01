import Axios from 'axios'

export const getTemplateList = (formData) => {
  return Axios.get(`/admin/min_page/home/tmpl`, {
    params: formData
  })
}

export const getTmplDetail = (id) => {
  return Axios.get(`/admin/min_page/home/tmpl/s/${id}`)
}

export const createTmpl = (formData) => {
  return Axios.post(`/admin/min_page/home/tmpl`, formData)
}

export const updateTmpl = (id, formData) => {
  return Axios.post(`/admin/min_page/home/tmpl/s/${id}`, formData)
}



export const getList = () => {
  return Axios.get(`/admin/page/home`)
}
export const update = (formData) => {
  return Axios.post(`/admin/page/home`, formData)
}

export const getMinPageList = () => {
  return Axios.get(`/admin/min_page/home`)
}

export const updateMinPage = (formData) => {
  return Axios.post(`/admin/min_page/home`, formData)
}

export const getMicroPageList = (formData) => {
  return Axios.get(`/admin/min_page`, {
    params: formData
  })
}

export const getMicroPageDetail = (id) => {
  return Axios.get(`/admin/min_page/s/${id}`)
}

export const createMicroPage = (formData) => {
  return Axios.post(`/admin/min_page`, formData)
}

export const updateMicroPage = (id, formData) => {
  return Axios.post(`/admin/min_page/s/${id}`, formData)
}

export const deleteMicroPage = (id) => {
  return Axios.delete(`/admin/min_page/s/${id}`)
}
