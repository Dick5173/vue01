<template lang="pug">
  div(v-loading="loading")
    div 平台后台
    div.head
      el-button.head(type="primary", @click="handleAuthGroup(platform)") 添加权限组
      el-table.large-el-table(:data="platformAuthGroupList", border)
        el-table-column(label="ID")
          div(slot-scope="scope") {{scope.row.id}}
        el-table-column(label="名称")
          div(slot-scope="scope") {{scope.row.name}}
        el-table-column(label="应用的权限数量")
          div(slot-scope="scope") {{scope.row.auth_count }}
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(type="primary", plain, size="mini", @click="handleAuthGroup(platform,scope.row)") 编辑
            el-button(type="danger", plain, size="mini", @click="deleteAuthGroup(scope.row)", :disabled="scope.row.auth_count !== 0") 删除
    div.head
      el-button.head(type="primary", @click="createAuth(platform)") 添加权限
      el-table.large-el-table(:data="platformAuthList", border)
        el-table-column(label="ID")
          div(slot-scope="scope") {{scope.row.id}}
        el-table-column(label="名称")
          div(slot-scope="scope") {{scope.row.name}}
        el-table-column(type="expand")
          div(slot-scope="scope")
            el-table.small-el-table(:data="scope.row.paths || []", border)
              el-table-column(prop="id", label="ID")
              el-table-column(prop="name", label="名称")
              el-table-column(prop="path", label="路径")
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(type="primary", plain, size="mini", @click="handleEdit(platform,scope.row)") 编辑
            el-button(type="danger", plain, size="mini", @click="handleDelete(scope.row)") 删除
    div 店铺后台
    div.head
      el-button.head(type="primary", @click="handleAuthGroup(tenant)") 添加权限组
      el-table.large-el-table(:data="tenantAuthGroupList", border)
        el-table-column(label="ID")
          div(slot-scope="scope") {{scope.row.id}}
        el-table-column(label="名称")
          div(slot-scope="scope") {{scope.row.name}}
        el-table-column(label="应用的权限数量")
          div(slot-scope="scope") {{scope.row.auth_count}}
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(type="primary", plain, size="mini", @click="handleAuthGroup(tenant,scope.row)") 编辑
            el-button(type="danger", plain, size="mini", @click="deleteAuthGroup(scope.row)", :disabled="scope.row.auth_count !== 0") 删除
    div.head
      el-button.head(type="primary", @click="createAuth(tenant)") 添加权限
      el-table.large-el-table(:data="tenantAuthList", border)
        el-table-column(label="ID")
          div(slot-scope="scope") {{scope.row.id}}
        el-table-column(label="名称")
          div(slot-scope="scope") {{scope.row.name}}
        el-table-column(label="权限组ID")
          div(slot-scope="scope") {{scope.row.auth_group_id}}
        el-table-column(type="expand")
          div(slot-scope="scope")
            el-table.small-el-table(:data="scope.row.paths || []", border)
              el-table-column(prop="id", label="ID")
              el-table-column(prop="name", label="名称")
              el-table-column(prop="path", label="API路径")
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(type="primary", plain, size="mini", @click="handleEdit(tenant,scope.row)") 编辑
            el-button(type="danger", plain, size="mini", @click="handleDelete(scope.row)") 删除
    auth-group-dialog(ref="dlgAuthGroup", @refresh="refreshData")
</template>

<script>
  import * as AuthManagementApi from 'src/api/authorization-management'
  import AuthGroupDialog from 'src/ui/character-auth/AuthGroupDialog.vue'

  export default {
    props: {},
    components: {
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
    computed: {
    },
    watch: {},
    methods: {
      async deleteAuthGroup (row) {
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
      getPlatformList () {
        this.getCharacterAuthGroupList(this.platform)
        this.getCharacterAuthList(this.platform)
      },
      getTenantList () {
        this.getCharacterAuthGroupList(this.tenant)
        this.getCharacterAuthList(this.tenant)
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
      async getCharacterAuthList (tp) {
        this.loading = true
        try {
          if (tp === this.platform) {
            let res = await AuthManagementApi.getAuthList(tp)
            this.platformAuthList = res.data.data
          } else {
            let res = await AuthManagementApi.getAuthList(tp)
            this.tenantAuthList = res.data.data
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
      let res = await AuthManagementApi.getAuthitem(7)
      console.log(res)
    }
  }
</script>


<style lang="scss" scoped>
  .head {
    margin-bottom: 20px;
  }
</style>
