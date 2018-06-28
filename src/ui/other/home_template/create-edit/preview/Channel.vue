<template lang="pug">
  div.channel-content
    div.item-out
      div.item(v-for="item, index in queryParams.wgt_channel.items")
        div.name.single-line(:class="{selected: index === 0}") {{item.name}}
        div.corner.single-line(v-if="item.badge && item.badge !== ''") {{item.badge}}
</template>

<script>
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
      return {}
    },
    computed: {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .channel-content {
    width: 375px;
    height: 36px;
    overflow: hidden;
    background: #fff;

    .item-out {
      width: 100%;
      height: 41px;
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
    }

    .item {
      padding: 0 15px;
      height: 36px;
      display: inline-block;
      position: relative;

      .name {
        line-height: 35px;
        height: 35px;
        text-align: center;
        color: #767676;
        font-size: $home-size-title;
        border-bottom: 1px solid #fff;

        &.selected {
          color: $home-color-button;
          border-bottom: 1px solid $home-color-button;
        }
      }

      .corner {
        position: absolute;
        top: 0;
        right: 0;
        color: #fff;
        font-size: 8px;
        padding: 1px 3px;
        background: $home-color-button;
        border-radius: 3px;
      }
    }
  }
</style>
