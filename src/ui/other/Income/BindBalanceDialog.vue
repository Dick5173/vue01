<template lang="pug">
  div(v-loading="loading")
    el-dialog( title="已收到结算款？",
    :visible.sync="dialogVisible",
    width="420px")
      div.head
        div.img(v-lazy:background-image="tenantDetail.head_img")
        div.name {{tenantData.tenant_nickname}}
      el-form(ref="form" labelWidth="85px" v-loading="loading")
        el-form-item(label="结算金额:") {{tenantData.settle_amount | price}}
        el-form-item(label="结算周期:") {{showStatPeriod(tenantData)}}
        el-form-item(label="公司:") {{this.company_name}}
        el-form-item
          el-button(type="", @click="hide", plain) 取 消
          el-button(v-if="tenantData.show_settle_btn" type="primary", @click="handleSettle") 确 定

</template>

<script>
    import { dateFormat } from 'src/util/format'
    import * as TenantApi from 'src/api/tenant'
    export default {
      data () {
        return {
          dialogVisible: false,
          tenantData: {
            head_img: ''
          },
          tenantDetail: {},
          company_name: '',
          loading: false
        }
      },
      methods: {
        show (row) {
          this.reset()
          this.tenantData = row
          this.getDetail(row.tenant_id)
          this.dialogVisible = true
        },
        showStatPeriod (row) {
          const start = dateFormat(row.start_tick, 'YYYY-MM-DD HH:mm:ss')
          const end = dateFormat(row.end_tick, 'YYYY-MM-DD HH:mm:ss')
          return start === end ? start : `${start}~${end}`
        },
        hide () {
          this.dialogVisible = false
        },
        reset () {
          if (this.$refs['form']) {
            this.$refs['form'].resetFields()
          }
        },
        async handleSettle () {
          await TenantApi.settleBill(this.tenantData.id)
          this.$message({
            type: 'success',
            message: '结算成功!'
          })
          this.dialogVisible = false
          this.$emit('refresh')
        },
        async getDetail (tid) {
          try {
            this.loading = true
            let res = await TenantApi.getBasic(tid)
            this.tenantDetail = res.data
            this.company_name = this.tenantDetail.company.name
          } catch (err) {
          } finally {
            this.loading = false
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
  .el-form-item{
    margin:0px;
  }

</style>
