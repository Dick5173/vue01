<template lang="pug">
  div
    draggable.image-item-list(element="div", :value='imageList', :options="{draggable:'.image-item',disabled: !isDraggable}", @input="handleDragChange")
      div.image-item(v-for!="(item,index) in imageList", v-loading="item.updating", v-lazy:background-image="showImage(item)", :style="sizeStyle")
        transition(name="el-fade-in-linear")
          div.action-wrapper(v-show="showActionBar")
            div(v-show!="showEdit", @click="handleReplaceImage(item)")
              i.el-icon-edit-outline(:style="iconStyle")
            div(v-if!="showDelete", @click="handleDeleteImage(item)")
              i.el-icon-delete(:style="iconStyle")
            div(v-if!="showPreview", @click="handlePreviewImage(item)")
              i.el-icon-zoom-in(:style="iconStyle")
    div.add-image(v-if="showAddAction", :style="addIconStyle", @click="handleAddImage")
      i.el-icon-plus
    div(ref="dropZone")
    el-dialog(:visible.sync="previewVisible", :appendToBody="true")
      img(width="100%", :src="previewImage")
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter'
  import Dropzone from 'dropzone'
  import Draggable from 'vuedraggable'

  import * as AliyunApi from 'src/api/aliyun'

  export default {
    mixins: [emitter],
    components: {
      Draggable
    },
    props: {
      imageList: {
        type: Array,
        default () {
          return []
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
      },
      maxFiles: {
        type: Number,
        default: 3
      }
    },
    data () {
      return {
        loading: false,
        ossToken: {},
        host: '',
        previewVisible: false,
        replaceImage: null,
        replaceImageList: [],
        previewImage: '',
        isDraggable: true
      }
    },
    computed: {
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
          'width': this.size,
          'height': this.size,
          'font-size': this.addIconSize
        }
      },
      sizeStyle () {
        return {
          'width': this.size,
          'height': this.size
        }
      },
      showAddAction () {
        return this.imageList.length < this.maxFiles
      },
      isUpdating () {
        for (const item of this.imageList) {
          if (item.isUpdating) {
            return true
          }
        }
        return false
      }
    },
    methods: {
      handleAddImage () {
        if (!this.myDropzone) {
          return
        }
        this.replaceImage = null
        if (this.maxFiles > 1) {
          this.myDropzone.hiddenFileInput.setAttribute('multiple', 'multiple')
        } else {
          this.myDropzone.hiddenFileInput.removeAttribute('multiple')
        }
        this.myDropzone.hiddenFileInput.click()
      },
      handleReplaceImage (item) {
        if (!this.myDropzone) {
          return
        }
        this.replaceImage = item
        this.myDropzone.hiddenFileInput.removeAttribute('multiple')
        this.myDropzone.hiddenFileInput.click()
      },
      handleDeleteImage (item) {
        const findIndex = this.imageList.indexOf(item)
        if (findIndex !== -1) {
          this.imageList.splice(findIndex, 1)
        }
        if (item.file) {
          this.myDropzone.removeFile(item.file)
        }
        if (item.replaceFile) {
          this.myDropzone.removeFile(item.replaceFile)
        }
      },
      handlePreviewImage (item) {
        this.previewImage = this.showImage(item)
        this.previewVisible = true
      },
      handleDragChange (e) {
        this.$emit('update:imageList', e)
      },
      dzAddThumbnail (file, dataUrl) {
        if (this.replaceImage) {
          this.$set(this.replaceImage, 'replaceFile', file)
          this.$set(this.replaceImage, 'replaceThumbnail', dataUrl)
          this.$set(this.replaceImage, 'updating', true)
          return
        }
        const findItem = this.imageList.find(item => {
          return item.file === file
        })
        if (findItem) {
          findItem.thumbnail = dataUrl
        } else {
          if (this.imageList.length >= this.maxFiles) {
            this.myDropzone.removeFile(file)
            return
          }
          this.imageList.push({
            file: file,
            thumbnail: dataUrl,
            updating: true
          })
        }
      },
      dzAddImage (file, url, width, height) {
        const setImageFn = (item) => {
          this.$set(item, 'url', url)
          this.$set(item, 'width', width)
          this.$set(item, 'height', height)
          this.$delete(item, 'file')
          this.$delete(item, 'replaceFile')
          this.$delete(item, 'replaceThumbnail')
          this.$delete(item, 'updating')
        }

        const findReplaceItem = this.imageList.find(item => {
          return item.replaceFile === file
        })
        if (findReplaceItem) {
          setImageFn(findReplaceItem)
          return
        }
        const findItem = this.imageList.find(item => {
          return item.file === file
        })
        if (findItem) {
          setImageFn(findItem)
        } else {
          if (this.imageList.length >= this.maxFiles) {
            this.myDropzone.removeFile(file)
            return
          }
          this.imageList.push({
            file: file,
            image: {url, width, height}
          })
        }
      },
      dzDelErrorFile (file) {
        const findReplaceItem = this.imageList.find(item => {
          return item.replaceFile === file
        })
        if (findReplaceItem) {
          this.$delete(findReplaceItem, 'replaceFile')
          this.$delete(findReplaceItem, 'replaceThumbnail')
          this.$delete(findReplaceItem, 'updating')
          return
        }
        const findIndex = this.imageList.findIndex(item => {
          return item.file === file
        })
        if (findIndex !== -1) {
          this.imageList.splice(findIndex, 1)
        }
      },
      showImage (item) {
        if (item.replaceThumbnail) {
          return item.replaceThumbnail
        }
        if (item.url) {
          return item.url
        } else {
          return item.thumbnail
        }
      },
      updateImage (image) {
        Object.assign(this.image, image)
        this.$emit('update:image', this.image)
        this.$emit('change', this.image)
        this.dispatch('ElFormItem', 'el.form.change', [this.image])
      },
      deleteImage () {
        this.myDropzone.removeAllFiles()
        const emptyImg = {
          url: '',
          width: 0,
          height: 0
        }
        Object.assign(this.image, emptyImg)
        this.$emit('update:image', this.image)
        this.$emit('change', this.image)
        this.dispatch('ElFormItem', 'el.form.change', [this.image])
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
        maxFiles: this.maxFiles,
        acceptedFiles: '.jpeg,.jpg,.png,.gif',
        thumbnailWidth: null,
        thumbnailHeight: null,
        accept: async (file, done) => {
          if (!this.replaceImage && this.imageList.length >= this.maxFiles) {
            done('超出最大文件数量')
            return
          }
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
        // 文件已经添加
        addedfile: (file) => {
        },
        // 上传文件失败
        error: (file, errMsg) => {
          console.log('errmsg', errMsg)
          if (file) {
            this.myDropzone.removeFile(file)
            this.dzDelErrorFile(file)
          }
          if (!file || file.status !== 'canceled') {
            this.$message({
              type: 'error',
              message: '图片上传失败'
            })
          }
          this.loading = false
        },
        success: (file, responseText) => {
          if (file) {
            this.dzAddImage(file, file.downloadUrl, file.width, file.height)
            this.myDropzone.removeFile(file)
          }
          this.loading = false
        },
        // 生成缩略图片
        thumbnail: (file, dataUrl) => {
          if (file.status !== 'error') {
            this.dzAddThumbnail(file, dataUrl)
          }
        },
        sending: (file, xhr, formData) => {
          this.loading = true
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

  .icon {
    background-size: cover;
  }

  .image-item-list {
    display: inline;

    .image-item {
      cursor: move;
      position: relative;
      border: solid $border-color-level1 1px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      border-radius: 5px;
      transition: border-color .3s;
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 10px;

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

  }

  .add-image {
    position: relative;
    border: dashed $border-color-level1 1px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 5px;
    transition: border-color .3s;
    cursor: pointer;
    @include center-layout();
    display: inline-flex;
    vertical-align: top;
    color: $font-color-secondary;

    &:hover {
      border-color: $color-primary;
    }
  }

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
