<template lang="pug">
  div.product-column-two-content
    div.item(v-for="item in dataList")
      div.cover.img-cover(v-lazy:background-image="showCover(item)")
        div.sold-out(v-if="!item.prop.stock")
          div.sold-out-top 售罄
          div.sold-out-bottom SOLD OUT
      div.name.home-title-small.single-line {{item.name}}
      div.not-buy-group-content(v-if="!buyGroup")
        div.sell-point.single-line {{item.sell_point}}
        div.price-content
          div.home-price-small {{price(item)}}
          div.old.txt-decoration {{stPrice(item)}}
      div.buy-group-content(v-else)
        div.old-price-content
          div.home-price-small {{price(item)}}
          div.old {{stPrice(item)}}
        div.price-content
          div.buy-group-count(v-if="buyGroup") {{buyGroupCount(item)}}
          div.open-group 去开团
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
    computed: {},
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
  .product-column-two-content {
    /*width: 100%;*/
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 5px;

    .item {
      width: 180px;
      height: 260px;
      margin-bottom: 5px;
      display: inline-block;
      background: #fff;
      position: relative;
    }

    .cover {
      width: 180px;
      height: 180px;
      position: relative;
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
      margin: 5px 10px 0;
    }

    .not-buy-group-content {
      .sell-point {
        margin: 4px 10px 0;
        line-height: 16px;
        min-height: 16px;
        color: $home-color-desc;
        font-size: $home-size-desc;
      }

      .price-content {
        margin: 5px 10px 0;
        display: flex;
        align-items: flex-end;
      }

      .old {
        margin-left: 5px;
        color: $home-color-desc;
        font-size: $home-size-desc;
      }
    }

    .buy-group-content {

      .old-price-content {
        margin: 5px 10px 0;
        display: flex;
        align-items: flex-end;

        .old {
          margin-left: 5px;
          color: $home-color-desc;
          font-size: $home-size-desc;
        }
      }

      .price-content {
        margin: 5px 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .buy-group-count {
          color: $home-color-title;
          font-size: $home-size-desc;
        }

        .open-group {
          background: $home-color-button;
          border-radius: 3px;
          width: 72px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          color: #fff;
          font-size: $home-size-title-small;
        }

      }
    }
  }
  .sold-out {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 90px;
    height: 90px;
    background-color: rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: #ffffff;

    .sold-out-top {
      font-size: 14px;
      margin-bottom: 2px;
    }

    .sold-out-bottom {
      font-size: 14px;
      font-weight: 300;
      font-family: DIN;
    }
  }
</style>
