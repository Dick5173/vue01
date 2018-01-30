<template lang="pug">
  div.order(v-loading="loading")
    search-bar(:queryParams="queryParams", @search="handleSearch", @create_export_task="createExportTask")
    list(:dataList.sync="dataList")
    div.order-bottom 实付合计: {{showPrice(dataList.stat)}}, 利润: {{showProfit(dataList.stat)}} &nbsp;&nbsp; 商品数量: {{showSold(dataList.stat)}}
    div.order-bottom
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import SearchBar from './SearchBar'
  import List from './List'
  import { orderList } from '../../api/order'
  import LoadPagerData from '../../mixins/load-pager-data'
  import { getShowPrice } from '../../util/moneyUtil'
  import { getShowCount } from '../../util/number'

  export default {
    mixins: [LoadPagerData],
    components: {
      SearchBar,
      List
    },
    data () {
      return {
        loading: false,
        tenants: [],
        queryParams: {
          status: ['3', '4', '5'],
          searchKey: '',
          searchType: 'prod',
          tenant_id: '',
          start_time: new Date().getTime(),
          end_time: new Date().getTime()
        }
      }
    },
    watch: {
      dataList (val) {
        console.log(val)
      }
    },
    computed: {},
    methods: {
      handleSearch (model) {
        this.queryChange(model)
      },
      getQueryApi (params) {
        return orderList(params)
      },
      showPrice (stat) {
        let price = 0
        if (stat && stat.sum) {
          price = stat.sum
        }
        return getShowPrice(price)
      },
      showProfit (stat) {
        let price = 0
        if (stat && stat.profit) {
          price = stat.profit
        }
        return getShowPrice(price)
      },
      showSold (stat) {
        let sold = 0
        if (stat && stat.count) {
          sold = stat.count
        }
        return getShowCount(sold)
      },
      createExportTask (model) {
        // this._filter(model)
        // orderList(Object.assign({export: 1}, this.queryParams)).then((res) => {
        //   this.$message({
        //     showClose: true,
        //     message: res.data,
        //     type: 'success'
        //   })
        // }).catch((err) => {
        //   this.$myErrorHandler.handle(this, err)
        // })
      },
      async loadTenant () {

      },
      autoSearch () {
        if (this.$route.params.tenant) {
          let params = {
            tenant_id: String(this.$route.params.tid)
          }
          this.queryChange(params)
        }
        if (this.$route.params.user) {
          let params = {
            searchKey: String(this.$route.params.uid),
            searchType: 'buyer',
            start_time: '',
            end_time: ''
          }
          this.queryChange(params)
        }
      }
    },
    mounted () {
      this.loadTenant()
      this.autoSearch()
    }
  }
</script>

<style lang="scss" scoped>
  .order-bottom {
    margin-top: 20px;
  }
</style>
