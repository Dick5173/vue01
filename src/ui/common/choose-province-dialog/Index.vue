<template lang="pug">
  div
    el-dialog(title="选择地区", :visible.sync="dialogVisible", :width="commonDialogWidth", @close="closeCallback")
      el-table(ref="tabProvince", :data="allItems",border, @row-click="handleRowClick", :showHeader="false", @selection-change="handleSelectionChange", :height="200")
        el-table-column(prop="name", type="selection", width="63", :selectable="checkSelectable")
        el-table-column
          template(slot-scope="props") {{ props.row }}
      div(slot="footer", class="dialog-footer")
        el-button(@click="dialogVisible = false") 取 消
        el-button(type="primary", @click="handleSubmit") 确 定
</template>

<script>
  import { commonDialogWidth } from 'src/config/el'
  import * as AddressUtil from 'src/util/address'

  export default {
    data () {
      return {
        dialogVisible: false,
        ...$global.$mapConst({
          'commonDialogWidth': commonDialogWidth
        }),
        disabledItems: [],
        allItems: [],
        editItem: {},
        editIndex: 0,
        selectedItems: []
      }
    },
    methods: {
      async show (editItem, editIndex, disabledItems) {
        this.editItem = editItem
        this.editIndex = editIndex
        this.disabledItems = disabledItems || []
        this.dialogVisible = true
        await this.$nextTick()
        for (const item of this.editItem.province || []) {
          this.$refs.tabProvince.toggleRowSelection(item, true)
        }
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.$refs.tabProvince && this.$refs.tabProvince.clearSelection()
      },
      checkSelectable (row) {
        return this.disabledItems.indexOf(row) < 0
      },
      handleRowClick (row) {
      },
      handleSelectionChange (val) {
        this.selectedItems = val || []
      },
      handleSubmit () {
        this.editItem.province = this.selectedItems
        this.hide()
        this.$emit('submit', {data: this.editItem, index: this.editIndex})
      }
    },
    mounted () {
      this.allItems = AddressUtil.allProvince || []
    }
  }
</script>


<style lang="scss" scoped>
</style>


