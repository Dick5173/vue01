<template lang="pug">
  div
    el-table.small-el-table(:data="dataList", border, :show-header="false")
      el-table-column(label="等级" )
        template(slot-scope="props")
          div {{props.row.tenant_level.name}}
      el-table-column(label="价格")
        template(slot-scope="props")
          div.supply-price
            div {{ supplyPrice(dataPrice, props.row)}}
            div.input-right-desc 元
</template>

<script>
  import * as ProductSer from 'src/service/product/index'

  export default {
    props: {
      dataList: {
        type: Array,
        default () {
          return []
        }
      },
      dataPrice: String,
      skus: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
      }
    },
    methods: {
      supplyPrice (price, row) {
        return ProductSer.supplyPrice(price, this.skus, row.tenant_level.name)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .supply-price {
    display: flex;
  }
</style>
