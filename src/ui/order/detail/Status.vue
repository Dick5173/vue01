<template lang="pug">
  div
    div.status
      span.section-title 订单状态:
      span(style="margin-right: 15px") {{order | orderFullStatus}}
      span.section-title 订单编号:
      span(style="margin-right: 15px") {{order.code}}
      span.section-title 用户:
      span(style="text-decoration: underline;", @click="clickUser") {{order.order_addr.name}}
</template>

<script>
  export default {
    components: {},
    props: {
      order: {
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
    methods: {
      clickUser () {
        console.log('点击user')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .status {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #48576a;
    line-height: 1;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
  }
</style>
