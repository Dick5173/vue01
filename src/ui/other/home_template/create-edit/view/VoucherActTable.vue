<template lang="pug">
  div.voucher-cell
    div.error-content-out(v-if="isErrorItem")
      div.error-content {{isErrorItem}}
    div(v-else)
      el-table(:data="voucherActs", :showHeader="false", border)
        el-table-column
          template(slot-scope="scope")
            div(:class="{empty: itemEmpty(scope.row)}") {{showName(scope.row)}}
        el-table-column(width="120px")
          template(slot-scope="scope")
            el-button(style="width:100px; margin-left:0", type="primary", plain, size="small", v-clipboard:copy="getAppUrl(scope.row)", v-clipboard:success="onCopy", v-clipboard:error="onError", :disabled="itemEmpty(scope.row)") 小程序链接
            el-button(style="width:100px; margin-left:0; margin-top:5px", type="primary", plain, size="small", @click="handleQrItem(scope.row)", :disabled="itemEmpty(scope.row)") 小程序码
    minprog-qr(ref="dlgMinprogQr")
</template>

<script>
  import MinprogQr from 'src/ui/common/minprog_qr/Index'

  export default {
    components: {
      MinprogQr
    },
    watch: {
      queryParams (val) {
        this.voucherActs = val
      }
    },
    props: {
      queryParams: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        voucherActs: this.queryParams
      }
    },
    computed: {
      isErrorItem () {
        // TODO
        return null
      }
    },
    methods: {
      getAppUrl (row) {
        if (!this.itemEmpty(row)) {
          return `pages/coupon/couponShareList?id=${row.voucher_activ.id}&isShare=1`
        }
        return null
      },
      onError () {
        this.$message({
          type: 'danger',
          message: '复制失败'
        })
      },
      onCopy () {
        this.$message({
          type: 'success',
          message: '已复制小程序链接到剪贴板'
        })
      },
      itemEmpty (row) {
        return !row.voucher_activ
      },
      showName (row) {
        if (!this.itemEmpty(row)) {
          return row.voucher_activ.name
        }
        return '优惠券活动已停止'
      },
      handleQrItem (row) {
        if (this.itemEmpty(row)) {
          this.$message({
            message: '获取小程序码错误',
            type: 'error'
          })
          return
        }
        this.$refs.dlgMinprogQr.show('小程序码', '', 'pages/coupon/couponShareList', `id_${row.voucher_activ.id}*ss_1`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .voucher-cell {

    .error-content-out {
      border: 1px solid #d6d6d6;
      width: 100%;
      height: 90px;

      .error-content {
        margin: 10px;
        flex: 1;
        line-height: 70px;
        background: #E7F6FD;
        color: #98CAE1;
        font-size: 16px;
        text-align: center;
      }
    }

    .empty {
      color: #F26065;
    }

    .product-name {
      font-size: $home-size-title;
      color: $color-primary;
      cursor: pointer;
    }
  }
</style>
