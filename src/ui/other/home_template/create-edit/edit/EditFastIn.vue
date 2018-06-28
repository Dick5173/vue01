<template lang="pug">
  div.edit-fast-in-content
    left-arrow
    div.info-content
      div.top-title 快捷入口
      el-form(ref="form", :model="formData.wgt_short_entry", :rules="formRules")
        el-form-item(prop="items")
          smart-table(:dataList.sync="formData.wgt_short_entry.items", :showHeader="false", border)
            smart-table-column(type="drag")
            smart-table-column(label="商品")
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
                    el-form-item(:ref="`action_tp${props.index}`", :prop="`items.${props.index}.action_tp`", :rules="formRules.action_tp")
                      div.name-content
                        div {{showTitle(props.row)}}
                        div.txt-btn.name(@click="clickPreview(props.row)") {{showName(props.row)}}
                    div.time(v-if="props.row.online_tp === allShowTp.show_limit.value")
                      div {{showTime(props.row)}}
            smart-table-column(label="操作", width="120px")
              div(slot-scope="props")
                el-button(v-if="props.row.action_tp !== allCustomTp.empty.value && !isErrorItem(props.row)", style="width:100px; margin-left:0", type="primary", plain, size="small", v-clipboard:copy="getAppUrl(props.row)", v-clipboard:success="onCopy", v-clipboard:error="onError") 小程序链接
                el-button(style="width:100px; margin-left:0; margin-top:5px", type="primary", plain, size="small", @click="clickChooseJump(props.row, props.index)") 选择跳转
                el-button(style="width:100px; margin-left:0; margin-top:5px", type="danger", size="small", @click="handleDeleteItem(props.index)") 删除
      div.add-content
        el-button(type="primary", :disabled="!showCreate", @click="handleAddItem") 添加
    dialog-choose-jump(ref="dialogChooseJump", @choose="handleChooseJump")
    <!--micro-preview-dialog(ref="dlgMinPreview")-->
    product-detail-dialog(ref="dlgProductDetail")
    product-Tags-dialog(ref="dlgTagPreview")
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import { SmartTable, SmartTableColumn, UploadImage } from '@baibao/zeratul'
  import DialogChooseJump from '../dialog/DialogChooseJump'
  import * as AliyunApi from 'src/api/aliyun'
  import * as CustomPageService from 'src/service/home_template/index'
  import { dateFormat } from 'src/util/format'
  // import MicroPreviewDialog from 'src/ui/micropage/preview/Index.vue'
  import ProductDetailDialog from 'src/ui/common/ProductDetail/ProductDetailDialog.vue'
  import * as ElUtil from 'src/util/el'
  import ProductTagsDialog from '../dialog/ProductTagsDialog'

  export default {
    components: {
      LeftArrow,
      SmartTable,
      SmartTableColumn,
      UploadImage,
      DialogChooseJump,
      // MicroPreviewDialog,
      ProductDetailDialog,
      ProductTagsDialog
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
      const actionValidator = (rule, value, callback) => {
        if (value === 0) {
          callback(new Error('请选择跳转方式'))
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
          ],
          action_tp: [
            {validator: actionValidator, required: true, trigger: 'change'}
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
      getAppUrl (row) {
        switch (row.action_tp) {
          case CustomPageService.allCustomTp.product.value:
            return `pages/goods/detail?pid=${row.product.id}`
          case CustomPageService.allCustomTp.min_page.value:
            return `pages/micropage/index?mid=${row.min_page.id}&isShare=1`
          case CustomPageService.allCustomTp.product_group.value:
            return `pages/goods/index?gid=${row.product_group.id}&isShare=1`
          case CustomPageService.allCustomTp.all_product.value:
            return `pages/goods/index?gid=0&isShare=1`
          case CustomPageService.allCustomTp.empty.value:
            return ``
        }
      },
      onError () {
        this.$message({
          type: 'danger',
          message: '复制失败'
        })
      },
      onCopy () {
        this.$message({
          type: 'success',
          message: '已复制小程序链接到剪贴板'
        })
      },
      showTitle (row) {
        switch (row.action_tp) {
          case CustomPageService.allCustomTp.product.value:
            return '商品：'
          case CustomPageService.allCustomTp.product_group.value:
            return '商品组：'
          case CustomPageService.allCustomTp.min_page.value:
            return '微页面：'
          case CustomPageService.allCustomTp.all_product.value:
            return '全部商品'
          case CustomPageService.allCustomTp.other_app.value:
            return '其它小程序'
          case CustomPageService.allCustomTp.product_tag.value:
            return '标签商品页：'
          case CustomPageService.allCustomTp.empty.value:
            return '无'
        }
      },
      showName (row) {
        switch (row.action_tp) {
          case CustomPageService.allCustomTp.product.value:
            if (!row.product || !row.product.name) {
              return ''
            }
            return row.product.name
          case CustomPageService.allCustomTp.product_group.value:
            if (!row.product_group || !row.product_group.name) {
              return ''
            }
            return row.product_group.name
          case CustomPageService.allCustomTp.min_page.value:
            return row.min_page.name
          case CustomPageService.allCustomTp.product_tag.value:
            if (row.product_tag_tp === CustomPageService.productTagTp.product_tag_group_id.value) {
              return row.product_tag_group.name
            } else {
              return `${row.product_tag.tag_group.name}-${row.product_tag.name}`
            }
          default:
            return ''
        }
      },
      showTime (row) {
        return `上线时间：${dateFormat(row.online_start)}-${dateFormat(row.online_end)}`
      },
      handleAddItem () {
        if (!this.formData.wgt_short_entry.items) {
          this.formData.wgt_short_entry.items = []
        }
        this.formData.wgt_short_entry.items.push(CustomPageService.createBannerItem())
      },
      clickChooseJump (item, index) {
        this.$refs.dialogChooseJump.show(item, false, index)
      },
      async handleChooseJump (form, index) {
        await this.$nextTick()
        this.$refs[`action_tp${index}`].onFieldChange()
      },
      handleDeleteItem (index) {
        this.formData.wgt_short_entry.items.splice(index, 1)
      },
      clickPreview (row) {
        if (row.action_tp === CustomPageService.allCustomTp.product.value) {
          this.$refs.dlgProductDetail.show(row.product, true)
        } else if (row.action_tp === CustomPageService.allCustomTp.min_page.value) {
          this.$refs.dlgMinPreview.show(row.min_page.id)
        } else if (row.action_tp === CustomPageService.allCustomTp.product_tag.value) {
          this.$refs.dlgTagPreview.show(row)
        }
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

          .name-content {
            display: flex;
            margin-top: 20px;

            .name {
              @include maxLine(1);
              flex: 1;
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
