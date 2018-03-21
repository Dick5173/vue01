<template lang="pug">
  div.detail(v-loading="loading")
    div
      el-button(type="primary", @click="handleCreateAuth") 添加权限
    smart-table(:dataList.sync="authList", @drag-end="handleDragEnd", rowKey="id")
      smart-table-column(label="", type="drag")
      smart-table-column(label="名称", prop="name")
      smart-table-column(label="权限组", prop="auth_count", width="280")
        div(slot-scope="scope") {{ scope.row.auth_group.name }}
      smart-table-column(label="操作", prop="auth_count", width="200")
        div(slot-scope="scope")
          el-button(type="primary", plain, size="mini", @click="handleEdit(scope.row)") 编辑
          el-button(type="danger", plain, size="mini", @click="handleDelete(scope.row)") 删除
    auth-dialog(ref="dlgAuth", @refresh="refreshData")
</template>

<script>
  import * as AuthManagementApi from 'src/api/authorization-management'
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import AuthDialog from 'src/ui/authorization-management/AuthDialog.vue'

  export default {
    props: {},
    components: {
      SmartTable,
      SmartTableColumn,
      AuthDialog
    },
    data () {
      return {
        loading: false,
        authList: [],
        authGroup: {}
      }
    },
    computed: {},
    watch: {},
    methods: {
      handleCreateAuth () {
        this.$refs.dlgAuth.show(this.authGroup.tp)
      },
      handleEdit (row) {
        this.$refs.dlgAuth.show(this.authGroup.tp, row)
      },
      async handleDelete (row) {
        await this.$confirm('确认删除？', '提示')
        this.loading = true
        try {
          await AuthManagementApi.deleteAuth(row.id)
          this.refreshData()
        } finally {
          this.loading = false
        }
      },
      async handleDragEnd () {
        this.loading = true
        try {
          await AuthManagementApi.sortAuth(this.authGroup.id, this.R.map(item => {
            return item.id
          })(this.authList || []))
          this.$message({message: '排序成功', type: 'success'})
        } finally {
          this.loading = false
        }
      },
      async refreshData () {
        const authGroupData = await AuthManagementApi.getAuthGroupItem(this.$route.params.id)
        this.authGroup = authGroupData.data
        let bread = ''
        bread += `[${this.authGroup.tp === 1 ? '系统' : '商铺'}]`
        bread += this.authGroup.name
        this.$parent.updateBreadcrumb([{
          text: '权限管理',
          to: {name: 'AuthorizationManagement'}
        }, {
          text: bread
        }])
        const authListData = await AuthManagementApi.getAuthList(this.$route.params.id)
        this.authList = authListData.data.data || []
      }
    },
    async mounted () {
      this.refreshData()
    }
  }
</script>


<style lang="scss" scoped>

  .detail {
    width: 800px;
  }

  .title {
    font-size: 22px;
    color: #606266;
    padding-bottom: 10px;
    font-weight: bold;
  }

  .section {
    margin-left: 20px;
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
