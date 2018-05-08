<template lang="pug">
  div(v-loading="loading")
    el-dialog( title="矩阵属性",
    :visible.sync="dialogVisible",
    width="420px")
      div.head
        div.img(v-lazy:background-image="tenantData.head_img")
        div.name {{tenantData.nick_name}}
      el-form.small-el-form(ref="form", label-width="110px")
        div.body-text
          el-radio-group(v-model="tp")
            el-radio(:label="2") 非矩阵
            div.text-margin
            el-radio(:label="1") 矩阵
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
        tp: 0,
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
        var title = '设为非矩阵'
        var matrixTp = 2
        if (this.tp === 1) {
          title = '设为矩阵'
          matrixTp = 1
        }
        this.$msgbox({
          title: title,
          message: h('p', null),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(async () => {
          try {
            if (matrixTp === 1) {
              await TenantApi.postMartix(this.tenantData.id)
            } else {
              await TenantApi.postNonMartix(this.tenantData.id)
            }
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
          this.tp = this.tenantData.tp
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
