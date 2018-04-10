<template lang="pug">
  div(v-loading="loading")
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(label="来源平台", width="91px")
          div(slot-scope="props") {{ getPlatform(props.row.platform) }}
        el-table-column(prop="name", label="名字")
        el-table-column(prop="mobile", label="手机号")
        el-table-column(prop="wx_account", label="微信个人账号")
        el-table-column(prop="wx_oa", label="微信公众账号")
        el-table-column(prop="follower_level", label="粉丝量级")
        el-table-column(prop="remark", label="留言")
        el-table-column(label="申请时间", width="160px")
          div(slot-scope="props") {{ props.row.ct | datetime }}
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import * as MinprogApplicationApi from 'src/api/minprog-application'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import * as ApplicationService from 'src/service/minprog-application/index'

  export default {
    mixins: [
      LoadPagerData
    ],
    components: {},
    data () {
      return {
        queryParams: {
          text: ''
        }
      }
    },
    methods: {
      getQueryApi (params) {
        return MinprogApplicationApi.getList(params)
      },
      getPlatform (platfrom) {
        return ApplicationService.allPlatformMap[platfrom]
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
