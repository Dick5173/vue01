import Axios from 'axios/index'
import * as wallet from 'src/service/wallet'

export const getWalletWithdraw = (id, params) => {
  return Axios.get(`/admin/user/s/${id}/wallet/withdraw`, {
    params: params
  })
}

export const postWalletWithdraw = (id, params) => {
  const formData = wallet.coverFormToParam(params)
  return Axios.post(`/admin/user/s/${id}/wallet/withdraw`, formData)
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
