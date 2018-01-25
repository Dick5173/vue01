<template lang="pug">
  div
    div
      search-bar(:queryParams="queryParams", @submit="handleSearch")
    div.button-box
      el-button.button(size="small", type="primary", @click="") 导&nbsp出
    div(v-loading="loading")
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border, @selection-change="handleSelectionChange")
        el-table-column(type="selection", width="55px")
        el-table-column(prop="", label="ID", width="55px")
          template(slot-scope="props")
            el-button(type="text", @click="") {{props.row.id}}
        el-table-column(prop="cover", label="", width="70px")
          div.cover(slot-scope="props", v-lazy:background-image="showCover(props.row)")
        el-table-column(prop="name", label="商品")
        el-table-column(prop="price", label="售价", sortable, width="110px")
          div(slot-scope="props") {{ props.row | productPrice }}
        el-table-column(prop="sold", label="销量", sortable, width="100px")
        el-table-column(prop="stock", label="库存", sortable, width="100px")
          div(slot-scope="props") {{ props.row.prop.stock }}
        el-table-column(prop="", label="店铺ID", width="110px")
          div(slot-scope="props")
            el-button(type="text", @click="") {{props.row.tenant_count}}
        el-table-column(prop="pt", label="首次上架", sortable, width="160px")
          div(slot-scope="props", v-if="props.row.pt > 0") {{ props.row.pt | datetime }}
        el-table-column(type="expand", fixed="right")
          div(slot-scope="props")
            el-table.small-el-table(:data="props.row.prop.skus || []", border)
              el-table-column(prop="spec", label="规格")
              el-table-column(prop="suggest_price", label="建议售价")
                div(slot-scope="skuProps") {{ skuProps.row.suggest_price | price(false) }}
              el-table-column(prop="sold", label="销量")
              el-table-column(prop="stock", label="库存")
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import * as TenantSelfProductApi from 'src/api/tenant-self-product'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { showCover } from 'src/service/product/index'
  import { dateFormat } from 'src/util/format'
  import SearchBar from './SearchBar.vue'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {
      SearchBar
    },
    data () {
      return {
        queryParams: {
          tenant_id: '',
          start: 0,
          end: 0,
          text: ''
        },
        multipleSelection: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        return TenantSelfProductApi.getTenantSelfList(this.R.mapObjIndexed((val, key, obj) => {
          if (key === 'start' || key === 'end') {
            if (val === 0) {
              return ''
            } else {
              return dateFormat(val, 'YYYY-MM-DD')
            }
          }
          return val
        })(params))
      },
      handleSearch (data) {
        this.queryChange(data)
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
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

  .button-box {
    .button {
      margin-bottom: 15px;
      float: right;
    }
  }
</style>
