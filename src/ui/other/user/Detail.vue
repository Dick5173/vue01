<template lang="pug">
  div
    div
      div.head
        div.head-cover.round(v-lazy:background-image="userData.logo")
        div.head-name {{userData.nickname}}
      div.body-detail
        div.body-item 手机：{{showMobile(userData.mobile)}}
        div.body-border
        div.body-item 用户ID：{{userData.id}}
        div.body-border
        div.body-item 店铺：
        div.body-item {{userData.tenantNickName}}
        div.body-border
        div.body-item 首次访问：{{showTime(userData.ct)}}
      div.body-bottom-line
      div.body-status
        div.body-item-status 收入：
          el-button(type="text", @click="toIncome(userData)", size="mini") {{this.userData.wallet.total_income| price}}
      div.body-status.margin-left
        div.body-item-status 抵用：
          el-button(type="text", @click="toServerPurpose(userData)", size="mini") {{userData.wallet.total_use | price}}
      div.body-status.margin-left
        div.body-item-status 余额：
          span {{this.userData.wallet.available_balance | price}}
      div.body-status.margin-left
        div.body-item-status 核销提现：
          el-button(type="text", @click="toWithDraw(userData)", size="mini") {{this.userData.wallet.total_withdraw | price}}
      div.list-title
        div.list-title-head
          div.list-title-item 订单统计
          div.list-title-item.btn(type="text", @click="toOrder(userData)") 详情
        div.list
          el-table.list-el-table(:data="dataList", border)
            el-table-column(label="最近购买", prop="recent_pay_tick")
              template(slot-scope="scope")
                div {{scope.row.recent_pay_tick | date}}
            el-table-column(label="平均交易额（元）", prop="")
              template(slot-scope="scope")
                div {{showAverage(scope.row) | price}}
            el-table-column(label="总交易额（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.total_amount | price}}
            el-table-column(label="订单总数", prop="total_count")
</template>

<script>
  import * as UserApi from 'src/api/user'
  import { getUserShowData, getUserOrderDataList } from 'src/service/other/index'
  import { dateFormat } from 'src/util/format'
  import { PUSH_STATUS_USER } from 'src/constants/orderPush'

  export default {
    props: {},
    components: {},
    data () {
      return {
        dataList: [],
        userData: {
          logo: '',
          nickname: '',
          tenantNickName: '',
          id: '',
          mobile: '',
          ct: '',
          wallet: {}
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      async getDetail () {
        try {
          this.loading = true
          let res = await UserApi.getUserDetail(this.$route.params.uid)
          this.userData = getUserShowData(res.data)
          this.dataList = getUserOrderDataList(res.data)
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      toOrder (row) {
        this.$router.push({
          name: 'OrderIndex',
          params: {
            uid: row.id
          },
          query: {
            status: PUSH_STATUS_USER
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
      toWithDraw (row) {
        this.$router.push({
          name: 'UserWithDraw',
          params: {
            uid: row.id
          }
        })
      },
      toServerPurpose (row) {
        this.$router.push({
          name: 'UserServerPurpose',
          params: {
            uid: row.id
          }
        })
      },
      showTime (row) {
        if (row !== '') {
          return dateFormat(row)
        }
        return '没有首次访问时间'
      },
      showMobile (row) {
        return row === '' ? '未知' : row
      },
      showAverage (row) {
        let data = row.total_amount / row.total_count
        data = data.toFixed()
        return data
      }
    },
    created () {
      if (this.$route.query.order) {
        this.$parent.updateBreadcrumb([{
          text: '订单',
          to: {name: 'OrderIndex'}
        }, {
          text: '订单详情',
          to: {name: 'OrderDetail', param: {id: this.$route.params.id}}
        }, {
          text: '用户详情'
        }])
      } else {
        this.$parent.updateBreadcrumb([{
          text: '用户',
          to: {name: 'User'}
        }, {
          text: '用户详情'
        }])
      }
    },
    mounted () {
      this.getDetail()
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../../assets/scss/other";

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
  .body-status {
    display: inline-flex;
    align-items: center;
    margin-top: -4px;
    margin-bottom: 30px;
    .body-item-status {
      display: inline-block;
      margin-right: 10px;
      height: 17px;
      font-size: 12px;
      line-height: 17px;
    }
    .el-button--text {
      text-decoration: underline;
    }
  }
  .margin-left {
    margin-left: 20px;
  }
</style>
