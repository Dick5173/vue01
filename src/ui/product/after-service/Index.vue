<template lang="pug">
  div
    div
      router-link(:to="{name:'AfterServiceCreate'}")
        el-button(type="primary", icon="el-icon-plus") 添加
    div(style="margin-top: 20px;")
      el-table.large-el-table(:data="dataList", border, :show-header="false", v-loading="loading")
        el-table-column(prop="name")
        el-table-column
          template(slot-scope="scope")
            div {{scope.row.pc}}款商品
        el-table-column
          template(slot-scope="scope")
            el-button(size="small", type="primary", @click="editItem(scope.row)") 编 辑
            el-button(size="small", type="danger", @click="deleteItem(scope.row)") 删 除
</template>

<script>
  import * as AfterServiceApi from 'src/api/after-service'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dataList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      editItem (row) {
        this.$router.push({
          name: 'AfterServiceEdit',
          params: {
            id: row.id
          }
        })
      },
      deleteItem (row) {
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            this.loading = true
            await AfterServiceApi.deleteItem(row.id)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } catch (err) {
            this.loading = false
          }
          this.refreshDataList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      async refreshDataList () {
        try {
          this.loading = true
          let res = await AfterServiceApi.getList()
          this.dataList = res.data.data
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      }
    },
    mounted () {
      this.refreshDataList()
    }
  }
</script>


<style lang="scss" scoped>

</style>
