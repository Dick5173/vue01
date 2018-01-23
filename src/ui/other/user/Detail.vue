<template lang="pug">
  div
    div
      div.user-head
        div.head-cover(v-lazy:background-image="userData.logo")
        div.head-name {{userData.nickname}}
      div.user-body
        div.body-item 手机：{{showMobile(userData.mobile)}}
        div.body-item 用户ID：{{userData.id}}
        div.body-item-name 店铺：{{userData.tenantNickName}}
        div.body-item 首次访问：{{showTime(userData.ct)}}
    div.order
      div.order-head
        div.order-item 订单统计
        el-button.order-item-details(type="text") 详情>
      div.list
        el-table.list-el-table(:data="dataList", border)
          el-table-column(label="最近购买", prop="recent_pay_tick")
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
          ct: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      async getDetail () {
        try {
          this.loading = true
          let res = await UserApi.getUserDetail(this.$route.params.id)
          this.userData = getUserShowData(res.data)
          this.dataList = getUserOrderDataList(res.data)
          this.loading = false
        } catch (err) {
          this.loading = false
        }
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
        return row.total_amount / row.total_count
      }
    },
    mounted () {
      this.getDetail()
    }
  }
</script>


<style lang="scss" scoped>
  .user-head {
    display: flex;
    height: 50px;
    .head-cover {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-size: cover;
      background-position: center;
    }
    .head-name {
      display: inline-block;
      margin-left: 10px;
      height: 50px;
      line-height: 50px;
    }
  }

  .user-body {
    display: flex;
    height: 50px;
    margin-left: 60px;
    .body-item {
      display: inline-block;
      height: 50px;
      line-height: 50px;
      margin-right: 50px;
    }
    .body-item-name {
      display: inline-block;
      height: 50px;
      width: 200px;
      line-height: 50px;
      margin-right: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .order {
    margin-top: 50px;
    .order-head {
      display: flex;
      .order-item {
        line-height: 40px;
        margin-right: 20px;
        display: inline-block;
      }
      .order-item-details {
        display: inline-block;
      }
    }

    .list {
    }
  }
</style>
