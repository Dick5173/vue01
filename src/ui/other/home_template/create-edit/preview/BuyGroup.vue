<template lang="pug">
  div.buy-group-content
    div.empty(v-if="emptyText") {{emptyText}}
    div(v-else)
      div.title-content
        div.title {{getTitle}}
        div.see-all(v-if="showMore") 查看全部
      component(:dataList="getProducts", :is="getCompByColumn()", :buyGroup="true")
</template>

<script>
  import * as CustomPageService from 'src/service/home_template/index'
  import ProductScrollColumn from '../view/ProductScrollColumn'
  import ProductFull from '../view/ProductFull'
  import ProductHalf from '../view/ProductHalf'
  import ProductColumn2 from '../view/ProductColumn2'
  import ProductColumn3 from '../view/ProductColumn3'

  export default {
    components: {
      ProductScrollColumn,
      ProductFull,
      ProductHalf,
      ProductColumn2,
      ProductColumn3
    },
    props: {
      queryParams: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        ...$global.$mapConst({
          'allProductTp': CustomPageService.allProductTp,
          'allShowTp': CustomPageService.allShowTp,
          'allProductStyleTp': CustomPageService.allProductStyleTp,
          'allProductGroupStyleTp': CustomPageService.allProductGroupStyleTp
        })
      }
    },
    computed: {
      isProduct () {
        return this.queryParams.wgt_buy_group.s_tp === CustomPageService.allProductTp.product.value
      },
      isProductGroup () {
        return this.queryParams.wgt_buy_group.s_tp === CustomPageService.allProductTp.product_group.value
      },
      showMore () {
        return this.queryParams.wgt_buy_group.products.length >= 6
      },
      getProducts () {
        return this.R.clone(this.queryParams.wgt_buy_group.products)
      },
      getTitle () {
        return this.queryParams.wgt_buy_group.name
      },
      isEmpty () {
        return !this.queryParams.wgt_buy_group.products || this.queryParams.wgt_buy_group.products.length === 0
      },
      emptyText () {
        if (this.isEmpty) {
          if (this.queryParams.wgt_buy_group.createWithUser || this.queryParams.wgt_buy_group.old_s_tp !== this.queryParams.wgt_buy_group.s_tp) {
            this.queryParams.wgt_buy_group.createWithUser = true
            return '点击编辑拼团'
          }
          return '拼团内容被删除'
        }
        return null
      }
    },
    methods: {
      empty () {
      },
      getCompByColumn () {
        switch (this.queryParams.wgt_buy_group.style_tp) {
          case CustomPageService.allProductGroupStyleTp.cross_slip.value:
            return 'ProductScrollColumn'
          case CustomPageService.allProductGroupStyleTp.banner.value:
            return 'ProductFull'
          case CustomPageService.allProductGroupStyleTp.half.value:
            return 'ProductHalf'
          case CustomPageService.allProductGroupStyleTp.column_two.value:
            return 'ProductColumn2'
          case CustomPageService.allProductGroupStyleTp.column_three.value:
            return 'ProductColumn3'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .buy-group-content {
    width: 375px;

    .empty {
      width: 100%;
      height: 242px;
      line-height: 242px;
      text-align: center;
      background: #E7F6FD;
      color: #98CAE1;
      font-size: 16px;
    }

    .title-content {
      height: 44px;
      background: #f5f5f5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;

      .title {
        color: $home-color-title;
        font-size: $home-size-title;
      }

      .see-all {
        color: $home-color-button;
        font-size: $home-size-more;
        padding-right: 15px;
        position: relative;
        &:after {
          content: '';
          position: absolute;
          background: #f00;
          width: 16px;
          height: 16px;
          background: url("~@/assets/image/more_home.png") center center;
          background-size: contain;
          top: -3px;
        }
      }
    }
  }
</style>
