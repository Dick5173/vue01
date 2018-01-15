<template lang="pug">
  div
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="78px")
      el-form-item(label="名称", prop="name")
        el-input.small-el-input(v-model.trim="formData.name", placeholder="最多10个字", :maxlength="10")
      el-form-item(label="选择地区", prop="include ")

</template>

<script>
  export default {
    props: {},
    components: {},
    data () {
      return {
        formData: {
          id: 0,
          name: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {}
  }
</script>


<style lang="scss" scoped>

</style>
