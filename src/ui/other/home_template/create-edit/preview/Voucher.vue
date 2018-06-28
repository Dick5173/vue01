<template lang="pug">
  div.voucher-content
    div.empty(v-if="emptyText") {{emptyText}}
    div.view-content(v-else)
      div.title-content
        div.title {{queryParams.wgt_voucher.name}}
        div.see-all(v-if="showMore") 查看全部
      div.items-content
        div.item(:class="{three: itemsLength >= 3}")(v-for="item in showItems")
          div.new(v-if="showNewUser(item)") 新人
          div.price {{showPrice(item)}}
          div.desc {{showFullNum(item)}}
</template>

<script>
  import { convertFenToYuan } from 'src/util/money'
  // import * as VoucherService from 'src/service/voucher'

  export default {
    components: {},
    props: {
      queryParams: {}
    },
    computed: {
      isEmpty () {
        return !this.queryParams.wgt_voucher.items || this.queryParams.wgt_voucher.items.length === 0
      },
      itemsLength () {
        return this.isEmpty ? 0 : this.queryParams.wgt_voucher.items.length
      },
      showMore () {
        if (this.isEmpty) {
          return false
        }
        return this.queryParams.wgt_voucher.items.length > 3
      },
      showItems () {
        const items = this.R.map((item) => {
          if (item.voucher_activ_item) {
            return item.voucher_activ_item
          } else {
            return {
              err: '此优惠券活动已停止'
            }
          }
        })(this.queryParams.wgt_voucher.items || [])
        return items && items.length > 3 ? this.R.slice(0, 3)(items) : items
      },
      emptyText () {
        if (this.isEmpty) {
          if (this.queryParams.wgt_voucher.createWithUser) {
            return '点击编辑优惠券'
          }
          return '优惠券内容被删除'
        }
        return null
      }
    },
    methods: {
      showPrice (item) {
        if (item.voucher && item.voucher.reduce_num) {
          return `¥${convertFenToYuan(item.voucher.reduce_num)}`
        } else {
          return ''
        }
      },
      showFullNum (item) {
        if (item.voucher && item.voucher.full_num > 0) {
          return `满¥${convertFenToYuan(item.voucher.full_num)}可用`
        } else if (item.err) {
          return item.err
        } else {
          return '无门槛使用'
        }
      },
      showNewUser (item) {
        return true
        // return item.voucher_activ && item.voucher_activ.user_scope === VoucherService.userScopeType.newUser.value
      }
    }
  }
</script>

<style lang="scss" scoped>
  .voucher-content {
    width: 375px;
    height: 122px;
    padding-bottom: 5px;
    background: #f5f5f5;

    .empty {
      width: 100%;
      height: 122px;
      line-height: 122px;
      text-align: center;
      background: #E7F6FD;
      color: #98CAE1;
      font-size: 16px;
    }

    .view-content {
      width: 100%;
      height: 100%;
      background: #fff;
    }
    .title-content {
      height: 40px;
      background: #fff;
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
        &:after{
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

    .items-content {
      display: flex;
      justify-content: center;
      height: 72px;

      .item {
        width: 180px;
        height: 72px;
        margin: 0 2px;
        background: #fff3dd;
        border: 1px solid #ffdc9d;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;

        &.three {
          width: 118px;
        }

        .new {
          background: #986ec2;
          width:30px;
          height:15px;
          padding:0px 2px;
          color:#fff;
          font-size:12px;
          text-align:center;
          line-height:15px;
          position:absolute;
          top:0px;
          left:0px;
          border-top-left-radius:5px;
          border-bottom-right-radius: 5px;
        }

        .price {
          color: $home-color-title;
          font-size: $home-size-price-big;

          &:first-letter {
            font-size: $home-size-more;
          }
        }

        .desc {
          margin-top: 7px;
          color: $home-color-desc;
          font-size: $home-size-desc;
        }
      }
    }
  }
</style>
