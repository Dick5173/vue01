<template lang="pug">
  div
    div
      search-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div
      el-table.list-el-table(v-loading="loading", :data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="", label="用户ID")
          div(slot-scope="scope")
            el-button(type="text", @click="toDetail(scope.row)") {{scope.row.id}}
        el-table-column(prop="", label="用户")
          div(slot-scope="scope")
            el-button(type="text", @click="toDetail(scope.row)") {{scope.row.nickname}}
        el-table-column(prop="", sortable, label="收入")
          div(slot-scope="scope")
            el-button(type="text", @click="toIncome(scope.row)") {{getIncome(scope.row) | price}}
        el-table-column(prop="", sortable, label="抵用")
          div(slot-scope="scope")
            el-button(type="text", @click="ToServerpurpose(scope.row)") {{getTotalUse(scope.row) | price}}
        el-table-column(prop="", sortable, label="余额")
          div(slot-scope="scope") {{getAvailableBalance(scope.row) | price}}
        el-table-column(prop="", sortable, label="核销提现")
          div(slot-scope="scope")
            el-button(type="text", @click="toWithdraw(scope.row)") {{getTotalWithdraw(scope.row) | price}}
        el-table-column(prop="", sortable, label="首次访问")
          template(slot-scope="scope")
            div {{showDate(scope.row)}}
        el-table-column(prop="", label="店铺")
          div(slot-scope="scope") {{getTenantName(scope.row)}}
        el-table-column(prop="",label="操作")
          div.control-wrapper(slot-scope="scope")
            el-button.btn.text-code(size="mini", type="primary", v-if="scope.row.tenant.allow_withdraw", @click="showWithDrawDialog(scope.row)", plain) 核销提现
      div.order-bottom.txt-head(v-if="dataList.data && dataList.data.length>0") 收入{{dataList.stat_data.sum_total_income | price}}，余额{{dataList.stat_data.sum_available_balance | price}}，核销提现{{dataList.stat_data.sum_total_withdraw | price}}
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
      with-draw-dialog(ref="withDrawDilog")
</template>

<script>
  import SearchToolbar from 'src/ui/other/user/SearchToolbar.vue'
  import WithDrawDialog from 'src/ui/other/user/WithDrawDialog.vue'
  import { dateFormat } from 'src/util/format'
  import * as UserApi from 'src/api/user'
  import LoadPagerData from 'src/mixins/load-pager-data'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {
      SearchToolbar,
      WithDrawDialog
    },
    data () {
      return {
        queryParams: {
          tenant_id: '',
          key: '',
          start: new Date().getTime(),
          end: new Date().getTime()
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        return UserApi.getUserList(this.R.mapObjIndexed((val, key, obj) => {
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
      toDetail (row) {
        this.$router.push({
          name: 'UserDetail',
          params: {
            uid: row.id
          }
        })
      },
      toIncome (row) {
        this.$router.push({
          name: 'UserIncome',
          params: {
            uid: row.id
          }
        })
      },
      toWithdraw (row) {
        this.$router.push({
          name: 'UserWithDraw',
          params: {
            uid: row.id
          }
        })
      },
      ToServerpurpose (row) {
        this.$router.push({
          name: 'UserServerPurpose',
          params: {
            uid: row.id
          }
        })
      },
      showWithDrawDialog (row) {
        this.$refs.withDrawDilog.show(row)
      },
      showDate (row) {
        return dateFormat(row.ct, 'YYYY-MM-DD')
      },
      handleSearch (data) {
        this.queryChange(data)
      },
      getTenantName (row) {
        if (row && row.tenant) {
          return row.tenant.nick_name
        } else {
          return '无店铺'
        }
      },
      getIncome (row) {
        if (row.wallet === null) {
          return 0
        } else {
          return row.wallet.total_income
        }
      },
      getTotalUse (row) {
        if (row.wallet === null) {
          return 0
        } else {
          return row.wallet.total_use
        }
      },
      getAvailableBalance (row) {
        if (row.wallet === null) {
          return 0
        } else {
          return row.wallet.available_balance
        }
      },
      getTotalWithdraw (row) {
        if (row.wallet === null) {
          return 0
        } else {
          return row.wallet.total_withdraw
        }
      }
    },
    mounted () {
    }
  }
</script>


<style lang="scss" scoped>

</style>
