<template lang="pug">
  div.edit-product-content
    left-arrow
    div.info-content
      div.title 商品
      el-form(ref="form", :model="formData.wgt_product", :rules="formRules")
        el-form-item(prop="s_tp", label="类型")
          el-radio(v-for="item in allProductTp", :key="item.value", :label="item.value", v-model="formData.wgt_product.s_tp") {{item.text}}
        el-form-item(prop="name", label="标题", v-if="formData.wgt_product.s_tp !== allProductTp.product.value")
          el-input(v-model="formData.wgt_product.name", style="width: 200px", :maxlength="10")
        el-form-item(prop="style_tp", label="样式")
          div(v-if="formData.wgt_product.s_tp === allProductTp.product.value")
            el-radio(v-for="item in allProductStyleTp", :key="item.value", :label="item.value", v-model="formData.wgt_product.style_tp") {{item.text}}
          div(v-else)
            el-radio(v-for="item in allProductGroupStyleTp", :key="item.value", :label="item.value", v-model="formData.wgt_product.style_tp") {{item.text}}
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import * as CustomPageService from 'src/service/home_template/index'
  import { DateRangePicker } from '@baibao/zeratul'
  import * as ElUtil from 'src/util/el'

  export default {
    components: {
      LeftArrow,
      DateRangePicker
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
      const titleValidator = (rule, value, callback) => {
        if (this.formData.wgt_product.s_tp === CustomPageService.allProductTp.all_product.value && !this.formData.wgt_product.name) {
          callback(new Error('不能为空'))
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
          ]
        },
        ...$global.$mapConst({
          'allProductTp': CustomPageService.allProductTp,
          'allProductStyleTp': CustomPageService.allProductStyleTp,
          'allProductGroupStyleTp': CustomPageService.allProductGroupStyleTp
        })
      }
    },
    methods: {
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
