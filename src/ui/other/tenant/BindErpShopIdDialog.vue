<template lang="pug">
  div
    el-dialog( title="绑定ERP商户号",
    :visible.sync="dialogVisible",
    width="400px")
      div.head
        div.img(v-lazy:background-image="tenantData.head_img")
        div.name {{tenantData.nick_name}}
      el-form.small-el-form(ref="form", :model="formData", :rules="rules", label-width="90px")
        el-form-item(label="AppID：", prop="app_id")
          el-input.tiny-x-el-input(v-model.trim="formData.app_id")
        el-form-item(label="erp商户：", prop="erp_shop_id")
          el-input.tiny-x-el-input(v-model.trim="formData.erp_shop_id")
          el-alert.erp_bind_warn(title="ERP账号错误将无法发货", type="warning", left, :closable="false", show-icon)
        el-form-item
          el-button(type="", @click="hide", plain) 取 消
          el-button(type="primary", @click="handleErpBind") 确 定
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
          erp_shop_id: ''
        },
        rules: {
          app_id: [{required: true, message: '不能为空', trigger: 'blur'},
            {validator: AppIdValidator, trigger: 'blur'}],
          erp_shop_id: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    computed: {},
    watch: {},
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
        this.formData = {
          id: '',
          erp_shop_id: ''
        }
      },
      handleErpBind () {
        if (this.tenantData.app_status === 4) {
          this.$alert('小程序已解除授权', '绑定失败', {
            confirmButtonText: '确定',
            callback: () => {
              this.dialogVisible = false
            }
          })
          return
        }

        var tips = '填写错误，会导致无法发货'
        if (this.tenantData.erp_shop_id !== '' && this.tenantData.erp_shop_id !== this.formData.erp_shop_id) {
          tips = '从' + this.tenantData.erp_shop_id + '更换为' + this.formData.erp_shop_id + '？'
        }

        this.$refs.form.validate(async (valid) => {
          if (!valid) {
            return
          }

          let formData = {
            erp_shop_id: this.formData.erp_shop_id,
            app_id: this.formData.app_id
          }

          this.$confirm(tips, '更换ERP', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await TenantApi.bindErpShopId(this.tenantData.id, formData)
            this.$message({
              type: 'success',
              message: '已修改erp商户号!'
            })
            this.dialogVisible = false
            this.$emit('refresh')
          }).catch(() => {})
        })
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
  .erp_bind_warn {
    background-position: left;
    height: 30px;
    width: 250px !important;
  }

</style>
