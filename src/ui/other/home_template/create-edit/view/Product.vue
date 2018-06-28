<template lang="pug">
  div.pro-cell
    div.error-content-out(v-if="isErrorItem")
      div.error-content {{isErrorItem}}
    div(v-else)
      smart-table(:dataList.sync="products", :showHeader="false", border)
        smart-table-column(type="drag")
        smart-table-column(label="商品")
          div.product-item(slot-scope="props")
            div.product-name.single-line(@click="showProductDetail(props.row)") {{ props.row.name}}
        smart-table-column(label="操作", width="200px")
          div(slot-scope="props")
            el-button(type="primary", plain, size="small", v-clipboard:copy="getAppUrl(props.row)", v-clipboard:success="onCopy", v-clipboard:error="onError") 小程序链接
            el-button(type="danger", size="small", @click="handleDeleteItem(props.index)") 删除
      product-detail-dialog(ref="dlgProductDetail")
</template>

<script>
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import ProductDetailDialog from 'src/ui/common/ProductDetail/ProductDetailDialog.vue'

  export default {
    components: {
      SmartTable,
      SmartTableColumn,
      ProductDetailDialog
    },
    props: {
      value: null
    },
    data () {
      return {
        products: this.value
      }
    },
    computed: {
      isErrorItem () {
        return (!this.products || this.products.length === 0) ? '商品缺失' : null
      }
    },
    watch: {
      value (val) {
        this.products = val
      },
      products (val) {
        this.$emit('input', val)
      }
    },
    methods: {
      getAppUrl (row) {
        return `pages/goods/detail?pid=${row.id}`
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
      handleDeleteItem (index) {
        this.products.splice(index, 1)
      },
      showProductDetail (row) {
        this.$refs.dlgProductDetail.show(row, true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pro-cell {

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


    .product-name {
      font-size: $home-size-title;
      color: $color-primary;
      cursor: pointer;
    }
  }

</style>
