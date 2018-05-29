export const getTenantNameId = (arr) => {
  let resArr = arr.map((i) => {
    let merge = []
    merge.push(i.id)
    merge.push(i.nick_name)
    let str = merge.join('--')
    let data = {
      id: String(i.id),
      principal_name_id: str
    }
    return data
  })
  return resArr
}
export const getUserShowData = (data) => {
  let resData = {}
  if (data.user) {
    resData.id = data.user.id ? data.user.id : ''
    resData.logo = data.user.logo ? data.user.logo : ''
    resData.nickname = data.user.nickname ? data.user.nickname : ''
    resData.tenantNickName = data.user.tenant && data.user.tenant.nick_name ? data.user.tenant.nick_name : ''
    resData.mobile = data.user.mobile ? data.user.mobile : ''
    resData.ct = data.user.ct ? data.user.ct : ''
    resData.tid = data.user.tenant_id ? data.user.tenant_id : ''
  } else {
    resData.id = ''
    resData.logo = ''
    resData.nickname = ''
    resData.tenantNickName = ''
    resData.mobile = ''
    resData.ct = ''
    resData.tid = ''
  }
  return resData
}
export const getUserOrderDataList = (data) => {
  let arr = []
  if (data.order_stat) {
    let item = {
      recent_pay_tick: data.order_stat.recent_pay_tick ? data.order_stat.recent_pay_tick : '',
      total_amount: data.order_stat.total_amount ? data.order_stat.total_amount : '',
      total_count: data.order_stat.total_count ? data.order_stat.total_count : ''
    }
    arr = [item]
    return arr
  } else {
    return []
  }
}
export const showAppStatus = (row) => {
  let text = ''
  switch (row) {
    case 1:
      text = '审核中'
      break
    case 2:
      text = '已上线'
      break
    case 3:
      text = '已下线'
      break
    case 4:
      text = '解除授权'
      break
  }
  return text
}
export const showTenantStatus = (row) => {
  if (row === 1) {
    return '正常'
  }
  return '禁用'
}
export const showProductAuth = (row) => {
  let text = ''
  switch (row.product_auth) {
    case 1:
      text = '自营'
      break
    case 2:
      text = '选货'
      break
    case 3:
      text = '选货/自营'
  }
  return text
}
export const showDeliverytButtonName = (row) => {
  let text = ''
  switch (row.delivery_mode) {
    case 1:
      text = '结算后发货'
      break
    case 2:
      text = '实时发货'
      break
  }
  return text
}
export const showWithdrawBindButtonName = (row) => {
  let text = ''
  switch (row.delivery_mode) {
    case 1:
      text = '开启'
      break
    case 2:
      text = '关闭'
      break
  }
  return text
}
export const showMatrixButtonName = (row) => {
  let text = ''
  switch (row.tp) {
    case 1:
      text = '矩阵'
      break
    case 2:
      text = '非矩阵'
      break
  }
  return text
}
export const showErpBindButtonName = (row) => {
  if (row.erp_shop_id) {
    return row.erp_shop_id
  }
  return 'ERP未绑'
}

export const showQiyuBindButtonName = (row) => {
  if (row.qiyu_id) {
    return row.qiyu_id
  }
  return '七鱼号未绑'
}

export const isMchBind = (row) => {
  if (row.pay_service === 1) {
    if (row.sub_mch_id !== '') {
      return true
    }
  }
  if (row.pay_service === 2) {
    if (row.sp_sub_mch_id !== '') {
      return true
    }
  }
  return false
}

export const showMchBindButtonName = (row) => {
  if (isMchBind(row)) {
    if (row.pay_service === 1 && row.sub_mch_id) {
      return '微信' + row.sub_mch_id
    }
    if (row.pay_service === 2 && row.sp_sub_mch_id) {
      return '全付通' + row.sp_sub_mch_id
    }
  }
  return '商户号未绑'
}
