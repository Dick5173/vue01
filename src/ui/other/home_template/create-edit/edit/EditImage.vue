<template lang="pug">
  div.edit-image-content
    left-arrow
    div.info-content
      div 图片
      el-form(ref="form", :model="formData.wgt_img", :rules="formRules")
        el-form-item
          el-radio.margin(v-for="item in columnStyle", :key="item.label", :label="item.label", v-model="formData.wgt_img.style_tp", @change="changeColumn") {{item.value}}
          div.image-content
            div.one-img(v-if="formData.wgt_img.style_tp === 1") 宽度1242像素；高度不大于2000像素
            div.two-three-img(v-if="formData.wgt_img.style_tp === 2")
              el-radio-group(v-model="editIndex")
                el-radio-button(:label="0")
                  div.img 宽度621像素<br>高度不大于2000像素<br>图片尺寸保持一致
                el-radio-button(:label="1")
                  div.img 宽度621像素<br>高度不大于2000像素<br>图片尺寸保持一致
            div.two-three-img(v-if="formData.wgt_img.style_tp === 3")
              el-radio-group(v-model="editIndex")
                el-radio-button(:label="0")
                  div.img 宽度414像素<br>高度不大于2000像素<br>图片尺寸保持一致
                el-radio-button(:label="1")
                  div.img 宽度414像素<br>高度不大于2000像素<br>图片尺寸保持一致
                el-radio-button(:label="2")
                  div.img 宽度414像素<br>高度不大于2000像素<br>图片尺寸保持一致
        el-form-item
          el-checkbox(v-model="formData.wgt_img.margin_bottom") 底部间距
        el-form-item(label="上线时间：", prop="online_tp")
          el-radio-group(v-model="formData.wgt_img.online_tp")
            div
              el-radio(:label="allShowTp.show_long.value") {{ allShowTp.show_long.text }}
            div
              el-radio(:label="allShowTp.show_limit.value")
                date-range-picker(:start.sync="formData.wgt_img.online_start", :end.sync="formData.wgt_img.online_end", type="datetimerange")
        div.data-content
          el-form-item(ref="formItemCover", prop="cover")
            div.image
              upload-image(ref="uploadCover", :image.sync="editImage.cover", :host="getHost", :token="getToken")
              div.input-bottom-desc
          el-form-item(ref="fIAction", prop="action_tp")
            div.select-content(v-if="editEmpty")
              el-button(type="primary", plain, size="small", @click="handleChooseJump") 选择跳转
            div.selected-content(v-else)
              div.error-content(v-if="isErrorItem()") {{isErrorItem()}}
              div.left(v-else)
                div.title {{selectedTitle}}
                div.name.txt-btn(@click="clickPreview") {{selectedName}}
              div.right
                el-button(v-if="editImage.action_tp !== allCustomTp.empty.value && !isErrorItem()", style="width:100px; margin-left:0", type="primary", plain, size="small", v-clipboard:copy="getAppUrl()", v-clipboard:success="onCopy", v-clipboard:error="onError") 小程序链接
                el-button(style="width:100px; margin-left:0; margin-top:5px", type="primary", plain, size="small", @click="handleChooseJump") 选择跳转
    dialog-choose-jump(ref="dialogChooseJump", @choose="chooseJump")
    <!--micro-preview-dialog(ref="dlgMinPreview")-->
    product-detail-dialog(ref="dlgProductDetail")
    product-Tags-dialog(ref="dlgTagPreview")
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import DialogChooseJump from '../dialog/DialogChooseJump'
  import * as CustomPageService from 'src/service/home_template/index'
  import { UploadImage, DateRangePicker } from '@baibao/zeratul'
  import * as AliyunApi from 'src/api/aliyun'
  // import MicroPreviewDialog from 'src/ui/micropage/preview/Index.vue'
  import ProductDetailDialog from 'src/ui/common/ProductDetail/ProductDetailDialog.vue'
  import ProductTagsDialog from '../dialog/ProductTagsDialog'
  import * as ElUtil from 'src/util/el'

  export default {
    components: {
      LeftArrow,
      DateRangePicker,
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
        },
        required: true
      }
    },
    watch: {
      queryParams (val) {
        this.formData = val
      },
      formData: {
        handler (val) {
          if (val.wgt_img.items.length > 1) {
            if (val.wgt_img.items.length <= this.firstSaveWHIndex || !val.wgt_img.items[this.firstSaveWHIndex].cover.url || this.firstSaveWHShowId !== val.show_id) {
              this.firstWidth = 0
              this.firstHeight = 0
            }
            val.wgt_img.items.forEach((item, index) => {
              if (item.cover && item.cover.url) {
                if (this.firstWidth === 0 && this.firstHeight === 0) {
                  this.firstSaveWHShowId = val.show_id
                  this.firstSaveWHIndex = index
                  this.firstWidth = item.cover.width
                  this.firstHeight = item.cover.height
                } else if (item.cover.width !== this.firstWidth || item.cover.height !== this.firstHeight) {
                  item.cover.url = ''
                  item.cover.width = 0
                  item.cover.height = 0
                  this.$message({
                    message: '图片尺寸不一致',
                    type: 'error'
                  })
                }
              }
            })
          }
          this.$emit('update:queryParams', val)
        },
        deep: true
      }
    },
    data () {
      const showTpValidator = (rule, value, callback) => {
        if (this.formData.wgt_img.online_tp === CustomPageService.allShowTp.show_limit.value && (this.formData.wgt_img.online_start === 0 || this.formData.wgt_img.online_end === 0)) {
          callback(new Error('请选择开始时间和结束时间'))
          return
        }
        callback()
      }
      const coverValidator = (rule, value, callback) => {
        if (this.$refs.uploadCover.isUpdating) {
          callback(new Error('正在上传图片'))
          return
        }
        if (this.RA.isNilOrEmpty(this.editImage.cover.url)) {
          callback(new Error('请上传图片'))
          return
        }
        if (this.R.and(this.coverRequired, this.R.or(!this.editImage.cover, this.RA.isNilOrEmpty(this.editImage.cover.url)))) {
          callback(new Error('请上传图片'))
          return
        }
        callback()
      }
      const actionValidator = (rule, value, callback) => {
        if (this.formData.wgt_img.items && this.formData.wgt_img.items.length > this.editIndex && this.formData.wgt_img.items[this.editIndex].action_tp === 0) {
          callback(new Error('请选择跳转方式'))
          return
        }
        callback()
      }
      return {
        firstSaveWHShowId: 0,
        firstSaveWHIndex: 0,
        firstWidth: 0,
        firstHeight: 0,
        editIndex: 0,
        formData: this.queryParams,
        formRules: {
          cover: [{validator: coverValidator, trigger: 'change'}],
          online_tp: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: showTpValidator, trigger: 'change'}
          ],
          action_tp: [
            {validator: actionValidator, required: true, trigger: 'change'}
          ]
        },
        columnStyle: [
          {
            label: 1,
            value: '1行1张'
          },
          {
            label: 2,
            value: '1行2张'
          },
          {
            label: 3,
            value: '1行3张'
          }
        ],
        ...$global.$mapConst({
          'allShowTp': CustomPageService.allShowTp,
          'allCustomTp': CustomPageService.allCustomTp
        })
      }
    },
    computed: {
      editImage: {
        get () {
          return this.formData.wgt_img.items[this.editIndex]
        },
        set (val) {
          this.formData.wgt_img.items[this.editIndex] = val
        }
      },
      editEmpty () {
        return this.editImage.action_tp === 0
      },
      selectedTitle () {
        switch (this.editImage.action_tp) {
          case CustomPageService.allCustomTp.product.value:
            return '商品：'
          case CustomPageService.allCustomTp.product_group.value:
            return '商品组：'
          case CustomPageService.allCustomTp.min_page.value:
            return '微页面：'
          case CustomPageService.allCustomTp.all_product.value:
            return '全部商品'
          case CustomPageService.allCustomTp.other_app.value:
            return '其他小程序'
          case CustomPageService.allCustomTp.product_tag.value:
            return '标签商品页：'
          case CustomPageService.allCustomTp.empty.value:
            return '无'
        }
      },
      selectedName () {
        switch (this.editImage.action_tp) {
          case CustomPageService.allCustomTp.product.value:
            return this.editImage.product.name
          case CustomPageService.allCustomTp.product_group.value:
            return this.editImage.product_group.name
          case CustomPageService.allCustomTp.min_page.value:
            return this.editImage.min_page.name
          case CustomPageService.allCustomTp.product_tag.value:
            if (this.editImage.product_tag_tp === CustomPageService.productTagTp.product_tag_group_id.value) {
              return this.editImage.product_tag_group.name
            } else {
              return `${this.editImage.product_tag.tag_group.name}-${this.editImage.product_tag.name}`
            }
          default:
            return ''
        }
      }
    },
    methods: {
      isErrorItem () {
        return CustomPageService.isCustomError(this.editImage)
      },
      getAppUrl () {
        switch (this.editImage.action_tp) {
          case CustomPageService.allCustomTp.product.value:
            return `pages/goods/detail?pid=${this.editImage.product.id}`
          case CustomPageService.allCustomTp.min_page.value:
            return `pages/micropage/index?mid=${this.editImage.min_page.id}&isShare=1`
          case CustomPageService.allCustomTp.product_group.value:
            return `pages/goods/index?gid=${this.editImage.product_group.id}&isShare=1`
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
      changeColumn () {
        this.editIndex = 0
        const diffNum = this.formData.wgt_img.style_tp - this.formData.wgt_img.items.length
        if (diffNum > 0) {
          for (let i = 0; i < diffNum; i++) {
            this.formData.wgt_img.items.push(CustomPageService.createImageItem())
          }
        } else {
          this.formData.wgt_img.items.splice(this.formData.wgt_img.style_tp, Math.abs(diffNum))
        }
      },
      handleChooseJump () {
        this.$refs.dialogChooseJump.show(this.editImage)
      },
      chooseJump (data) {
        this.$refs.fIAction.onFieldChange()
      },
      clickPreview () {
        if (this.editImage.action_tp === CustomPageService.allCustomTp.product.value) {
          this.$refs.dlgProductDetail.show(this.editImage.product, true)
        } else if (this.editImage.action_tp === CustomPageService.allCustomTp.min_page.value) {
          this.$refs.dlgMinPreview.show(this.editImage.min_page.id)
        } else if (this.editImage.action_tp === CustomPageService.allCustomTp.product_tag.value) {
          this.$refs.dlgTagPreview.show(this.editImage)
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
  .edit-image-content {
    width: 542px;
    margin-bottom: 10px;
    display: flex;

    .error-content {
      height: 100%;
      flex: 1;
      margin-right: 20px;
      line-height: 80px;
      background: #E7F6FD;
      color: #98CAE1;
      font-size: 14px;
      text-align: center;
    }

    .info-content {
      flex: 1;
      width: 100%;
      height: 100%;
      padding: 10px;
      border: 1px solid #DFDFDF;

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

      .margin {
        margin-top: 10px;
      }

      .image-content {
        margin-top: 10px;

        .one-img {
          background: #fff;
          width: 450px;
          height: 100px;
          line-height: 100px;
          text-align: center;
          border: 1px solid #d6d6d6;
        }

        .two-three-img {
          width: 450px;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;

          .img {
            font-size: 12px;
            width: 100px;
            height: 100px;
            line-height: 20px;
            text-align: center;
          }
        }
      }

      .data-content {
        border-top: 1px solid #d6d6d6;
        display: flex;
        align-items: center;
        width: 450px;
        height: 120px;
        padding: 10px;

        .image {
          width: 150px;
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .select-content {
          width: 280px;
          height: 80px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .selected-content {
          width: 280px;
          height: 80px;
          flex: 1;
          display: flex;

          .left {
            width: 100%;
            flex: 1;
            display: flex;
            align-items: center;

            .title {
              color: $font-color-common;
              font-size: $home-size-title;
            }

            .name {
              color: $color-primary;
              font-size: $home-size-title;
              @include maxLine(1);
              line-height: 20px;
              flex: 1;
            }
          }

          .right {
            width: 100px;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

        }
      }
    }
  }
</style>
