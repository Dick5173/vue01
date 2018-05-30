import Axios from 'axios/index'

export const getWalletWithdraw = (id, params) => {
  return Axios.get(`/admin/user/s/${id}/wallet/withdraw`, {
    params: params
  })
}

export const postWalletWithdraw = (id, params) => {
  return Axios.post(`/admin/user/s/${id}/wallet/withdraw`, params)
}

export const getWalletIncome = (id, params) => {
  return Axios.get(`/admin/user/s/${id}/wallet/income`, {
    params: params
  })
}

export const getWalletUse = (id, params) => {
  return Axios.get(`/admin/user/s/${id}/wallet/use`, {
    params: params
  })
}
