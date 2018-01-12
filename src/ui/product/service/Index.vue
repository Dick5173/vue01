<template lang="pug">
  div
    el-radio-group(v-model="activeName")
      el-radio-button(label="tag") 服务说明
      el-radio-button(label="group") 服务组合
    div.content(v-show="activeName === 'tag'")
      ServiceTag
</template>

<script>
  import ServiceTag from 'src/ui/product/service/tag/Index.vue'

  export default {
    props: {},
    components: {
      ServiceTag
    },
    data () {
      return {
        activeName: 'tag'
      }
    },
    computed: {},
    watch: {},
    methods: {}
  }
</script>


<style lang="scss" scoped>
  .content{
    margin-top: 20px;
  }

</style>
