<template lang="pug">
  div
    div
      income-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(label="店铺", prop="")
          template(slot-scope="scope")
            div
        el-table-column(label="统计周期", prop="")
          template(slot-scope="scope")
            div {{scope.row.start_tick | datetime}}～{{scope.row.end_tick | datetime}}
        el-table-column(label="销售额（元）", prop="sale_total_amount")
          template(slot-scope="scope")
            div {{scope.row.sale_total_amount | price}}
        el-table-column(label="货款（元）", prop="sp_total_amount")
          template(slot-scope="scope")
            div {{scope.row.sp_total_amount | price}}
        el-table-column(label="平台服务费（元）", prop="platform_fee")
          template(slot-scope="scope")
            div {{scope.row.platform_fee | price}}
        el-table-column(label="利润（元）", prop="total_profit")
          template(slot-scope="scope")
            div {{scope.row.total_profit | price}}
      div.total
        span 销售总额：万，货款合计：万，平台服务费合计：万，利润合计：万
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import IncomeToolbar from 'src/ui/other/Income/SearchToolbar.vue'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { dateFormat } from 'src/util/format'
  import * as TenantApi from 'src/api/tenant'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {IncomeToolbar},
    data () {
      return {
        queryParams: {
          start: 0,
          end: 0,
          tenant_id: ''
        },
        defaultDate: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        return TenantApi.getIncomeList(this.R.mapObjIndexed((val, key, obj) => {
          if (key === 'start' || key === 'end') {
            if (val === 0) {
              return ''
            } else {
              return dateFormat(val, 'YYYY-MM')
            }
          }
          return val
        })(params))
      },
      handleSearch (data) {
        this.queryChange(data)
      }
    },
    mounted () {
      if (this.$route.params.tenant) {
        let params = {
          start: 0,
          end: 0,
          tenant_id: this.$route.params.tid
        }
        this.queryChange(params)
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../../assets/scss/other";

  .margin {
    margin-left: 60px;
  }

  .total {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
