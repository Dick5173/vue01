import Axios from 'axios'

export const getList = (params) => {
  return Axios.get('/a/Product', {
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
  return Axios.post('/a/Product', {...form})
}

export const update = (id, form) => {
  return Axios.post(`/a/Product/${id}`, {...form})
}
