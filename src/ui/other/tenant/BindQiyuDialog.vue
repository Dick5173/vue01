<template lang="pug">
  div
    el-dialog( title="绑定七鱼号",
    :visible.sync="dialogVisible",
    width="400px")
      div.head
        div.img(v-lazy:background-image="tenantData.head_img")
        div.name {{tenantData.nick_name}}
      el-form.small-el-form(ref="form", :model="formData", :rules="rules", label-width="90px")
        el-form-item(label="AppID：", prop="app_id")
          el-input.tiny-x-el-input(v-model.trim="formData.app_id")
        el-form-item(label="七鱼ID：", prop="qiyu_id")
          el-input.tiny-x-el-input(v-model.trim="formData.qiyu_id")
        el-form-item
          el-button(type="", @click="hide", plain) 取 消
          el-button(type="primary", @click="handleQiyuBind") 确 定
</template>

<script>
  import * as TenantApi from 'src/api/tenant'

  export default {
    props: {},
    components: {},
    data () {
      const AppIdValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'))
          return
        }
        if (this.formData.app_id !== this.tenantData.app_id) {
          callback(new Error('AppID与小程序不符'))
          return
        }
        callback()
      }

      return {
        dialogVisible: false,
        tenantData: {
          head_img: ''
        },
        formData: {
          id: '',
          qiyu_id: ''
        },
        rules: {
          app_id: [{required: true, message: '不能为空', trigger: 'blur'},
            {validator: AppIdValidator, trigger: 'blur'}],
          qiyu_id: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      show (row) {
        this.reset()
        this.tenantData = row
        this.formData.id = row.id
        if (row.qiyu_id) {
          this.formData.app_id = row.app_id
          this.formData.qiyu_id = row.qiyu_id
        }
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      reset () {
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
        this.formData = {
          id: '',
          qiyu_id: ''
        }
      },
      handleQiyuBind () {
        if (this.tenantData.app_status === 4) {
          this.$alert('小程序已解除授权', '绑定失败', {
            confirmButtonText: '确定',
            callback: () => {
              this.dialogVisible = false
            }
          })
        } else {
          var tips = '设置七鱼号'
          if (this.tenantData.qiyu_id !== '' && this.tenantData.qiyu_id !== this.formData.qiyu_id) {
            tips = '从' + this.tenantData.qiyu_id + '更换为' + this.formData.qiyu_id + '？'
          }
          this.$confirm(tips, '设置七鱼', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.$refs.form.validate(async (valid) => {
              if (valid) {
                let formData = {
                  qiyu_id: this.formData.qiyu_id,
                  app_id: this.formData.app_id
                }
                await TenantApi.bindQiyu(this.tenantData.id, formData)
                this.$message({
                  type: 'success',
                  message: '已修改七鱼号!'
                })
                this.dialogVisible = false
                this.$emit('refresh')
              }
            })
          }).catch(() => {
          })
        }
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
