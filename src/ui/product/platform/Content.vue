<template lang="pug">

  mixin imageContent
    div.box
      div.image-content(v-if!="props.row.tp === allContentTp.img.value", v-lazy:background-image="props.row.url")
      div.text-content(v-if!="props.row.tp === allContentTp.img.value") {{computeFileName(props.row.url)}}
  mixin textContent
    div.text-content(v-if!="props.row.tp === allContentTp.text.value")
      el-form-item.show-validate-el-form(:ref="`text${props.index}`", :prop="'content.' + props.index + '.text'", :rules="formRules.text")
        el-input(v-model="props.row.text", :maxlength="2000", type="textarea", :autosize="{ minRows: 1, maxRows: 15}")
  mixin videoContent
    div.box
      div.image-content(v-lazy:background-image="props.row.poster", v-if!="props.row.tp === allContentTp.video.value")
      div.text-content-video(v-if!="props.row.tp === allContentTp.video.value")
        div.videoText {{props.row.text}}
        div {{props.row.name}}

  div
    smart-table.large-el-table(ref="contentTable", :dataList="content", :showHeader="false",  @drag-change="handleDragChange",  @drag-end="handleDragEnd")
      smart-table-column(type="drag")
      smart-table-column(label="内容")
        div(slot-scope="props")
          +imageContent
          +textContent
          +videoContent
      smart-table-column(label="", width="350px")
        div(slot-scope="props")
          el-button(type="", size="mini", plain, v-if="props.row.tp === allContentTp.video.value", @click="handleEditVideoName(props.row, props.index)") 改名
          el-button(type="primary", size="mini", icon="el-icon-plus", plain, @click="handleCreateAbove(props.index)") 上面
          el-button(type="primary", size="mini",  icon="el-icon-plus", plain, @click="handleCreateBelow(props.index)") 下面
          el-button(type="danger", size="mini", plain, @click="handleDel(props.index)") 删除
    div
      el-button(type="primary", size="mini", plain, @click="handleCreate") 添加描述
      el-button(type="primary", size="mini", plain, @click="showPreview") 预览
    create-content-dialog(ref="dlgCreateContent", @success="handleCreateSuccess", imageTip="建议宽度750像素")
    preview-dialog(ref="dlgPreview", :resources="content")
    dialog-edit-video-name(ref="dlgEditVideoName", @submit="handleChangeVideoName")
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter'
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import CreateContentDialog from './dialog/CreateContentDialog.vue'
  import PreviewDialog from 'src/ui/common/preview/PreviewDialog.vue'
  import * as ProductService from 'src/service/product/index'
  import DialogEditVideoName from './dialog/DialogEditVideoName.vue'

  export default {
    mixins: [emitter],
    components: {
      SmartTable,
      SmartTableColumn,
      CreateContentDialog,
      PreviewDialog,
      DialogEditVideoName
    },
    props: {
      content: {
        type: Array,
        required: true
      }
    },
    watch: {},
    data () {
      return {
        formRules: {
          text: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 2000, message: '最多可以输入2000个字符', trigger: 'blur'}
          ]
        },
        createAtPos: -1,
        ...$global.$mapConst({
          'allContentTp': ProductService.allProductInfoTp
        })
      }
    },
    methods: {
      showPreview () {
        this.$refs.dlgPreview.show()
      },
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
        this.createAtPos = this.content.length
        this.$refs.dlgCreateContent.show()
      },
      handleEditVideoName (row, index) {
        this.$refs.dlgEditVideoName.show(row.text, index)
      },
      handleCreateAbove (index) {
        this.createAtPos = index
        this.$refs.dlgCreateContent.show()
      },
      handleCreateBelow (index) {
        this.createAtPos = index + 1
        this.$refs.dlgCreateContent.show()
      },
      handleDel (index) {
        this.content.splice(index, 1)
      },
      handleCreateSuccess (data) {
        if (this.createAtPos < 0 || this.createAtPos >= this.content.length) {
          this.content.push(...this.R.clone(data))
        } else {
          this.content.splice(this.createAtPos, 0, ...this.R.clone(data))
        }
      },
      handleChangeVideoName (name, index) {
        const video = this.content[index]
        video.text = name
        this.$set(this.content, index, video)
      },
      computeFileName (url) {
        var index = url.lastIndexOf('/')
        var ext = url.substr(index + 1)
        return decodeURIComponent(ext.replace(/%25/g, '%'))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .text-content {
    height: 50px;
    width: 95%;
    margin-left: 10px;
    line-height: 50px;
    display: inline-block;
  }
  .text-content-video {
    display: flex;
    height: 50px;
    margin-left: 10px;
    display: inline-block;
    width: 80%;
    .videoText {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .box {
    display: flex;
  }

  .image-content {
    width: 50px;
    height: 50px;
    display: inline-block;
    background-size: cover;
    background-position: center;
  }
</style>
