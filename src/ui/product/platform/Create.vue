<template lang="pug">
  div
    update-image-list(:imageList.sync="imageList")
</template>

<script>
  import UpdateImageList from 'src/ui/widget/upload-image-list/Index.vue'

  export default {
    components: {
      UpdateImageList
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
        ]
      }
    }
  }
</script>

<style lang="scss" scoped></style>
