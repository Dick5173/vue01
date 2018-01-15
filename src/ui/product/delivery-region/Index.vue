<template lang="pug">
  div
    div
      router-link(:to="{name:'DeliveryRegioncCreate'}")
        el-button(type="primary", icon="el-icon-plus") 添加
    div
</template>

<script>
  export default {
    props: {},
    components: {},
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {
      getList () {
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
