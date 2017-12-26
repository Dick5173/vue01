<template lang="pug">
  div(v-loading="loading")
    el-button(type="primary", icon="el-icon-plus", @click="handleCreate") 添加
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="name", label="名字")
        el-table-column(prop="", label="角色")
        el-table-column(prop="mobile", label="手机号")
        el-table-column(label="操作", width="220px")
          template(slot-scope="scope")
            div
              el-button(type="warning", size="mini", plain, @click="editItem(scope.row)") 编辑
              el-button(:type="scope.row.enabled ? 'danger' : 'success'", size="mini", plain, @click="enableItem(scope.row)") {{ scope.row.enabled ? '禁用' : '启用' }}
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
    div
      form-dialog(ref="dlgForm", @created="handleCreated")
</template>

<script>
  import * as SysUserApi from 'src/api/sysuser'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import FormDialog from './FormDialog.vue'

  export default {
    mixins: [
      LoadPagerData
    ],
    components: {
      FormDialog
    },
    data () {
      return {
        queryParams: {
          name: '',
          mobile: '',
          roles: '',
          start: '',
          end: ''
        }
      }
    },
    watch: {},
    methods: {
      getQueryApi (params) {
        return SysUserApi.getList(params)
      },
      shouldResetRouteQuery (to, from) {
        return from.name === 'SysUserCreate'
      },
      editItem (item) {
      },
      handleCreate () {
        this.$refs.dlgForm.show()
      },
      handleCreated () {
        this.resetQuery()
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
