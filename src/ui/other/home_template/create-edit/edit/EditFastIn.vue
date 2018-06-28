<template lang="pug">
  div.edit-fast-in-content
    left-arrow
    div.info-content
      div.top-title 快捷入口
      el-form(ref="form", :model="formData.wgt_short_entry", :rules="formRules")
        el-form-item(prop="items")
          smart-table(:dataList.sync="formData.wgt_short_entry.items", :showHeader="false", border)
            smart-table-column(type="drag")
            smart-table-column
              div(slot-scope="props")
                div.table-item
                  el-form-item(:ref="`cover${props.index}`", :prop="`items.${props.index}.cover`", :rules="formRules.cover")
                    div.upload-image
                      upload-image(ref="uploadCover", :image.sync="props.row.cover", :host="getHost", :token="getToken")
                      div.input-bottom-desc 建议尺寸80x80像素
                  div.error-content(v-if="isErrorItem(props.row)") {{isErrorItem(props.row)}}
                  div.jump-content(v-else)
                    el-form-item(:ref="`name${props.index}`", :prop="`items.${props.index}.name`", :rules="formRules.name")
                      div.edit-title
                        div 标题
                        el-input.input-txt(style="width:150px", v-model="props.row.name", :maxlength="5")
            smart-table-column(label="操作", width="120px")
              div(slot-scope="props")
                el-button(style="width:100px; margin-left:0; margin-top:5px", type="danger", size="small", @click="handleDeleteItem(props.index)") 删除
      div.add-content
        el-button(type="primary", :disabled="!showCreate", @click="handleAddItem") 添加
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import { SmartTable, SmartTableColumn, UploadImage } from '@baibao/zeratul'
  import * as AliyunApi from 'src/api/aliyun'
  import * as CustomPageService from 'src/service/home_template/index'
  import * as ElUtil from 'src/util/el'

  export default {
    components: {
      LeftArrow,
      SmartTable,
      SmartTableColumn,
      UploadImage
    },
    props: {
      queryParams: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    watch: {
      queryParams (val) {
        this.formData = val
      },
      formData: {
        handler (val) {
          this.$emit('update:queryParams', val)
        },
        deep: true
      }
    },
    data () {
      const itemsValidator = (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error('不能为空'))
          return
        }
        callback()
      }
      const coverValidator = (rule, value, callback) => {
        if (!value || !value.url || value.url === '') {
          callback(new Error('图片不能为空'))
          return
        }
        callback()
      }
      return {
        formData: this.queryParams,
        formRules: {
          items: [
            {validator: itemsValidator, trigger: 'change'}
          ],
          cover: [
            {validator: coverValidator, required: true, trigger: 'change'}
          ],
          name: [
            {required: true, message: '不能为空', trigger: 'change'}
          ]
        },
        ...$global.$mapConst({
          'allShowTp': CustomPageService.allShowTp,
          'allCustomTp': CustomPageService.allCustomTp
        })
      }
    },
    computed: {
      showCreate () {
        return this.formData.wgt_short_entry.items.length < 4
      }
    },
    methods: {
      isErrorItem (item) {
        return CustomPageService.isCustomError(item)
      },
      handleAddItem () {
        if (!this.formData.wgt_short_entry.items) {
          this.formData.wgt_short_entry.items = []
        }
        this.formData.wgt_short_entry.items.push(CustomPageService.createBannerItem())
      },
      handleDeleteItem (index) {
        this.formData.wgt_short_entry.items.splice(index, 1)
      },
      formValidate () {
        this.$refs.form.validate(async (valid) => {
          if (!valid) {
            ElUtil.scrollToInvalidFirstElement(this.$refs.form)
          }
        })
      },
      ...$global.$mapMethods({
        'getHost': AliyunApi.getOssHost,
        'getToken': AliyunApi.getOssToken
      })
    }
  }
</script>

<style lang="scss" scoped>
  .edit-fast-in-content {
    width: 542px;
    display: flex;

    .error-content {
      flex: 1;
      margin-left: 10px;
      height: 100%;
      line-height: 100px;
      text-align: center;
      background: #E7F6FD;
      color: #98CAE1;
      font-size: 14px;
    }

    .info-content {
      width: 100%;
      flex: 1;
      border: 1px solid #DFDFDF;
      padding: 10px;

      position: relative;
      background: #F5F5F5;
      line-height: 30px;
      border-radius: 10px;

      &:after {
        position: absolute;
        content: '';
        width: 20px;
        height: 20px;
        background: #F5F5F5;
        border-top-right-radius: 10px;
        top: 25px;
        left: -11px;
        border-bottom: solid 1px #DFDFDF;
        border-right: solid 1px #F5F5F5;
        border-top: solid 1px #F5F5F5;
        border-left: solid 1px #DFDFDF;
        transform: rotate(45deg);
      }

      .top-title {
        margin-bottom: 10px;
      }

      .table-item {
        display: flex;
        height: 130px;

        .upload-image {
          width: 130px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .jump-content {
          flex: 1;
          margin-left: 10px;
          padding: 20px 0;

          .edit-title {
            display: flex;
            color: $font-color-common;
            font-size: $home-size-title;
            align-items: center;

            .input-txt {
              flex: 1;
              margin-left: 10px;
            }
          }
        }
      }
      .add-content {
        margin-top: 20px;
        margin-bottom: 10px;
      }
    }
  }
</style>
