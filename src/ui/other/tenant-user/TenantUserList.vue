<template lang="pug">
  div(v-loading="loading")
    div 账号信息
    div
      el-form(ref="form", :model="formData", label-width="300px")
        el-form-item(label="店铺管理员ID：")
          div.input {{formData.id}}
        el-form-item(label="名字：")
          div.input {{formData.name}}
        el-form-item(label="手机号码：", prop="mobile")
          div.input {{formData.mobile}}
        el-form-item()
            el-button.tenant-revamp(type="primary", plain, @click="resetPwd(formData)") 修改密码
    div 公司信息
    div
      el-form(ref="form", :model="formData", label-width="300px")
        el-form-item(label="公司名称：", prop="company_name")
          div.input {{formData.company_name}}
        el-form-item(label="公司地址：", prop="company_addr")
          div.input {{formData.company_addr}}
        el-form-item(label="公司官网：", prop="company_website")
          div.input {{formData.company_website}}
        el-form-item(label="公司描述：", prop="company_desc")
          div.input {{formData.company_desc}}
        el-form-item(label="联系人：", prop="company_contact")
          div.input {{formData.company_contact}}
        el-form-item(label="手机号：", prop="company_mobile")
          div.input {{formData.company_mobile}}
        el-form-item(label="邮箱：", prop="company_email")
          div.input {{formData.company_email}}
        el-form-item
    div.tenant-list 店铺信息
    div.head
      div.head-cover(v-lazy:background-image="formData.tenant_head_img")
      div.head-name-box
        span.head-name(@click="toDetail(formData)") {{formData.tenant_name}}
        span.icon(@click="dialogVisible = true")
          img.img(:src="qrcodeIcon")
          div.head-status
    el-button.tenant-reset(@click="editItem(formData)", type="primary", plain) 编&nbsp辑
    el-dialog(title="小程序码", :visible.sync="dialogVisible", width="480px", :modal-append-to-body="false")
      img.dlgImg(:src="formData.tenant_acode_url")
      el-button(style='margin-left:150px;', @click="download") 下载小程序码
    reset-pwd-dialog(ref="dlgResetPwd", @refresh="loadDataListByQueryPage")
</template>

<script>
  import * as TenantUserApi from 'src/api/tenant-user'
  import ResetPwdDialog from 'src/ui/other/tenant-user/ResetPwdDialog.vue'
  import LoadPagerData from 'src/mixins/load-pager-data'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {
    },
    components: {
      ResetPwdDialog
    },
    data () {
      return {
        dialogVisible: false,
        loading: false,
        qrcodeIcon: require('src/assets/image/qrcode.png'),
        formData: {}
      }
    },
    methods: {
      download () {
        let link = document.createElement('a')
        link.href = this.formData.tenant_acode_url
        link.download = 'qrcode'
        link.click()
        this.dialogVisible = false
      },
      toDetail (row) {
        console.log(row, 88888)
        this.$router.push({
          name: 'TenantDetail',
          params: {
            tid: row.tenant_id
          }
        })
      },
      resetPwd (row) {
        console.log(row, 1111)
        this.$refs.dlgResetPwd.show(row)
      },
      editItem (row) {
        this.$router.push({
          name: 'EditTenantUser',
          params: {
            id: row.id
          }
        })
      },
      async getItem () {
        try {
          this.loading = true
          let res = await TenantUserApi.getTenantUserItem(this.$route.params.tid)
          this.formData = res.data ? res.data : []
        } catch (err) {
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.getItem()
    }
  }
</script>


<style lang="scss" scoped>
  .input {
    width: 400px;
    border: 0px;
    outline: none;

  }

  .dlgImg {
    width: 430px;
    height: 430px;
  }

  .border {
    padding-top: 10px;
    border-top: 1px solid #dcdfe6;
  }

  .tenant-list{
    float: left;
  }

  .tenant-reset {
    width: 130px;
    margin: 30px 0;
    margin-left: 160px;
  }

  .tenant-revamp {
    width: 130px;
    margin-bottom: 30px;
  }
  .head {
    display: flex;
    height: 50px;
    margin-left: 100px;
    .head-cover {
      display: inline-block;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      background-position: center;
      background-size: cover;
    }
    .head-name-box {
      margin-left: 10px;
      display: flex;
      align-items: center;
      .head-name {
        height: 22px;
        font-size: 16px;
        line-height: 22px;
        color: #409EFF;
        text-decoration: underline;
        cursor: pointer;
      }
      .icon {
        margin-left: 6px;
        width: 16px;
        line-height: 16px;
        .img {
          position: relative;
          top: 32px;
          left: 0px;
          width: 16px;
          height: 16px;
          cursor: pointer;
          height: 16px;
        }
        .head-status {
          display: inline-block;
          margin-top: 41px;
          margin-left: -69px;
          width: 80px;
          height: 20px;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
</style>
