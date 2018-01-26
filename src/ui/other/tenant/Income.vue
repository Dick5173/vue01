<template lang="pug">
  div
    div
      income-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="", label="统计周期", sortable)
        el-table-column(prop="", label="销售额（元）", sortable)
        el-table-column(prop="", label="货款（元）", sortable)
        el-table-column(prop="", label="平台服务费（元）", sortable)
        el-table-column(prop="", label="利润（元）", sortable)
      div.total
        span 销售总额：万，货款合计：万，平台服务费合计：万，利润合计：万
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import IncomeToolbar from 'src/ui/other/tenant/search-toolbar/IncomeToolbar.vue'
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
              return dateFormat(val, 'YYYY-MM-DD')
            }
          }
          return val
        })(params))
      },
      handleSearch (data) {
        this.queryChange(data)
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
