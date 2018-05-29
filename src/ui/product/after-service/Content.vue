<template lang="pug">

  mixin imageContent
    div.image-content(v-if!="props.row.tp === allContentTp.img.value", v-lazy:background-image="props.row.url")
  mixin textContent
    div.text-content(v-if!="props.row.tp === allContentTp.text.value")
      el-form-item.show-validate-el-form(:ref="`text${props.index}`", :prop="'items.' + props.index + '.text'", :rules="formRules.text")
        el-input(v-model.trim="props.row.text", :maxlength="26")

  div(style="width: 560px")
    smart-table(ref="contentTable", :dataList="items", :showHeader="false",  @drag-change="handleDragChange",  @drag-end="handleDragEnd")
      smart-table-column(type="drag")
      smart-table-column(label="内容")
        div(slot-scope="props")
          +imageContent
          +textContent
      smart-table-column(label="", width="120px")
        div(slot-scope="props")
          el-button(type="danger", size="mini", plain, @click="handleDel(props.index)") 删除
    div
      el-button(type="primary", size="mini", plain, @click="handleCreate") 添加
      el-button(type="primary", size="mini", plain, @click="preview") 预览
    create-content-dialog(ref="dlgCreateContent", @success="handleCreateSuccess")
    preview-dialog(ref="dlgPreview", :resources="items")
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter'
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import CreateContentDialog from './CreateContentDialog.vue'
  import * as ResourceService from 'src/service/resource/index'
  import PreviewDialog from 'src/ui/common/preview/PreviewDialog.vue'

  export default {
    mixins: [emitter],
    components: {
      SmartTable,
      SmartTableColumn,
      CreateContentDialog,
      PreviewDialog
    },
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        formRules: {
          text: [
            {required: true, message: '不能为空', trigger: 'change'}
          ]
        },
        ...$global.$mapConst({
          'allContentTp': ResourceService.allTp
        })
      }
    },
    watch: {
      async items (val) {
        await this.$nextTick()
        for (const i in val) {
          this.$refs[`text${i}`] && this.$refs[`text${i}`].onFieldChange()
        }
      }
    },
    methods: {
      handleDragChange (dataList) {
        this.$emit('update:items', arguments[0])
      },
      preview () {
        this.$refs.dlgPreview.show()
      },
      async handleDragEnd () {
        await this.$nextTick()
        for (const i in this.items) {
          this.$refs[`text${i}`] && this.$refs[`text${i}`].clearValidate()
        }
      },
      handleCreate () {
        this.$refs.dlgCreateContent.show()
        this.$emit('cleanValidate')
      },
      handleCreateSuccess (data) {
        this.items.push({...data})
      },
      handleDel (index) {
        this.items.splice(index, 1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-content {
    width: 50px;
    height: 50px;
    background-size: cover;
    background-position: center;
  }
</style>
