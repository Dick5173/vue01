<template lang="pug">
  div.product-column-scroll-content
    div.item(v-for="item in showDataList")
      div.cover.img-cover(v-lazy:background-image="showCover(item)")
      div.name.home-title-small.single-line {{item.name}}
      div.not-buy-group-content(v-if="!buyGroup")
        div.sell-point.single-line {{item.sell_point}}
        div.price-content
          div.price.home-price-small {{price(item)}}
          div.old.txt-decoration {{stPrice(item)}}
      div.buy-group-content(v-else)
        div.old-price-content
          div.old {{stPrice(item)}}
          div.buy-group-count(v-if="buyGroup") {{buyGroupCount(item)}}
        div.price-content
          div.price {{price(item)}}
          div.open-group 开团
      div.tag(v-if="showTag(item)") 新人专享
</template>

<script>
  import { showCover, showBuyGroupPrice, minPrice, showSTPrice } from 'src/service/product/index'

  export default {
    components: {},
    props: {
      dataList: {
        type: Array,
        default () {
          return []
        }
      },
      buyGroup: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    computed: {
      showDataList () {
        if (this.dataList && this.dataList.length > 3) {
          return this.dataList.slice(0, 3)
        }
        return this.dataList
      }
    },
    methods: {
      showTag (item) {
        if (!this.buyGroup) {
          return false
        }
        return item.buy_groups[0].scope_tp === 2
      },
      buyGroupCount (item) {
        if (!this.buyGroup) {
          return ''
        }
        return `${item.buy_groups[0].member_count}人团`
      },
      price (item) {
        return this.buyGroup ? `¥${showBuyGroupPrice(item)}` : `¥${minPrice(item)}`
      },
      stPrice (item) {
        if (this.buyGroup) {
          return `单购价¥${minPrice(item)}`
        } else {
          const st = showSTPrice(item)
          if (st && st !== '') {
            return `¥${st}`
          }
          return ''
        }
      },
      ...$global.$mapMethods({'showCover': showCover})
    }
  }
</script>

<style lang="scss" scoped>
  .product-column-scroll-content {
    /*padding: 0 5px;*/
    overflow: hidden;
    background: #fff;
    height: 207px;
    width: 375px;
    display: flex;
    margin-bottom: 5px;

    .item {
      margin-right: 5px;
      width: 128px;
      height: 207px;
      background: #fff;
      position: relative;
    }

    .cover {
      width: 128px;
      height: 128px;
    }

    .tag {
      width: 54px;
      height: 20px;
      position: absolute;
      top: 10px;
      left: 10px;
      background: $home-color-tag;
      color: #fff;
      font-size: $home-size-desc;
      border-radius: 3px;
      line-height: 20px;
      text-align: center;
    }

    .name {
      margin-top: 5px;
      line-height: 20px;
    }

    .not-buy-group-content {
      margin-top: 2px;
      width: 100%;

      .sell-point {
        line-height: 16px;
        min-height: 16px;
        color: $home-color-desc;
        font-size: $home-size-desc;
      }

      .price-content {
        margin-top: 7px;
        display: flex;
        align-items: flex-end;
      }

      .price {
        color: $home-color-price;
        font-size: $font-size-title-small;
      }

      .old {
        margin-left: 5px;
        color: $home-color-desc;
        font-size: $home-size-desc;
      }
    }

    .buy-group-content {
      position: absolute;
      bottom: 5px;
      width: 100%;

      .old-price-content {
        margin-top: 5px;
        line-height: 16px;
        display: flex;
        justify-content: space-between;

        .old {
          color: $home-color-desc;
          font-size: $home-size-desc;
        }

        .buy-group-count {
          color: $home-color-title;
          font-size: $home-size-desc;
        }
      }

      .price-content {
        margin-top: 3px;
        padding: 0 5px;
        /*width: 100%;*/
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: $home-color-button;
        border-radius: 3px;

        .price {
          font-size: $home-size-price-small;
          color: #fff;
        }

        .open-group {
          font-size: $home-size-title-small;
          color: #fff;
        }

      }
    }
  }
</style>
