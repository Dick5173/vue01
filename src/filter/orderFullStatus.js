import * as OrderUtil from '../service/order/orderUtil'
const orderStatus = {
  1: '待付款',
  2: '已关闭',
  3: '待发货',
  4: '已发货',
  5: '已完成',
  6: '已退款'
}

export default order => {
  if (order.status === 3) {
    if (OrderUtil.checkPartDeliver(order)) {
      return '部分发货'
    } else if (order.tp === 2 && order.buy_group_record_status === 2) {
      return '待成团'
    }
  }
  return orderStatus[order.status]
}
