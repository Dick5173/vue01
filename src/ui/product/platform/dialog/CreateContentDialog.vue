<template lang="pug">
  mixin textContent
    el-form-item.show-validate-el-form(ref="fiShowText", v-if!="formData.tp === allContentTp.text.value", label="", prop="text")
      div.input-text-wrapper
        el-input(v-model="formData.text", :maxlength="2000", type="textarea", autosize)
      div.desc-text 建议26个字以内
  mixin imageContent
    el-form-item.show-validate-el-form(ref="fiImage", v-if!="formData.tp === allContentTp.img.value", label="", prop="imageList")
      upload-image-list(ref="uploadImage", :imageList.sync="formData.imageList", :host="getHost", :token="getToken")
      div.desc-text {{imageTip}}
  mixin videoContent
    div.videoContent(v-if!="formData.tp === allContentTp.video.value")
      el-form-item.video-show-validate-el-form(ref="",label="视频", prop="video")
        upload-video(ref="fIUploadVideo", :host="getHost", :token="getToken", :video.sync="formData.video", :beforeUploadCheck="beforeUploadCheck", accept="video/mp4", uploadButtonText="选择视频")
        div.el-upload__tip mp4格式，50M以下，建议720P
      el-form-item(label="封面", prop="")
        upload-image.uploadImage(ref="fIUploadCover", :image.sync="formData.videoImage", :host="getHost", :token="getToken")
        span.el-upload__tip 建议与视频宽高比相同
      el-form-item(label="标题")
        el-input(v-model="formData.video.text", placeholder="最多40个字符", :maxlength="40")

  el-dialog(:visible.sync="dialogVisible", title="添加描述", :width="mediumDialogWidth", @close="closeCallback")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="80px")
      el-form-item(label="类型", prop="tp")
        el-radio-group(v-model="formData.tp", @change="handleTpChange")
          el-radio(v-for!="item in allContentTp", :label="item.value", :key="item.value") {{ item.text }}
      + textContent
      + imageContent
      + videoContent
    div.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary", :loading="loading", @click="submit") 确定
</template>

<script>
  import * as AliyunApi from 'src/api/aliyun'
  import { mediumDialogWidth } from 'src/config/el'
  import * as ResourceService from 'src/service/resource/index'
  import { UploadImageList, UploadVideo, UploadImage } from '@baibao/zeratul'

  export default {
    components: {
      UploadImageList,
      UploadImage,
      UploadVideo
    },
    props: {
      imageTip: {
        type: String,
        default: ''
      }
    },
    data () {
      const validateImage = (rule, value, callback) => {
        if (this.$refs.uploadImage && this.$refs.uploadImage.isUpdating) {
          callback(new Error('图片正在上传中'))
          return
        }
        if (value) {
          if (value.length <= 0) {
            callback(new Error('请选择图片'))
            return
          } else {
            callback()
            return
          }
        }
        callback(new Error('请选择图片'))
      }
      const validateVideo = (rule, value, callback) => {
        if (this.$refs.fIUploadVideo.isUpdating) {
          callback(new Error('正在上传视频'))
          return
        } else if (!value || !value.url || value.url === '') {
          callback(new Error('请选择视频'))
          return
        }
        callback()
      }
      return {
        loading: false,
        initialData: null,
        extArr: ['.mp4'],
        formData: {
          tp: ResourceService.allTp.text.value,
          text: '',
          imageList: [],
          video: {
            url: '',
            name: '',
            duration: 0,
            file_size: 0,
            width: 0,
            height: 0,
            poster: '',
            text: ''
          },
          videoImage: {
            url: '',
            width: 0,
            height: 0
          }
        },
        formRules: {
          text: [
            {required: true, message: '请输入文本', trigger: 'blur'},
            {max: 2000, message: '最多可输入2000个字符', trigger: 'blur'}
          ],
          imageList: [
            {validator: validateImage, trigger: 'change'}
          ],
          video: [
            {required: true, validator: validateVideo, trigger: 'change'}
          ]
        },
        dialogVisible: false,
        ...$global.$mapConst({
          'mediumDialogWidth': mediumDialogWidth,
          'allContentTp': ResourceService.allTp
        })
      }
    },
    watch: {
      'formData.video': {
        handler (val) {
          if (!this.formData.videoImage.url) {
            this.formData.videoImage = {
              width: val.width,
              height: val.height,
              url: val.poster
            }
          }
        },
        deep: true
      }
    },
    methods: {
      async show () {
        this.dialogVisible = true
        await this.$nextTick()
        if (!this.initialData) {
          this.initialData = this.R.clone(this.formData)
        }
        this.formData = this.R.clone(this.initialData)
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.$refs.form && this.$refs.form.clearValidate()
        // 保持tp, 只重置数据
        this.formData.text = ''
        this.formData.imageList = []
        this.formData.video = {
          url: '',
          name: '',
          duration: 0,
          file_size: 0,
          width: 0,
          height: 0,
          poster: '',
          text: ''
        }
        this.formData.videoImage = {
          url: '',
          width: 0,
          height: 0
        }
      },
      beforeUploadCheck (file) {
        const err = this.R.none(item => {
          return this.R.endsWith(item)(file.name)
        })(this.extArr || [])
        if (err) {
          this.$message({
            message: '请选择有效文件',
            type: 'error'
          })
          return false
        }
        if (file.size > 1024 * 1024 * 50) {
          this.$message({
            message: '文件最大为50M',
            type: 'error'
          })
          return false
        }
        return true
      },
      async submit () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          try {
            if (valid) {
              let result = []
              switch (this.formData.tp) {
                case this.allContentTp.text.value:
                  result = [{
                    tp: this.allContentTp.text.value,
                    text: this.formData.text,
                    url: '',
                    width: 0,
                    height: 0
                  }]
                  break
                case this.allContentTp.img.value:
                  result = this.R.map(item => {
                    return {
                      tp: this.allContentTp.img.value,
                      text: '',
                      ...item
                    }
                  })(this.formData.imageList)
                  break
                case this.allContentTp.video.value:
                  if (this.formData.videoImage.url) {
                    this.formData.video.poster = this.formData.videoImage.url
                  }
                  this.formData.video.name = this.formData.video.name + '.mp4'
                  result = [{
                    tp: this.allContentTp.video.value,
                    ...this.formData.video
                  }]
                  break
              }
              this.$emit('success', result)
              this.hide()
            }
          } finally {
            this.loading = false
          }
        })
      },
      handleTpChange () {
        this.$refs.fiShowText && this.$refs.fiShowText.clearValidate()
        this.$refs.fiImage && this.$refs.fiImage.clearValidate()
      },
      ...$global.$mapMethods({
        'getHost': AliyunApi.getOssHost,
        'getToken': AliyunApi.getOssToken
      })
    },
    async mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  .input-text-wrapper {
    display: flex;
    width: 400px;

    .input-right-desc {
      width: 60px;
    }
  }

  .video-show-validate-el-form {
    margin-top: 15px !important;
    margin-bottom: 25px !important;
  }
  .videoContent {
    position: relative;
    div.el-upload__tip {
      position: absolute;
      top:-7px;
      left:80px;
    }
  }

  .el-upload__tip {
    margin-left: 10px;
    font-size: 12px;
    color: #999;
  }

  .desc-text {
    color: $font-color-place-holder;
    font-size: $font-size-content-small;
  }
</style>
