<template lang="pug">
  div.edit-buy-group-content
    left-arrow
    div.info-content
      div.title 拼团
      el-form(ref="form", :model="formData.wgt_buy_group", :rules="formRules")
        el-form-item(prop="name", label="标题")
          el-input(v-model="formData.wgt_buy_group.name", style="width: 300px", :maxlength="10")
        el-form-item(prop="s_tp", label="类型")
          el-radio(v-for="item in allBuyGroupTp", :key="item.value", :label="item.value", v-model="formData.wgt_buy_group.s_tp", @change="handleContentTpChange") {{item.text}}
        el-form-item(labelWidth="10px", prop="products", ref="fIContent", v-if="showSelectProduct")
          el-button(size="small", type="primary", @click="chooseProduct") {{selectProductText}}
          product-cell(v-if="showProductCell", v-model!="formData.wgt_buy_group.products")
          product-group-cell(v-if="showProductGroupCell", :queryParams.sync="formData.wgt_buy_group", :buyGroup="true")
        el-form-item(prop="style_tp", label="样式")
          el-radio(v-for="item in allProductGroupStyleTp", :key="item.value", :label="item.value", v-model="formData.wgt_buy_group.style_tp") {{item.text}}
        el-form-item(label="上线时间：", prop="online_tp")
          el-radio-group(v-model="formData.wgt_buy_group.online_tp")
            div
              el-radio(:label="allShowTp.show_long.value") {{ allShowTp.show_long.text }}
            div
              el-radio(:label="allShowTp.show_limit.value")
                date-range-picker(:start.sync="formData.wgt_buy_group.online_start", :end.sync="formData.wgt_buy_group.online_end", type="datetimerange")
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
  import { getOwnProductList } from 'src/api/product'
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
        if (this.formData.wgt_buy_group.s_tp === CustomPageService.allBuyGroupTp.product.value && (!this.formData.wgt_buy_group.products || this.formData.wgt_buy_group.products.length === 0)) {
          callback(new Error('请选择商品'))
          return
        } else if (this.formData.wgt_buy_group.s_tp === CustomPageService.allBuyGroupTp.product_group.value && (!this.formData.wgt_buy_group.product_group || !this.formData.wgt_buy_group.product_group.id)) {
          callback(new Error('请选择商品组'))
          return
        }
        callback()
      }
      const showTpValidator = (rule, value, callback) => {
        if (this.formData.wgt_buy_group.online_tp === CustomPageService.allShowTp.show_limit.value && (this.formData.wgt_buy_group.online_start === 0 || this.formData.wgt_buy_group.online_end === 0)) {
          callback(new Error('请选择开始时间和结束时间'))
          return
        }
        callback()
      }
      return {
        formData: this.queryParams,
        formRules: {
          s_tp: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          style_tp: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          name: [
            {required: true, message: '不能为空', trigger: 'change'}
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
          'allBuyGroupTp': CustomPageService.allBuyGroupTp,
          'allShowTp': CustomPageService.allShowTp,
          'allProductGroupStyleTp': CustomPageService.allProductGroupStyleTp
        })
      }
    },
    computed: {
      selectProductText () {
        return this.formData.wgt_buy_group.s_tp === CustomPageService.allBuyGroupTp.product.value ? '选择商品' : '选择商品组'
      },
      showSelectProduct () {
        return this.formData.wgt_buy_group.s_tp === CustomPageService.allBuyGroupTp.product.value || this.formData.wgt_buy_group.s_tp === CustomPageService.allBuyGroupTp.product_group.value
      },
      showProductCell () {
        if (this.formData.wgt_buy_group.s_tp === CustomPageService.allBuyGroupTp.product.value) {
          if (!this.formData.wgt_buy_group.createWithUser) {
            return true
          } else {
            return this.formData.wgt_buy_group.products && this.formData.wgt_buy_group.products.length > 0
          }
        }
        return false
      },
      showProductGroupCell () {
        if (this.formData.wgt_buy_group.s_tp === CustomPageService.allBuyGroupTp.product_group.value) {
          if (!this.formData.wgt_buy_group.createWithUser) {
            return true
          } else {
            return this.formData.wgt_buy_group.product_group && this.formData.wgt_buy_group.product_group.id
          }
        }
        return false
      }
    },
    methods: {
      cleanData () {
        if (this.$refs.fIContent && this.$refs.fIContent.clearValidate) {
          this.$refs.fIContent.clearValidate()
        }
        this.formData.wgt_buy_group.products = []
        this.formData.wgt_buy_group.product_group = {}
      },
      async handleContentTpChange () {
        this.cleanData()
        this.formData.wgt_buy_group.style_tp = CustomPageService.allProductGroupStyleTp.cross_slip.value
        if (this.formData.wgt_buy_group.s_tp === CustomPageService.allBuyGroupTp.all_product.value) {
          const res = await getOwnProductList(this.$tid, {page: 1, limit: 6, group: true})
          this.formData.wgt_buy_group.products = res.data.data
        }
      },
      chooseProductCompleted (items) {
        const oldProducts = this.R.clone(this.formData.wgt_buy_group.products)
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
        this.formData.wgt_buy_group.products = newProducts.concat(products)
        this.$refs.fIContent.onFieldChange()
      },
      async handleChooseProductGroupComplete (productGroups) {
        // let productGroup = productGroups[0]
        // const res = await ProductGroup.getItem(this.$tid, productGroup.id)
        // productGroup = res.data
        // if (productGroup.products && productGroup.products.length > 6) {
        //   productGroup.products.splice(6, productGroup.products.length - 6)
        // }
        // this.formData.wgt_buy_group.product_group = productGroup
        // this.$refs.fIContent.onFieldChange()
      },
      chooseProduct () {
        // if (this.formData.wgt_buy_group.s_tp === CustomPageService.allBuyGroupTp.product.value) {
        //   this.$refs.dlgChooseProduct.show(ChooseProductDialog.MODE_MULTIPLE, this.formData.wgt_buy_group.products, [], true, 24)
        // } else if (this.formData.wgt_buy_group.s_tp === CustomPageService.allBuyGroupTp.product_group.value) {
        //   this.$refs.dlgChooseProductGroup.show([], ChooseProductGroupDialog.MODE_SINGLE, [], true)
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
  .edit-buy-group-content {
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
