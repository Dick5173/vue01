<template lang="pug">
  div.product-cell
    div.icon(v-lazy:background-image="showIcon")
    div.desc
      div.txt {{orderItem.product.name}}
      div.txt 规格: {{orderItem.spec}}
      div.txt 价格: {{orderItem.total_price | price}}
</template>

<script>
  export default {
    props: {
      orderItem: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      showIcon () {
        if (this.orderItem.product && this.orderItem.product.cover) {
          return this.orderItem.product.cover.url
        } else if (this.orderItem.product.head && this.orderItem.product.head.length > 0) {
          return this.orderItem.product.head[0].url
        }
        return ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .product-cell {
    display: flex;

    .icon {
      width: 80px;
      height: 80px;
      background-size: cover;
    }

    .desc {
      flex: 1;
      line-height: 1.4;
      padding-left: 5px;

      & > div {
        padding-bottom: 10px;
      }

      .txt {
        width: 150px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
    }
  }
</style>
