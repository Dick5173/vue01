<template lang="pug">
  div(v-loading="loading")
    div
      search-toolbar(:queryParams="queryParams", ref="searchtoolbar", @submit="search")
    div
      el-button(size="medium", icon="el-icon-plus", type="primary", @click="createItem") 创建
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="id", label="店铺管理员ID")
        el-table-column(prop="name", label="名字")
          div.infoText(slot-scope="scope", @click="toTenantUserList(scope.row)") {{ scope.row.name }}
        el-table-column(prop="mobile", label="手机号")
        el-table-column(prop="", label="公司")
          div(slot-scope="scope") {{showCompany(scope.row)}}
        el-table-column(prop="", label="店铺")
          div(slot-scope="scope")
            div
              p(v-html="showTenantName(scope.row)")
        el-table-column(width="170px" label="操作")
          template(slot-scope="scope")
            el-button(size="mini", @click="editItem(scope.row)", type="primary", plain) 编辑
            el-button(size="mini", @click="resetPwd(scope.row)", type="primary", plain) 修改密码
    el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
    reset-pwd-dialog(ref="dlgResetPwd", @refresh="loadDataListByQueryPage")

</template>

<script>
  import LoadPagerData from 'src/mixins/load-pager-data'
  import ResetPwdDialog from 'src/ui/other/tenant-user/ResetPwdDialog.vue'
  import * as TenantUserApi from 'src/api/tenant-user'
  import SearchToolbar from 'src/ui/other/tenant-user/SearchToolbar.vue'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {
      SearchToolbar,
      ResetPwdDialog},
    data () {
      return {
        queryParams: {
          tenant_id: '',
          key: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      toTenantUserList (row) {
        this.$router.push({
          name: 'TenantUserList',
          params: {
            tid: row.id
          }
        })
      },
      getQueryApi (params) {
        return TenantUserApi.getList(params)
      },
      showCompany (row) {
        if (row.company) {
          return row.company.name
        } else {
          return '无公司名称'
        }
      },
      showTenantName (row) {
        if (row.company) {
          if (row.company.tenants) {
            let arr = row.company.tenants
            let text = ''
            for (let i = 0; i < arr.length; i++) {
              text = arr[i].nick_name + '</br>'
            }
            return text
          }
        }
        return '无店铺'
      },
      search (data) {
        this.queryChange(data)
      },
      createItem () {
        this.$router.push({
          name: 'CreateTenantUser'
        })
      },
      editItem (row) {
        this.$router.push({
          name: 'EditTenantUser',
          params: {
            id: row.id
          }
        })
      },
      resetPwd (row) {
        this.$refs.dlgResetPwd.show(row)
      }
    },
    mounted () {
      if (this.$route.params.tenantDetail === true) {
        const data = {
          tenant_id: '',
          key: this.$route.params.id
        }
        this.search(data)
      }
    }
  }
</script>


<style lang="scss" scoped>
  .list-el-table{
    .infoText {
      color: #409EFF;
      text-decoration: underline;
      cursor: pointer;
    }
  }

</style>
