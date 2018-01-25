<template lang="pug">
  el-form(ref="form", :model="formData", labelWidth="78px", v-loading="loading")
    el-form-item(label="商品图片", prop="head")
      template(slot-scope="scope")
        div.img(v-for="headItem in formData.head", v-lazy:background-image="headItem.url")
    el-form-item(label="列表图", prop="cover")
      div.img(v-if="showImg(formData.cover) !== ''", v-lazy:background-image="showImg(formData.cover)")
    el-form-item(label="商品名称", prop="")
      div {{formData.name}}
    el-form-item(label="卖点", prop="")
      div {{formData.sell_point}}
    el-form-item(label="商品规格", prop="")
      el-table(:data="formData.tenant_skus ? formData.tenant_skus : []", border)
        el-table-column(label="规格")
          div(slot-scope="scope") {{scope.row.sku.spec}}
        el-table-column(label="售价")
          div(slot-scope="scope") {{scope.row.sell_price | price}}
        el-table-column(label="库存")
          div(slot-scope="scope") {{scope.row.sku.stock}}
        el-table-column(label="编码")
          div(slot-scope="scope") {{scope.row.sku.code}}
        el-table-column(label="图片")
          template(slot-scope="scope")
            div.skuImg(v-lazy:background-image="showImg(scope.row.sku.image)")
    el-form-item(label="划线价", prop="st_price")
      span {{formData.st_price | price}}
      span.input-right-desc 元
    el-form-item(label="供货价", prop="supply_price")
      span {{formData.prop.ext.supply_price | price}}
      span.input-right-desc 元
    el-form-item(label="配送区域", prop="delivery_region_id", placeholder="请选择")
      div {{showName(formData.prop.ext.delivery_region)}}
    el-form-item(label="商品设置", prop="oversea")
      div {{showOversea(formData.prop.ext.oversea)}}
    el-form-item(label="商品描述", prop="content")
      show-description(:description="description")
    el-form-item(label="服务组合", prop="service_tag_group_id")
      div {{showName(formData.prop.ext.service_tag_group)}}
    el-form-item(label="售后模板", prop="after_service_id")
      div {{showName(formData.prop.ext.after_service)}}
</template>

<script>
  import * as TenantSelfProductApi from 'src/api/tenant-self-product'
  import ShowDescription from './ShowDescription.vue'

  export default {
    props: {},
    components: {ShowDescription},
    data () {
      return {
        loading: false,
        formData: {
          head: [],
          cover: {
            url: ''
          },
          prop: {
            ext: {}
          }
        },
        description: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      showOversea (row) {
        if (row) {
          return '清关商品'
        }
        return '非清关商品'
      },
      async getDetail () {
        try {
          this.loading = true
          let res = await TenantSelfProductApi.getTenantSelfItem(this.$route.params.id)
          this.formData = res.data
          this.description = res.data.content ? res.data.content : []
          this.loading = false
        } catch (err) {
        } finally {
          this.loading = false
        }
      },
      showImg (row) {
        if (row) {
          return row.url
        }
        return ''
      },
      showName (row) {
        if (row) {
          return row.name
        }
        return ''
      }
    },
    mounted () {
      this.getDetail()
    }
  }
</script>


<style lang="scss" scoped>
  .img {
    display: inline-block;
    width: 100px;
    height: 100px;
    background-size: cover;
    margin-right: 10px;
  }

  .skuImg {
    width: 50px;
    height: 50px;
    background-size: cover;
    margin-right: 10px;
  }
</style>
