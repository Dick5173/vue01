<template lang="pug">
  div.list-wrapper
    el-table(:data="dataList.data", border, row-key="id")
      el-table-column(label="订单信息")
        template(slot-scope="scope")
          div.info-wrapper
            div.icon-wrapper(v-lazy:background-image="showIcon(scope.row)")
            div.desc-wrapper
              div 订单号：{{scope.row.ocode}}
              div {{scope.row.name}}
              div 规格：{{scope.row.spec}}
              div {{scope.row.price | price}} X {{scope.row.count}}
      el-table-column(label="收货信息")
        template(slot-scope="scope")
          div(v-if="scope.row.order_addr")
            div {{scope.row.order_addr.name}} {{scope.row.order_addr.mobile}}
            div {{scope.row.order_addr.province}}{{scope.row.order_addr.city}}{{scope.row.order_addr.district}}{{scope.row.order_addr.town}}{{scope.row.order_addr.address}}
      el-table-column(label="退款状态", width="200")
        template(slot-scope="scope")
          div
            el-button(size="mini", @click="goDetail(scope.row)") {{buttonText(scope.row)}}
          div(v-if="lastRemark(scope.row)") {{lastRemark(scope.row)}}
</template>

<script>
  import {refundBtnText} from '../../../manager/refund/refund'

  export default {
    components: {},
    props: {
      dataList: {}
    },
    data () {
      return {}
    },
    computed: {},
    methods: {
      showIcon (row) {
        if (row.product && row.product.cover) {
          return row.product.cover.url
        } else if (row.product.head && row.product.head.length > 0) {
          return row.product.head[0].url
        }
        return ''
      },
      buttonText (orderItem) {
        return refundBtnText(orderItem)
      },
      lastRemark (orderItem) {
        const rp = orderItem.refund || []
        if (rp.length > 0) {
          return rp[0].sys_remark
        }
        return ''
      },
      goDetail (row) {
        this.$router.push({
          name: 'OrderRefundDetail',
          params: {
            id: row.order_id,
            oiid: row.id
          },
          query: {
            refund: true
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-wrapper {
    margin-top: 20px;

    .info-wrapper {
      display: flex;
      padding-top: 8px;
      padding-bottom: 8px;

      .icon-wrapper {
        width: 60px;
        height: 60px;
        background-size: cover;
        margin-right: 10px;
      }

      .desc-wrapper {
        flex: 1;

      }
    }
  }
</style>
