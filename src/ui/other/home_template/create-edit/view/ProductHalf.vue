<template lang="pug">
  div.product-half-content
    div.item(v-for="item in dataList")
      div.cover-content
        img(class="cover", :src="showCover(item)")
      div.right-content
        div.name.home-title {{item.name}}
        div.sell-point {{item.sell_point}}
        div.price-content
          div.price.home-price {{price(item)}}
          div.old(:class="{'not-buy-group': !buyGroup}") {{stPrice(item)}}
        div.buy-content
          div.buy-group-count(v-if="buyGroup") {{buyGroupCount(item)}}
          div.buy-btn {{buyBtnText}}
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
  .product-half-content {
    width: 100%;

    .item {
      height: 162px;
      width: 375px;
      display: flex;
      margin-bottom: 5px;
      background: #fff;
      position: relative;
    }

    .cover-content {
      margin: 10px 0 10px 10px;
      width: 142px;
      height: 142px;

      .cover {
        width: 142px;
        height: 142px;
      }
    }

    .tag {
      width: 54px;
      height: 20px;
      position: absolute;
      top: 20px;
      left: 20px;
      background: $home-color-tag;
      color: #fff;
      font-size: $home-size-desc;
      border-radius: 3px;
      line-height: 20px;
      text-align: center;
    }


    .right-content {
      flex: 1;
      margin: 10px;
      /*width: 100%;*/
      position: relative;
    }

    .name {
      @include maxLine(2);
    }

    .sell-point {
      margin-top: 5px;
      line-height: 18px;
      min-height: 18px;
      color: $home-color-desc;
      font-size: $home-size-more;
      @include maxLine(1);
    }

    .price-content {
      margin-top: 5px;
      display: flex;
      align-items: flex-end;
    }

    .old {
      margin-left: 10px;
      color: $home-color-desc;
      font-size: $home-size-desc;

      &.not-buy-group {
        text-decoration: line-through;
      }
    }

    .buy-content {
      display: flex;
      align-items: center;
      position: absolute;
      justify-content: flex-end;
      bottom: 0;
      right: 0;

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
</style>
