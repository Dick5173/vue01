<template lang="pug">
  div.refunding-bar
    div.export
      el-button(@click="refunding") 退款中{{refundCount}}
</template>

<script>
  export default {
    components: {},
    props: {},
    data () {
      return {
        refundCount: 0
      }
    },
    computed: {},
    methods: {
      refunding () {
        this.$router.push({
          name: 'OrderRefund'
        })
      }
    },
    activated () {
      this.refundCount = 10
      // try {
      //   const resCount = await getRefundingCount(this.customerId)
      //   this.refundCount = resCount.data.count
      // } catch (e) {
      //   this.$myErrorHandler.handle(this, e)
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .refunding-bar {
    height: 30px;
    margin-bottom: 20px;

    .export {
      display: inline-block;
      float: right;
    }
  }
</style>
