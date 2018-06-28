<template lang="pug">
  div.left-arrow-content
    div.triangle-left
</template>

<script>
  export default {
    components: {},
    props: {},
    data () {
      return {}
    },
    computed: {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .left-arrow-content {
    width: 20px;
    height: 20px;

    .triangle-left {
      width: 0;
      height: 0;
      border-top: 15px solid transparent;
      border-right: 20px solid transparent;
      border-bottom: 15px solid transparent;
    }
  }
</style>
