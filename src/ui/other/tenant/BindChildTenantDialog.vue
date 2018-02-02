<template lang="pug">
  div
    el-dialog( title="绑定商户号",
    :visible.sync="dialogVisible",
    width="400px")
      div.head
        div.img(v-lazy:background-image="tenantData.head_img")
        div.name {{tenantData.nick_name}}
      el-form.small-el-form(:model="formData", :rules="rules", label-width="68px")
        el-form-item(label="AppID：", prop="app_id")
          el-input.tiny-x-el-input(v-model.trim="formData.app_id")
        el-form-item(label="商户号：")
          el-input.tiny-x-el-input(v-model.trim="formData.sub_mch_id")
        el-form-item
          el-button(type="", @click="dialogVisible = false", plain) 取 消
          el-button(type="primary", @click="handleBind", plain) 确 定
</template>

<script>
  export default {
    props: {},
    components: {},
    data () {
      return {
        dialogVisible: false,
        tenantData: {
          head_img: ''
        },
        formData: {
          id: '',
          app_id: '',
          sub_mch_id: ''
        },
        rules: {}
      }
    },
    computed: {},
    watch: {},
    methods: {
      show (row) {
        this.tenantData = row
        this.formData.id = row.id
        this.dialogVisible = true
      },
      handleBind () {
        this.$emit('submit', this.formData)
      }
    }
  }
</script>


<style lang="scss" scoped>
  .head {
    display: flex;
    height: 50px;
    .img {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-size: cover;
      background-position: center;
    }
    .name {
      display: inline-block;
      height: 50px;
      line-height: 50px;
      margin-left: 10px;
    }
  }
</style>
