<template lang="pug">
  div
    el-dialog(title="标签商品页", :visible.sync="dialogVisible",)
      div.content
        div.product-column-two-content
          div.item(v-for="item in dataList")
            div.cover.img-cover(v-lazy:background-image="showCover(item)")
              div.sold-out(v-if="!item.prop.stock")
                div.sold-out-top 售罄
                div.sold-out-bottom SOLD OUT
            div.name.home-title-small.single-line {{item.name}}
            div.not-buy-group-content()
              div.sell-point.single-line {{item.sell_point}}
              div.price-content
                div.home-price-small {{price(item)}}
                div.old.txt-decoration {{stPrice(item)}}
</template>

<script>
  import { showCover, showBuyGroupPrice, minPrice, showSTPrice } from 'src/service/product/index'
  // import * as ProductApi from 'src/api/product'
  import * as CustomPageService from 'src/service/home_template/index'

  export default {
    components: {
    },
    props: {
    },
    data () {
      return {
        dialogVisible: false,
        dataList: [],
        queryParams: {
          tp: 0,
          status: 1,
          text: '',
          tenant_category_id: '',
          tenant_tags: [],
          tag_group_id: 0
        }
      }
    },
    methods: {
      async show (row) {
        if (row.product_tag_tp === CustomPageService.productTagTp.product_tag_group_id.value) {
          this.queryParams.tag_group_id = row.product_tag_group.id
          this.queryParams.tenant_tags = []
        } else if (row.product_tag_tp === CustomPageService.productTagTp.product_tag_id.value) {
          this.queryParams.tenant_tags = [row.product_tag.id]
        }
        // var data = await ProductApi.getOwnProductList(this.$tid, this.queryParams)
        // this.dataList = data.data.data
        // this.dialogVisible = true
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
    },
    watch: {
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    justify-content: center;
    .product-column-two-content {
      width: 375px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 3px;
      border: 1px solid #d6d6d6;
      background: #ccc;
      .item {
        width: 185px;
        height: 265px;
        margin-bottom: 5px;
        display: inline-block;
        background: #fff;
        position: relative;
      }

      .cover {
        width: 185px;
        height: 185px;
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
  }

</style>
