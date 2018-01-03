<template lang="pug">
  div()
    router-link(:to="{name: 'PlatformProductCreate'}")
      el-button(type="primary",  icon="el-icon-plus") 添加

</template>

<script>
  import LoadPagerData from 'src/mixins/load-pager-data'

  export default {
    mixins: [
      LoadPagerData
    ]
  }
</script>

<style lang="scss" scoped>
</style>
