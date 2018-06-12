<template lang="pug">
  div(v-loading="loading")
    el-dialog( title="隐藏店铺",
    :visible.sync="dialogVisible",
    width="420px")
      div.head
        div.img(v-lazy:background-image="tenantData.head_img")
        div.name {{tenantData.nick_name}}
      el-form.small-el-form(ref="form", label-width="110px")
        div.body-text
          el-radio-group(v-model="hidden")
            el-radio(:label="true") 是
            el-radio(:label="false") 否
        el-form-item()
          el-button.btn1(type="", @click="hide", plain) 取 消
          el-button.btn2(type="primary", @click="handleBind") 确 定
</template>

<script>
  import * as TenantApi from 'src/api/tenant'

  export default {
    data () {
      return {
        dialogVisible: false,
        loading: false,
        hidden: '',
        tenantData: {
          head_img: '',
          nick_name: ''
        }
      }
    },
    methods: {
      show (row) {
        this.tenantData = row
        this.hidden = this.tenantData.hidden
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      handleBind () {
        var tips = '隐藏店铺?'
        if (this.hidden === false) {
          tips = '显示店铺?'
        }
        this.$confirm(tips, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            if (this.hidden === false) {
              await TenantApi.postWithDisplay(this.tenantData.id)
            } else if (this.hidden === true) {
              await TenantApi.postWithHidden(this.tenantData.id)
            }
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.$emit('refresh')
          } catch (err) {}
        }).catch(() => {
        })
      }
    }
  }
</script>

<style scoped lang="scss">
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
  .body-text{
    margin-left:100px;
    margin-top: 30px;
    margin-bottom:40px;
    div{
      font-size:10px;
      margin-left:24px;
    }
  }
</style>
