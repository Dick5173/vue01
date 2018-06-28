<template lang="pug">
  div
    el-dialog(title="图片跳转", :visible.sync="dialogVisible", :loading="loading")
      div
        el-form(ref="form", :model="formData", :rules="formRules")
          el-form-item(label="类型", ref="fIAction", prop="action_tp")
            el-radio(v-for="item in allCustomTp", :key="item.value", :label="item.value", v-model="formData.action_tp", @change="radioChange") {{item.text}}
          el-form-item(v-if="showChooseBtnText || showOtherApp || showTags", ref="fIContent", prop="content")
            el-button(v-if="showChooseBtnText", style="margin-bottom:10px", type="primary", plain, @click="handleChooseContent") {{showChooseBtnText}}
            <!--product-cell(v-if="showProduct", :product="showProduct")-->
            <!--product-group-cell(v-if="showProductGroup", :productGroup="showProductGroup")-->
            <!--tags-group-cell(ref="productTag", v-if="showTags", :model="showTags")-->
            <!--micro-page-cell(v-if="showMicroPage", :micropage="showMicroPage")-->
            <!--other-app-cell(v-if="showOtherApp", :model="formData")-->
          el-form-item(v-if="showChooseTime", label="上线时间", prop="online_tp")
            el-radio-group(v-model="formData.online_tp")
              div
                el-radio(:label="allShowTp.show_long.value") {{ allShowTp.show_long.text }}
              div
                el-radio(:label="allShowTp.show_limit.value")
                  date-range-picker(:start.sync="formData.online_start", :end.sync="formData.online_end", type="datetimerange")
      div(slot="footer", class="dialog-footer")
        el-button(size="mini", @click="dialogVisible = false") 取 消
        el-button(size="mini", type="primary", @click="submitForm", :disabled="loading") 确 定
    <!--choose-product-dialog(ref="dlgChooseProduct", @choose="handleChooseProductComplete")-->
    <!--choose-product-group-dialog(ref="dlgChooseProductGroup", @choose="handleChooseProductGroupComplete")-->
    <!--choose-micro-page-dialog(ref="dlgChooseMicroPage", @choose="handleChooseMicroPageComplete")-->
</template>

<script>
  import * as CustomPageService from 'src/service/home_template/index'
  // import ProductCell from 'src/ui/common/cell/Product'
  // import TagsGroupCell from 'src/ui/common/cell/TagsGroup'
  // import ProductGroupCell from 'src/ui/common/cell/ProductGroup'
  // import MicroPageCell from 'src/ui/common/cell/MicroPage'
  // import ChooseProductDialog from 'src/ui/common/choose-product-dialog/Index.vue'
  // import ChooseProductGroupDialog from 'src/ui/common/choose-product-group-dialog/Index.vue'
  // import ChooseMicroPageDialog from 'src/ui/common/choose-micropage-dialog/Index.vue'
  import { DateRangePicker } from '@baibao/zeratul'
  import * as ElUtil from 'src/util/el'
  // import OtherAppCell from 'src/ui/common/cell/OtherApp'

  export default {
    components: {
      // ProductCell,
      // ProductGroupCell,
      // MicroPageCell,
      // ChooseProductDialog,
      // ChooseProductGroupDialog,
      // ChooseMicroPageDialog,
      DateRangePicker
      // OtherAppCell,
      // TagsGroupCell
    },
    props: {},
    data () {
      const productValidator = (rule, value, callback) => {
        if (this.formData.action_tp === CustomPageService.allCustomTp.product.value && (!this.formData.product || !this.formData.product.id)) {
          callback(new Error('请选择商品'))
          return
        } else if (this.formData.action_tp === CustomPageService.allCustomTp.product_group.value && (!this.formData.product_group || !this.formData.product_group.id)) {
          callback(new Error('请选择商品组'))
          return
        } else if (this.formData.action_tp === CustomPageService.allCustomTp.min_page.value && (!this.formData.min_page || !this.formData.min_page.id)) {
          callback(new Error('请选择微页面'))
          return
        }
        callback()
      }
      const showTpValidator = (rule, value, callback) => {
        if (this.formData.online_tp === CustomPageService.allShowTp.show_limit.value && (this.formData.online_start === 0 || this.formData.online_end === 0)) {
          callback(new Error('请选择开始时间和结束时间'))
          return
        }
        callback()
      }
      const actionValidator = (rule, value, callback) => {
        if (value === 0) {
          callback(new Error('请选择跳转方式'))
          return
        }
        callback()
      }
      return {
        loading: false,
        dialogVisible: false,
        showChooseTime: false,
        index: 0,
        formData: {},
        formRules: {
          action_tp: [
            {required: true, message: '不能为空', trigger: 'change'},
            {validator: actionValidator, trigger: 'change'}
          ],
          content: [
            {validator: productValidator, trigger: 'change'}
          ],
          online_tp: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: showTpValidator, trigger: 'change'}
          ]
        },
        ...$global.$mapConst({
          'allShowTp': CustomPageService.allShowTp,
          'allCustomTp': CustomPageService.allCustomTp
        })
      }
    },
    watch: {
      dialogVisible (val) {
        if (!val) {
          this.formData = {
            action_tp: 0,
            product: {},
            product_group: {},
            product_tag_group: {},
            product_tag: {},
            product_tag_tp: 0,
            min_page: {},
            online_tp: 1,
            online_start: 0,
            online_end: 0
          }
        }
      }
    },
    computed: {
      showChooseBtnText () {
        switch (this.formData.action_tp) {
          case CustomPageService.allCustomTp.product.value:
            return '选择商品'
          case CustomPageService.allCustomTp.product_group.value:
            return '选择商品组'
          case CustomPageService.allCustomTp.min_page.value:
            return '选择微页面'
          default:
            return null
        }
      },
      showProduct () {
        if (this.formData.action_tp === CustomPageService.allCustomTp.product.value && this.formData.product && this.formData.product.id) {
          return this.formData.product
        }
        return null
      },
      showProductGroup () {
        if (this.formData.action_tp === CustomPageService.allCustomTp.product_group.value && this.formData.product_group && this.formData.product_group.id) {
          return this.formData.product_group
        }
        return null
      },
      showMicroPage () {
        if (this.formData.action_tp === CustomPageService.allCustomTp.min_page.value && this.formData.min_page && this.formData.min_page.id) {
          return this.formData.min_page
        }
        return null
      },
      showOtherApp () {
        if (this.formData.action_tp === CustomPageService.allCustomTp.other_app.value) {
          return CustomPageService.getOtherAppInfo(this.formData)
        }
        return null
      },
      showTags () {
        if (this.formData.action_tp === CustomPageService.allCustomTp.product_tag.value) {
          return this.formData
        }
        return null
      }
    },
    methods: {
      show (formData, showChooseTime = false, index = 0) {
        this.formDataChange = formData
        this.index = index
        this.formData = this.R.clone(formData)
        this.showChooseTime = showChooseTime
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      async radioChange () {
        await this.$nextTick()
        if (this.$refs.fIContent && this.$refs.fIContent.clearValidate) {
          this.$refs.fIContent.clearValidate()
        }
        this.$refs.fIAction.clearValidate()
        this.formData.product = {}
        this.formData.product_group = {}
        this.formData.min_page = {}
        this.$set(this.formData, 'product_tag_tp', '')
        this.$set(this.formData, 'product_tag_group', {})
        this.$set(this.formData, 'product_tag', {})
        this.$set(this.formData, 'app_id', '')
        this.$set(this.formData, 'app_page', '')
      },
      handleChooseContent () {
        // if (this.formData.action_tp === CustomPageService.allCustomTp.product.value) {
        //   this.$refs.dlgChooseProduct.show(ChooseProductDialog.MODE_SINGLE)
        // } else if (this.formData.action_tp === CustomPageService.allCustomTp.product_group.value) {
        //   this.$refs.dlgChooseProductGroup.show()
        // } else if (this.formData.action_tp === CustomPageService.allCustomTp.min_page.value) {
        //   this.$refs.dlgChooseMicroPage.show()
        // }
      },
      async handleChooseProductComplete (products) {
        this.formData.product = products[0]
        await this.$nextTick()
        this.$refs.fIContent.onFieldChange()
      },
      async handleChooseProductGroupComplete (productGroups) {
        this.formData.product_group = productGroups[0]
        await this.$nextTick()
        this.$refs.fIContent.onFieldChange()
      },
      async handleChooseMicroPageComplete (microPage) {
        this.formData.min_page = microPage
        await this.$nextTick()
        this.$refs.fIContent.onFieldChange()
      },
      submitForm () {
        if (this.formData.action_tp === CustomPageService.allCustomTp.product_tag.value && !this.formData.product_tag_tp) {
          this.$refs.productTag.changeShowMsg()
        } else {
          this.$refs.form.validate(async (valid) => {
            if (valid) {
              const data = this.R.clone(this.formData)
              this.formDataChange.action_tp = data.action_tp
              this.formDataChange.product = data.product
              this.formDataChange.product_group = data.product_group
              this.formDataChange.min_page = data.min_page
              this.formDataChange.online_tp = data.online_tp
              this.formDataChange.online_start = data.online_start
              this.formDataChange.online_end = data.online_end
              this.$set(this.formDataChange, 'product_tag_tp', this.formData.product_tag_tp)
              this.$set(this.formDataChange, 'product_tag_group', this.formData.product_tag_group)
              this.$set(this.formDataChange, 'product_tag', this.formData.product_tag)
              this.$set(this.formDataChange, 'app_id', this.formData.app_id)
              this.$set(this.formDataChange, 'app_page', this.formData.app_page)
              this.$emit('choose', this.formData, this.index)
              this.hide()
            } else {
              ElUtil.scrollToInvalidFirstElement(this.$refs.form)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
