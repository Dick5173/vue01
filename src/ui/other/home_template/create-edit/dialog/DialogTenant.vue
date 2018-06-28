<template lang="pug">
  div
    el-dialog(title="使用店铺", :visible.sync="dialogVisible", :loading="loading")
      div {{template.name}}
      smart-table(:dataList.sync="dataList.data", :showHeader="false", border)
        smart-table-column(label="店铺ID")
          div(slot-scope="props")
            div {{ props.row.id}}
        smart-table-column(label="店铺")
          div(slot-scope="props")
            div {{ props.row.name}}
      div.bottom
        el-pagination(:currentPage="dataList.page", :pageSize="dataList.limit", :total="dataList.total",  @current-change="changePage")
</template>

<script>
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import * as TmplApi from 'src/api/home-template'

  export default {
    components: {
      SmartTable,
      SmartTableColumn
    },
    props: {},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        template: {},
        dataList: {
          data: []
        },
        queryParams: {
          page: 1,
          limit: 10
        }
      }
    },
    computed: {},
    methods: {
      show (template) {
        this.queryParams.page = 1
        this.template = template
        this.refreshList()
        this.dialogVisible = true
      },
      changePage (page) {
        this.queryParams.page = page
        this.refreshList()
      },
      async refreshList () {
        this.loading = true
        try {
          const res = await TmplApi.getUseTmplTenant(this.template.id, this.queryParams)
          this.dataList = res.data || {}
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
