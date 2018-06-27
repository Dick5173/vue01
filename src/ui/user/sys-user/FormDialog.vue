<template lang="pug">
  el-dialog(:visible.sync="dialogVisible", :title="dialogTitle", :width="commonDialogWidth", @close="closeCallback")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="66px")
      el-form-item(prop="name", label="名称")
        el-input(v-model.trim="formData.name", :maxlength="20", clearable)
      el-form-item(prop="roles", label="角色")
        el-select(v-model="formData.roles", multiple)
          el-option(v-for="item in roleList", :key="item.id", :label="item.name", :value="item.id")
      el-form-item(prop="mobile", label="手机号")
        el-input(v-model.trim="formData.mobile", clearable)
      el-form-item(prop="passwd", label="密码")
        el-input(type="password", v-model.trim="formData.passwd", clearable, @focus="handlePwdFocus")
    div.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary", :loading="loading", @click="handleSubmit") 确定
</template>

<script>
  import { commonDialogWidth } from 'src/config/el'

  import * as SysUserApi from 'src/api/sysuser'
  import { REGEX_MOBILE } from 'src/util/regex'
  import * as CharacterAuthApi from 'src/api/character-auth'

  export default {
    data () {
      return {
        loading: false,
        initPwd: false,
        initialData: {},
        roleList: [],
        formData: {
          id: 0,
          name: '',
          mobile: '',
          passwd: '',
          roles: []
        },
        formRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {max: 20, message: '长度最大10个字符', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: REGEX_MOBILE, message: '请输入正确的手机号', trigger: 'blur'}
          ],
          roles: [
            {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'}
          ],
          passwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        dialogVisible: false,
        ...$global.$mapConst({
          'commonDialogWidth': commonDialogWidth
        })
      }
    },
    computed: {
      isEditMode () {
        return !!this.initialData
      },
      dialogTitle () {
        return this.isEditMode ? '编辑管理员' : '添加管理员'
      }
    },
    methods: {
      async getRoleList () {
        this.loading = true
        try {
          const res = await CharacterAuthApi.getTenantRoleList()
          this.roleList = res.data.data
        } finally {
          this.loading = false
        }
      },
      show (editData) {
        this.getRoleList()
        if (editData) {
          editData.passwd = '********'
        }
        this.initialData = editData
        if (this.initialData) {
          this.formData = this.R.clone(this.initialData)
          if (!this.formData.roles) {
            this.formData.roles = []
          } else {
            this.formData.roles = this.formData.roles.map(i => {
              return i.id
            })
          }
        } else {
          this.formData = {
            id: 0,
            name: '',
            mobile: '',
            passwd: '',
            roles: []
          }
        }
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.formData = {
          id: 0,
          name: '',
          mobile: '',
          passwd: '',
          roles: []
        }
        this.roleList = []
        this.initPwd = false
        this.$refs.form && this.$refs.form.resetFields()
      },
      handlePwdFocus () {
        if (!this.initPwd) {
          this.formData.passwd = ''
          this.initPwd = true
        }
      },
      async handleSubmit () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          try {
            if (valid) {
              const frm = this.R.clone(this.formData)
              if (!this.initPwd) {
                frm.passwd = ''
              }
              if (!this.isEditMode) {
                await SysUserApi.create(frm)
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              } else {
                await SysUserApi.update(this.initialData.id, frm)
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
              }
              this.$emit('success')
              this.hide()
            }
          } finally {
            this.loading = false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
