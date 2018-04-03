<template lang="pug">
  div.bottom-outer-content
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="78px", v-loading="loading")
      el-form-item(label="商品图片", prop="head", :required="true")
        upload-image-list(ref="uploadHead", :imageList.sync="formData.head", :maxFiles='$options.MAX_HEAD_COUNT', :host="getHost", :token="getToken")
        div.input-bottom-desc 还能上传 {{ remainHeadCount }} 张，建议尺寸750×750像素
      el-form-item(label="列表图", prop="cover")
        upload-image(ref="uploadCover", :image.sync="formData.cover", :host="getHost", :token="getToken")
        div.input-bottom-desc 建议尺寸750×750像素
      el-form-item(label="首页图", prop="page_cover")
        upload-image(ref="uploadPageCover", :image.sync="formData.page_cover", :host="getHost", :token="getToken")
        div.input-bottom-desc 在首页中以单品形式显示时适用，建议尺寸702×440像素
      el-form-item(label="商品名称", prop="name")
        el-input.medium-el-input(v-model.trim="formData.name", :maxlength="50")
        span.input-right-desc {{ formData.name.length }} / 50
      el-form-item(label="卖点", prop="sell_point")
        el-input.medium-el-input(v-model.trim="formData.sell_point", :maxlength="30")
        span.input-right-desc {{ formData.sell_point.length }} / 30
      el-form-item(label="商品规格", prop="skus", required)
        skus(ref="skus", :skus.sync="formData.skus", :stPrice="this.formData.st_price", :supplyPrice="this.formData.supply_price")
      el-form-item(label="划线价", prop="st_price")
        el-input.tiny-el-input(v-model.trim="formData.st_price")
        span.input-right-desc 元
      el-form-item(label="供货价")
        el-form-item(label="普通店铺", prop="supply_price", style="margin-bottom:20px")
          el-input.tiny-el-input(v-model.trim="formData.supply_price")
          span.input-right-desc 元
        el-form-item(label="中级店铺", prop="mid_tenant_supply_price", style="margin-bottom:20px")
          el-input.tiny-el-input(v-model.trim="formData.mid_tenant_supply_price")
          span.input-right-desc 元
        el-form-item(label="高级店铺", prop="high_tenant_supply_price")
          el-input.tiny-el-input(v-model.trim="formData.high_tenant_supply_price")
          span.input-right-desc 元
      el-form-item(label="商品分类", prop="category_id")
        el-select(v-model="formData.category_id", placeholder="请选择")
          el-option-group(v-for!="parentItem in allCategories", :label="parentItem.name", :key="parentItem.id")
            el-option(v-for!="childItem in parentItem.children", :label="childItem.name", :value="`${childItem.id}`", :key="childItem.id")
      el-form-item(label="配送区域", prop="delivery_region_id", placeholder="请选择")
        el-select(v-model="formData.delivery_region_id", placeholder="请选择", clearable)
          el-option(v-for="item in deliveryRegionList", :key="item.id", :label="item.name", :value="`${item.id}`")
      el-form-item(label="商品设置", prop="oversea")
        el-checkbox(v-model="formData.oversea") 清关商品
          span.input-right-desc 购买清关商品时需要消费者提供真实姓名和身份证，系统检验后才能进行付款
      el-form-item(label="运费", prop="freight_template_id")
        el-radio(v-model="radFreightVal", :label="$options.FREIGHT_FREE_DELIVERY") 包邮
        el-radio(v-model="radFreightVal", :label="$options.FREIGHT_SPECIFY_TEMPLATE") 运费模板 &nbsp;
        el-select(v-model="formData.freight_template_id", placeholder="请选择")
          el-option(v-for="item in freightTemplateList", :key="item.id", :label="item.name", :value="`${item.id}`")
      el-form-item(label="商品标签", prop="tag")
        div
          el-tag.ptag(type="primary", v-for="item in formData.tags", :key="item.id") {{item.name}}
        el-button(type="primary", size="small", icon="el-icon-plus", @click="chooseTag") 选择标签
      el-form-item(label="商品描述", prop="content")
        content-comp(:content.sync="formData.content")
      el-form-item(label="服务组合", prop="service_tag_group_id")
        el-select(v-model="formData.service_tag_group_id", placeholder="请选择", clearable)
          el-option(v-for="item in serviceGroupList", :key="item.id", :label="item.name", :value="`${item.id}`")
      el-form-item(label="售后模板", prop="after_service_id")
        el-select(v-model="formData.after_service_id", placeholder="请选择", clearable)
          el-option(v-for="item in afterServiceList", :key="item.id", :label="item.name", :value="`${item.id}`")
    bottom-container
      el-button(@click="$router.back()") 取消
      el-button(v-if="!isEditMode", :loading="loading", @click="handleSave(true)") 保存并上架
      el-button(type="primary", :loading="loading", @click="handleSave") 保存
    batch-tag-dialog(ref="chooseTagDialog", :origin="oraTags", @submit="chooseTagComplete")
</template>

<script>
  import * as AliyunApi from 'src/api/aliyun'
  import Skus from './Skus.vue'
  import Supply from './Supply.vue'
  import * as TenantApi from 'src/api/tenant'
  import { UploadImage, UploadImageList } from '@baibao/zeratul'
  import ContentComp from './Content.vue'
  import * as FormApi from 'src/api/product'
  import * as CategoryApi from 'src/api/category'
  import * as ProductService from 'src/service/product'
  import * as ServiceGroupApi from 'src/api/servicetag'
  import * as AfterServiceApi from 'src/api/after-service'
  import * as deliveryRegionApi from 'src/api/delivery-region'
  import * as freightTemplateApi from 'src/api/freight-template'
  import { priceValidator } from 'src/util/validator'
  import BatchTagDialog from 'src/ui/product/platform/dialog/BatchTagDialog.vue'
  import * as ElUtil from 'src/util/el'

  const MAX_HEAD_COUNT = 5
  const FREIGHT_FREE_DELIVERY = 0
  const FREIGHT_SPECIFY_TEMPLATE = 1

  export default {
    MAX_HEAD_COUNT,
    FREIGHT_FREE_DELIVERY,
    FREIGHT_SPECIFY_TEMPLATE,
    components: {
      UploadImageList,
      UploadImage,
      Skus,
      ContentComp,
      BatchTagDialog,
      Supply
    },
    data () {
      const headValidator = (rule, value, callback) => {
        if (this.$refs.uploadHead.isUpdating) {
          callback(new Error('正在上传图片'))
          return
        }
        if (value) {
          if (value.length <= 0) {
            callback(new Error('请选择图片'))
          } else if (value.length > MAX_HEAD_COUNT) {
            callback(new Error(`最多选择${MAX_HEAD_COUNT}图片`))
          } else {
            callback()
          }
        } else {
          callback(new Error('请选择图片'))
        }
      }
      const coverValidator = (rule, value, callback) => {
        if (this.$refs.uploadCover.isUpdating) {
          callback(new Error('正在上传图片'))
          return
        }
        callback()
      }
      const pageCoverValidator = (rule, value, callback) => {
        if (this.$refs.uploadPageCover.isUpdating) {
          callback(new Error('正在上传图片'))
          return
        }
        callback()
      }
      const skuValidator = (rule, value, callback) => {
        if (!value || value.length <= 0) {
          callback(new Error('Sku不能为空'))
          return
        }
        if (this.$refs.skus.isUpdating()) {
          callback(new Error('正在上传图片'))
          return
        }
        callback()
      }
      const supplyPriceValidator = (rule, value, callback) => {
        if (!this.R_.isPrice(value)) {
          callback(new Error('不正确的价格'))
          return
        }
        const supplyPrice = this.R_.convertYuanToFen(value)
        if (this.R_.isPrice(this.formData.st_price)) {
          const st = this.R_.convertYuanToFen(this.formData.st_price)
          if (supplyPrice > st) {
            callback(new Error('不能大于划线价'))
            return
          }
        }
        callback()
      }
      const midTenantSupplyPriceValidator = (rule, value, callback) => {
        if (!this.R_.isPrice(value)) {
          callback(new Error('不正确的价格'))
          return
        }
        const midTenantSupplyPrice = this.R_.convertYuanToFen(value)
        if (this.R_.isPrice(this.formData.supply_price)) {
          const st = this.R_.convertYuanToFen(this.formData.supply_price)
          if (midTenantSupplyPrice > st) {
            callback(new Error('不能大于普通店铺划线价'))
            return
          }
        }
        callback()
      }
      const highTenantSupplyPriceValidator = (rule, value, callback) => {
        if (!this.R_.isPrice(value)) {
          callback(new Error('不正确的价格'))
          return
        }
        const highTenantSupplyPrice = this.R_.convertYuanToFen(value)
        if (this.R_.isPrice(this.formData.mid_tenant_supply_price)) {
          const st = this.R_.convertYuanToFen(this.formData.mid_tenant_supply_price)
          if (highTenantSupplyPrice > st) {
            callback(new Error('不能大于中级店铺划线价'))
            return
          }
        }
        callback()
      }
      const freightTemplateValidator = (rule, value, callback) => {
        if (this.radFreightVal === FREIGHT_SPECIFY_TEMPLATE && !value) {
          callback(new Error('请选择运费模板'))
          return
        }
        callback()
      }

      return {
        loading: false,
        initialData: {},
        serviceGroupList: [],
        afterServiceList: [],
        deliveryRegionList: [],
        allCategories: [],
        tenantLevelList: [],
        freightTemplateList: [],
        radFreightVal: 0,
        formData: {
          id: 0,
          status: 1,
          head: [],
          cover: {
            url: '',
            width: 0,
            height: 0
          },
          page_cover: {
            url: '',
            width: 0,
            height: 0
          },
          name: '',
          sell_point: '',
          skus: [{
            spec: '默认规格',
            suggest_price: '',
            stock: '',
            code: '',
            weight: '',
            image: {
              url: '',
              width: 0,
              height: 0
            }
          }],
          supply_levels: [{
            id: 0,
            tenant_level_id: 0,
            supply_price: 0
          }],
          st_price: '',
          supply_price: '',
          mid_tenant_supply_price: '',
          high_tenant_supply_price: '',
          category_id: '',
          oversea: false,
          content: [],
          tags: [],
          service_tag_group_id: '',
          after_service_id: '',
          delivery_region_id: '',
          freight_template_id: ''
        },
        formRules: {
          head: [
            {validator: headValidator, trigger: 'change'}
          ],
          cover: [
            {validator: coverValidator, trigger: 'change'}
          ],
          page_cover: [
            {validator: pageCoverValidator, trigger: 'change'}
          ],
          name: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 50, message: '最多可以输入50个字符', trigger: 'blur'}
          ],
          sell_point: [
            {max: 30, message: '最多可以输入30个字符', trigger: 'blur'}
          ],
          skus: [
            {validator: skuValidator, trigger: 'change'}
          ],
          st_price: [
            {validator: priceValidator, trigger: 'blur'}
          ],
          supply_price: [
            {required: true, message: '价格不能为空', trigger: 'blur'},
            {validator: supplyPriceValidator, trigger: 'blur'}
          ],
          mid_tenant_supply_price: [
            {required: true, message: '价格不能为空', trigger: 'blur'},
            {validator: midTenantSupplyPriceValidator, trigger: 'blur'}
          ],
          high_tenant_supply_price: [
            {required: true, message: '价格不能为空', trigger: 'blur'},
            {validator: highTenantSupplyPriceValidator, trigger: 'blur'}
          ],
          category_id: [
            {required: true, message: '分类不能为空', trigger: 'change'}
          ],
          freight_template_id: [
            {validator: freightTemplateValidator, trigger: 'change'}
          ]
        }
      }
    },
    computed: {
      isCopy () {
        return this.$route.params.copy === true
      },
      isRecycle () {
        return this.$route.params.recycle === true
      },
      isEditMode () {
        return this.$route.name === 'PlatformProductEdit'
      },
      remainHeadCount () {
        return MAX_HEAD_COUNT - this.formData.head.length
      },
      oraTags () {
        return this.formData.tags ? [{tags: this.formData.tags}] : []
      }
    },
    watch: {
      radFreightVal (newVal, oldVal) {
        if (newVal === FREIGHT_FREE_DELIVERY) {
          this.formData.freight_template_id = ''
        }
      },
      'formData.freight_template_id' (newVal, oldVal) {
        if (newVal) {
          this.radFreightVal = FREIGHT_SPECIFY_TEMPLATE
        }
      }
    },
    methods: {
      async initData () {
        try {
          this.loading = true
          this.getTenantLevel()
          this.getCategoryList()
          this.getServiceGroupList()
          this.getAfterServiceList()
          this.getDeliveryRegionList()
          this.getFreightTemplateList()
          if (this.isEditMode || this.isCopy) {
            const resItem = await FormApi.getItem(this.$route.params.id)
            this.formData = ProductService.convertModelToForm(resItem.data)
          }
          this.initialData = this.R.clone(this.formData)
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      async getTenantLevel () {
        const res = await TenantApi.getTenantLevelList()
        this.tenantLevelList = res.data.data
      },
      async getCategoryList () {
        const resCategory = await CategoryApi.getList()
        this.allCategories = resCategory.data.data
      },
      async getServiceGroupList () {
        const resServiceGroup = await ServiceGroupApi.getTagGroupList()
        this.serviceGroupList = resServiceGroup.data.data
      },
      async getAfterServiceList () {
        const resAfterService = await AfterServiceApi.getList()
        this.afterServiceList = resAfterService.data.data
      },
      async getDeliveryRegionList () {
        const resDeliveryRegion = await deliveryRegionApi.getList()
        this.deliveryRegionList = resDeliveryRegion.data.data
      },
      async getFreightTemplateList () {
        const resFreightTemplate = await freightTemplateApi.getList()
        this.freightTemplateList = resFreightTemplate.data.data
      },
      async create (up) {
        this.formData.id = 0
        let frm = Object.assign({}, this.formData)
        console.log(frm.supply_levels)
        if (up) {
          frm.status = ProductService.allStatus.up.value
        }
        if (this.isCopy) {
          frm = ProductService.copyCreate(frm)
        }
        await FormApi.create(frm)
        this.$router.back()
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      },
      async update () {
        if (this.isRecycle) {
          await FormApi.update(this.formData.id, this.formData)
          await FormApi.cancelDeleteProduct(this.formData.id)
          this.$message({
            type: 'success',
            message: '编辑成功,商品已经恢复为下架商品'
          })
          this.$router.back()
        } else {
          await FormApi.update(this.formData.id, this.formData)
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.$router.back()
        }
      },
      handleSave (up) {
        this.loading = true
        this.$refs.form.validate((valid) => {
          if (valid) {
            try {
              if (!this.isEditMode) {
                this.create(up)
              } else {
                this.update()
              }
            } catch (err) {
            }
          } else {
            ElUtil.scrollToInvalidFirstElement(this.$refs.form)
          }
          this.loading = false
        })
      },
      chooseTag () {
        this.$refs.chooseTagDialog.show()
      },
      chooseTagComplete (result) {
        this.formData.tags = result.component.chooseTags
        result.component.hide()
      },
      ...$global.$mapMethods({
        'getHost': AliyunApi.getOssHost,
        'getToken': AliyunApi.getOssToken
      })
    },
    async mounted () {
      this.initData()
    }
  }
</script>

<style lang="scss" scoped>
  .ptag {
    margin-right: 10px;
  }
</style>
