<template lang="pug">
  div.text-content
    div.left
      div.text
        div.broadcast(v-show="queryParams.wgt_txt.show_logo", v-lazy:background-image="broadcastImage")
        div.info {{queryParams.wgt_txt.txt}}
</template>

<script>
  import broadcastImage from 'src/assets/image/icon-broadcast.png'

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
        broadcastImage: broadcastImage
      }
    },
    computed: {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .text-content {
    width: 100%;
    display: flex;
    background: #f5f5f5;
    padding-bottom: 5px;

    .left {
      width: 375px;
      background: #fff;

      .broadcast {
        width: 12px;
        height: 12px;
        background-size: 100%, 100%;
      }

      .text {
        margin: 5px;
        padding: 5px;
        min-height: 50px;
        display: flex;
        width: 355px;
        background: #fff;
        color: $home-color-title;
        font-size: $home-size-title;
        overflow: hidden;
        word-break: break-all;

        .info {
          margin-left: 3px;
          flex: 1;
        }
      }
    }
  }
</style>
