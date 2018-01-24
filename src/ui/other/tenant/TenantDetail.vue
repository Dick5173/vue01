<template lang="pug">
  div
    div
      div.head
        div.head-cover(v-lazy:background-image="")
        div.head-name name
      div.body
        div.body-item 小程序状态：
        div.body-item 店铺状态：状态
          el-button(style="margin-left: 10px", type="danger", size="mini") 禁用
      div.body
        div.body-item 店铺ID：
        div.body-item 店铺管理员：
        div.body-item 授权状态：
        div.body-item 首次上线：
      div.list-title
        div.list-title-head
          div.list-title-item 最近收入
          el-button.list-title-item-details(type="text") 详细>
        div.list
          el-table.list-el-table(:data="incomeList", border)
            el-table-column(label="统计周期", prop="")
            el-table-column(label="销售额（元）", prop="")
              template(slot-scope="scope")
                div
            el-table-column(label="货款（元）", prop="")
              template(slot-scope="scope")
                div
            el-table-column(label="平台服务费（元）", prop="")
            el-table-column(label="利润（元）", prop="")
      div.list-title
        div.list-title-head
          div.list-title-item 最新上架
          el-button.list-title-item-details(type="text") 详细>
        div.list
          el-table.list-el-table(:data="productList", border)
            el-table-column(label="商品", prop="")
            el-table-column(label="利润（元）", prop="")
              template(slot-scope="scope")
                div
            el-table-column(label="售价（元）", prop="")
              template(slot-scope="scope")
                div
            el-table-column(label="销量", prop="")
            el-table-column(label="库存", prop="")
            el-table-column(label="首次上架", prop="")
            el-table-column(label="来源", prop="")
</template>

<script>
  export default {
    props: {},
    components: {},
    data () {
      return {
        incomeList: [],
        productList: []
      }
    },
    computed: {},
    watch: {},
    methods: {}
  }
</script>


<style lang="scss" scoped>
  @import "../../../assets/scss/other";
</style>
