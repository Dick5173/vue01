<template lang="pug">
  div.fast-in-content
    div.empty(v-if="emptyText") {{emptyText}}
    div.item-content(v-else, v-for="item in queryParams.wgt_short_entry.items")
      div.cover(v-lazy:background-image="item.cover.url || emptyImage")
      div.name {{item.name}}
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
    data () {
      return {
        emptyImage: emptyImage
      }
    },
    computed: {
      isEmpty () {
        return !this.queryParams.wgt_short_entry.items || this.queryParams.wgt_short_entry.items.length === 0
      },
      emptyText () {
        if (this.isEmpty) {
          if (this.queryParams.wgt_short_entry.createWithUser) {
            return '点击编辑快捷入口'
          }
          return '快捷入口内容被删除'
        }
        return null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fast-in-content {
    width: 375px;
    height: 86px;
    display: flex;
    overflow: auto;
    background: #f5f5f5;
    align-items: center;
    justify-content: center;

    .empty {
      width: 100%;
      height: 86px;
      line-height: 86px;
      text-align: center;
      background: #E7F6FD;
      color: #98CAE1;
      font-size: 16px;
    }

    .item-content {
      width: 88px;
      display: flex;
      margin: 0 1px;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .cover {
        width: 48px;
        height: 48px;
        background-size: cover;
        background-position: center;
      }

      .name {
        color: $home-color-common;
        font-size: $home-size-title;
        @include maxLine(1);
        margin-top: 5px;
        text-align: center;
      }

    }

  }
</style>
