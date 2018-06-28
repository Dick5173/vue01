<template lang="pug">
  div.edit-product-content
    left-arrow
    div.info-content
      div.title 商品
      el-form(ref="form", :model="formData.wgt_product", :rules="formRules")
        el-form-item(prop="s_tp", label="类型")
          el-radio(v-for="item in allProductTp", :key="item.value", :label="item.value", v-model="formData.wgt_product.s_tp", @change="handleContentTpChange") {{item.text}}
        el-form-item(labelWidth="10px", prop="products", ref="fIProduct", v-if="showSelectProduct")
          el-button(size="small", type="primary", @click="chooseProduct") {{selectProductText}}
          product-cell(v-if="showProductCell", v-model!="formData.wgt_product.products")
          product-group-cell(v-if="showProductGroupCell", :queryParams.sync="formData.wgt_product")
        el-form-item(prop="name", label="标题" v-else)
          el-input(v-model="formData.wgt_product.name", style="width: 200px", :maxlength="10")
          el-button(style="margin-left: 10px", type="primary", plain, size="small", v-clipboard:copy="getAppUrl()", v-clipboard:success="onCopy", v-clipboard:error="onError") 小程序链接
        el-form-item(prop="style_tp", label="样式")
          div(v-if="formData.wgt_product.s_tp === allProductTp.product.value")
            el-radio(v-for="item in allProductStyleTp", :key="item.value", :label="item.value", v-model="formData.wgt_product.style_tp") {{item.text}}
          div(v-else)
            el-radio(v-for="item in allProductGroupStyleTp", :key="item.value", :label="item.value", v-model="formData.wgt_product.style_tp") {{item.text}}
        el-form-item(label="上线时间：", prop="online_tp")
          el-radio-group(v-model="formData.wgt_product.online_tp")
            div
              el-radio(:label="allShowTp.show_long.value") {{ allShowTp.show_long.text }}
            div
              el-radio(:label="allShowTp.show_limit.value")
                date-range-picker(:start.sync="formData.wgt_product.online_start", :end.sync="formData.wgt_product.online_end", type="datetimerange")
      <!--choose-product-dialog(ref="dlgChooseProduct", @choose="chooseProductCompleted")-->
      <!--choose-product-group-dialog(ref="dlgChooseProductGroup", @choose="handleChooseProductGroupComplete")-->
</template>

<script>
  // import * as ProductGroup from 'src/api/productGroup'
  import LeftArrow from '../view/LeftArrow'
  import * as CustomPageService from 'src/service/home_template/index'
  // import ChooseProductDialog from 'src/ui/common/choose-product-dialog/Index.vue'
  // import ChooseProductGroupDialog from 'src/ui/common/choose-product-group-dialog/Index.vue'
  import ProductGroupCell from '../view/ProductGroup.vue'
  import ProductCell from '../view/Product.vue'
  // import { getOwnProductList } from 'src/api/product'
  import { DateRangePicker } from '@baibao/zeratul'
  import * as ElUtil from 'src/util/el'

  export default {
    components: {
      LeftArrow,
      DateRangePicker,
      // ChooseProductDialog,
      // ChooseProductGroupDialog,
      ProductCell,
      ProductGroupCell
    },
    props: {
      queryParams: {
        type: Object,
        default () {
          return {}
        },
        required: true
      }
    },
    watch: {
      queryParams (val) {
        this.formData = val
      },
      formData: {
        handler (val) {
          this.$emit('update:queryParams', val)
        },
        deep: true
      }
    },
    data () {
      const productValidator = (rule, value, callback) => {
        if (this.formData.wgt_product.s_tp === CustomPageService.allProductTp.product.value && (!this.formData.wgt_product.products || this.formData.wgt_product.products.length === 0)) {
          callback(new Error('请选择商品'))
          return
        } else if (this.formData.wgt_product.s_tp === CustomPageService.allProductTp.product_group.value && (!this.formData.wgt_product.product_group || !this.formData.wgt_product.product_group.id)) {
          callback(new Error('请选择商品组'))
          return
        }
        callback()
      }
      const titleValidator = (rule, value, callback) => {
        if (this.formData.wgt_product.s_tp === CustomPageService.allProductTp.all_product.value && !this.formData.wgt_product.name) {
          callback(new Error('不能为空'))
          return
        }
        callback()
      }
      const showTpValidator = (rule, value, callback) => {
        if (this.formData.wgt_product.online_tp === CustomPageService.allShowTp.show_limit.value && (this.formData.wgt_product.online_start === 0 || this.formData.wgt_product.online_end === 0)) {
          callback(new Error('请选择开始时间和结束时间'))
          return
        }
        callback()
      }
      return {
        formData: this.queryParams,
        formRules: {
          s_tp: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          style_tp: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          name: [
            {validator: titleValidator, trigger: 'change'}
          ],
          products: [
            {validator: productValidator, trigger: 'change'}
          ],
          online_tp: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: showTpValidator, trigger: 'change'}
          ]
        },
        ...$global.$mapConst({
          'allProductTp': CustomPageService.allProductTp,
          'allShowTp': CustomPageService.allShowTp,
          'allProductStyleTp': CustomPageService.allProductStyleTp,
          'allProductGroupStyleTp': CustomPageService.allProductGroupStyleTp
        })
      }
    },
    computed: {
      selectProductText () {
        return this.formData.wgt_product.s_tp === CustomPageService.allProductTp.product.value ? '选择商品' : '选择商品组'
      },
      showSelectProduct () {
        return this.formData.wgt_product.s_tp === CustomPageService.allProductTp.product.value || this.formData.wgt_product.s_tp === CustomPageService.allProductTp.product_group.value
      },
      showProductCell () {
        if (this.formData.wgt_product.s_tp === CustomPageService.allProductTp.product.value) {
          if (this.formData.wgt_product.createWithUser || this.queryParams.wgt_product.old_s_tp !== this.queryParams.wgt_product.s_tp) {
            this.queryParams.wgt_product.createWithUser = true
            return this.formData.wgt_product.products && this.formData.wgt_product.products.length > 0
          } else {
            return true
          }
        }
        return false
      },
      showProductGroupCell () {
        if (this.formData.wgt_product.s_tp === CustomPageService.allProductTp.product_group.value) {
          if (this.formData.wgt_product.createWithUser || this.queryParams.wgt_product.old_s_tp !== this.queryParams.wgt_product.s_tp) {
            this.queryParams.wgt_product.createWithUser = true
            return this.formData.wgt_product.product_group && this.formData.wgt_product.product_group.id
          } else {
            return true
          }
        }
        return false
      }
    },
    methods: {
      getAppUrl () {
        return `pages/goods/index?gid=0&isShare=1`
      },
      onError () {
        this.$message({
          type: 'danger',
          message: '复制失败'
        })
      },
      onCopy () {
        this.$message({
          type: 'success',
          message: '已复制小程序链接到剪贴板'
        })
      },
      cleanData () {
        if (this.$refs.fIProduct && this.$refs.fIProduct.clearValidate) {
          this.$refs.fIProduct.clearValidate()
        }
        this.formData.wgt_product.products = []
        this.formData.wgt_product.product_group = {}
      },
      async handleContentTpChange () {
        this.cleanData()
        this.formData.wgt_product.name = ''
        if (this.formData.wgt_product.s_tp === CustomPageService.allProductTp.product.value) {
          this.formData.wgt_product.style_tp = CustomPageService.allProductStyleTp.banner.value
        } else {
          this.formData.wgt_product.style_tp = CustomPageService.allProductGroupStyleTp.cross_slip.value
          if (this.formData.wgt_product.s_tp === CustomPageService.allProductTp.all_product.value) {
            this.formData.wgt_product.name = '全部商品'
            // const res = await getOwnProductList(this.$tid, {page: 1, limit: 6})
            // this.formData.wgt_product.products = res.data.data
          }
        }
      },
      chooseProductCompleted (items) {
        const oldProducts = this.R.clone(this.formData.wgt_product.products)
        let products = this.R.clone(items)
        let newProducts = []
        oldProducts.forEach((product) => {
          let i = 0
          products.forEach((item) => {
            if (product.id === item.id) {
              newProducts.push(item)
              products.splice(i, 1)
              return null
            }
            i++
          })
        })
        this.formData.wgt_product.products = newProducts.concat(products)
        this.$refs.fIProduct.onFieldChange()
      },
      async handleChooseProductGroupComplete (productGroups) {
        // let productGroup = productGroups[0]
        // const res = await ProductGroup.getItem(this.$tid, productGroup.id)
        // productGroup = res.data
        // this.formData.wgt_product.product_group = productGroup
        // if (!this.formData.wgt_product.name || this.formData.wgt_product.name === '') {
        //   this.formData.wgt_product.name = productGroup.name
        // }
        // this.$refs.fIProduct.onFieldChange()
      },
      chooseProduct () {
        // if (this.formData.wgt_product.s_tp === CustomPageService.allProductTp.product.value) {
        //   this.$refs.dlgChooseProduct.show(ChooseProductDialog.MODE_MULTIPLE, this.formData.wgt_product.products, [], false, 24)
        // } else if (this.formData.wgt_product.s_tp === CustomPageService.allProductTp.product_group.value) {
        //   this.$refs.dlgChooseProductGroup.show([], ChooseProductGroupDialog.MODE_SINGLE)
        // }
      },
      formValidate () {
        this.$refs.form.validate(async (valid) => {
          if (!valid) {
            ElUtil.scrollToInvalidFirstElement(this.$refs.form)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .edit-product-content {
    width: 542px;
    margin-bottom: 10px;
    display: flex;

    .info-content {
      flex: 1;
      width: 100%;
      height: 100%;
      padding: 10px;
      border: 1px solid #DFDFDF;

      position: relative;
      background: #F5F5F5;
      line-height: 30px;
      border-radius: 10px;

      &:after {
        position: absolute;
        content: '';
        width: 20px;
        height: 20px;
        background: #F5F5F5;
        border-top-right-radius: 10px;
        top: 25px;
        left: -11px;
        border-bottom: solid 1px #DFDFDF;
        border-right: solid 1px #F5F5F5;
        border-top: solid 1px #F5F5F5;
        border-left: solid 1px #DFDFDF;
        transform: rotate(45deg);
      }


      .title {
        margin-bottom: 10px;
      }

      .margin-top {
        margin-top: 5px;
      }

      .margin-left {
        margin-top: 15px;
      }
    }
  }
</style>
