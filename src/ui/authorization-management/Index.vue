<template lang="pug">
  div(v-loading="loading")
    div
      div.title 系统
      div.section
        div
          el-button(type="primary", @click="handleAuthGroup(platform)") 添加权限组
        div.content
          smart-table(:dataList.sync="platformAuthGroupList", @drag-end="handleAuthGroupDragEnd(platform)", rowKey="id")
            smart-table-column(label="", type="drag")
            smart-table-column(label="名称", prop="name")
            smart-table-column(label="应用的权限数量", prop="auth_count", width="260")
            smart-table-column(label="操作", prop="auth_count", width="240")
              div(slot-scope="scope")
                el-button(type="primary", plain, size="mini", @click="handleOpenAuthList(scope.row)") 查看权限
                el-button(type="primary", plain, size="mini", @click="handleAuthGroup(platform,scope.row)") 编辑
                el-button(type="danger", plain, size="mini", @click="deleteAuthGroup(scope.row)", :disabled="scope.row.auth_count !== 0") 删除
      div.title 商铺
      div.section
        div
          el-button(type="primary", @click="handleAuthGroup(tenant)") 添加权限组
        div.content
          smart-table(:dataList.sync="tenantAuthGroupList", @drag-end="handleAuthGroupDragEnd(tenant)", rowKey="id")
            smart-table-column(label="", type="drag")
            smart-table-column(label="名称", prop="name")
            smart-table-column(label="应用的权限数量", prop="auth_count", width="260")
            smart-table-column(label="操作", prop="auth_count", width="240")
              div(slot-scope="scope")
                el-button(type="primary", plain, size="mini", @click="handleOpenAuthList(scope.row)") 查看权限
                el-button(type="primary", plain, size="mini", @click="handleAuthGroup(tenant,scope.row)") 编辑
                el-button(type="danger", plain, size="mini", @click="deleteAuthGroup(scope.row)", :disabled="scope.row.auth_count !== 0") 删除
    auth-group-dialog(ref="dlgAuthGroup", @refresh="refreshData")
</template>

<script>
  import * as AuthManagementApi from 'src/api/authorization-management'
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import AuthGroupDialog from 'src/ui/authorization-management/AuthGroupDialog.vue'

  export default {
    props: {},
    components: {
      SmartTable,
      SmartTableColumn,
      AuthGroupDialog
    },
    data () {
      return {
        platform: 1,
        tenant: 2,
        platformAuthGroupList: [],
        platformAuthList: [],
        tenantAuthGroupList: [],
        tenantAuthList: [],
        loading: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      async deleteAuthGroup (row) {
        await this.$confirm('确认删除？', '提示')
        this.loading = true
        try {
          await AuthManagementApi.deleteAuthGroup(row.id)
          this.refreshData()
        } finally {
          this.loading = false
        }
      },
      handleAuthGroup (tp, row) {
        this.$refs.dlgAuthGroup.show(tp, row)
      },
      handleOpenAuthList (row) {
        this.$router.push(
          {
            name: 'AuthDetail',
            params: {
              id: row.id
            }
          }
        )
      },
      async handleAuthGroupDragEnd (tp) {
        this.loading = true
        let dataList = []
        if (tp === this.platform) {
          dataList = this.platformAuthGroupList
        } else if (tp === this.tenant) {
          dataList = this.tenantAuthGroupList
        }
        try {
          await AuthManagementApi.sortAuthGroup(tp, this.R.map(item => {
            return item.id
          })(dataList || []))
          this.$message({message: '排序成功', type: 'success'})
        } finally {
          this.loading = false
        }
      },
      getPlatformList () {
        this.getCharacterAuthGroupList(this.platform)
      },
      getTenantList () {
        this.getCharacterAuthGroupList(this.tenant)
      },
      async getCharacterAuthGroupList (tp) {
        this.loading = true
        try {
          if (tp === this.platform) {
            let res = await AuthManagementApi.getAuthGroupList(tp)
            this.platformAuthGroupList = res.data.data
          } else {
            let res = await AuthManagementApi.getAuthGroupList(tp)
            this.tenantAuthGroupList = res.data.data
          }
        } finally {
          this.loading = false
        }
      },
      refreshData () {
        this.getPlatformList()
        this.getTenantList()
      }
    },
    async mounted () {
      this.getPlatformList()
      this.getTenantList()
    }
  }
</script>


<style lang="scss" scoped>

  .title {
    font-size: 22px;
    color: #606266;
    padding-bottom: 10px;
  }

  .section {
    margin-left: 20px;
    margin-bottom: 8px;
    .head {
      font-size: 18px;
      color: #606266;
      margin-bottom: 10px;
    }
    .content {
      width: 800px;
      padding-bottom: 10px;
    }
  }

  .head {
  }

  .text {
    font-size: 22px;
    color: #606266;
    margin-bottom: 20px;
  }
</style>
