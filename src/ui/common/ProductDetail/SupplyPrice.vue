<template lang="pug">
  div
    el-table.small-el-table(:data="dataList", border, cell-class-name="hidden-bottom-padding-el-tab", :show-header="false")
      el-table-column(label="等级")
        template(slot-scope="props")
          div.supply-price
            div {{props.row.tenant_level.name}}
      el-table-column(label="价格")
        template(slot-scope="props")
          el-form-item.show-validate-in-tab-el-form(:prop="'supply_levels.' + props.$index + '.supply_price'", :rules="formRules.supply_price")
            div.supply-price
              div {{props.row.supply_price}}
              div.input-right-desc 元
</template>

<script>
  import { priceValidator } from 'src/util/validator'

  export default {
    props: {
      dataList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        formRules: {
          supply_price: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: priceValidator, trigger: 'blur'}
          ]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .supply-price {
    display: flex;
  }
</style>
