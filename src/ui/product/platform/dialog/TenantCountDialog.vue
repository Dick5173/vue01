<template lang="pug">
  div
    el-dialog(v-loading="loading", title="上架店铺", :visible.sync="dialogVisible")
</template>

<script>
  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dialogVisible: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      show (row) {
        this.dialogVisible = true
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
