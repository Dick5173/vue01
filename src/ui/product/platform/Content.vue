<template lang="pug">

  mixin imageContent
    div.image-content(v-if!="props.row.tp === allContentTp.img.value", v-lazy:background-image="props.row.url")
  mixin textContent
    div.text-content(v-if!="props.row.tp === allContentTp.text.value")
      el-form-item.show-validate-el-form(:ref="`text${props.index}`", :prop="'content.' + props.index + '.text'", :rules="formRules.text")
        el-input(v-model.trim="props.row.text",  :maxlength="26")

  div
    smart-table.large-el-table(ref="contentTable", :dataList="content", @drag-change="handleDragChange",  @drag-end="handleDragEnd")
      table-column(type="drag")
      table-column(label="内容")
        div(slot-scope="props")
          +imageContent
          +textContent
      table-column(label="", width="250px")
        div(slot-scope="props")
          el-button(type="primary", size="mini", icon="el-icon-plus", plain) 上面
          el-button(type="primary", size="mini",  icon="el-icon-plus", plain) 下面
          el-button(type="danger", size="mini", plain) 删除
    div
      el-button(type="primary", size="mini", plain, @click="handleCreate") 添加描述
    create-content-dialog(ref="dlgCreateContent", @success="handleCreateSuccess")
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter'
  import SmartTable from 'src/ui/widget/smart-table/Table.vue'
  import TableColumn from 'src/ui/widget/smart-table/TableColumn.jsx'
  import UploadImage from 'src/ui/widget/upload-image/Index.vue'
  import CreateContentDialog from './CreateContentDialog.vue'
  import * as ResourceService from 'src/service/resource/index'

  export default {
    mixins: [emitter],
    components: {
      SmartTable,
      TableColumn,
      UploadImage,
      CreateContentDialog
    },
    props: {
      content: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        formRules: {
          text: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        ...$global.$mapConst({
          'allContentTp': ResourceService.allTp
        })
      }
    },
    methods: {
      handleDragChange (dataList) {
        this.$emit('update:content', arguments[0])
        this.dispatch('ElFormItem', 'el.form.change', [dataList])
      },
      async handleDragEnd () {
        await this.$nextTick()
        for (const i in this.content) {
          this.$refs[`text${i}`] && this.$refs[`text${i}`].clearValidate()
        }
      },
      handleCreate () {
        this.$refs.dlgCreateContent.show()
      },
      handleCreateSuccess (data) {
        this.content.push(
          {
            ...data
          }
        )
        console.log(' this.content', this.content)
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
