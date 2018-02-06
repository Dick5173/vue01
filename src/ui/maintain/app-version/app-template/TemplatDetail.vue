<template lang="pug">
  div
    el-form(labelWidth="100px")
      el-form-item(label="版本号")
        div.item {{itemData.user_version}}
      el-form-item(label="描述")
        div.item {{itemData.user_desc}}
      el-form-item(label="TemplateID")
        div.item {{itemData.template_id}}
      el-form-item(label="来源小程序")
        div.item {{itemData.source_miniprogram}}
      el-form-item(label="小程序AppID")
        div.item {{itemData.source_miniprogram_appid}}
      el-form-item(label="添加时间")
        div.item {{itemData.create_time * 1000 | datetime}}
      el-form-item(label="开发者")
        div.item {{itemData.developer}}
      el-form-item(label="")
</template>

<script>
  export default {
    props: {},
    components: {},
    data () {
      return {
        itemData: {}
      }
    },
    computed: {},
    watch: {},
    methods: {},
    mounted () {
      this.itemData = this.$route.params.rowItem
    }
  }
</script>


<style lang="scss" scoped>
  .item {
    margin-left: 100px;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    color: #606266;
  }
</style>
