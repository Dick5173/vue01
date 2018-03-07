<template lang="pug">
  div
    div
      router-link(:to="{name:'FreightCreate'}")
        el-button(type="primary") 添加
    div(v-loading="loading")
      div(v-for="item in dataList")
        div.item
          el-card
            div.top-wrapper(slot="header")
              div.single-line.name {{ item.name }}
              div.count {{ item.product_count }}款商品
              div.action
                el-button(size="mini", type="primary", plain, @click="handleEditItem(item)") 编辑
                el-button(size="mini", :disabled="!!item.product_count", type="danger", plain, @click="handleDeleteItem(item)") 删除
            div.bottom-wrapper(v-html="freightDescText(item)")

</template>

<script>
  import * as FreightApi from 'src/api/freight-template'
  import * as FreightService from 'src/service/freight'

  export default {
    data () {
      return {
        loading: false,
        dataList: []
      }
    },
    methods: {
      async refreshDataList () {
        try {
          this.loading = true
          let res = await FreightApi.getList()
          this.dataList = res.data.data || []
        } finally {
          this.loading = false
        }
      },
      handleEditItem (item) {
        this.$router.push({
          name: 'FreightEdit',
          params: {
            id: item.id
          }
        })
      },
      async handleDeleteItem (item) {
        await this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        try {
          this.loading = true
          await FreightApi.deleteItem(item.id)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        } finally {
          this.loading = false
        }
        this.refreshDataList()
      },
      ...$global.$mapMethods({'freightDescText': FreightService.getDescText})
    },
    mounted () {
      this.refreshDataList()
    }
  }
</script>


<style lang="scss" scoped>

  .item {
    margin-top: 20px;
    width: 650px;
  }

  .top-wrapper {
    @include center-layout('v');

    .name {
      flex: 1;
      font-size: 20px;
      margin-right: 10px;
    }

    .count {
      font-size: 14px;
      margin-right: 10px;
    }
  }

  .bottom-wrapper {
    font-size: 14px;
    line-height: 18px;
  }


</style>
