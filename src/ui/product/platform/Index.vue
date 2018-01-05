<template lang="pug">
  div(v-loading="loading")
    search-bar(:queryParams="queryParams", @submit="handleSearch")
    router-link(:to="{name:'PlatformProductCreate'}")
      el-button(type="primary", icon="el-icon-plus") 添加
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(type="selection", width="55px")
        el-table-column(prop="cover", label="", width="70px")
          div.cover(slot-scope="props", v-lazy:background-image="showCover(props.row)")
        el-table-column(prop="name", label="商品")
        el-table-column(prop="suggest_price", label="建议售价", sortable, width="110px")
          div(slot-scope="props") {{ props.row | productSuggestPrice }}
        el-table-column(prop="sold", label="销量", sortable, width="100px")
        el-table-column(prop="stock", label="库存", sortable, width="100px")
          div(slot-scope="props") {{ props.row.prop.stock }}
        el-table-column(prop="tenant_count", label="店铺选择", sortable, width="110px")
        el-table-column(prop="pt", label="上架时间", sortable, width="160px")
          div(slot-scope="props", v-if="props.row.pt > 0") {{ props.row.pt | datetime }}
        el-table-column(type="expand", fixed="right")
          div(slot-scope="props")
            el-table.small-el-table(:data="props.row.prop.skus || []", border)
              el-table-column(prop="spec", label="规格")
              el-table-column(prop="suggest_price", label="建议售价")
                div(slot-scope="skuProps") {{ skuProps.row.suggest_price | price(false) }}
              el-table-column(prop="sold", label="销量")
              el-table-column(prop="stock", label="库存")
        el-table-column(label="操作", width="120px", fixed="right")
          div(slot-scope="props")
            el-dropdown()
              el-button(type="primary", size="medium")
                | 操作
                i.el-icon-arrow-down.el-icon--right()
              el-dropdown-menu(slot="dropdown")
                el-dropdown-item &nbsp;&nbsp;编辑&nbsp;&nbsp;
                el-dropdown-item &nbsp;&nbsp;复制&nbsp;&nbsp;
                el-dropdown-item &nbsp;&nbsp;下架&nbsp;&nbsp;
                el-dropdown-item &nbsp;&nbsp;置顶&nbsp;&nbsp;
                el-dropdown-item &nbsp;&nbsp;删除&nbsp;&nbsp;
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import SearchBar from './SearchBar.vue'
  import * as ProductApi from 'src/api/product'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { showCover } from 'src/service/product/index'

  export default {
    name: 'AdminIndex',
    mixins: [
      LoadPagerData
    ],
    components: {
      SearchBar
    },
    data () {
      return {
        queryParams: {}
      }
    },
    watch: {},
    methods: {
      getQueryApi (params) {
        return ProductApi.getList(params)
      },
      shouldResetRouteQuery (to, from) {
        return from.name === 'ManagerCreate'
      },
      handleEditItem (item) {
        this.$router.push({
          name: 'ManagerEdit',
          params: {
            id: item.id
          }
        })
      },
      handleSearch () {
      },
      ...$global.$mapMethods({'showCover': showCover})
    }
  }
</script>

<style lang="scss" scoped>
  .cover {
    width: 50px;
    height: 50px;
    background-size: cover;
    background-position: center;
  }
</style>
