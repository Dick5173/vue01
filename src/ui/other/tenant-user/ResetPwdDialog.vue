<template lang="pug">
  div
    el-dialog( title="修改密码",
    :visible.sync="dialogVisible",
    width="450px")
      el-form.small-el-form(ref="form", :model="formData", :rules="rules", label-width="100px")
        el-form-item(label="新密码*：", prop="passwd")
          el-input.tiny-x-el-input(type="password", placeholder="请输入密码", v-model.trim="formData.passwd")
        el-form-item(label="重复密码*：", prop="checkpasswd")
          el-input.tiny-x-el-input(type="password", placeholder="请重复密码", v-model.trim="formData.checkpasswd")
        el-form-item
          el-button(type="", @click="hide", plain) 取 消
          el-button(type="primary", @click="handleResetPwd") 确 定
</template>

<script>
  import * as TenantUserApi from 'src/api/tenant-user'

  export default {
    props: {},
    components: {},
    data () {
      const validatePass = (rule, value, callback) => {
        let reg = /^[\w]{6,20}$/
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (reg.test(value)) {
          if (this.formData.checkpasswd !== '') {
            this.$refs.form.validateField('checkpasswd')
          }
          callback()
        } else if (!reg.test(value)) {
          callback(new Error('密码只能是长度6到20的字母和数字'))
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.formData.passwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

      return {
        dialogVisible: false,
        formData: {
          id: '',
          passwd: '',
          checkpasswd: ''
        },
        rules: {
          passwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          checkpasswd: [
            {required: true, message: '请重复密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      show (row) {
        this.reset()
        this.id = row.id
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
          passwd: ''
        }
      },
      async handleResetPwd () {
        this.$refs.form.validate(async (validFrom) => {
          if (!validFrom) {
            return
          }
          let data = JSON.parse(JSON.stringify(this.formData))
          delete data.checkpasswd
          try {
            this.loading = true
            await TenantUserApi.resetTenantUserPwd(this.id, data)
            this.$message({
              message: '更新成功',
              showClose: true,
              type: 'success'
            })
            this.dialogVisible = false
            this.$emit('refresh')
          } catch (err) {
            this.loading = false
            this.$my.ErrorPlugin(this, err)
          }
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
