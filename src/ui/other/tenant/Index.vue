<template lang="pug">
  div
    div
      search-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border, @selection-change="handleSelectionChange")
        el-table-column(prop="id", label="店铺ID", width="65px")
        el-table-column(prop="name", label="名称", width="")
        el-table-column(prop="", label="销售额", sortable, width="")
        el-table-column(prop="", label="店铺利润", sortable, width="")
        el-table-column(prop="", label="上架商品", sortable, width="")
        el-table-column(prop="", label="首次上线", sortable, width="")
        el-table-column(prop="", label="小程序状态", width="")
        el-table-column(prop="", label="店铺管理员ID", width="")
        el-table-column(prop="", label="退款授权", width="")
        el-table-column(prop="", label="店铺状态", width="")
        el-table-column(prop="", label="操作", width="", fixed="right")
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
          status: '',
          start: 0,
          end: 0,
          text: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        console.log(params)
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
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSearch (data) {
        this.queryChange(data)
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
