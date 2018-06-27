<template lang="pug">
  div(v-loading="loading")
    el-dialog( title="powered by",
    :visible.sync="dialogVisible",
    width="420px")
      div.head
        div.img(v-lazy:background-image="tenantData.head_img")
        div.name {{tenantData.nick_name}}
      el-form.small-el-form(ref="form", label-width="100px")
        el-form-item
          div
            el-radio(v-model="operate", :label="'open'") 显示"美市提供平台支持"
          div
            el-radio(v-model="operate", :label="'close'") 隐藏"美市提供平台支持"
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
        operate: 'close',
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
        var title = '隐藏powered by？'
        var message = '隐藏"美市提供平台支持"'
        var allowWithdraw = 'close'
        if (this.operate === 'open') {
          title = '显示powered by？'
          allowWithdraw = 'open'
          message = '显示"美市提供平台支持"'
        }
        this.$confirm(message, title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            this.operate = allowWithdraw
            if (this.operate === 'close') {
              await TenantApi.hidePowerInfo(this.tenantData.id)
              this.$message({
                type: 'success',
                message: '隐藏成功 '
              })
              this.dialogVisible = false
              this.$emit('refresh')
            } else if (this.operate === 'open') {
              await TenantApi.showPowerInfo(this.tenantData.id)
              this.$message({
                type: 'success',
                message: '显示成功 '
              })
              this.dialogVisible = false
              this.$emit('refresh')
            }
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
          if (this.tenantData.relate_info_show) {
            this.operate = 'open'
          } else {
            this.operate = 'close'
          }
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
</style>
