<template lang="pug">
  el-dialog(:title="showTitle()", :visible.sync="dialogVisible", @close="handleClose()")
  el-form(ref="form", :model="formData", :rules="formRules", labelWidth="120px")
    el-form-item(label="名称：", prop="name")
      el-input.tiny-x-el-input(v-model="formData.name", :maxlength="10")
    el-form-item(label="是否显示名称：", prop="show_name")
      el-radio(v-model="formData.show_name", :label="true") 是
      el-radio(v-model="formData.show_name", :label="false") 否
  span(slot="footer" class="dialog-footer")
    el-button(@click="dialogVisible = false") 取 消
    el-button(type="primary", @click="submit", v-loading="loading") 确 定
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
    }
  }
</script>


<style lang="scss" scoped>

</style>
