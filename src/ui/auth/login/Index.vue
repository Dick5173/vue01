<template lang="pug">
  div.login-container
    el-form(ref="formLogin", :model="form", :rules="rules", labelPosition="left", labelWidth="0")
      h3.title 诚之优品企业版管理后台
      el-form-item(prop="mobile")
        div.icon
          svg-icon(icon="account")
        el-input(type="text", placeholder="手机号", v-model="form.mobile")
      el-form-item(prop="password")
        div.icon
          svg-icon(icon="key")
        el-input(type="password", placeholder="密码", v-model="form.password")
      el-form-item
        el-button(type="primary", @click="handleLogin", :loading="loading") 登录
</template>

<script>
  import { login } from 'src/api/auth'

  export default {
    data () {
      return {
        loading: false,
        form: {
          mobile: '',
          password: ''
        },
        rules: {
          mobile: [
            {
              required: true, trigger: 'blur', message: '请输入手机号'
            }
          ],
          password: [
            {
              required: true, trigger: 'blur', message: '请输入密码'
            }
          ]
        }
      }
    },
    methods: {
      handleLogin () {
        this.$refs.formLogin.validate(async valid => {
          if (valid) {
            this.loading = true
            try {
              await login(this.form)
              this.$router.replace({
                name: 'Welcome'
              })
            } finally {
              this.loading = false
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  $bg-color: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    width: 100%;
    height: 100vh;
    background-color: $bg-color;

    .el-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    .el-button {
      width: 100%;
      height: 40px;
    }

    .el-input {
      display: inline-block;
      width: 90%;
    }

    .icon {
      display: inline-block;
      width: 30px;
      font-size: 20px;
      color: $dark_gray;
      text-align: right;
      vertical-align: middle;
    }

  }
</style>

<style lang="scss">
  $light_gray: #eee;

  .login-container {
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }

  }

</style>
