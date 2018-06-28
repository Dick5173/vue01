<template lang="pug">
  div
    el-dialog(title="跳转", :visible.sync="dialogVisible", :loading="loading")
      div
        el-form(ref="form", :model="formData", :rules="formRules")
          el-form-item(label="类型", ref="fIAction", prop="action_tp")
            el-radio(v-for="item in channelCustomTp", :key="item.value", :label="item.value", v-model="formData.action_tp", @change="radioChange") {{item.text}}
          el-form-item(ref="fIContent", prop="content")
            el-button(v-if="showChooseBtn", style="margin-bottom:10px", type="primary", plain, @click="clickChooseMicroPage") {{selectBtnText}}
            product-group-cell(v-if="showProductGroup", :productGroup="showProductGroup")
            micro-page-cell(v-if="showMicroPage", :micropage="showMicroPage")
            tag-group(ref="showTagPage", v-if="isShowTag", @selected="selectedTag", :tag="showTagPage")
            other-app-cell(v-if="showOtherApp", :model="formData")
            tags-group-cell(ref="productTag", v-if="showTags", :model="showTags")
      div(slot="footer", class="dialog-footer")
        el-button(size="mini", @click="dialogVisible = false") 取 消
        el-button(size="mini", type="primary", @click="submitForm", :disabled="loading") 确 定
    dialog-micro-page(ref="dialogMicroPage", @choose="handleChooseMicroPage")
    choose-product-group-dialog(ref="dlgChooseProductGroup", @choose="handleChooseProductGroupComplete")
</template>

<script>
  import * as CustomPageService from 'src/service/home_template/index'
  import DialogMicroPage from 'src/ui/common/choose-micropage-dialog/Index'
  import * as ElUtil from 'src/util/el'
  import ProductGroupCell from 'src/ui/common/cell/ProductGroup'
  import MicroPageCell from 'src/ui/common/cell/MicroPage'
  import TagGroup from 'src/ui/common/cell/TagGroup'
  import ChooseProductGroupDialog from 'src/ui/common/choose-product-group-dialog/Index.vue'
  import OtherAppCell from 'src/ui/common/cell/OtherApp'
  import TagsGroupCell from 'src/ui/common/cell/TagsGroup'

  export default {
    components: {
      DialogMicroPage,
      ChooseProductGroupDialog,
      ProductGroupCell,
      MicroPageCell,
      TagGroup,
      OtherAppCell,
      TagsGroupCell
    },
    data () {
      const actionValidator = (rule, value, callback) => {
        if (value === 0) {
          callback(new Error('请选择跳转方式'))
          return
        }
        callback()
      }
      const contentValidator = (rule, value, callback) => {
        if (this.formData.action_tp === CustomPageService.channelCustomTp.min_page.value && (!this.formData.min_page || !this.formData.min_page.id)) {
          callback(new Error('请选择微页面'))
          return
        } else if (this.formData.action_tp === CustomPageService.channelCustomTp.product_group.value && (!this.formData.product_group || !this.formData.product_group.id)) {
          callback(new Error('请选择商品组'))
          return
        }
        callback()
      }
      return {
        loading: false,
        dialogVisible: false,
        index: 0,
        formData: {},
        formDataChange: {},
        formRules: {
          action_tp: [
            {validator: actionValidator, required: true, trigger: 'change'}
          ],
          content: [
            {validator: contentValidator, required: false, trigger: 'change'}
          ]
        },
        ...$global.$mapConst({
          'channelCustomTp': CustomPageService.channelCustomTp
        })
      }
    },
    computed: {
      showChooseBtn () {
        return this.formData.action_tp === CustomPageService.channelCustomTp.min_page.value || this.formData.action_tp === CustomPageService.channelCustomTp.product_group.value
      },
      selectBtnText () {
        return this.formData.action_tp === CustomPageService.channelCustomTp.min_page.value ? '选择微页面' : '选择商品组'
      },
      showProductGroup () {
        if (this.formData.action_tp === CustomPageService.channelCustomTp.product_group.value && this.formData.product_group && this.formData.product_group.id) {
          return this.formData.product_group
        }
        return null
      },
      showMicroPage () {
        if (this.formData.action_tp === CustomPageService.channelCustomTp.min_page.value && this.formData.min_page && this.formData.min_page.id) {
          return this.formData.min_page
        }
        return null
      },
      showTagPage () {
        if (this.formData.action_tp === CustomPageService.channelCustomTp.tag_group.value && this.formData.tag_group) {
          return this.formData.tag_group
        }
        return null
      },
      isShowTag () {
        return this.formData.action_tp === CustomPageService.channelCustomTp.tag_group.value
      },
      showOtherApp () {
        if (this.formData.action_tp === CustomPageService.channelCustomTp.other_app.value) {
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
      show (row, index) {
        this.index = index
        this.formDataChange = row
        this.formData = this.R.clone(row)
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      radioChange () {
        if (this.$refs.fIContent) {
          this.$refs.fIContent.clearValidate()
        }
        this.$refs.fIAction.clearValidate()
        this.formData.min_page = {}
        this.formData.product_group = {}
        this.formData.tag_group = {}
        this.$set(this.formData, 'product_tag_tp', '')
        this.$set(this.formData, 'product_tag_group', {})
        this.$set(this.formData, 'product_tag', {})
        this.$set(this.formData, 'app_id', '')
        this.$set(this.formData, 'app_page', '')
      },
      clickChooseMicroPage () {
        if (this.formData.action_tp === CustomPageService.channelCustomTp.min_page.value) {
          this.$refs.dialogMicroPage.show()
        } else if (this.formData.action_tp === CustomPageService.channelCustomTp.product_group.value) {
          this.$refs.dlgChooseProductGroup.show()
        }
      },
      async handleChooseMicroPage (item) {
        this.formData.min_page = item
        await this.$nextTick()
        this.$refs.fIContent.onFieldChange()
      },
      async handleChooseProductGroupComplete (productGroups) {
        this.formData.product_group = productGroups[0]
        await this.$nextTick()
        this.$refs.fIContent.onFieldChange()
      },
      async selectedTag (val) {
        this.formData.tag_group = val
        await this.$nextTick()
        this.$refs.fIContent.onFieldChange()
      },
      submitForm () {
        if (this.formData.action_tp === CustomPageService.channelCustomTp.product_tag.value && !this.formData.product_tag_tp) {
          this.$refs.productTag.changeShowMsg()
        } else {
          this.$refs.form.validate(async (valid) => {
            if (valid) {
              this.$emit('choose', this.formData, this.index)
              this.formDataChange.action_tp = this.formData.action_tp
              this.formDataChange.min_page = this.formData.min_page
              this.formDataChange.product_group = this.formData.product_group
              let setTg = this.formData.tag_group
              if (!this.formData.tag_group || !this.formData.tag_group.id) {
                setTg = null
              }
              this.$set(this.formDataChange, 'tag_group', setTg)
              this.$set(this.formDataChange, 'app_id', this.formData.app_id)
              this.$set(this.formDataChange, 'app_page', this.formData.app_page)
              this.$set(this.formDataChange, 'product_tag_tp', this.formData.product_tag_tp)
              this.$set(this.formDataChange, 'product_tag_group', this.formData.product_tag_group)
              this.$set(this.formDataChange, 'product_tag', this.formData.product_tag)
              this.hide()
            } else {
              ElUtil.scrollToInvalidFirstElement(this.$refs.form)
            }
          })
        }
      }
    },
    watch: {
      async 'formData.action_tp' (newValue, oldValue) {
        this.formData.action_tp = newValue
        if (this.formData.action_tp === CustomPageService.channelCustomTp.tag_group.value) {
          await this.$nextTick()
          this.$refs.showTagPage.show()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .min-page {
    margin-top: 10px;
    width: 200px;
    height: 50px;
    padding-left: 20px;
    line-height: 50px;
    color: $home-color-title;
    font-size: $home-size-title;
    border: 1px solid #d6d6d6;
  }
</style>
