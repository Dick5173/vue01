import Axios from 'axios'
import * as ProductService from 'src/service/product'

export const getList = (params) => {
  console.log('params', params)
  return Axios.get('/admin/product', {
    params: params
  })
}

export const checkExist = (params) => {
  return Axios.head('/a/Product', {
    params: params,
    ignoreError: true
  })
}

export const getItem = (id) => {
  return Axios.get(`/admin/product/s/${id}`)
}

export const create = (form) => {
  const params = ProductService.convertFormToParam(form)
  return Axios.post('/admin/product', params)
}

export const update = (id, form) => {
  const params = ProductService.convertFormToParam(form)
  return Axios.post(`/admin/product/s/${id}`, params)
}
export const shelveUp = (id) => {
  return Axios.post(`/admin/product/s/${id}/up`)
}
export const shelveDown = (id) => {
  return Axios.delete(`/admin/product/s/${id}/up`)
}
export const top = (id) => {
  return Axios.post(`/admin/product/s/${id}/top`)
}
export const cancelTop = (id) => {
  return Axios.delete(`/admin/product/${id}/top`)
}
export const deleteProduct = (id) => {
  return Axios.post(`/admin/product/s/${id}/trash`)
}
export const batchCategory = (formData) => {
  return Axios.post(`/admin/batch/product/category`, formData)
}
export const batchChangeTags = (fomData) => {
  return Axios.post(`/admin/batch/product/tags`, fomData)
}
export const batchShelveDown = (arr) => {
  let formData = {
    pids: arr
  }
  return Axios.delete(`/admin/batch/product/up`, formData)
}
