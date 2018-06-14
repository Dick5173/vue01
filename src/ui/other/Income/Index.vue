<template lang="pug">
  div
    div
      income-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div(v-loading="loading")
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(label="店铺", prop="")
          template(slot-scope="scope")
            el-button(type="text", @click="toTenantDetail(scope.row)") {{scope.row.tenant_nickname}}
        el-table-column(label="统计周期", prop ="")
          template(slot-scope="scope") {{showStatPeriod(scope.row)}}
        el-table-column(label="向美市结算（元）", prop="settle_total_amount")
          template(slot-scope="scope")
            div {{scope.row.settle_amount | price}}
        el-table-column(label="销售额（元）", prop="sale_total_amount")
          template(slot-scope="scope") {{scope.row.sale_total_amount | price}}
        el-table-column(prop="total_refund_amount", label="退款(元)", sortable)
          template(slot-scope="props")
            div {{props.row.total_refund_amount | price}}
        el-table-column(label="总货款（元）", prop="sp_total_amount")
          template(slot-scope="scope")
            div {{scope.row.sp_total_amount | price}}
        el-table-column(label="自营货款（元）", prop="self_sp_amount")
          template(slot-scope="scope")
            div {{scope.row.self_sp_amount | price}}
        el-table-column(label="平台货款（元）", prop="platform_sp_amount")
          template(slot-scope="scope")
            div {{scope.row.platform_sp_amount | price}}
        el-table-column(label="利润（元）", prop="total_profit")
          template(slot-scope="scope")
            div {{scope.row.tenant_total_amount | price}}
        el-table-column(label="状态", prop="")
          template(slot-scope="scope")
            div(v-if="scope.row.unsettle_amount > 0")
              div.unsettle-text 未结算
              div （{{scope.row.unsettle_amount | price}}）
            div(v-else) 已结算
      div.total
      div.bottom.txt-head(v-if="dataList.data && dataList.data.length>=1") 向美市结算:{{overview.settle_total_amount | price}} 销售总额: {{overview.pure_sale_total_amount | price}}，退款: {{overview.total_refund_amount | price}}，总货款: {{overview.sp_total_amount | price}}，自营货款: {{overview.self_sp_amount | price}}, 平台货款: {{overview.platform_sp_amount | price}}, 利润: {{overview.tenant_total_amount | price}}，未结算: {{overview.unsettle_total_amount | price}}
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
      bind-balance-dialog(ref="dlgBindBalance",@refresh="handleSearch")
</template>

<script>
  import IncomeToolbar from 'src/ui/other/Income/SearchToolbar.vue'
  import BindBalanceDialog from 'src/ui/other/Income/BindBalanceDialog.vue'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { dateFormat } from 'src/util/format'
  import * as BillApi from 'src/api/bill'
  import { TENANT_STATUS_IN_COME } from 'src/constants/tenantPush'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {IncomeToolbar, BindBalanceDialog},
    data () {
      return {
        queryParams: {
          start: 0,
          end: 0,
          tenant_id: '',
          status: ''
        },
        defaultDate: [],
        overview: {
          pure_sale_total_amount: 0,
          sp_total_amount: 0,
          total_platform_fee: 0,
          tenant_gross_total_amount: 0,
          tenant_total_amount: 0,
          settle_total_amount: 0,
          unsettle_total_amount: 0,
          platform_sp_amount: 0,
          self_sp_amount: 0,
          total_refund_amount: 0
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        return BillApi.getIncomeList(this.R.mapObjIndexed((val, key, obj) => {
          if (key === 'start' || key === 'end') {
            if (val === 0) {
              return ''
            } else {
              return dateFormat(val)
            }
          }
          return val
        })(params))
      },
      async getProfitOverview (params) {
        const res = await BillApi.getProfitOverview(this.R.mapObjIndexed((val, key, obj) => {
          if (key === 'start' || key === 'end') {
            if (val === 0) {
              return ''
            } else {
              return dateFormat(val)
            }
          }
          return val
        })(params))
        this.overview = res.data.stat
      },
      toTenantDetail (row) {
        this.$router.push({
          name: 'TenantDetail',
          params: {
            tid: row.tenant_id
          },
          query: {
            status: TENANT_STATUS_IN_COME
          }
        })
      },
      showStatPeriod (row) {
        const start = dateFormat(row.start_tick)
        const end = dateFormat(row.end_tick)
        return start === end ? start : `${start}~${end}`
      },
      showBalanceDialog (row) {
        this.$refs.dlgBindBalance.show(row)
      },
      async handleSearch (data) {
        this.queryChange(data)
        this.getProfitOverview(data)
      }
    },
    async mounted () {
      let params = {
        tenant_id: 0
      }
      if (this.$route.params.tenant) {
        params.tenant_id = this.$route.params.tid
        this.queryChange(params)
      }
      this.getProfitOverview(params)
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

  .unsettle-text {
    color: $color-danger;
  }

</style>
