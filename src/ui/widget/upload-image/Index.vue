<template lang="pug">
  div
    div(ref="dropZone", v-show="false")
    div.upload-image(v-loading="isUpdating", v-lazy:background-image="showImage", :style="sizeStyle")
      transition(name="el-fade-in-linear")
        div.action-wrapper(v-show="showActionBar")
          div(v-show!="showEdit", @click="handleChooseFile")
            i.el-icon-edit-outline(:style="iconStyle")
          div(v-if!="showDelete", @click="handleDeleteImage")
            i.el-icon-delete(:style="iconStyle")
          div(v-if!="showPreview", @click="previewImage")
            i.el-icon-zoom-in(:style="iconStyle")
      div.add-wrapper(v-show="!showImage", :style="addIconStyle", @click="handleChooseFile")
        i.el-icon-plus
    el-dialog(:visible.sync="previewVisible", :appendToBody="true")
      img(width="100%", :src="showImage")
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter'
  import Dropzone from 'dropzone'

  import * as AliyunApi from 'src/api/aliyun'

  export default {
    mixins: [emitter],
    props: {
      image: {
        type: Object,
        default () {
          return {
            url: '',
            width: 0,
            height: 0
          }
        }
      },
      enableEdit: {
        type: Boolean,
        default: true
      },
      enableDelete: {
        type: Boolean,
        default: true
      },
      enablePreview: {
        type: Boolean,
        default: true
      },
      iconSize: {
        type: String,
        default: '10px'
      },
      addIconSize: {
        type: String,
        default: '30px'
      },
      size: {
        type: String,
        default: '100px'
      }
    },
    data () {
      return {
        isUpdating: false,
        thumbnail: '',
        ossToken: {},
        host: '',
        previewVisible: false
      }
    },
    computed: {
      showImage () {
        return this.thumbnail || this.image.url
      },
      showEdit () {
        return this.showImage && this.enableEdit
      },
      showDelete () {
        return this.showImage && this.enableDelete
      },
      showPreview () {
        return this.showImage && this.enablePreview
      },
      showActionBar () {
        return this.showEdit || this.showDelete || this.showPreview
      },
      iconStyle () {
        return {
          'font-size': this.iconSize
        }
      },
      addIconStyle () {
        return {
          'font-size': this.addIconSize
        }
      },
      sizeStyle () {
        return {
          'width': this.size,
          'height': this.size
        }
      }
    },
    methods: {
      handleChooseFile () {
        if (!this.myDropzone) {
          return
        }
        this.myDropzone.hiddenFileInput.click()
      },
      handleDeleteImage () {
        this.myDropzone.removeAllFiles()
        this.thumbnail = ''
        const emptyImg = {
          url: '',
          width: 0,
          height: 0
        }
        Object.assign(this.image, emptyImg)
        this.$emit('update:image', this.image)
        this.$emit('change', this.image)
        this.dispatch('ElFormItem', 'el.form.change', [this.image])
      },
      onUpdateImage (image) {
        this.thumbnail = ''
        Object.assign(this.image, image)
        this.$emit('update:image', this.image)
        this.$emit('change', this.image)
        this.dispatch('ElFormItem', 'el.form.change', [this.image])
      },
      previewImage () {
        this.previewVisible = true
      }
    },
    created () {
    },
    async mounted () {
      const resOssToken = await AliyunApi.getOssToken()
      this.host = resOssToken.data.token.host
      if (this.myDropzone) {
        this.myDropzone.destroy()
      }
      this.myDropzone = new Dropzone(this.$refs.dropZone, {
        url: this.host,
        previewTemplate: '<div></div>',
        maxFiles: 1,
        acceptedFiles: '.jpeg,.jpg,.png,.gif',
        thumbnailWidth: null,
        thumbnailHeight: null,
        accept: async (file, done) => {
          try {
            const allowTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
            if (!file || allowTypes.indexOf(file.type) === -1) {
              done(new Error('图片错误'))
              return
            }
            const resToken = await AliyunApi.getOssToken()
            this.ossToken = resToken.data.token
            done()
          } catch (e) {
            done(e)
          }
        },
        // 上传文件失败
        error: (file, errMsg) => {
          if (file) {
            this.myDropzone.removeFile(file)
            this.thumbnail = ''
          }
          this.$message({
            type: 'error',
            message: '图片上传失败'
          })
          this.isUpdating = false
        },
        success: (file, responseText) => {
          if (file) {
            this.myDropzone.removeFile(file)
          }
          this.isUpdating = false
          this.onUpdateImage({url: file.downloadUrl, width: file.width, height: file.height})
        },
        // 生成缩略图片
        thumbnail: (file, dataUrl) => {
          if (file.status !== 'error') {
            this.thumbnail = dataUrl
          }
        },
        sending: (file, xhr, formData) => {
          this.isUpdating = true
          const key = `${this.ossToken.dir}${this.ossToken.key}/${file.name}`
          file.downloadUrl = `${this.host}/${key}`
          formData.append('key', key)
          formData.append('policy', this.ossToken.policy)
          formData.append('OSSAccessKeyId', this.ossToken.accessid)
          formData.append('signature', this.ossToken.signature)
          formData.append('success_action_status', 200)
        }
      })
    },
    beforeDestroy () {
      if (this.myDropzone) {
        this.myDropzone.destroy()
      }
    }

  }
</script>

<style lang="scss" scoped>

  .upload-image {
    position: relative;
    border: dashed $border-color-level1 1px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 5px;
    transition: border-color .3s;

    &:hover {
      border-color: $color-primary;
    }

    .add-wrapper {
      height: 100%;
      color: $font-color-secondary;
      cursor: pointer;
      @include center-layout();
    }

    .action-wrapper {
      display: flex;
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      transition: background-color .3s;
      background-color: rgba(0, 0, 0, 0.5);
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      height: 30%;

      & > div {
        flex: 1;
        cursor: pointer;
        @include center-layout();

        & > i {
          display: block;
          color: white;
        }
      }

    }

  }
</style>
