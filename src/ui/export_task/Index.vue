<template lang="pug">
  div.order(v-loading="loading")
    list(:dataList.sync="dataList")
    div.order-bottom
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
import List from './List'
import { getList } from 'src/api/export_task'
import LoadPagerData from 'src/mixins/load-pager-data'

export default {
  mixins: [LoadPagerData],
  components: {
    List
  },
  data () {
    return {
      loading: false,
      queryParams: {
        'tp': this.$route.query.tp
      }
    }
  },
  computed: {},
  methods: {
    getQueryApi (params) {
      return getList(params)
    }
  },
  created () {
    this.$parent.updateBreadcrumb([{
      text: '平台商品',
      to: {name: 'PlatformProductIndex'}
    }, {
      text: '导出任务'
    }])
  }
}
</script>

<style lang="scss" scoped>
.order-bottom {
  padding-top: 8px;
}
</style>

