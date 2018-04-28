<template lang="pug">
  div
    el-dialog(title="核销提现",
    :visible.sync="dialogVisible",
    width="750px",
    )
      div.head
        div.head-cover.round(v-lazy:background-image="userData.logo")
        div.head-name {{userData.nickname}}
      el-form(:model="form",label-width="80px" :rules="rules" style="margin-top:30px" )
        el-form-item(label="核销金额" prop="amount")
          el-input.input(v-model="form.amount")
          div.tip
            span 最多核销{{18 | price}}
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
  import {convertYuanToFen, checkIsMoney} from 'src/util/money'

  export default {
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
        dialogVisible: false,
        remarkMaxLength: 30,
        userData: {
          logo: '',
          nickname: ''
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
      submit () {
        this.dialogVisible = false
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
</style>
