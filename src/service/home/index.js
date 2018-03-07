export const getList = (data) => {
  let arr = []
  let sales = {
    name: '销售额',
    today_data: getShowPrice(data.today_sale_self + data.today_sale_platform),
    yesterday_data: getShowPrice(data.yesterday_sale_self + data.yesterday_sale_platform),
    month_data: getShowPrice(data.month_sale_self + data.month_sale_platform),
    pre_month_data: getShowPrice(data.pre_month_sale_self + data.pre_month_sale_platform),
    all_data: getShowPrice(data.all_sale_self + data.all_sale_platform)
  }
  let platformProportion = {
    name: '平台供货比',
    today_data: getShowPercentage(data.today_sale_platform / (data.today_sale_self + data.today_sale_platform)),
    yesterday_data: getShowPercentage(data.yesterday_sale_platform / (data.yesterday_sale_self + data.yesterday_sale_platform)),
    month_data: getShowPercentage(data.month_sale_platform / (data.month_sale_self + data.month_sale_platform)),
    pre_month_data: getShowPercentage(data.pre_month_sale_platform / (data.pre_month_sale_self + data.pre_month_sale_platform)),
    all_data: getShowPercentage(data.all_sale_platform / (data.all_sale_self + data.all_sale_platform))
  }
  let platform = {
    name: '平台供货款',
    today_data: getShowPrice(data.today_supply_price_platform),
    yesterday_data: getShowPrice(data.yesterday_supply_price_platform),
    month_data: getShowPrice(data.month_supply_price_platform),
    pre_month_data: getShowPrice(data.pre_month_supply_price_platform),
    all_data: getShowPrice(data.all_supply_price_platform)
  }
  let user = {
    name: '交易用户数',
    today_data: getShowCount(data.today_pay_user_count),
    yesterday_data: getShowCount(data.yesterday_pay_use_count),
    month_data: getShowCount(data.month_pay_user_count),
    pre_month_data: getShowCount(data.pre_month_pay_user_count),
    all_data: getShowCount(data.all_pay_user_count)
  }
  arr = [sales, platformProportion, platform, user]
  return arr
}
export const getShowCount = (num) => {
  if (num < 10000) {
    return `${num}`
  } else if (num > 100000000) {
    return `${(num / 100000000).toFixed(2)}亿`
  } else {
    return `${(num / 10000).toFixed(2)}万`
  }
}

export const getShowPrice = (num) => {
  let val = num * 1.0 / 100
  if (val < 10000) {
    return `¥${val}`
  } else if (val > 100000000) {
    return `¥${(val / 100000000).toFixed(2)}亿`
  } else {
    return `¥${(val / 10000).toFixed(2)}万`
  }
}
export const getShowPercentage = (num) => {
  if (num) {
    return `${(num * 100).toFixed(2)}%`
  }
  return ''
}
