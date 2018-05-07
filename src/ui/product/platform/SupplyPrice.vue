<template lang="pug">
  div
    el-table.small-el-table(:data="dataList", border, cell-class-name="hidden-bottom-padding-el-tab", :show-header="false")
      el-table-column(label="等级" )
        template(slot-scope="props" ,)
          div {{props.row.tenant_level.name}}
      el-table-column(label="价格")
        template(slot-scope="props")
          <!--el-form-item.show-validate-in-tab-el-form(:prop="'supply_levels.' + props.$index + '.supply_price'", :rules="formRules.supply_price")-->
            div.supply-price
              div {{ conutPrice(dataPrice, props.row)}}
                <!--el-input(v-model.trim="props.row.supply_price")-->
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
  data() {
    return {
      newData: [],
      formRules: {
        supply_price: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: priceValidator, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    conutPrice(price, row) {
      let A = parseFloat(price);
      if (A >= 0) {
        var suggestPrice = 0;
        for (var i = 0; i < this.skus.length; i++) {
          if (this.skus[i].suggest_price === ""){
            return
          }
          suggestPrice += parseFloat(this.skus[i].suggest_price);
        }
        let B = suggestPrice / this.skus.length;
        let P = parseFloat(price) * 0.0842;
        if (P < 5) {
          P = 5;
        }
        if (row.tenant_level.name === "普通店铺") {
          return (A + P + (B - A - P) * 0.3).toFixed(2);
        } else if (row.tenant_level.name === "高级店铺" || row.tenant_level.name === "中级店铺") {
          return (A + P).toFixed(2);
        }
      }
    },
    // filterData () {
    //   let data = this.dataList
    //   for (var i = 0; i < data.length; i++) {
    //     if (data[i].tenant_level.name !== "中级店铺") {
    //       this.newData.push(data[i])
    //     }
    //   }
    // },
    // show () {
    //   if
    // }
    ...$global.$mapMethods({
      // 'showProvince': FreightService.showProvince
    })
  }
};
</script>

<style lang="scss" scoped>
.supply-price {
  display: flex;
}
</style>
