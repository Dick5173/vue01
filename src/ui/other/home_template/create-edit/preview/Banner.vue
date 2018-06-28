<template lang="pug">
  div.banner-content
    div.empty(v-if="emptyText") {{emptyText}}
    div(v-else, @mouseenter="showLeftRightBtn = true", @mouseleave="showLeftRightBtn = false")
      div.image-content(ref="imageContent")
        img.cover(:src!="showImage")
        div.left(v-if="showLeftRightBtn", @click.stop="clickLeft")
        div.right(v-if="showLeftRightBtn", @click.stop="clickRight")
</template>

<script>
  import emptyImage from 'src/assets/image/empty-image.png'

  export default {
    props: {
      queryParams: {}
    },
    data () {
      return {
        emptyImage: emptyImage,
        imageHeight: 211,
        showLeftRightBtn: false,
        showIndex: 0
      }
    },
    watch: {
      queryParams: {
        async handler (val) {
          if (val.wgt_carousel.items && val.wgt_carousel.items.length > 0) {
            let minWhScale = 999
            val.wgt_carousel.items.forEach((item) => {
              if (item.cover.url && item.cover.url !== '') {
                const whScale = item.cover.width / item.cover.height
                if (whScale < minWhScale) {
                  minWhScale = whScale
                }
              }
            })
            if (minWhScale === 999) {
              minWhScale = 1.7
            } else if (minWhScale < (3 / 4)) {
              minWhScale = 3 / 4
            }
            this.imageHeight = 375 / minWhScale
            await this.$nextTick()
            this.$refs.imageContent.style.height = `${this.imageHeight}px`
          }
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      isEmpty () {
        return !this.queryParams.wgt_carousel.items || this.queryParams.wgt_carousel.items.length === 0
      },
      emptyText () {
        if (this.isEmpty) {
          if (this.queryParams.wgt_carousel.createWithUser) {
            return '点击编辑快捷入口'
          }
          return '轮播图内容被删除'
        }
        return null
      },
      showImage () {
        if (!this.queryParams.wgt_carousel.items || this.queryParams.wgt_carousel.items.length === 0 || this.queryParams.wgt_carousel.items.length <= this.showIndex) {
          return emptyImage
        } else if (!this.queryParams.wgt_carousel.items[this.showIndex].cover.url || this.queryParams.wgt_carousel.items[this.showIndex].cover.url === '') {
          return emptyImage
        }
        return this.queryParams.wgt_carousel.items[this.showIndex].cover.url
      }
    },
    methods: {
      clickLeft () {
        if (this.showIndex - 1 < 0) {
          this.showIndex = this.queryParams.wgt_carousel.items.length - 1
        } else {
          this.showIndex--
        }
      },
      clickRight () {
        if (this.showIndex + 1 >= this.queryParams.wgt_carousel.items.length) {
          this.showIndex = 0
        } else {
          this.showIndex++
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .banner-content {
    width: 375px;
    background: #fff;

    .empty {
      width: 100%;
      line-height: 211px;
      text-align: center;
      background: #E7F6FD;
      color: #98CAE1;
      font-size: 16px;
    }

    .image-content {
      width: 100%;
      position: relative;
      display: flex;
      align-items: center;

      .cover {
        background: #f5f5f5;
        object-fit: contain;
        width: 100%;
        height: 100%;
      }

      .left {
        position: absolute;
        width: 40px;
        height: 40px;
        left: 20px;
        cursor: pointer;
        background: url("~@/assets/image/arrow-left-btn.png") no-repeat center / 100% 100%;
      }

      .right {
        position: absolute;
        width: 40px;
        height: 40px;
        right: 20px;
        cursor: pointer;
        background: url("~@/assets/image/arrow-right-btn.png") no-repeat center / 100% 100%;
      }
    }
  }
</style>
