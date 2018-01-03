<template lang="pug">
  div
    upload-image-list(:imageList.sync="imageList")
    upload-image
</template>

<script>
  import UploadImageList from 'src/ui/widget/upload-image-list/Index.vue'
  import UploadImage from 'src/ui/widget/upload-image/Index.vue'

  export default {
    components: {
      UploadImageList,
      UploadImage
    },
    data () {
      return {
        imageList: [
          {
            url: 'https://oreo-beta.oss-cn-beijing.aliyuncs.com/beta/f940f3a4-f012-11e7-9264-720005607950/1496973569778.jpg',
            width: 100,
            height: 200
          },
          {
            url: 'https://oreo-beta.oss-cn-beijing.aliyuncs.com/beta/f940f3a4-f012-11e7-9264-720005607950/1496973569778.jpg',
            width: 200,
            height: 100
          }
        ],
        image: {
          url: 'https://oreo-beta.oss-cn-beijing.aliyuncs.com/beta/f940f3a4-f012-11e7-9264-720005607950/1496973569778.jpg',
          width: 100,
          height: 200
        }
      }
    }
  }
</script>

<style lang="scss" scoped></style>
