<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item
        el-input(v-model.trim="formData.text", placeholder="模板名称", clearable)
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="submit") 搜&nbsp索
        el-button(@click="handleReset") 重&nbsp置
</template>

<script>
  export default {
    props: {
      queryParams: {}
    },
    components: {},
    data () {
      return {
        initialData: null,
        formData: {
          text: ''
        }
      }
    },
    computed: {},
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      submit () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = this.R.clone(this.initialData)
        this.$emit('submit', this.formData)
      },
      convertQueryParamsToForm () {
        this.formData = {
          text: this.queryParams.text
        }
      }
    },
    mounted () {
      this.initialData = this.R.clone(this.formData)
      this.convertQueryParamsToForm()
    }
  }
</script>

<style lang="scss" scoped>

</style>
