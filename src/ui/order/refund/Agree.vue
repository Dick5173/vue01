<template lang="pug">
  el-dialog(title="同意退款",  :visible.sync="dialogVisible", size="tiny", @open="openCallback", @close="closeCallback", v-loading="loading")
    el-form(ref="formAgree", :model="form", label-width="80px", :rules="rules")
      el-form-item(label="退款金额", prop="amount")
        el-input.input(v-model="form.amount")
        div.tip
          span 最多退款
          span.can-refund-price(:class="{red: !canFullRefund}") {{canRefundPrice | price}}，
          span 其中商品总额{{orderItem.total_price | price}}，
          span {{orderItem.order_total_count}}件商品运费总额{{orderItem.order_postage | price}}
      el-form-item(label="")
        el-checkbox(v-if="false") 退回优惠券
      el-form-item(label="描述", prop="txt")
        el-input(v-model="form.txt", placeholder="请输入内容", type="textarea", :rows="3", :maxlength="maxLength")
        span.input-tip {{form.txt.length}} / {{maxLength}}
      div.line
      div.txt 以下内容用户不可见
      el-form-item(label="退货数量", prop="count")
        el-select(v-model="form.count", placeholder="请选择")
          el-option(v-for="item in chooseCount", :key="item", :label="item", :value="item")
        div.tip
          span 未给用户发货的商品也要记作退货数量
      el-form-item(label="备注", prop="remark")
        el-input(v-model="form.remark", placeholder="请输入内容", type="textarea", :rows="3", :maxlength="remarkMaxLength")
        span.input-tip {{form.remark.length}} / {{remarkMaxLength}}
    div.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary", @click="submit") 确定
</template>


<script>
  import {agree} from 'src/api/refuse'
  import {convertYuanToFen, checkIsMoney} from 'src/util/money'

  export default {
    components: {},
    props: {
      orderItem: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      const validateAmount = (rule, value, callback) => {
        if (value) {
          if (checkIsMoney(value)) {
            if (parseFloat(value) <= 0) {
              callback(new Error('价格必须大于0'))
              return
            }
          } else {
            callback(new Error('请输入适合的数字'))
          }
          if (convertYuanToFen(value) > this.canRefundPrice) {
            callback(new Error('请输入适合的数字'))
          }
        }
        callback()
      }
      return {
        loading: false,
        dialogVisible: false,
        maxLength: 100,
        remarkMaxLength: 30,
        form: {
          txt: '',
          amount: '',
          count: 0,
          remark: ''
        },
        rules: {
          amount: [
            {required: true, message: '请输入适合的数字', trigger: 'blur'},
            {validator: validateAmount, trigger: 'blur'}
          ],
          count: [
            {required: true}
          ],
          txt: [
            {max: 100, message: '最大100个字符', trigger: 'blur'}
          ],
          remark: [
            {max: 30, message: '最大30个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      chooseCount () {
        let arr = []
        for (let i = 0; i <= this.orderItem.count; i++) {
          arr[i] = this.orderItem.count - i
        }
        return arr
      },
      canFullRefund () {
        return (this.orderItem.total_price + this.orderItem.order_postage) <= this.orderItem.order_left_amount
      },
      canRefundPrice () {
        if (this.canFullRefund) {
          return this.orderItem.total_price + this.orderItem.order_postage
        }
        return this.orderItem.order_left_amount
      }
    },
    methods: {
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      openCallback () {
        this.form = {
          txt: '',
          amount: '',
          count: this.orderItem.count,
          remark: ''
        }
      },
      closeCallback () {
        this.$refs.formAgree.resetFields()
      },
      submit () {
        console.log('确认退款')
        this.$refs.formAgree.validate(async (valid) => {
          if (valid) {
            this.$confirm('同意退款', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              this.loading = true
              try {
                const resResult = await agree(this.orderItem.id, convertYuanToFen(this.form.amount), this.form.txt, this.form.count, this.form.remark)
                this.$message({
                  message: '退款成功',
                  type: 'success'
                })
                this.$emit('submit', resResult.data)
                this.loading = false
                this.hide()
              } catch (e) {
                this.$emit('submit')
                this.loading = false
                this.hide()
                this.$myErrorHandler.handle(this, e)
              }
            }).catch(() => {})
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input {
    display: inline-block;
    width: 150px;
    margin-right: 5px;
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: #d6d6d6;
  }

  .tip {
    color: rgb(153, 153, 153);
    font-size: 12px;
  }

  .txt {
    font-size: 12px;
    color: #868686;
    margin-top: 5px;
    margin-bottom: 20px;
  }

  .can-refund-price {

    &.red {
      color: $color-danger;
    }
  }
</style>
