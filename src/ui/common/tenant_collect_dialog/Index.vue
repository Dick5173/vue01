<template lang="pug">
  el-dialog(title="收藏量", :visible.sync="dialogVisible")
    div(v-loading="loading")
      div.name {{product.name}}
      el-table(:data="dataList.data", border)
        el-table-column(label="店铺ID", prop="id")
        el-table-column(label="店铺")
          div.tenant-content(slot-scope="props")
            div.cover(v-lazy:background-image="props.row.head_img")
            span {{props.row.name}}
        el-table-column(label="收藏量", prop="collect_count")
    div.bottom
      el-pagination(:currentPage="dataList.page", :pageSize="dataList.limit", :total="dataList.total",  @current-change="changePage")
</template>

<script>
  import { getTenantCollects } from 'src/api/product'

  export default {
    components: {},
    props: {},
    data () {
      return {
        dialogVisible: false,
        loading: false,
        product: {},
        tenants: [],
        queryParams: {
          page: 1,
          limit: 10
        },
        dataList: {
          data: []
        }
      }
    },
    computed: {},
    methods: {
      async show (product) {
        this.product = product
        this.dialogVisible = true
        await this.refreshList()
      },
      hide () {
        this.dialogVisible = false
      },
      changePage (page) {
        this.queryParams.page = page
        this.refreshList()
      },
      async refreshList () {
        this.loading = true
        try {
          const res = await getTenantCollects(this.product.id, this.queryParams)
          this.dataList = res.data || []
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .name {
    padding-left: 5px;
    height: 50px;
  }

  .tenant-content {
    display: flex;
    align-items: center;
  }
  .cover {
    width: 30px;
    height: 30px;
    background-size: cover;
    border-radius: 50%;
    margin-right: 5px;
  }

  .bottom {
    margin-top: 10px;
  }


</style>
