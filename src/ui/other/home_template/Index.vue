<template lang="pug">
  div
    div
      search-bar(:queryParams="queryParams", @submit="handleSearch")
    div
      el-button(size="medium", icon="el-icon-plus", type="primary", @click="clickCreateItem") 创建
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="id", label="ID")
        el-table-column(prop="name", label="名称")
        el-table-column(prop="tenant_count", label="使用店铺")
          template(slot-scope="scope")
            el-button(type="text", @click="clickUseTenant(scope.row)") {{scope.row.tenant_count}}
        el-table-column(prop="ct", label="更新时间")
          template(slot-scope="scope")
            div {{scope.row.ct | datetime}}
        el-table-column(width="170px" label="操作")
          template(slot-scope="scope")
            el-button(size="mini", @click="clickEditItem(scope.row)", type="primary", plain) 编辑
            el-button(size="mini", @click="clickDeleteItem(scope.row)", type="danger", plain) 删除
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import SearchBar from './SearchBar'
  import * as HomeTmplApi from 'src/api/home-template'
  import LoadPagerData from 'src/mixins/load-pager-data'

  export default {
    components: {
      SearchBar
    },
    mixins: [LoadPagerData],
    data () {
      return {
        queryParams: {
          name: ''
        }
      }
    },
    computed: {},
    methods: {
      getQueryApi (params) {
        return HomeTmplApi.getTemplateList(params)
      },
      handleSearch (data) {
        this.queryChange(data)
      },
      clickCreateItem () {
        this.$router.push({
          name: 'HomeTemplateCreate'
        })
      },
      clickEditItem (row) {
        this.$router.push({
          name: 'HomeTemplateEdit',
          params: {
            id: row.id
          }
        })
      },
      clickDeleteItem (row) {
        //
      },
      clickUseTenant (row) {
        //
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
