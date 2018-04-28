<template lang="pug">
  div(v-loading="loading")
    el-dialog( title="发货",
    :visible.sync="dialogVisible",
    width="420px")
      div.head
        div.img(v-lazy:background-image="tenantData.head_img")
        div.name {{tenantData.nick_name}}
      el-form.small-el-form(ref="form", label-width="110px")
        div.body-text
          el-radio-group(v-model="delivery_mode")
            el-radio(:label="1") 开启
            div.text-margin 允许店铺为用户线下提现，线上记账
            el-radio(:label="2") 关闭
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
        delivery_mode: 0,
        tenantData: {
          head_img: '',
          nick_name: ''
        }
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
      },
      handleBind () {
        const h = this.$createElement
        var title = '开启"核销提现"'
        var delivM = 1
        if (this.delivery_mode === 2) {
          title = '关闭"核销提现"'
          delivM = 2
        }
        this.$msgbox({
          title: title,
          message: h('p', null, [
            h('span', null)
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(async () => {
          try {
            var formData = {
              delivery_mode: delivM
            }
            await TenantApi.postDilvery(this.tenantData.id, formData)
            this.$message({
              type: 'success',
              message: '更新成功 '
            })
            this.dialogVisible = false
            this.$emit('refresh')
          } catch (err) {
          }
        }).catch(() => {
        })
      },
      async getDetail () {
        try {
          this.loading = true
          let res = await TenantApi.getDetail(this.$route.params.tid)
          this.tenantData = res.data.tenant
          this.delivery_mode = this.tenantData.delivery_mode
        } catch (err) {
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.getDetail()
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
    margin-left:140px;
    margin-bottom:20px;
    div{
      font-size:10px;
      margin-left:24px;
    }
    .text-margin{
      margin-bottom:20px;
    }
  }
</style>
