<template lang="pug">
  div
    el-dialog(:visible.sync="dialogVisible", title="编辑视频标题", @close="closeCallback")
      el-form(labelWidth="80px")
        el-form-item(label="标题")
          el-input(v-model="videoName", :maxlength="40", placeholder="最多40个字符")
      div.dialog-footer(slot="footer")
        el-button(@click="dialogVisible = false") 取消
        el-button(type="primary", :loading="loading", @click="submit") 确定
</template>

<script>
  export default {
    components: {},
    props: {},
    data () {
      return {
        dialogVisible: false,
        loading: false,
        videoName: '',
        index: 0
      }
    },
    computed: {},
    methods: {
      show (name, index) {
        this.index = index
        this.videoName = this.R.clone(name)
        this.dialogVisible = true
      },
      closeCallback () {
        this.videoName = ''
      },
      submit () {
        this.$emit('submit', this.videoName, this.index)
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
