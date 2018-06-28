<template lang="pug">
  div.edit-voucher-content
    left-arrow
    div.info-content
      div.top-title 优惠券
      el-form(ref="form", :model="formData.wgt_voucher", :rules="formRules")
        el-form-item(label="标题", prop="name")
          el-input(style="width: 300px", placeholder="请输入内容", v-model="formData.wgt_voucher.name", :maxlength="10")
        el-form-item(ref="fIContent", prop="items")
          el-button(size="small", style="margin-bottom:10px", type="primary", @click="clickChooseContent") 选择优惠券
          voucher-table(:queryParams.sync="formData.wgt_voucher.items", v-if="showVoucher")
        el-form-item(label="上线时间", prop="online_tp")
          el-radio-group(v-model="formData.wgt_voucher.online_tp")
            div
              el-radio(:label="allShowTp.show_long.value") {{ allShowTp.show_long.text }}
            div
              el-radio(:label="allShowTp.show_limit.value")
                date-range-picker(:start.sync="formData.wgt_voucher.online_start", :end.sync="formData.wgt_voucher.online_end", type="datetimerange")
    <!--dialog-choose-voucher(ref="dlgChooseVoucher", @choose="handleChooseVoucher")-->
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import { DateRangePicker } from '@baibao/zeratul'
  import * as CustomPageService from 'src/service/home_template/index'
  import VoucherTable from '../view/VoucherTable'
  import VoucherActTable from '../view/VoucherActTable'
  // import DialogChooseVoucher from 'src/ui/common/choose-voucher-dialog/Index'
  import * as ElUtil from 'src/util/el'

  export default {
    components: {
      LeftArrow,
      DateRangePicker,
      VoucherTable,
      VoucherActTable
      // DialogChooseVoucher
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
      const voucherValidator = (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error('请选择优惠券'))
          return
        }
        callback()
      }
      const showTpValidator = (rule, value, callback) => {
        if (this.formData.wgt_voucher.online_tp === CustomPageService.allShowTp.show_limit.value && (this.formData.wgt_voucher.online_start === 0 || this.formData.wgt_voucher.online_end === 0)) {
          callback(new Error('请选择开始时间和结束时间'))
          return
        }
        callback()
      }
      return {
        formData: this.queryParams,
        formRules: {
          name: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          items: [
            {validator: voucherValidator, trigger: 'change'}
          ],
          online_tp: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: showTpValidator, trigger: 'change'}
          ]
        },
        ...$global.$mapConst({
          'allShowTp': CustomPageService.allShowTp
        })
      }
    },
    computed: {
      showVoucher () {
        return this.formData.wgt_voucher.items && this.formData.wgt_voucher.items.length > 0
      }
    },
    methods: {
      radioChange () {
        this.$refs.fIContent && this.$refs.fIContent.clearValidate()
        this.formData.wgt_voucher.items = []
      },
      clickChooseContent () {
        const items = this.R.map((item) => item.voucher_activ_item || {id: -1})(this.formData.wgt_voucher.items || [])
        const showItems = items.filter(item => item.id > 0)
        this.$refs.dlgChooseVoucher.show(showItems)
      },
      handleChooseVoucher (vouchers) {
        this.formData.wgt_voucher.items = this.R.map((item) => ({voucher_activ_item: item}))(vouchers || [])
        this.$refs.fIContent && this.$refs.fIContent.onFieldChange()
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
