<template lang="pug">
  div
    div
      search-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div(v-loading="loading")
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="id", label="店铺ID", width="65px")
        el-table-column(prop="", label="名称", width="")
          div(slot-scope="scope")
            el-button(type="text", @click="toDetail(scope.row)") {{scope.row.nick_name}}
        el-table-column(prop="total_amount", label="销售额", sortable, width="")
          div(slot-scope="scope")
            el-button(type="text", @click="toOrder(scope.row)") {{scope.row.total_amount  | price}}
        el-table-column(prop="total_profit", label="店铺利润", sortable, width="")
          div(slot-scope="scope") {{scope.row.total_profit  | price}}
        el-table-column(prop="up_product_count", label="上架商品", sortable, width="")
          div(slot-scope="scope")
            el-button(type="text", @click="toProduct(scope.row)") {{scope.row.up_product_count}}
        el-table-column(prop="first_uptime", label="首次上线", sortable, width="")
          div(slot-scope="scope") {{scope.row.first_uptime | datetime}}
        el-table-column(prop="", label="小程序状态", width="")
          div(slot-scope="scope") {{showAppStatus(scope.row.app_status)}}
        el-table-column(prop="", label="店铺管理员ID", width="")
          div(slot-scope="scope") {{scope.row.admin_id}}
        el-table-column(prop="", label="退款授权", width="")
          div(slot-scope="scope")
            div(v-if="scope.row.refund_status === 2") 已授权
            el-button(v-else, type="primary", size="small", @click="") 确认授权
        el-table-column(prop="", label="店铺状态", width="")
          div(slot-scope="scope") {{showTenantStatus(scope.row.tenant_status)}}
        el-table-column(prop="", label="操作", width="", fixed="right")
          div(slot-scope="scope")
            el-button(v-if="scope.row.tenant_status === 1", type="danger", size="small", @click="") 禁用
            el-button(v-else, type="primary", size="small", @click="") 启用
    el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")

</template>
<script>
  import SearchToolbar from 'src/ui/other/tenant/SearchToolBar.vue'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import * as TenantApi from 'src/api/tenant'
  import { dateFormat } from 'src/util/format'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {
      SearchToolbar
    },
    data () {
      return {
        queryParams: {
          app_status: '',
          start: 0,
          end: 0,
          key: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        return TenantApi.getList(this.R.mapObjIndexed((val, key, obj) => {
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
      showAppStatus (row) {
        let text = ''
        switch (row) {
          case 1:
            text = '审核中'
            break
          case 2:
            text = '已上线'
            break
          case 3:
            text = '已下线'
            break
          case 4:
            text = '解除授权'
            break
        }
        return text
      },
      showTenantStatus (row) {
        if (row === 1) {
          return '正常'
        }
        return '禁用'
      },
      toDetail (row) {

      },
      handleSearch (data) {
        this.queryChange(data)
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
