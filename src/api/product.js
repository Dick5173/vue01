import Axios from 'axios'
import * as ProductService from 'src/service/product'

export const getList = (params) => {
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
  return Axios.get(`/a/Product/${id}`)
}

export const create = (form) => {
  const params = ProductService.convertFromToParam(form)
  return Axios.post('/admin/product', params)
}

export const update = (id, form) => {
  return Axios.post(`/a/Product/${id}`, {...form})
}
