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
        el-table-column(prop="",label="收入")
          div(slot-scope="scope")
            el-button(type="text", @click="toIncome(scope.row)") {{1800 | price}}
        el-table-column(prop="", label="抵用")
          div(slot-scope="scope")
            el-button(type="text", @click="ToServerpurpose(scope.row)") {{1900 | price}}
        el-table-column(prop="",label="余额")
          div(slot-scope="scope") {{1900 | price}}
        el-table-column(prop="",label="核销提现")
          div(slot-scope="scope")
            el-button(type="text", @click="toWithdraw(scope.row)") {{2000 | price}}
        el-table-column(prop="", label="首次访问")
          template(slot-scope="scope")
            div {{showDate(scope.row)}}
        el-table-column(prop="", label="店铺")
          div(slot-scope="scope") {{getTenantName(scope.row)}}
        el-table-column(prop="",label="操作")
          div.control-wrapper(slot-scope="scope")
            el-button.btn.text-code(size="mini", type="primary", @click="showWithDrawDialog(scope.row)", plain) 核销提现
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
      }
    },
    mounted () {
    }
  }
</script>


<style lang="scss" scoped>

</style>
