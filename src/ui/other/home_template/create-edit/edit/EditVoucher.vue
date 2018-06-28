<template lang="pug">
  div.edit-voucher-content
    left-arrow
    div.info-content
      div.top-title 优惠券
      el-form(ref="form", :model="formData.wgt_voucher", :rules="formRules")
        el-form-item(label="标题", prop="name")
          el-input(style="width: 300px", placeholder="请输入内容", v-model="formData.wgt_voucher.name", :maxlength="10")
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import { DateRangePicker } from '@baibao/zeratul'
  import VoucherTable from '../view/VoucherTable'
  import VoucherActTable from '../view/VoucherActTable'
  import * as ElUtil from 'src/util/el'

  export default {
    components: {
      LeftArrow,
      DateRangePicker,
      VoucherTable,
      VoucherActTable
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
      return {
        formData: this.queryParams,
        formRules: {
          name: [
            {required: true, message: '不能为空', trigger: 'change'}
          ]
        }
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
  .edit-voucher-content {
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
