<template lang="pug">
  div
    el-table.small-el-table(:data="filterDataList(dataList)", border, cell-class-name="hidden-bottom-padding-el-tab", :show-header="false")
      el-table-column(label="等级" )
        template(slot-scope="props")
          div {{props.row.tenant_level.name}}
      el-table-column(label="价格")
        template(slot-scope="props")
          div.supply-price
            div {{ conutPrice(dataPrice, props.row)}}
            div.input-right-desc 元
</template>

<script>
  // import { priceValidator } from "src/util/validator"

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
    methods: {
      filterDataList (data) {
        let newData = []
        for (var i = 0; i < data.length; i++) {
          if (data[i].tenant_level.name !== '中级店铺') {
            newData.push(data[i])
          }
        }
        return newData
      },
      conutPrice (price, row) {
        let A = parseFloat(price)
        if (A >= 0) {
          var suggestPrice = 0
          for (var i = 0; i < this.skus.length; i++) {
            if (this.skus[i].suggest_price === '') {
              this.skus[i].suggest_price = 0
            }
            suggestPrice += parseFloat(this.skus[i].suggest_price)
          }
          let B = suggestPrice / this.skus.length
          let P = parseFloat(price) * 0.0842
          if (P < 5) {
            P = 5
          }
          console.log('A' + A + ' P ' + P + ' B ' + B)
          if (row.tenant_level.name === '普通店铺') {
            return B === 0 ? 0 : (A + P + (B - A - P) * 0.3).toFixed(2)
          } else if (row.tenant_level.name === '高级店铺' || row.tenant_level.name === '中级店铺') {
            return B === 0 ? 0 : (A + P).toFixed(2)
          }
        }
      },
      ...$global.$mapMethods(
        {}
      )
    }
  }
</script>

<style lang="scss" scoped>
  .supply-price {
    display: flex;
  }
</style>
