<template lang="pug">
  div.product-full-content
    div.item(:class="{'buy-group': buyGroup}", v-for="item in dataList")
      div.img-cover.image(:class="{'buy-group': buyGroup}", v-lazy:background-image="showCover(item)")
        div.sold-out(v-if="!item.prop.stock")
          div.sold-out-top 售罄
          div.sold-out-bottom SOLD OUT
      div.bottom
        div.name.home-title.single-line {{item.name}}
        div.sell-point.single-line(v-if="!buyGroup") {{item.sell_point}}
        div.bottom-content
          div.price-content
            div.home-price {{price(item)}}
            div.old(:class="{'not-buy-group': !buyGroup}") {{stPrice(item)}}
          div.buy-content
            div.buy-group-count(v-if="buyGroup") {{buyGroupCount(item)}}
            div.buy-btn {{buyBtnText}}
      div.tag(v-if="showTag(item)") 新人专享
</template>

<script>
  import { minPrice, showBuyGroupPrice, showCover, showSTPrice } from 'src/service/product/index'

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
      buyBtnText () {
        return this.buyGroup ? '去开团' : '购买'
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
  .product-full-content {
    width: 100%;

    .item {
      height: 280px;
      margin-bottom: 5px;
      background: #fff;
      position: relative;

      &.buy-group {
        height: 242px;
      }
    }

    .image {
      width: 100%;
      height: 188px;
      position: relative;
      &.buy-group {
        height: 164px;
      }
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

    .bottom {
      margin: 10px 10px 10px;
      /*width: 100%;*/

      .name {
      }

      .sell-point {
        margin-top: 2px;
        line-height: 18px;
        min-height: 18px;
        color: $home-color-desc;
        font-size: $home-size-more;
      }

      .bottom-content {
        margin: 5px 0 10px 0;
        display: flex;
        justify-content: space-between;

        .price-content {
          display: flex;
          align-items: flex-end;

          .price {
            color: $home-color-price;
            font-size: $font-size-title-large;
          }

          .old {
            margin-left: 10px;
            color: $home-color-desc;
            font-size: $home-size-more;

            &.not-buy-group {
              text-decoration: line-through;
            }
          }
        }

        .buy-content {
          display: flex;
          align-items: center;


          .buy-group-count {
            color: $home-color-title;
            font-size: $home-size-desc;
            margin-right: 10px;
          }

          .buy-btn {
            background: $home-color-button;
            width: 64px;
            height: 28px;
            color: #fff;
            font-size: $home-size-title-small;
            border-radius: 3px;
            line-height: 28px;
            text-align: center;
          }
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
