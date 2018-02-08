<template lang="pug">
  div
    div
    div
      el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(label="店铺ID", prop="")
        el-table-column(label="线上版本ID", prop="")
        el-table-column(label="审核版本ID", prop="")
        el-table-column(label="审核状态", prop="")
        el-table-column(label="操作", prop="")
</template>

<script>
  import LoadPagerData from 'src/mixins/load-pager-data'
  import * as AppVersionApi from 'src/api/app-version'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {},
    data () {
      return {
        queryParams: {
          key: '',
          audit_status: '',
          online_template_id: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        return AppVersionApi.getAuditList(params)
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
