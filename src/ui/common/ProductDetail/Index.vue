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
      skus(:skus="skus", :isPlatform="isPlatform", :formData="formData")
    el-form-item(label="划线价", prop="st_price")
      span {{formData.st_price | price}}
      span.input-right-desc 元
    el-form-item(label="供货价", prop="supply_price")
      span {{formData.prop.ext.supply_price | price}}
      span.input-right-desc 元
    el-form-item(v-if="isPlatform", label="商品分类", prop="delivery_region_id")
      div {{showName(formData.prop.category)}}
    el-form-item(label="配送区域", prop="delivery_region_id")
      div {{showName(formData.prop.ext.delivery_region)}}
    el-form-item(label="商品设置", prop="oversea")
      div {{showOversea(formData.prop.ext.oversea)}}
    el-form-item(v-if="isPlatform", label="商品标签", prop="oversea")
      div
        el-tag.ptag(type="primary", v-for="item in formData.prop.tags", :key="item.id") {{item.name}}
    el-form-item(label="商品描述", prop="content")
      show-description(:description="description")
    el-form-item(label="服务组合", prop="service_tag_group_id")
      div {{showName(formData.prop.ext.service_tag_group)}}
    el-form-item(label="售后模板", prop="after_service_id")
      div {{showName(formData.prop.ext.after_service)}}
</template>

<script>
  import * as ProductApi from 'src/api/product'
  import * as TenantSelfProductApi from 'src/api/tenant-self-product'
  import * as TenantApi from 'src/api/tenant'
  import ShowDescription from './ShowDescription.vue'
  import Skus from 'src/ui/common/ProductDetail/Skus.vue'

  export default {
    props: {},
    components: {ShowDescription, Skus},
    data () {
      return {
        loading: false,
        skus: [],
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
    computed: {
      isPlatform () {
        return this.$route.name === 'PlatformProductDetail'
      },
      isTenantProductDetail () {
        return this.$route.name === 'TenantShowProductDetail'
      }
    },
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
          let res = ''
          if (this.isPlatform) {
            res = await ProductApi.getItem(this.$route.params.id)
            this.skus = res.data.prop.skus
          } else if (this.isTenantProductDetail) {
            res = await TenantApi.getTenantProductDetail(this.$route.params.tid, this.$route.params.pid)
            this.skus = res.data.tenant_skus
          } else {
            res = await TenantSelfProductApi.getTenantSelfItem(this.$route.params.id)
            this.skus = res.data.tenant_skus
          }
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


</style>
