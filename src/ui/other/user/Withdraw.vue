<template lang="pug">
  div(v-loading="loading")
    div
      div.head
        div.head-cover.round(v-lazy:background-image="userData.logo")
        div.head-name {{userData.nickname}}
      div.list
        el-table.list-el-table(:data="dataList", border)
          el-table-column(label="金额(元)", prop="recent_pay_tick")
            template(slot-scope="scope")
              div {{1888 | price}}
          el-table-column(label="时间", prop="")
            template(slot-scope="scope")
              div {{showtime(scope.row) | date}}
          el-table-column(label="备注", prop="")
            template(slot-scope="scope")
              div {{scope.row.total_amount | price}}
          el-table-column(label="操作者", prop="total_count")
            template(slot-scope="scope")
              div {{scope.row.time | date}}

</template>

<script>
  import { getUserShowData } from 'src/service/other/index'
  import * as UserApi from 'src/api/user'
  import { dateFormat } from 'src/util/format'

  export default {
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
      showtime (row) {
        const timeee = dateFormat(row.timeee)
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
