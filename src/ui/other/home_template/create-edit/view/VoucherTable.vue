<template lang="pug">
  div.voucher-cell
    div.error-content-out(v-if="isErrorItem")
      div.error-content {{isErrorItem}}
    div(v-else)
      smart-table(:dataList.sync="dataList", border)
        smart-table-column(type="drag")
        smart-table-column(label="优惠券名称", width="90px")
          template(slot-scope="scope")
            div(:class="{empty: itemEmpty(scope.row)}") {{showName(scope.row)}}
        smart-table-column(label="面值", width="80px")
          template(slot-scope="scope")
            div(:class="{empty: itemEmpty(scope.row)}") {{showPrice(scope.row)}}
        smart-table-column(label="门槛", width="80px")
          template(slot-scope="scope")
            div(:class="{empty: itemEmpty(scope.row)}") {{showReduce(scope.row)}}
        smart-table-column(label="发券活动")
          template(slot-scope="scope")
            div(:class="{empty: itemEmpty(scope.row)}") {{showActName(scope.row)}}
        smart-table-column(width="120px")
          template(slot-scope="scope")
            el-button(style="width:100px; margin-left:0", type="primary", plain, size="small", v-clipboard:copy="getAppUrl(scope.row)", v-clipboard:success="onCopy", v-clipboard:error="onError", :disabled="itemEmpty(scope.row)") 小程序链接
            el-button(style="width:100px; margin-left:0; margin-top:5px", type="primary", plain, size="small", @click="handleQrItem(scope.row)", :disabled="itemEmpty(scope.row)") 小程序码
            el-button(style="width:100px; margin-left:0; margin-top:5px", type="danger", size="small", @click="handleDeleteItem(scope.index)") 删除
    <!--minprog-qr(ref="dlgMinprogQr")-->
</template>

<script>
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import { convertFenToYuan } from 'src/util/money'
  // import MinprogQr from 'src/ui/common/minprog_qr/Index'

  export default {
    components: {
      SmartTable,
      SmartTableColumn
      // MinprogQr
    },
    watch: {
      queryParams (val) {
        this.dataList = val
      },
      dataList: {
        handler (val) {
          this.$emit('update:queryParams', val)
        },
        deep: true
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
        dataList: this.queryParams
      }
    },
    computed: {
      isErrorItem () {
        if (!this.dataList || this.dataList.length === 0) {
          return '优惠券缺失'
        }
        return null
      }
    },
    methods: {
      getAppUrl (row) {
        if (!this.itemEmpty(row)) {
          return `pages/coupon/couponDetail?aid=${row.voucher_activ_item.id}&isShare=1`
        } else {
          return null
        }
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
        return !row.voucher_activ_item || !row.voucher_activ_item.voucher
      },
      showName (row) {
        if (!this.itemEmpty(row)) {
          return row.voucher_activ_item.voucher.name
        }
        return '优惠券活动已停止'
      },
      showPrice (row) {
        if (!this.itemEmpty(row)) {
          return `¥${convertFenToYuan(row.voucher_activ_item.voucher.reduce_num)}`
        }
        return 'N/A'
      },
      showReduce (row) {
        if (!this.itemEmpty(row)) {
          return `¥${convertFenToYuan(row.voucher_activ_item.voucher.full_num)}`
        }
        return 'N/A'
      },
      showActName (row) {
        if (row.voucher_activ_item && row.voucher_activ_item.voucher_activ) {
          return row.voucher_activ_item.voucher_activ.name
        }
        return 'N/A'
      },
      handleQrItem (row) {
        if (this.itemEmpty(row)) {
          this.$message({
            message: '获取小程序码错误',
            type: 'error'
          })
          return
        }
        this.$refs.dlgMinprogQr.show('小程序码', '', 'pages/coupon/couponDetail', `aid_${row.voucher_activ_item.id}*ss_1`)
      },
      handleDeleteItem (index) {
        this.dataList.splice(index, 1)
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
