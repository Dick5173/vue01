<template lang="pug">
  div
    el-dialog(title="核销提现",
    :visible.sync="dialogVisible",
    width="750px",
    @close="closeCallback"
    )
      div.headT
        div.headTxt 此操作不能让用户收到提现，仅作为记账手段
        div.headTxt 操作不可撤销，请确认已为用户用其他方式提现
      div.head
        div.head-cover.round(v-lazy:background-image="userData.logo")
        div.head-name {{userData.nickname}}
      el-form(:model="form",label-width="80px" :rules="rules" style="margin-top:30px", ref="form" )
        el-form-item(label="核销金额" prop="amount")
          el-input.input(v-model="form.amount")
          span 币
          div.tip
            span 最多核销{{getAvailableBalance(userData) | price(false)}}币
        div.line
        div.txt 以下内容用户不可见
        el-form-item(label="备注", prop="remark")
          el-input(v-model="form.remark", placeholder="请输入内容", type="textarea", :rows="3", :maxlength="remarkMaxLength")
          span.input-tip {{form.remark.length}} / {{remarkMaxLength}}
      div.dialog-footer(slot="footer")
        el-button(@click="dialogVisible = false") 取消
        el-button(type="primary", @click="submit") 提交

</template>

<script>
  import * as UserApi from 'src/api/user'
  import {getUserShowData} from 'src/service/other/index'
  import * as UserWallet from 'src/api/wallet'
  import {convertYuanToFen, checkIsMoney} from 'src/util/money'

  export default {
    data () {
      const validateAmount = (rule, value, callback) => {
        if (value) {
          if (checkIsMoney(value)) {
            if (parseFloat(value) <= 0) {
              callback(new Error('输入内容不能小于等于0'))
              return
            }
          }
          let reg = /^(([1-9][0-9]*)|[0-9])(\.[0-9]{1,2})?$/
          if (!reg.test(value)) {
            callback(new Error('最多限两位小数'))
            return
          }
          if (convertYuanToFen(value) > this.userData.wallet.available_balance) {
            callback(new Error('不能超过最多核销'))
          }
        }
        callback()
      }
      return {
        dialogVisible: false,
        remarkMaxLength: 30,
        userData: {
          logo: '',
          nickname: '',
          wallet: {}
        },
        form: {
          amount: '',
          remark: ''
        },
        rules: {
          amount: [
            {required: true, message: '请输入适合的数字', trigger: 'blur'},
            {validator: validateAmount, trigger: 'blur'}
          ],
          remark: [
            {max: 30, message: '最大30个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      show (row) {
        this.dialogVisible = true
        this.userData = row
      },
      hide () {
        this.dialogVisible = false
      },
      getAvailableBalance (row) {
        if (row.wallet === null) {
          return 0
        } else {
          return row.wallet.available_balance
        }
      },
      submit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.$confirm('确认提现', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              try {
                await UserWallet.postWalletWithdraw(this.userData.id, this.form)
                this.$message({
                  message: '提现成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.$emit('refresh')
              } catch (err) {}
            })
          }
        })
      },
      closeCallback () {
        this.$refs.form.resetFields()
      },
      async getDetail () {
        try {
          this.loading = true
          let res = await UserApi.getUserDetail(this.$tid, this.$route.params.uid)
          this.userData = getUserShowData(res.data)
        } catch (err) {
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
    }
  }
</script>

<style scoped lang="scss">
  .head {
    display: flex;
    height: 50px;
    align-items: center;
    margin-top:30px;
    .head-cover {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-size: cover;
      background-position: center;
    }
    .head-name {
      margin-left: 10px;
      height: 22px;
      line-height: 22px;
      font-size: 16px;
    }
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: #d6d6d6;
  }
  .input {
    display: inline-block;
    width: 150px;
    margin-right: 5px;
  }
  .txt {
    font-size: 12px;
    color: #868686;
    margin-top: 5px;
    margin-bottom: 20px;
  }
  .headT {
    position: absolute;
    top: 45px;
    .headTxt {
      color: #FA5555;
      font-size: 12px;
      height:16px;
      line-height: 16px;
    }
  }
</style>
