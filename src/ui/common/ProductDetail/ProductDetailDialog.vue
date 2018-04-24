<template lang="pug">
  div.detail-dialog
    el-dialog(title="商品详情",
    :visible.sync="dialogVisible",
    width="750px",
    )
      div(v-loading="loading")
        product-detail(:rowFormData="formData", :isPrompt="prompt")
      </span>

</template>

<script>
import ProductDetail from './Index'
import * as ProductApi from 'src/api/product'
import * as TenantSelfProductApi from 'src/api/tenant-self-product'
import * as TenantApi from 'src/api/tenant'
import * as ProductService from 'src/service/product'

export default {
  props: {},
  components: { ProductDetail },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      formData: {},
      prompt: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    show (item, needPrompt, tid) {
      if (needPrompt) {
        this.prompt = needPrompt
      }
      this.dialogVisible = true
      this.getDetail(item.id, item.tp, tid)
    },
    async getDetail (id, tp, tid) {
      await this.getTenantLevel()
      try {
        this.loading = true
        let res = ''
        if (tp === 1) {
          res = await ProductApi.getItem(id)
        } else if (tid) {
          res = await TenantApi.getTenantProductDetail(tid, id)
        } else {
          res = await TenantSelfProductApi.getTenantSelfItem(id)
        }
        this.formData = res.data
        if (tp === 1) {
          this.formData.supply_levels = ProductService.buildSupplyPriceWithConvertFenToYuan(this.tenantLevelList, this.formData.prop.supply_levels)
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    async getTenantLevel () {
      const res = await TenantApi.getTenantLevelList()
      this.tenantLevelList = res.data.data
      console.log('this.tenantLevelList', this.tenantLevelList)
    }
  }
}
</script>


<style lang="scss">
.detail-dialog .el-dialog {
  overflow: hidden;
  height: 500px;
  .el-dialog__wrapper {
    overflow: hidden;
  }
  .el-dialog__body {
    overflow: auto;
    height: 410px;
  }
  .btn-fixed {
    position: absolute;
    bottom: 0;
    z-index: 10;
    margin-bottom: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 100%;
    background: #fff;
    .el-form-item__content {
      margin-left: 0;
    }
  }
}
</style>
