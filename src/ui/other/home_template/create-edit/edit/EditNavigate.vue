<template lang="pug">
  div.edit-navigate-content
    left-arrow
    div.info-content
      div.title 搜索
      el-form(ref="form", :model="formData.wgt_search", :rules="formRules")
        el-form-item(ref="formItemCover", prop="logo")
          el-checkbox(v-model="formData.wgt_search.show_logo") LOGO
          upload-image(ref="uploadCover", :image.sync="formData.wgt_search.logo", :host="getHost", :token="getToken")
          div.input-bottom-desc 建议高度96像素，宽度小于384像素
        el-form-item
          el-checkbox(v-model="formData.wgt_search.show_tag") 标签入口
          div.input-bottom-desc 请完善产品标签，以免影响用户体验
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import * as AliyunApi from 'src/api/aliyun'
  import { UploadImage } from '@baibao/zeratul'
  import * as ElUtil from 'src/util/el'

  export default {
    components: {
      LeftArrow,
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
          if (val.wgt_search.logo && val.wgt_search.logo.url) {
            if (val.wgt_search.logo.width / val.wgt_search.logo.height > 4) {
              val.wgt_search.logo.url = ''
              val.wgt_search.logo.width = 0
              val.wgt_search.logo.height = 0
              this.$message({
                message: 'LOGO最大宽高比4:1',
                type: 'error'
              })
            }
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
        if (this.formData.wgt_search.show_logo) {
          if (this.RA.isNilOrEmpty(this.formData.wgt_search.logo.url)) {
            callback(new Error('请上传图片'))
            return
          }
        }
        if (this.R.and(this.coverRequired, this.R.or(!this.formData.wgt_search.logo, this.RA.isNilOrEmpty(this.formData.wgt_search.logo.url)))) {
          callback(new Error('请上传图片'))
          return
        }
        callback()
      }
      return {
        formData: this.queryParams,
        formRules: {
          logo: [{validator: coverValidator, trigger: 'change'}]
        }
      }
    },
    computed: {},
    methods: {
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
  .edit-navigate-content {
    width: 542px;
    margin-bottom: 10px;
    display: flex;

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


      .title {
        margin-bottom: 10px;
      }

      .margin-top {
        margin-top: 5px;
      }

      .margin-left {
        margin-top: 15px;
      }

    }



  }
</style>
