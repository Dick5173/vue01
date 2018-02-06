<template lang="pug">
  div
    el-button(@click="toChooseTemplate") 选择模板
</template>

<script>
  export default {
    props: {},
    components: {},
    data () {
      return {}
    },
    computed: {
    },
    watch: {},
    methods: {
      toChooseTemplate () {
        this.$router.push({
          name: 'AppTemplate'
        })
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
