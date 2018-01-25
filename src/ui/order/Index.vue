<template lang="pug">
  div.order(v-loading="loading")
    search-bar(:queryParams="queryParams", @search="handleSearch")
    refunding-bar
    list(:dataList.sync="dataList")
    div.order-bottom 实付合计: {{showPrice(dataList.stat)}}, 利润: {{showProfit(dataList.stat)}} &nbsp;&nbsp; 商品数量: {{showSold(dataList.stat)}}
    div.order-bottom
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import SearchBar from './SearchBar'
  import RefundingBar from './RefundingBar'
  import List from './List'
  import {orderList} from '../../api/order'
  import LoadPagerData from '../../mixins/load-pager-data'
  import {getShowPrice} from '../../util/moneyUtil'
  import {getShowCount} from '../../util/number'

  export default {
    mixins: [LoadPagerData],
    components: {
      SearchBar,
      RefundingBar,
      List
    },
    data () {
      return {
        loading: false,
        tenants: [],
        queryParams: {
          status: ['3', '4', '5'],
          tenant_id: 0,
          prod: '', // 订单编号、商品名称
          user: '', // 用户昵称、ID
          buyer: '', // 买家姓名、买家手机号
          dev_no: '',  // 物流单号
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
        return orderList(this.$tid, params)
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
      async loadTenant () {

      }
    },
    mounted () {
      this.loadTenant()
    }
  }
</script>

<style lang="scss" scoped>
  .order-bottom {
    margin-top: 20px;
  }
</style>
