<template lang="pug">
  div.image-content(:class="{'margin': queryParams.wgt_img.margin_bottom}")
    div.empty(v-if="emptyText") {{emptyText}}
    div.images-for(v-else, style="`height:${imageHeight}px; width:${imageWidth}px`", v-for="item in queryParams.wgt_img.items", )
      img.images(:src="item.cover.url || emptyImage")
</template>

<script>
  import emptyImage from 'src/assets/image/empty-image.png'

  export default {
    props: {
      queryParams: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    watch: {
      queryParams: {
        handler (val) {
          if (val.wgt_img.items && val.wgt_img.items.length > 0) {
            this.imageWidth = 375 / val.wgt_img.items.length
            val.wgt_img.items.forEach((item) => {
              if (item.cover.url && item.cover.url !== '') {
                const height = item.cover.height * this.imageWidth / item.cover.width
                if (height > this.imageHeight) {
                  this.imageHeight = height
                }
              }
            })
          }
        },
        deep: true,
        immediate: true
      }
    },
    data () {
      return {
        emptyImage: emptyImage,
        imageHeight: 0,
        imageWidth: 375
      }
    },
    computed: {
      isEmpty () {
        if (!this.queryParams.wgt_img.items || this.queryParams.wgt_img.items.length === 0) {
          return true
        } else {
          const hasImg = this.queryParams.wgt_img.items.some((item) => {
            return (item.cover && item.cover.url) || item.action_tp !== 0
          })
          return !hasImg
        }
      },
      emptyText () {
        if (this.isEmpty) {
          if (this.queryParams.wgt_img.createWithUser) {
            return '点击编辑图片'
          }
          return '图片内容被删除'
        }
        return null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-content {
    width: 375px;
    background: #f5f5f5;
    display: flex;

    &.margin {
      padding-bottom: 10px;
    }

    .empty {
      width: 100%;
      height: 125px;
      line-height: 125px;
      text-align: center;
      background: #E7F6FD;
      color: #98CAE1;
      font-size: 16px;
    }

    .images-for {
      flex: 1;
    }

    .images {
      background: #f5f5f5;
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
</style>
