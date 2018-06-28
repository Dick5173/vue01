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
        div.data-content
          el-form-item(ref="formItemCover", prop="cover")
            div.image
              upload-image(ref="uploadCover", :image.sync="editImage.cover", :host="getHost", :token="getToken")
              div.input-bottom-desc
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import * as CustomPageService from 'src/service/home_template/index'
  import { UploadImage, DateRangePicker } from '@baibao/zeratul'
  import * as AliyunApi from 'src/api/aliyun'
  import * as ElUtil from 'src/util/el'

  export default {
    components: {
      LeftArrow,
      DateRangePicker,
      UploadImage
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
      return {
        firstSaveWHShowId: 0,
        firstSaveWHIndex: 0,
        firstWidth: 0,
        firstHeight: 0,
        editIndex: 0,
        formData: this.queryParams,
        formRules: {
          cover: [{validator: coverValidator, trigger: 'change'}]
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
      }
    },
    methods: {
      isErrorItem () {
        return CustomPageService.isCustomError(this.editImage)
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
      }
    }
  }
</style>
