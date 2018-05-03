<template lang="pug">
  div(v-loading="loading")
    div
      div.head
        div.head-cover(v-lazy:background-image="tenantData.head_img")
        div.head-name-box
          div.head-name {{tenantData.nick_name}}
            span.icon(@click="dialogVisible = true")
              img.img(:src="qrcodeIcon")
              div.head-status {{showAppStatus(tenantData.app_status)}}
      div.body-detail
        div.body-item 店铺ID：{{tenantData.id}}
        div.body-border
        div.body-item 小程序状态：{{showAppStatus(tenantData.app_status)}}
        div.body-border
        div.body-item 店铺管理员：
        div.body-item.btn(type="text", @click="toTenantUser(tenantData.admin_id)") {{tenantData.admin_name}}
        div.body-border
        div.body-item 退款授权：{{showRefundStatus(tenantData.refund_status)}}
        div.body-border
        div.body-item 首次上线：{{tenantData.first_uptime | datetime}}
        //- div.body-border
        //- div.body-item 支付服务商：{{payService(tenantData.pay_service)}}
      div.body-status
        div.body-item-status 店铺状态：
        //- {{showTenantStatus(tenantData.tenant_status)}}
        //- el-button(v-if="tenantData.tenant_status === 1", type="danger", size="mini", @click="disable(tenantData.id)") 禁用
        //- el-button(v-else, type="primary", size="mini", @click="enable(tenantData.id)") 启用
        el-button(type="text", size="mini", @click="setTenantStatus") {{showTenantStatus(tenantData.tenant_status)}}
      div.body-status.margin-left
        div.body-item-status 店铺等级：
          el-button(type="text", @click="showTenantLevelDialog(tenantData)", size="mini") {{tenantData.tenant_level.description}}
      div.body-status.margin-left
        div.body-item-status 商品权限：
          el-button(type="text", @click="showProductAuthDialog(tenantData)", size="mini") {{showProductAuth(tenantData)}}
        //- el-button(type="text", @click="showMchBindDialog(tenantData)", size="mini") {{showMchBindButtonName(tenantData)}}
        //- el-button(type="text", @click="showErpBindDialog(tenantData)", size="mini") {{showErpBindButtonName(tenantData)}}
        //- el-button(type="text", @click="showQiyuBindDialog(tenantData)", size="mini") {{showQiyuBindButtonName(tenantData)}}
      div.body-status.margin-left
        div.body-item-status 发货方式：
          el-button(type="text", @click="showDeliveryAuthDialog(tenantData)", size="mini") {{showDeliverytButtonName(tenantData)}}
      div
        div.body-status
          div.body-item-status 支付商户号：
            el-button(type="text", @click="showMchBindDialog(tenantData)", size="mini") {{payService(tenantData)}}{{payServiceId(tenantData.pay_service)}}
        div.body-status.margin-left
          div.body-item-status ERP：
            el-button(type="text", @click="showErpBindDialog(tenantData)", size="mini") {{showErpBindButtonName(tenantData)}}
        div.body-status.margin-left
          div.body-item-status 七鱼：
            el-button(type="text", @click="showQiyuBindDialog(tenantData)", size="mini") {{showQiyuBindButtonName(tenantData)}}
      div.body-bottom-line
      div.list-title
        div.list-title-head
          div.list-title-item 最近收入
          div.list-title-item.btn(type="text", @click="toIncome(tenantData.id)") 详细
        div.list
          el-table.list-el-table(:data="incomeList", border)
            el-table-column(label="统计周期", prop="")
              template(slot-scope="scope")
                div {{showStatPeriod(scope.row)}}
            el-table-column(label="销售额（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.sale_total_amount | price}}
            el-table-column(label="货款（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.sp_total_amount | price}}
            el-table-column(label="平台服务费（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.platform_fee | price}}
            el-table-column(label="利润（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.tenant_total_amount | price}}
      div.list-title.margin-top
        div.list-title-head
          div.list-title-item 最新上架
          div.list-title-item.btn(type="text", @click="toTenantProduct(tenantData.id)") 详细
        div.list
          el-table.list-el-table(:data="productList", border)
            el-table-column(prop="", label="", width="70px")
              div.cover(slot-scope="scope", v-lazy:background-image="showCover(scope.row)")
            el-table-column(label="商品", prop="name")
            el-table-column(label="利润（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.min_profit | price}}～{{scope.row.max_profit | price}}
            el-table-column(label="售价（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.min_price | price}}～{{scope.row.max_price | price}}
            el-table-column(label="销量", prop="sold")
            el-table-column(label="库存", prop="")
              div(slot-scope="scope") {{scope.row.prop.stock}}
            el-table-column(label="首次上架", prop="", width="155px")
              div(slot-scope="scope", v-if="scope.row.pt > 0") {{ scope.row.pt | datetime }}
            el-table-column(label="来源", prop="")
              div(slot-scope="scope") {{showTp(scope.row.tp)}}
    el-dialog(title="小程序码", :visible.sync="dialogVisible", width="480px", :modal-append-to-body="false")
      img.dlgImg(:src="tenantData.acode_url")
      el-button(style='margin-left:150px;', @click="download") 下载小程序码
    product-auth-dialog(ref="dlgProductAuth", @refresh="getDetail")
    bind-child-tenant-dialog(ref="dlgMchBindDialog", @refresh="getDetail")
    bind-erp-shop-id-dialog(ref="dlgBindShopId", @refresh="getDetail")
    bind-qiyu-dialog(ref="dlgBindQiyu" , @refresh="getDetail")
    bind-delivery-mode-dialog(ref="dlgBindDelivery",@refresh="getDetail")
    tenant-level-dialog(ref="dlgTenantLevel", @refresh="getDetail")
    el-dialog.tenant-status(title="店铺状态", :visible.sync="tenantDialogVisible", width="480px", :modal-append-to-body="false")
      div.head
        div.head-cover(v-lazy:background-image="tenantData.head_img")
        div.head-name-box
          div.head-name {{tenantData.nick_name}}
      el-radio-group(v-model="tenantStatus")
        el-radio(:label="1") 正常
        el-radio(:label="2") 禁用
      i.el-alert.el-alert--warning 小程序将无法访问，店铺后台将无法登录
      div.dialog-footer(slot="footer")
        el-button(@click="tenantDialogVisible = false") 取 消
        el-button(type="primary" @click="setTenantStatusSubmit(tenantData.id)") 确 定
</template>

<script>
import ProductAuthDialog from 'src/ui/common/product-auth-dialog/Index.vue'
import BindChildTenantDialog from 'src/ui/other/tenant/BindChildTenantDialog.vue'
import BindErpShopIdDialog from 'src/ui/other/tenant/BindErpShopIdDialog.vue'
import BindQiyuDialog from 'src/ui/other/tenant/BindQiyuDialog.vue'
import BindDeliveryModeDialog from 'src/ui/other/tenant/BindDeliveryModeDialog.vue'
import TenantLevelDialog from 'src/ui/other/tenant/TenantLevelDialog.vue'
import * as TenantApi from 'src/api/tenant'
import { showAppStatus, showTenantStatus, showProductAuth, showMchBindButtonName, showErpBindButtonName, showQiyuBindButtonName, showDeliverytButtonName } from 'src/service/other/index'
import { showCover } from 'src/service/product/index'
import { dateFormat } from 'src/util/format'
import { TENANT_STATUS_IN_COME, TENANT_STATUS_ORDER, TENANT_STATUS_PRODUCT } from 'src/constants/tenantPush'

export default {
  props: {},
  components: {
    ProductAuthDialog,
    BindChildTenantDialog,
    BindErpShopIdDialog,
    BindQiyuDialog,
    BindDeliveryModeDialog,
    TenantLevelDialog
  },
  data () {
    return {
      dialogVisible: false,
      qrcodeIcon: require('src/assets/image/qrcode.png'),
      loading: false,
      incomeList: [],
      productList: [],
      tenantData: {
        tenant_level: {}
      },
      tenantDialogVisible: false,
      tenantStatus: ''
    }
  },
  computed: {
  },
  watch: {},
  methods: {
    showProductAuthDialog (row) {
      this.$refs.dlgProductAuth.show(row)
    },
    showMchBindDialog (row) {
      this.$refs.dlgMchBindDialog.show(row)
    },
    showErpBindDialog (row) {
      this.$refs.dlgBindShopId.show(row)
    },
    showQiyuBindDialog (row) {
      this.$refs.dlgBindQiyu.show(row)
    },
    showDeliveryAuthDialog (row) {
      this.$refs.dlgBindDelivery.show(row)
    },
    showTenantLevelDialog (row) {
      this.$refs.dlgTenantLevel.show(row)
    },
    showStatPeriod (row) {
      const start = dateFormat(row.start_tick, 'YYYY-MM-DD HH:mm:ss')
      const end = dateFormat(row.end_tick, 'YYYY-MM-DD HH:mm:ss')
      return start === end ? start : `${start}~${end}`
    },
    toIncome (id) {
      this.$router.push({
        name: 'TenantIncome',
        params: {
          tid: id,
          tenant: true
        }
      })
    },
    payService (value) {
      if (value.pay_service === 1 && value.sub_mch_id !== '') {
        return '微信'
      }
      if (value.pay_service === 2 && value.sp_sub_mch_id !== '') {
        return '全付通'
      }
      return '未绑定'
    },
    payServiceId (val) {
      if (val === 1) {
        return this.tenantData.sub_mch_id
      } else if (val === 2) {
        return this.tenantData.sp_sub_mch_id
      }
    },
    toTenantProduct (id) {
      this.$router.push({
        name: 'TenantProduct',
        params: {
          id: id
        }
      })
    },
    download () {
      let link = document.createElement('a')
      link.href = this.tenantData.acode_url
      link.download = 'qrcode'
      link.click()
      this.dialogVisible = false
    },
    toTenantUser (id) {
      this.$router.push({
        name: 'TenantUser',
        params: {
          id: id,
          tenantDetail: true
        }
      })
    },
    setTenantStatus () {
      this.tenantDialogVisible = true
    },
    setTenantStatusSubmit (id) {
      if (this.tenantStatus === 1) {
        this.enable(id)
      } else {
        this.disable(id)
      }
    },
    async enable (id) {
      // this.$confirm('启用店铺？', '提示？', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(async () => {

      // }).catch(() => {
      // })
      try {
        this.loading = true
        await TenantApi.enableTenant(id)
        this.$message({
          type: 'success',
          message: '已启用!'
        })
        this.tenantDialogVisible = false
        this.getDetail()
      } catch (err) {
        this.loading = false
      }
    },
    async disable (id) {
      // this.$confirm('小程序将无法访问，店铺后台将无法登录', '禁用？', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(async () => {

      // }).catch(() => {
      // })
      try {
        this.loading = true
        await TenantApi.disableTenant(id)
        this.$message({
          type: 'success',
          message: '已禁用!'
        })
        this.tenantDialogVisible = false
        this.getDetail()
      } catch (err) {
        this.loading = false
      }
    },
    showTp (tp) {
      if (tp === 1) {
        return ''
      }
      if (tp === 2) {
        return '自营'
      }
      return '平台'
    },
    showRefundStatus (row) {
      if (row === 1) {
        return '未授权'
      }
      return '已授权'
    },
    async getDetail () {
      try {
        this.loading = true
        let res = await TenantApi.getDetail(this.$route.params.tid)
        this.tenantData = res.data.tenant
        this.incomeList = res.data.bills ? res.data.bills : []
        this.productList = res.data.products ? res.data.products : []
        this.tenantStatus = this.tenantData.tenant_status
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
    ...$global.$mapMethods({ 'showAppStatus': showAppStatus }),
    ...$global.$mapMethods({ 'showTenantStatus': showTenantStatus }),
    ...$global.$mapMethods({ 'showCover': showCover }),
    ...$global.$mapMethods({ 'showProductAuth': showProductAuth }),
    ...$global.$mapMethods({ 'showErpBindButtonName': showErpBindButtonName }),
    ...$global.$mapMethods({ 'showQiyuBindButtonName': showQiyuBindButtonName }),
    ...$global.$mapMethods({ 'showMchBindButtonName': showMchBindButtonName }),
    ...$global.$mapMethods({ 'showDeliverytButtonName': showDeliverytButtonName })
  },
  created () {
    const status = this.$route.query.status
    if (status === TENANT_STATUS_IN_COME) {
      this.$parent.updateBreadcrumb([{
        text: '收入',
        to: { name: 'TenantIncome' }
      }, {
        text: '店铺详情'
      }])
    } else if (status === TENANT_STATUS_ORDER) {
      this.$parent.updateBreadcrumb([{
        text: '订单',
        to: { name: 'OrderIndex' }
      }, {
        text: '订单详情',
        to: { name: 'OrderDetail', param: { id: this.$route.params.id } }
      }, {
        text: '店铺详情'
      }])
    } else if (status === TENANT_STATUS_PRODUCT) {
      this.$parent.updateBreadcrumb([{
        text: '店铺自营商品',
        to: { name: 'TenantSelfProductIndex' }
      }, {
        text: '店铺详情'
      }])
    } else {
      this.$parent.updateBreadcrumb([{
        text: '店铺',
        to: { name: 'Tenant' }
      }, {
        text: '店铺详情'
      }])
    }
  },
  mounted () {
    this.getDetail()
  }
}
</script>


<style lang="scss" scoped>
@import '../../../assets/scss/other';
.margin-left {
  margin-left: 20px;
}

.head {
  display: flex;
  height: 50px;
  .head-cover {
    display: inline-block;
    width: 50px;
    height: 50px;
    background-position: center;
    background-size: cover;
  }
  .head-name-box {
    margin-left: 10px;
    .head-name {
      display: flex;
      align-items: center;
      height: 22px;
      font-size: 16px;
      line-height: 22px;
      .icon {
        margin-left: 6px;
        width: 16px;
        line-height: 16px;
        .img {
          position: relative;
          top: 32px;
          left: 0px;
          width: 16px;
          height: 16px;
          cursor: pointer;
          height: 16px;
        }
        .head-status {
          display: inline-block;
          margin-top: 41px;
          margin-left: -69px;
          width: 80px;
          height: 20px;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
}

.body-status {
  display: inline-flex;
  align-items: center;
  margin-top: 20px;
  .body-item-status {
    display: inline-block;
    margin-right: 10px;
    height: 17px;
    font-size: 12px;
    line-height: 17px;
  }
  .el-button--text {
    text-decoration: underline;
  }
}

.body-detail {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding-bottom: 20px;
  height: 21px;
  border-bottom: 1px solid #dcdfe6;
  .body-border {
    display: inline-block;
    margin-right: 10px;
    margin-left: 10px;
    height: 21px;
    border-right: solid 1px #dcdfe6;
    background-color: #dcdfe6;
  }
  .body-item {
    display: inline-block;
    overflow: hidden;
    height: 17px;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    line-height: 17px;
  }
  .btn {
    text-decoration: underline;
  }
}

.dlgImg {
  width: 430px;
  height: 430px;
}

.cover {
  width: 50px;
  height: 50px;
  background-position: center;
  background-size: cover;
}
.tenant-status {
  .head {
    margin-bottom: 20px;
    .head-cover {
      border-radius: 50%;
    }
    .head-name-box {
      display: flex;
      align-items: center;
    }
  }
  .el-radio {
    margin-left: 0;
    margin-bottom: 15px;
    display: block;
  }
  .el-alert {
    margin-left: 10px;
    background: none;
    padding-top: 0px;
  }
}
</style>
