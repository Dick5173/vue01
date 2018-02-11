<template lang="pug">
  div
    el-dialog(:visible.sync="dialogVisible", title="选择颜色", width="300px", @close="closeCallback", center)
      div.colorBox
        el-color-picker(v-model="formData.color")
      div.dialog-footer(slot="footer")
        el-button(@click="dialogVisible = false") 取消
        el-button(type="primary", :loading="loading", @click="submit") 确定
</template>

<script>
  import * as ColorApi from 'src/api/theme-color'

  export default {
    props: {},
    components: {},
    data () {
      return {
        dialogVisible: false,
        loading: false,
        initialData: null,
        formData: {
          id: 0,
          color: null
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      async submit () {
        this.loading = true
        try {
          if (this.initialData) {
            await ColorApi.editThemeColor(this.formData)
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
          } else {
            await ColorApi.createThemeColor(this.formData)
            this.$message({
              message: '创建成功',
              type: 'success'
            })
          }
          this.$emit('refresh')
          this.hide()
        } finally {
          this.loading = false
        }
      },
      show (row) {
        if (row) {
          this.formData.color = row.color
          this.formData.id = row.id
          this.initialData = row
        }
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.formData.id = 0
        this.formData.color = null
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>

<style lang="scss">
  .colorBox {
    position: relative;
    height: 60px;
    .el-color-picker{
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      .el-color-picker__trigger {
        width: 60px !important;
        height: 60px !important;
      }
    }
  }
</style>
