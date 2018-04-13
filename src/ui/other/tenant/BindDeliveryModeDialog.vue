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
            el-radio(:label="1") 结算后发货
            div.text-margin 订单需要"确认结算"后才发货
            el-radio(:label="2") 实时发货
        el-form-item()
          el-button.btn1(type="", @click="hide", plain) 取 消
          el-button.btn2(type="primary", @click="handleBind") 确 定
</template>

<script>
  import * as TenantApi from 'src/api/tenant'

  export default {
    components: {
    },
    data () {
      return {
        dialogVisible: false,
        loading: false,
        delivery_mode: 0,
        tenantData: {
          head_img: ''
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
        if (this.delivery_mode === 1) {
          this.$msgbox({
            title: '设为结算后发货',
            message: h('p', null, [
              h('span', null, '此后的订单为结算后发货')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(async () => {
            try {
              var formData = {
                delivery_mode: 1
              }
              await TenantApi.postDilvery(this.tenantData.id, formData)
              this.$message({
                type: 'success',
                message: '更新成功 '
              })
              this.dialogVisible = false
              this.$emit('refresh')
            } catch (err) {}
          }).catch(() => {})
        } else {
          this.$msgbox({
            title: '设为实时发货',
            message: h('p', null, [
              h('span', null, '此后的订单为实时发货')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(async () => {
            try {
              var formData = {
                delivery_mode: 2
              }
              await TenantApi.postDilvery(this.tenantData.id, formData)
              this.$message({
                type: 'success',
                message: '更新成功 '
              })
              this.dialogVisible = false
              this.$emit('refresh')
            } catch (err) {}
          }).catch(() => {})
        }
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
  .small-el-form{
    margin-left:-60px;
  }
</style>
