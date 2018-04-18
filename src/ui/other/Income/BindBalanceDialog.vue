<template lang="pug">
  div(v-loading="loading")
    el-dialog( title="已收到结算款？",
    :visible.sync="dialogVisible",
    width="420px")
      div.head
        div.img(v-lazy:background-image="tenantData.head_img")
        div.name {{tenantData.nick_name}}
      el-form(ref="form" labelWidth="85px" v-loading="loading")
        el-form-item(label="结算金额:")
        el-form-item(label="结算周期:")
        el-form-item(label="公司:")
</template>

<script>
    export default {
      data () {
        return {
          dialogVisible: false,
          tenantData: {
            head_img: ''
          },
          loading: false
        }
      },
      methods: {
        show (row) {
          this.reset()
          this.tenantData = row
          this.dialogVisible = true
        },
        hide () {
          this.dialogVisible = false
        },
        reset () {
          if (this.$refs['form']) {
            this.$refs['form'].resetFields()
          }
        }
      }
    }
</script>

<style scoped>

</style>
