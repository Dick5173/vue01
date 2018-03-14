<template lang="pug">
  div
    el-dialog( title="绑定商户号",
    :visible.sync="dialogVisible",
    width="420px")
      div.head
        div.img(v-lazy:background-image="tenantData.head_img")
        div.name {{tenantData.nick_name}}
      el-form.small-el-form(ref="form", :model="formData", :rules="rules", label-width="110px")
        el-form-item(label="AppID：", prop="app_id")
          el-input.tiny-x-el-input(v-model.trim="formData.app_id")
        el-form-item(label="支付服务商：", prop="pay_service")
          el-select(v-model="formData.pay_service", placeholder="请选择")
            el-option(v-for="item in payServiceList", :key="item.pay_service", :label="item.name", :value="item.pay_service")
        el-form-item(label="商户号：", prop="sub_mch_id")
          el-input.tiny-x-el-input(v-model.trim="formData.sub_mch_id")
        el-form-item
          el-button(type="", @click="hide", plain) 取 消
          el-button(type="primary", @click="handleBind") 确 定
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
          app_id: '',
          sub_mch_id: '',
          erp_shop_id: ''
        },
        payServiceList: [
          {name: '微信', pay_service: 1},
          {name: '全付通', pay_service: 2}
        ],
        rules: {
          app_id: [{required: true, message: '不能为空', trigger: 'blur'},
            {validator: AppIdValidator, trigger: 'blur'}],
          sub_mch_id: [{required: true, message: '不能为空', trigger: 'blur'}],
          pay_service: [{required: true, message: '不能为空', trigger: 'blur'}]
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
          app_id: '',
          sub_mch_id: '',
          sp_sub_mch_id: ''
        }
      },
      handleBind () {
        const parseService = (service) => {
          if (service === 1) {
            return '微信'
          }
          if (service === 2) {
            return '全付通'
          }
          return ''
        }
        if (this.tenantData.app_status === 4) {
          this.$alert('小程序已解除授权', '绑定失败', {
            confirmButtonText: '确定',
            callback: () => {
              this.dialogVisible = false
            }
          })
          return
        }

        var tips = '确定绑定商户号?'
        var oldService = parseService(this.tenantData.pay_service)
        var newService = parseService(this.formData.pay_service)
        if (oldService !== '' && oldService !== newService) {
          tips = '服务商从' + oldService + '更换为' + newService + '？'
        }

        if (this.formData.pay_service === 1) {
          if (this.tenantData.sub_mch_id !== '' && this.tenantData.sub_mch_id !== this.formData.sub_mch_id) {
            tips += '子商户从' + this.tenantData.sub_mch_id + '更换为' + this.formData.sub_mch_id + '？'
          }
        } else {
          if (this.tenantData.sp_sub_mch_id !== '' && this.tenantData.sp_sub_mch_id !== this.formData.sp_sub_mch_id) {
            tips += '子商户从' + this.tenantData.sp_sub_mch_id + '更换为' + this.formData.sub_mch_id + '？'
          }
        }

        this.$refs.form.validate(async (valid) => {
          if (!valid) {
            return
          }

          let formData = {
            sub_mch_id: this.formData.sub_mch_id,
            app_id: this.formData.app_id,
            pay_service: this.formData.pay_service
          }

          this.$confirm(tips, '设置商户号', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await TenantApi.bindChildTenant(this.tenantData.id, formData)
            this.$message({
              type: 'success',
              message: '绑定商户号成功!'
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
</style>
