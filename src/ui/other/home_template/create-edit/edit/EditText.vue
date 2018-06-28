<template lang="pug">
  div.edit-text-content
    left-arrow
    div.info-content
      div.top-title 文本
      el-form(ref="form", :model="formData.wgt_txt", :rules="formRules")
        el-form-item(prop="txt")
          el-input(type="textarea", placeholder="请输入内容", v-model="formData.wgt_txt.txt", :maxlength="500")
        el-form-item
          el-checkbox(v-model="formData.wgt_txt.show_logo") 公告标识
        el-form-item(label="跳转")
          el-radio(v-for="item in allCustomTp", :key="item.value", :label="item.value", v-model="formData.wgt_txt.action_tp", @change="radioChange") {{item.text}}
        el-form-item(v-if="showChooseBtnText || showOtherApp || showTags", ref="fIContent", prop="action_tp")
          el-button(v-if="!showOtherApp && !showTags", style="margin-bottom:10px", type="primary", plain, @click="handleChooseContent") {{showChooseBtnText}}
          <!--product-cell(v-if="showProduct", :product="formData.wgt_txt.product")-->
          <!--product-group-cell(v-if="showProductGroup", :productGroup="formData.wgt_txt.product_group")-->
          <!--micro-page-cell(v-if="showMicroPage", :micropage="formData.wgt_txt.min_page")-->
          <!--other-app-cell(v-if="showOtherApp", :model="formData.wgt_txt")-->
          <!--tags-group-cell(ref="productTag", v-if="showTags", :model="showTags")-->
        el-form-item(label="上线时间", prop="online_tp")
          el-radio-group(v-model="formData.wgt_txt.online_tp")
            div
              el-radio(:label="allShowTp.show_long.value") {{ allShowTp.show_long.text }}
            div
              el-radio(:label="allShowTp.show_limit.value")
                date-range-picker(:start.sync="formData.wgt_txt.online_start", :end.sync="formData.wgt_txt.online_end", type="datetimerange")
    <!--choose-product-dialog(ref="dlgChooseProduct", @choose="handleChooseProductComplete")-->
    <!--choose-product-group-dialog(ref="dlgChooseProductGroup", @choose="handleChooseProductGroupComplete")-->
    <!--choose-micro-page-dialog(ref="dlgChooseMicroPage", @choose="handleChooseMicroPageComplete")-->
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import * as CustomPageService from 'src/service/home_template/index'
  // import ProductCell from 'src/ui/common/cell/Product'
  // import ProductGroupCell from 'src/ui/common/cell/ProductGroup'
  // import MicroPageCell from 'src/ui/common/cell/MicroPage'
  // import ChooseProductDialog from 'src/ui/common/choose-product-dialog/Index.vue'
  // import ChooseProductGroupDialog from 'src/ui/common/choose-product-group-dialog/Index.vue'
  // import ChooseMicroPageDialog from 'src/ui/common/choose-micropage-dialog/Index.vue'
  import { DateRangePicker } from '@baibao/zeratul'
  import * as ElUtil from 'src/util/el'
  // import OtherAppCell from 'src/ui/common/cell/OtherApp'
  // import TagsGroupCell from 'src/ui/common/cell/TagsGroup'

  export default {
    components: {
      LeftArrow,
      DateRangePicker
      // ProductCell,
      // ProductGroupCell,
      // MicroPageCell,
      // ChooseProductDialog,
      // ChooseProductGroupDialog,
      // ChooseMicroPageDialog,
      // OtherAppCell,
      // TagsGroupCell
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
    props: {
      queryParams: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      const actionValidator = (rule, value, callback) => {
        if (value === CustomPageService.allCustomTp.product.value && (!this.formData.wgt_txt.product || !this.formData.wgt_txt.product.id)) {
          callback(new Error('请选择商品'))
          return
        } else if (value === CustomPageService.allCustomTp.product_group.value && (!this.formData.wgt_txt.product_group || !this.formData.wgt_txt.product_group.id)) {
          callback(new Error('请选择商品组'))
          return
        } else if (value === CustomPageService.allCustomTp.min_page.value && (!this.formData.wgt_txt.min_page || !this.formData.wgt_txt.min_page.id)) {
          callback(new Error('请选择微页面'))
          return
        }
        callback()
      }
      const showTpValidator = (rule, value, callback) => {
        if (this.formData.wgt_txt.online_tp === CustomPageService.allShowTp.show_limit.value && (this.formData.wgt_txt.online_start === 0 || this.formData.wgt_txt.online_end === 0)) {
          callback(new Error('请选择开始时间和结束时间'))
          return
        }
        callback()
      }
      return {
        formData: this.queryParams,
        formRules: {
          txt: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          action_tp: [
            {validator: actionValidator, required: false, trigger: 'change'}
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
    computed: {
      showChooseBtnText () {
        switch (this.formData.wgt_txt.action_tp) {
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
        if (this.formData.wgt_txt.action_tp === CustomPageService.allCustomTp.product.value) {
          if (this.formData.wgt_txt.createWithUser || this.formData.wgt_txt.old_action_tp !== this.formData.wgt_txt.action_tp) {
            this.formData.wgt_txt.createWithUser = true
            return this.formData.wgt_txt.product && this.formData.wgt_txt.product.id
          } else {
            return true
          }
        }
        return false
      },
      showProductGroup () {
        if (this.formData.wgt_txt.action_tp === CustomPageService.allCustomTp.product_group.value) {
          if (this.formData.wgt_txt.createWithUser || this.formData.wgt_txt.old_action_tp !== this.formData.wgt_txt.action_tp) {
            this.formData.wgt_txt.createWithUser = true
            return this.formData.wgt_txt.product_group && this.formData.wgt_txt.product_group.id
          } else {
            return true
          }
        }
        return false
      },
      showMicroPage () {
        if (this.formData.wgt_txt.action_tp === CustomPageService.allCustomTp.min_page.value) {
          if (this.formData.wgt_txt.createWithUser || this.formData.wgt_txt.old_action_tp !== this.formData.wgt_txt.action_tp) {
            this.formData.wgt_txt.createWithUser = true
            return this.formData.wgt_txt.min_page && this.formData.wgt_txt.min_page.id
          } else {
            return true
          }
        }
        return false
      },
      showOtherApp () {
        if (this.formData.wgt_txt.action_tp === CustomPageService.allCustomTp.other_app.value) {
          return CustomPageService.getOtherAppInfo(this.formData.wgt_txt)
        }
        return null
      },
      showTags () {
        if (this.formData.wgt_txt.action_tp === CustomPageService.allCustomTp.product_tag.value) {
          return this.formData.wgt_txt
        }
        return null
      }
    },
    methods: {
      radioChange () {
        if (this.$refs.fIContent && this.$refs.fIContent.clearValidate) {
          this.$refs.fIContent.clearValidate()
        }
        this.formData.wgt_txt.product = {}
        this.formData.wgt_txt.product_group = {}
        this.formData.wgt_txt.min_page = {}
        this.$set(this.formData.wgt_txt, 'product_tag_tp', '')
        this.$set(this.formData.wgt_txt, 'product_tag_group', {})
        this.$set(this.formData.wgt_txt, 'product_tag', {})
        this.$set(this.formData.wgt_txt, 'app_id', '')
        this.$set(this.formData.wgt_txt, 'app_page', '')
      },
      handleChooseContent () {
        // if (this.formData.wgt_txt.action_tp === CustomPageService.allCustomTp.product.value) {
        //   this.$refs.dlgChooseProduct.show(ChooseProductDialog.MODE_SINGLE)
        // } else if (this.formData.wgt_txt.action_tp === CustomPageService.allCustomTp.product_group.value) {
        //   this.$refs.dlgChooseProductGroup.show()
        // } else if (this.formData.wgt_txt.action_tp === CustomPageService.allCustomTp.min_page.value) {
        //   this.$refs.dlgChooseMicroPage.show()
        // }
      },
      handleChooseProductComplete (products) {
        this.formData.wgt_txt.product = products[0]
        this.$refs.fIContent.onFieldChange()
      },
      handleChooseProductGroupComplete (productGroups) {
        this.formData.wgt_txt.product_group = productGroups[0]
        this.$refs.fIContent.onFieldChange()
      },
      handleChooseMicroPageComplete (micropage) {
        this.formData.wgt_txt.min_page = micropage
        this.$refs.fIContent.onFieldChange()
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

  .edit-text-content {
    width: 542px;
    display: flex;

    .info-content {
      width: 100%;
      flex: 1;
      border: 1px solid #DFDFDF;
      padding: 10px;

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

      .top-title {
        margin-bottom: 10px;
      }

    }
  }
</style>
