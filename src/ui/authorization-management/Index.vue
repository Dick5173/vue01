<template lang="pug">
  div(v-loading="loading")
    div
      div(v-for="group in authGroup")
        div.title {{group.name}}
        div.section
          div
            el-button(type="primary", @click="handleAuthGroup(group.tp)") 添加权限组
          div.content
            smart-table(:dataList.sync="group.groups", @drag-end="handleAuthGroupDragEnd(group.tp, group.groups, false)", rowKey="id")
              smart-table-column(label="", type="drag")
              smart-table-column(label="", type="expand")
                div(slot-scope="scope_group")
                  div(v-if="scope_group.row.children && scope_group.row.children.length > 0")
                    smart-table.children-content(:dataList.sync="scope_group.row.children", @drag-end="handleAuthGroupDragEnd(group.tp, scope_group.row.children, true)")
                      smart-table-column(label="", type="drag")
                      smart-table-column.children-content(label="", type="expand")
                        div(slot-scope="scope_children")
                          smart-table(:dataList.sync="scope_children.row.auths", @drag-end="handleAuthDragEnd(scope_children.row.id, scope_children.row.auths)")
                            smart-table-column(label="", type="drag")
                            smart-table-column(label="权限名称", prop="name")
                            smart-table-column(label="应用的权限数量", prop="apply_count", width="260")
                            smart-table-column(label="操作", width="240")
                              div(slot-scope="scope")
                                el-button(type="primary", plain, size="mini", @click="handleAuth(group.tp, scope_children.row, scope.row)") 编辑
                                el-button(type="danger", plain, size="mini", @click="deleteAuth(scope.row)", :disabled="scope.row.apply_count > 0") 删除
                      smart-table-column.children-content(label="子权限组名称", prop="name")
                      smart-table-column.children-content(label="操作", prop="auth_count", width="240")
                        div(slot-scope="scope_children")
                          el-button(type="primary", plain, size="mini", @click="handleAuth(group.tp, scope_children.row)") 添加权限
                          el-button(type="primary", plain, size="mini", @click="handleAuthGroup(group.tp, 0, scope_children.row)") 编辑
                          el-button(type="danger", plain, size="mini", @click="deleteAuthGroup(scope_children.row)", :disabled="disableDelete(scope_children.row)") 删除
                  div(v-else-if="scope_group.row.auths && scope_group.row.auths.length > 0")
                    smart-table(:dataList.sync="scope_group.row.auths", @drag-end="handleAuthDragEnd(scope_group.row.id, scope_group.row.auths)")
                      smart-table-column(label="", type="drag")
                      smart-table-column(label="权限名称", prop="name")
                      smart-table-column(label="应用的权限数量", prop="apply_count", width="260")
                      smart-table-column(label="操作", width="240")
                        div(slot-scope="scope")
                          el-button(type="primary", plain, size="mini", @click="handleAuth(group.tp, scope_group.row, scope.row)") 编辑
                          el-button(type="danger", plain, size="mini", @click="deleteAuth(scope.row)", :disabled="scope.row.apply_count > 0") 删除
              smart-table-column(label="权限组名称", prop="name")
              smart-table-column(label="操作", prop="auth_count", width="380")
                div(slot-scope="scope_group")
                  el-button(type="primary", plain, size="mini", :disabled="disableAddGroup(scope_group.row)", @click="handleAuthGroup(group.tp, scope_group.row.id)") 添加子权限组
                  el-button(type="primary", plain, size="mini", :disabled="disableAddAuth(scope_group.row)", @click="handleAuth(group.tp, scope_group.row)") 添加权限
                  el-button(type="primary", plain, size="mini", @click="handleAuthGroup(group.tp, scope_group.row.id, scope_group.row)") 编辑
                  el-button(type="danger", plain, size="mini", @click="deleteAuthGroup(scope_group.row)", :disabled="disableDelete(scope_group.row)") 删除
    auth-group-dialog(ref="dlgAuthGroup", @refresh="refreshData")
    auth-dialog(ref="dlgAuth", @refresh="refreshData")
</template>

<script>
  import * as AuthManagementApi from 'src/api/authorization-management'
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import AuthGroupDialog from 'src/ui/authorization-management/AuthGroupDialog.vue'
  import AuthDialog from 'src/ui/authorization-management/AuthDialog.vue'

  const TP_SYS = 1
  const TP_TENANT = 2

  export default {
    TP_SYS,
    TP_TENANT,
    props: {},
    components: {
      SmartTable,
      SmartTableColumn,
      AuthGroupDialog,
      AuthDialog
    },
    data () {
      return {
        platform: 1,
        tenant: 2,
        platformAuthGroupList: [],
        tenantAuthGroupList: [],
        loading: false,
        authGroup: [
          {
            title: '系统',
            tp: TP_SYS,
            groups: []
          },
          {
            title: '店铺',
            tp: TP_TENANT,
            groups: []
          }
        ]
      }
    },
    computed: {},
    watch: {},
    methods: {
      disableAddGroup (row) {
        return row.auths && row.auths.length > 0
      },
      disableAddAuth (row) {
        return row.children && row.children.length > 0
      },
      disableDelete (row) {
        return (row.children && row.children.length > 0) || (row.auths && row.auths.length > 0)
      },
      handleAuthGroup (tp, pid, row) {
        this.$refs.dlgAuthGroup.show(tp, pid, row)
      },
      handleAuth (tp, group, row) {
        this.$refs.dlgAuth.show(tp, group, row)
      },
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
      async deleteAuth (row) {
        await this.$confirm('确认删除？', '提示')
        this.loading = true
        try {
          await AuthManagementApi.deleteAuth(row.id)
          this.refreshData()
        } finally {
          this.loading = false
        }
      },
      async handleAuthGroupDragEnd (tp, groups, child) {
        this.loading = true
        let pid = 0
        const ids = this.R.map(item => {
          return item.id
        })(groups || [])
        if (child) {
          if (groups && groups.length > 0) {
            pid = groups[0].parent_id
          }
        }
        try {
          if (tp === TP_SYS) {
            await AuthManagementApi.sortSysAuthGroup(pid, ids)
          } else if (tp === TP_TENANT) {
            await AuthManagementApi.sortTenantAuthGroup(pid, ids)
          }
          this.$message({message: '排序成功', type: 'success'})
        } finally {
          this.loading = false
          this.refreshData()
        }
      },
      async handleAuthDragEnd (gid, auths) {
        this.loading = true
        try {
          await AuthManagementApi.sortAuth(gid, this.R.map(item => {
            return item.id
          })(auths || []))
          this.$message({message: '排序成功', type: 'success'})
        } finally {
          this.loading = false
          this.refreshData()
        }
      },
      refreshData () {
        Promise.all([AuthManagementApi.getAuthGroupList(TP_SYS), AuthManagementApi.getAuthGroupList(TP_TENANT)]).then(([platRes, tenantRes]) => {
          this.authGroup[0].groups = platRes.data.data
          this.authGroup[1].groups = tenantRes.data.data
        })
      }
    },
    async mounted () {
      this.refreshData()
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

  .children-content {
    background-color: #878D99;
  }
</style>
