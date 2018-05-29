<template lang="pug">
  div
    el-table.small-el-table(:data="filterDataList", border, :show-header="false")
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
        required: true
      },
      dataPrice: String,
      skus: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        newData: [],
        formRules: {
          supply_price: [
            // {required: true, message: '不能为空', trigger: 'blur'},
            // {validator: priceValidator, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      filterDataList () {
        let newData = []
        for (var i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i].tenant_level.name !== '中级店铺') {
            newData.push(this.dataList[i])
          }
        }
        return newData
      }
    },
    methods: {
      supplyPrice (price, row) {
        return ProductSer.supplyPrice(price, this.skus, row.tenant_level.name === '普通店铺')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .supply-price {
    display: flex;
  }
</style>
