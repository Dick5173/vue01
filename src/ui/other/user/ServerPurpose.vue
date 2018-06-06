<template lang="pug">
  div(v-loading="loading")
    div
    div.head
      div.head-cover.round(v-lazy:background-image="userData.logo")
      div.head-name {{userData.nickname}}
    div.list
      el-table.list-el-table(:data="dataList.data", border)
        el-table-column(label="详情", prop="recent_pay_tick")
          template(slot-scope="scope")
            div 订单号：
              el-button(type="text", @click="toOderDetail(scope.row.order_id)") {{scope.row.order_code}}
        el-table-column(label="类型", prop="")
          template(slot-scope="scope")
            div {{scope.row.reason}}
        el-table-column(label="金额（元）", prop="")
          template(slot-scope="scope")
            div(v-if="scope.row.type === 2") {{scope.row.amount | price}}
            div(v-else) -{{scope.row.amount | price}}
        el-table-column(label="时间", prop="total_count")
          template(slot-scope="scope")
            div {{showtime(scope.row)}}
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import { getUserShowData } from 'src/service/other/index'
  import * as UserApi from 'src/api/user'
  import * as UserWallet from 'src/api/wallet'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { dateFormat } from 'src/util/format'

  export default {
    mixins: [
      LoadPagerData
    ],
    data () {
      return {
        loading: false,
        userData: {
          logo: '',
          nickname: ''
        },
        dataList: []
      }
    },
    methods: {
      getQueryApi (params) {
        return UserWallet.getWalletUse(this.$route.params.uid, params)
      },
      async getDetail () {
        try {
          this.loading = true
          let res = await UserApi.getUserDetail(this.$route.params.uid)
          this.userData = getUserShowData(res.data)
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      toOderDetail (id) {
        this.$router.push({
          name: 'OrderDetail',
          params: {
            id: id
          }
        })
      },
      showtime (row) {
        const timeee = dateFormat(row.timestamp)
        return timeee
      }
    },
    mounted () {
      this.getDetail()
    }
  }
</script>

<style scoped lang="scss">
  .head {
    display: flex;
    height: 50px;
    align-items: center;
    .head-cover {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-size: cover;
      background-position: center;
    }
    .head-name {
      margin-left: 10px;
      height: 22px;
      line-height: 22px;
      font-size: 16px;
    }
  }
</style>
