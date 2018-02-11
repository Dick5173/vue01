<template lang="pug">
  div(v-loading="loading")
    div
      el-button(type="primary", @click="handleCreate") 添加
    div.medium-el-table
      smart-table(ref="tabCategory", :dataList.sync="colorList", @drag-end="handleDragEnd", rowKey="id")
        smart-table-column(label="", type="drag")
        smart-table-column(label="主题色", prop="color")
          template(slot-scope="scope")
            div(style="display: flex")
              div.color(v-bind:style="showColor(scope.row)")
              div.text {{scope.row.color}}
        smart-table-column(label="操作", width="200px")
          template(slot-scope="scope")
            el-button(size="mini", plain, type="primary", @click="handleEdit(scope.row)") 编辑
            el-button(size="mini", plain, type="danger", :disabled="scope.row.tenant_count !==0 ", @click="handelDelete(scope.row)") 删除
    pick-color-dialog(ref="dlgPickColor", @refresh="loadData")
</template>

<script>
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import * as ColorApi from 'src/api/theme-color'
  import PickColorDialog from 'src/ui/other/theme-color/FormDialog.vue'

  export default {
    props: {},
    components: {
      SmartTable,
      SmartTableColumn,
      PickColorDialog
    },
    data () {
      return {
        loading: false,
        colorList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      showColor (row) {
        return {background: row.color}
      },
      async loadData () {
        try {
          this.loading = true
          let res = await ColorApi.getColorList()
          this.colorList = res.data.data
        } finally {
          this.loading = false
        }
      },
      handleCreate () {
        this.$refs.dlgPickColor.show()
      },
      handleEdit (row) {
        this.$refs.dlgPickColor.show(row)
      },
      async handelDelete (row) {
        try {
          this.loading = true
          await ColorApi.deleteThemeColor(row.id)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.loadData()
        } finally {
          this.loading = false
        }
      },
      async handleDragEnd () {
        this.loading = true
        try {
          await ColorApi.sortThemeColor(this.R.map(item => {
            return item.id
          })(this.colorList || []))
          this.$message({message: '排序成功', type: 'success'})
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.loadData()
    }
  }
</script>


<style lang="scss" scoped>
  .color{
    width: 50px;
    height: 50px;
    display: inline-block;
  }
  .text{
    display: inline-block;
    height: 50px;
    line-height: 50px;
    margin-left: 10px;
  }
</style>
